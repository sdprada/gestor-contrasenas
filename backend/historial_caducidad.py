from database import get_connection
from utilidades import estado_caducidad
from alertas_seguridad import generar_alertas_automaticas


def _obtener_usuario_id(cursor, nombre_usuario):
    cursor.execute("SELECT id FROM usuarios WHERE nombre_usuario = ?", (nombre_usuario,))
    usuario = cursor.fetchone()
    return usuario["id"] if usuario else None


def analizar_caducidad(nombre_usuario):
    generar_alertas_automaticas(nombre_usuario)

    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return []

        cursor.execute(
            """
            SELECT id, usuario, contrasena, nivel_seguridad, fecha_expiracion, creado_en, categoria_id
            FROM contrasenas WHERE usuario_id = ?
            ORDER BY fecha_expiracion ASC
            """,
            (usuario_id,)
        )
        filas = [dict(row) for row in cursor.fetchall()]
        for f in filas:
            f["estado"] = estado_caducidad(f["fecha_expiracion"])
        return filas
    except Exception as e:
        print(f"Error al analizar caducidad: {e}")
        return []
    finally:
        conn.close()


def resumen_seguridad(nombre_usuario):
    filas = analizar_caducidad(nombre_usuario)
    resumen = {
        "total": len(filas),
        "seguridad": {"FUERTE": 0, "MEDIA": 0, "DEBIL": 0},
        "caducidad": {"VIGENTE": 0, "POR_VENCER": 0, "VENCIDA": 0, "SIN_FECHA": 0}
    }
    for f in filas:
        nivel = f.get("nivel_seguridad", "DESCONOCIDO")
        if nivel in resumen["seguridad"]:
            resumen["seguridad"][nivel] += 1
        est = f.get("estado", "SIN_FECHA")
        if est in resumen["caducidad"]:
            resumen["caducidad"][est] += 1
    return resumen


def obtener_historial(nombre_usuario, limite=50):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return []

        cursor.execute(
            """
            SELECT id_contrasena, accion, detalle, fecha
            FROM historial_seguridad
            WHERE usuario_id = ?
            ORDER BY fecha DESC
            LIMIT ?
            """,
            (usuario_id, limite)
        )
        return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error al obtener historial: {e}")
        return []
    finally:
        conn.close()


def obtener_logs_acceso(nombre_usuario, limite=50):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return []

        cursor.execute(
            """
            SELECT accion, ip_address, detalle, fecha
            FROM logs_acceso
            WHERE usuario_id = ?
            ORDER BY fecha DESC
            LIMIT ?
            """,
            (usuario_id, limite)
        )
        return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error al obtener logs: {e}")
        return []
    finally:
        conn.close()
