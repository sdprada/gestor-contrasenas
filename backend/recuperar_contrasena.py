import bcrypt
from datetime import datetime, timedelta
from database import get_connection
from utilidades import generar_token


def solicitar_recuperacion(email):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE email = ?", (email,))
        usuario = cursor.fetchone()
        if not usuario:
            return None

        token = generar_token()
        expiracion = (datetime.now() + timedelta(hours=1)).isoformat()

        cursor.execute(
            "UPDATE usuarios SET token_recuperacion = ?, token_expiracion = ? WHERE id = ?",
            (token, expiracion, usuario["id"])
        )
        conn.commit()
        return token
    except Exception as e:
        print(f"Error al solicitar recuperacion: {e}")
        return None
    finally:
        conn.close()


def resetear_contrasena(token, nueva_clave):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE token_recuperacion = ?", (token,))
        usuario = cursor.fetchone()
        if not usuario:
            print("ERROR: Token invalido.")
            return False

        expiracion = usuario["token_expiracion"]
        if expiracion and datetime.now() > datetime.fromisoformat(expiracion):
            print("ERROR: El token ha expirado. Solicita uno nuevo.")
            return False

        clave_hash = bcrypt.hashpw(nueva_clave.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        cursor.execute(
            "UPDATE usuarios SET clave = ?, token_recuperacion = NULL, token_expiracion = NULL WHERE id = ?",
            (clave_hash, usuario["id"])
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error al resetear contrasena: {e}")
        return False
    finally:
        conn.close()
