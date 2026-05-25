import bcrypt
from database import get_connection
from utilidades import validar_email


def registro_usuario(nombre_usuario, clave, email=None, nombre_completo=None):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE nombre_usuario = ?", (nombre_usuario,))
        if cursor.fetchone():
            print("ERROR: Ese nombre de usuario ya existe.")
            return False

        if email:
            if not validar_email(email):
                print("ERROR: El formato del correo electronico no es valido.")
                return False
            cursor.execute("SELECT * FROM usuarios WHERE email = ?", (email,))
            if cursor.fetchone():
                print("ERROR: Ese correo electronico ya esta registrado.")
                return False

        clave_hash = bcrypt.hashpw(clave.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        cursor.execute(
            "INSERT INTO usuarios (nombre_usuario, clave, email, nombre_completo) VALUES (?, ?, ?, ?)",
            (nombre_usuario, clave_hash, email, nombre_completo)
        )
        conn.commit()
        print("Registro completado con exito.")
        return True

    except Exception as e:
        print(f"Error al registrar: {e}")
        return False
    finally:
        conn.close()
