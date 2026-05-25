from database import get_connection
from utilidades import estado_caducidad


def _obtener_usuario_id(cursor, nombre_usuario):
    cursor.execute("SELECT id FROM usuarios WHERE nombre_usuario = ?", (nombre_usuario,))
    usuario = cursor.fetchone()
    return usuario["id"] if usuario else None


def obtener_alertas(nombre_usuario, solo_no_leidas=False):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return []

        if solo_no_leidas:
            cursor.execute(
                "SELECT id, tipo, mensaje, leida, fecha FROM alertas_seguridad WHERE usuario_id = ? AND leida = 0 ORDER BY fecha DESC",
                (usuario_id,)
            )
        else:
            cursor.execute(
                "SELECT id, tipo, mensaje, leida, fecha FROM alertas_seguridad WHERE usuario_id = ? ORDER BY fecha DESC",
                (usuario_id,)
            )
        return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error al obtener alertas: {e}")
        return []
    finally:
        conn.close()


def marcar_alerta_leida(alerta_id, nombre_usuario):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return False

        cursor.execute(
            "UPDATE alertas_seguridad SET leida = 1 WHERE id = ? AND usuario_id = ?",
            (alerta_id, usuario_id)
        )
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        print(f"Error al marcar alerta: {e}")
        return False
    finally:
        conn.close()


def generar_alertas_automaticas(nombre_usuario):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return 0

        cursor.execute(
            "SELECT id, usuario, fecha_expiracion, nivel_seguridad FROM contrasenas WHERE usuario_id = ?",
            (usuario_id,)
        )
        filas = [dict(row) for row in cursor.fetchall()]
        nuevas = 0

        for f in filas:
            est = estado_caducidad(f["fecha_expiracion"])
            app = f["usuario"]

            if est == "VENCIDA":
                cursor.execute(
                    "SELECT COUNT(*) as total FROM alertas_seguridad WHERE usuario_id = ? AND tipo = 'CONTRASENA_VENCIDA' AND mensaje LIKE ? AND leida = 0",
                    (usuario_id, f"%{app}%")
                )
                if cursor.fetchone()["total"] == 0:
                    cursor.execute(
                        "INSERT INTO alertas_seguridad (usuario_id, tipo, mensaje) VALUES (?, ?, ?)",
                        (usuario_id, "CONTRASENA_VENCIDA", f"La contrasena de '{app}' ha vencido. Deberias cambiarla.")
                    )
                    nuevas += 1

            elif est == "POR_VENCER":
                cursor.execute(
                    "SELECT COUNT(*) as total FROM alertas_seguridad WHERE usuario_id = ? AND tipo = 'CONTRASENA_POR_VENCER' AND mensaje LIKE ? AND leida = 0",
                    (usuario_id, f"%{app}%")
                )
                if cursor.fetchone()["total"] == 0:
                    cursor.execute(
                        "INSERT INTO alertas_seguridad (usuario_id, tipo, mensaje) VALUES (?, ?, ?)",
                        (usuario_id, "CONTRASENA_POR_VENCER", f"La contrasena de '{app}' vence pronto. Considera renovarla.")
                    )
                    nuevas += 1

        conn.commit()
        return nuevas
    except Exception as e:
        print(f"Error al generar alertas: {e}")
        return 0
    finally:
        conn.close()


def contar_alertas_no_leidas(nombre_usuario):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return 0

        cursor.execute(
            "SELECT COUNT(*) as total FROM alertas_seguridad WHERE usuario_id = ? AND leida = 0",
            (usuario_id,)
        )
        return cursor.fetchone()["total"]
    except Exception as e:
        print(f"Error al contar alertas: {e}")
        return 0
    finally:
        conn.close()
