import random
import re
import string
import secrets
from datetime import datetime, timedelta


def analizar_seguridad(password):
    """
    Analiza la fortaleza de una contrasena y devuelve puntaje y nivel.
    """
    puntaje = 0
    detalles = []

    longitud = len(password)
    if longitud < 6:
        puntaje += 5
        detalles.append("Muy corta")
    elif longitud < 10:
        puntaje += 20
        detalles.append("Corta")
    elif longitud < 14:
        puntaje += 35
        detalles.append("Media")
    else:
        puntaje += 45
        detalles.append("Larga")

    if re.search(r'[A-Z]', password):
        puntaje += 10
        detalles.append("Tiene mayusculas")
    else:
        detalles.append("Sin mayusculas")

    if re.search(r'[a-z]', password):
        puntaje += 10
        detalles.append("Tiene minusculas")
    else:
        detalles.append("Sin minusculas")

    if re.search(r'\d', password):
        puntaje += 15
        detalles.append("Tiene numeros")
    else:
        detalles.append("Sin numeros")

    if re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        puntaje += 20
        detalles.append("Tiene simbolos")
    else:
        detalles.append("Sin simbolos")

    # Penalizaciones
    if password.lower() in ['password', '123456', 'qwerty', 'admin', 'contrasena']:
        puntaje -= 30
        detalles.append("Contrasena muy comun")

    if re.search(r'(.)\1{2,}', password): 
        puntaje -= 10
        detalles.append("Caracteres repetidos")

    puntaje = max(0, min(100, puntaje))

    if puntaje < 40:
        nivel = "DEBIL"
    elif puntaje < 70:
        nivel = "MEDIA"
    else:
        nivel = "FUERTE"

    return {
        "puntaje": puntaje,
        "nivel": nivel,
        "detalles": detalles
    }


def generar_contrasena(longitud=16, incluir_mayusculas=True, incluir_minusculas=True,
                       incluir_numeros=True, incluir_simbolos=True):
    """
    Genera una contrasena segura aleatoria.
    """
    caracteres = ""
    if incluir_minusculas:
        caracteres += string.ascii_lowercase
    if incluir_mayusculas:
        caracteres += string.ascii_uppercase
    if incluir_numeros:
        caracteres += string.digits
    if incluir_simbolos:
        caracteres += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if not caracteres:
        raise ValueError("Debe seleccionar al menos un tipo de caracter")

    password = []
    if incluir_minusculas:
        password.append(secrets.choice(string.ascii_lowercase))
    if incluir_mayusculas:
        password.append(secrets.choice(string.ascii_uppercase))
    if incluir_numeros:
        password.append(secrets.choice(string.digits))
    if incluir_simbolos:
        password.append(secrets.choice("!@#$%^&*()_+-=[]{}|;:,.<>?"))

    for _ in range(longitud - len(password)):
        password.append(secrets.choice(caracteres))

    random.shuffle(password)
    return "".join(password)


def calcular_expiracion(dias=90):
    """
    Calcula la fecha de expiracion a partir de hoy.
    """
    return datetime.now() + timedelta(days=dias)


def generar_token():
    """
    Genera un token seguro para recuperacion de contrasena.
    """
    return secrets.token_urlsafe(32)


def validar_email(email):
    """
    Valida formato basico de correo electronico.
    """
    patron = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(patron, email) is not None


def estado_caducidad(fecha_expiracion):
    """
    Devuelve el estado de una contrasena segun su fecha de expiracion.
    """
    if not fecha_expiracion:
        return "SIN_FECHA"

    ahora = datetime.now()
    if isinstance(fecha_expiracion, str):
        try:
            fecha_expiracion = datetime.fromisoformat(fecha_expiracion)
        except ValueError:
            return "SIN_FECHA"

    dias_restantes = (fecha_expiracion - ahora).days

    if dias_restantes < 0:
        return "VENCIDA"
    elif dias_restantes <= 7:
        return "POR_VENCER"
    else:
        return "VIGENTE"
