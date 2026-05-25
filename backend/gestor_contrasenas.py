import os
from cryptography.fernet import Fernet
from database import get_connection
from utilidades import analizar_seguridad, calcular_expiracion, estado_caducidad
from datetime import datetime


def get_cipher():
    key = os.getenv("FERNET_MASTER_KEY").encode()
    return Fernet(key)


def cifrar_texto(texto):
    if not texto:
        return texto
    return get_cipher().encrypt(texto.encode("utf-8")).decode("utf-8")


def descifrar_texto(texto_cifrado):
    if not texto_cifrado:
        return texto_cifrado
    try:
        return get_cipher().decrypt(texto_cifrado.encode("utf-8")).decode("utf-8")
    except Exception:
        return texto_cifrado


def _obtener_usuario_id(cursor, nombre_usuario):
    cursor.execute("SELECT id FROM usuarios WHERE nombre_usuario = ?", (nombre_usuario,))
    usuario = cursor.fetchone()
    return usuario["id"] if usuario else None


def _registrar_historial(cursor, usuario_id, id_contrasena, accion, detalle=""):
    cursor.execute(
        "INSERT INTO historial_seguridad (usuario_id, id_contrasena, accion, detalle) VALUES (?, ?, ?, ?)",
        (usuario_id, id_contrasena, accion, detalle)
    )


def _crear_alerta(cursor, usuario_id, tipo, mensaje):
    cursor.execute(
        "INSERT INTO alertas_seguridad (usuario_id, tipo, mensaje) VALUES (?, ?, ?)",
        (usuario_id, tipo, mensaje)
    )


def listar_categorias():
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categorias ORDER BY nombre")
        return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error al listar categorias: {e}")
        return []
    finally:
        conn.close()


def guardar_contrasena(nombre_usuario, app, contrasena, es_generada=False,
                       categoria_id=None, notas=None, url=None, username=None):
    if not app or not contrasena:
        return False

    analisis = analizar_seguridad(contrasena)
    nivel = analisis["nivel"]
    fecha_exp = calcular_expiracion()
    contrasena_cifrada = cifrar_texto(contrasena)

    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return False

        cursor.execute(
            """
            INSERT INTO contrasenas
            (usuario_id, usuario, contrasena, nivel_seguridad, fecha_expiracion,
             es_generada, categoria_id, notas, url, username)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (usuario_id, app, contrasena_cifrada, nivel, fecha_exp, int(es_generada),
             categoria_id, notas, url, username)
        )
        nueva_id = cursor.lastrowid
        _registrar_historial(cursor, usuario_id, nueva_id, "CREADA",
                             f"Nivel: {nivel}, Puntaje: {analisis['puntaje']}")
        if nivel == "DEBIL":
            _crear_alerta(cursor, usuario_id, "CONTRASENA_DEBIL",
                          f"La contrasena guardada para '{app}' es debil. Considera cambiarla.")
        conn.commit()
        return True
    except Exception as e:
        print(f"Error al guardar contrasena: {e}")
        return False
    finally:
        conn.close()


def mostrar_contrasenas(nombre_usuario, categoria_id=None):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return []

        if categoria_id:
            cursor.execute(
                """
                SELECT c.*, cat.nombre as categoria_nombre
                FROM contrasenas c
                LEFT JOIN categorias cat ON c.categoria_id = cat.id
                WHERE c.usuario_id = ? AND c.categoria_id = ?
                ORDER BY c.creado_en DESC
                """,
                (usuario_id, categoria_id)
            )
        else:
            cursor.execute(
                """
                SELECT c.*, cat.nombre as categoria_nombre
                FROM contrasenas c
                LEFT JOIN categorias cat ON c.categoria_id = cat.id
                WHERE c.usuario_id = ?
                ORDER BY c.creado_en DESC
                """,
                (usuario_id,)
            )
        filas = [dict(row) for row in cursor.fetchall()]
        for f in filas:
            f["estado"] = estado_caducidad(f["fecha_expiracion"])
            f["contrasena"] = descifrar_texto(f["contrasena"])
        return filas
    except Exception as e:
        print(f"Error al mostrar contrasenas: {e}")
        return []
    finally:
        conn.close()


def editar_contrasena(nombre_usuario, id_contrasena, nueva_contrasena,
                      categoria_id=None, notas=None, url=None, username=None):
    analisis = analizar_seguridad(nueva_contrasena)
    nivel = analisis["nivel"]
    fecha_exp = calcular_expiracion()
    contrasena_cifrada = cifrar_texto(nueva_contrasena)

    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return False

        cursor.execute(
            """
            UPDATE contrasenas
            SET contrasena = ?, nivel_seguridad = ?, fecha_expiracion = ?,
                es_generada = 0, categoria_id = ?, notas = ?, url = ?, username = ?
            WHERE id = ? AND usuario_id = ?
            """,
            (contrasena_cifrada, nivel, fecha_exp, categoria_id, notas, url, username,
             id_contrasena, usuario_id)
        )
        if cursor.rowcount > 0:
            _registrar_historial(cursor, usuario_id, id_contrasena, "EDITADA", f"Nuevo nivel: {nivel}")
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        print(f"Error al editar contrasena: {e}")
        return False
    finally:
        conn.close()


def eliminar_contrasena(nombre_usuario, id_contrasena):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return False

        _registrar_historial(cursor, usuario_id, id_contrasena, "ELIMINADA")
        cursor.execute("DELETE FROM contrasenas WHERE id = ? AND usuario_id = ?", (id_contrasena, usuario_id))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        print(f"Error al eliminar contrasena: {e}")
        return False
    finally:
        conn.close()


def eliminar_todas_contrasenas(nombre_usuario):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        usuario_id = _obtener_usuario_id(cursor, nombre_usuario)
        if not usuario_id:
            return False

        cursor.execute("SELECT id FROM contrasenas WHERE usuario_id = ?", (usuario_id,))
        ids = cursor.fetchall()
        for row in ids:
            _registrar_historial(cursor, usuario_id, row["id"], "ELIMINADA")

        cursor.execute("DELETE FROM contrasenas WHERE usuario_id = ?", (usuario_id,))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error al eliminar todas las contrasenas: {e}")
        return False
    finally:
        conn.close()


def obtener_perfil(nombre_usuario):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, nombre_usuario, email, nombre_completo, creado_en FROM usuarios WHERE nombre_usuario = ?",
            (nombre_usuario,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None
    except Exception as e:
        print(f"Error al obtener perfil: {e}")
        return None
    finally:
        conn.close()
