import os
from dotenv import load_dotenv

load_dotenv()

FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "clave-secreta-gestor-muy-larga-y-aleatoria")
FERNET_MASTER_KEY = os.getenv("FERNET_MASTER_KEY", "VOv6RadCrG6ESer0zyzak8fUaJb9WWceosLqc7S_CM4=")
