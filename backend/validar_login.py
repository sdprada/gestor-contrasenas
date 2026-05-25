import bcrypt
from database import get_connection
from datetime import datetime, timedelta


def _registrar_log(cursor, usuario_id, accion, detalle="", ip=None):
    cursor.execute(
        "INSERT INTO logs_acceso (usuario_id, accion, ip_address, detalle) VALUES (?, ?, ?, ?)",
        (usuario_id, accion, ip, detalle)
    )


def verifica_login(usuario, clave, ip_address=None):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE nombre_usuario = ?", (usuario,))
        datos = cursor.fetchone()

        if not datos:
            _registrar_log(cursor, None, "LOGIN_FALLIDO", "Usuario no existe", ip_address)
            conn.commit()
            return "no_usuario"

        bloqueado = datos["bloqueado_hasta"]
        if bloqueado:
            bloqueado_dt = datetime.fromisoformat(bloqueado)
            if datetime.now() < bloqueado_dt:
                _registrar_log(cursor, datos["id"], "LOGIN_BLOQUEADO", f"Bloqueado hasta {bloqueado}", ip_address)
                conn.commit()
                return "bloqueado"

        clave_hash = datos["clave"]
        exito = bcrypt.checkpw(clave.encode("utf-8"), clave_hash.encode("utf-8"))

        cursor.execute(
            "INSERT INTO intentos_login (usuario_id, ip_address, exito) VALUES (?, ?, ?)",
            (datos["id"], ip_address, int(exito))
        )

        if exito:
            if bloqueado:
                cursor.execute("UPDATE usuarios SET bloqueado_hasta = NULL WHERE id = ?", (datos["id"],))
            _registrar_log(cursor, datos["id"], "LOGIN_EXITOSO", "Acceso correcto", ip_address)
            conn.commit()
            return {"status": "exito", "usuario_id": datos["id"]}
        else:
            _registrar_log(cursor, datos["id"], "LOGIN_FALLIDO", "Contrasena incorrecta", ip_address)

            hace_15min = (datetime.now() - timedelta(minutes=15)).isoformat()
            cursor.execute("""
                SELECT COUNT(*) as total FROM intentos_login
                WHERE usuario_id = ? AND exito = 0 AND fecha > ?
            """, (datos["id"], hace_15min))
            fallidos = cursor.fetchone()["total"]

            if fallidos >= 5:
                bloqueo = (datetime.now() + timedelta(minutes=30)).isoformat()
                cursor.execute("UPDATE usuarios SET bloqueado_hasta = ? WHERE id = ?", (bloqueo, datos["id"]))
                _registrar_log(cursor, datos["id"], "USUARIO_BLOQUEADO", f"Bloqueado por {fallidos} intentos fallidos", ip_address)
                conn.commit()
                return "bloqueado"

            conn.commit()
            return "no_clave"

    except Exception as e:
        print(f"Error al validar login: {e}")
        return "no_usuario"
    finally:
        conn.close()
