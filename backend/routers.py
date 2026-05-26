import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from guardar_registro import registro_usuario
from validar_login import verifica_login
from recuperar_contrasena import solicitar_recuperacion, resetear_contrasena
from gestor_contrasenas import (
    guardar_contrasena,
    mostrar_contrasenas,
    editar_contrasena,
    eliminar_contrasena,
    eliminar_todas_contrasenas,
    obtener_perfil,
    listar_categorias
)
from historial_caducidad import (
    analizar_caducidad,
    resumen_seguridad,
    obtener_historial,
    obtener_logs_acceso
)
from alertas_seguridad import (
    obtener_alertas,
    marcar_alerta_leida,
    contar_alertas_no_leidas
)
from utilidades import generar_contrasena, analizar_seguridad

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "clave-secreta-gestor-muy-larga-y-aleatoria")

# Configuracion de sesion para funcionar con frontend en otro puerto
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = False
app.config["SESSION_COOKIE_HTTPONLY"] = True

CORS(app, supports_credentials=True, origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:3000", "http://192.168.1.11:8080", "http://192.168.1.14:8080"], allow_headers=["Content-Type"], methods=["GET","POST","PUT","PATCH","DELETE","OPTIONS"])

# ── REGISTRO ──────────────────────────────────────────
@app.route("/registro", methods=["POST"])
def registro():
    datos = request.json
    nombre = datos.get("nombre_usuario")
    clave = datos.get("clave")
    email = datos.get("email")
    nombre_completo = datos.get("nombre_completo")

    if not nombre or not clave:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    resultado = registro_usuario(nombre, clave, email, nombre_completo)
    if resultado:
        return jsonify({"mensaje": "Registro exitoso"}), 201
    else:
        return jsonify({"error": "No se pudo registrar. Verifica que el usuario/email no existan."}), 409


# ── LOGIN ─────────────────────────────────────────────
@app.route("/login", methods=["POST"])
def login():
    datos = request.json
    usuario = datos.get("nombre_usuario")
    clave = datos.get("clave")

    if not usuario or not clave:
        return jsonify({"error": "Faltan campos"}), 400

    ip = request.remote_addr
    resultado = verifica_login(usuario, clave, ip_address=ip)

    if isinstance(resultado, dict) and resultado.get("status") == "exito":
        session["usuario_id"] = resultado["usuario_id"]
        session["nombre_usuario"] = usuario
        alertas = contar_alertas_no_leidas(usuario)
        return jsonify({
            "mensaje": "Login exitoso",
            "usuario_id": resultado["usuario_id"],
            "nombre_usuario": usuario,
            "alertas_pendientes": alertas
        }), 200
    elif resultado == "no_clave":
        return jsonify({"error": "Contrasena incorrecta"}), 401
    elif resultado == "no_usuario":
        return jsonify({"error": "Usuario no encontrado"}), 404
    elif resultado == "bloqueado":
        return jsonify({"error": "Cuenta bloqueada temporalmente."}), 403
    return jsonify({"error": "Error desconocido"}), 500


# ── SESSION ───────────────────────────────────────────
@app.route("/session", methods=["GET"])
def session_check():
    usuario_id = session.get("usuario_id")
    nombre_usuario = session.get("nombre_usuario")
    if usuario_id and nombre_usuario:
        alertas = contar_alertas_no_leidas(nombre_usuario)
        return jsonify({
            "autenticado": True,
            "usuario_id": usuario_id,
            "nombre_usuario": nombre_usuario,
            "alertas_pendientes": alertas
        }), 200
    return jsonify({"autenticado": False}), 200


# ── LOGOUT ────────────────────────────────────────────
@app.route("/logout", methods=["POST"])
def logout():
    session.pop("nombre_usuario", None)
    session.pop("usuario_id", None)
    return jsonify({"mensaje": "Sesion cerrada"}), 200


# ── PERFIL ────────────────────────────────────────────
@app.route("/perfil", methods=["GET"])
def perfil():
    nombre = request.args.get("nombre_usuario") or session.get("nombre_usuario")
    if not nombre:
        return jsonify({"error": "Falta nombre_usuario"}), 400

    datos = obtener_perfil(nombre)
    if not datos:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({
        "id": datos["id"],
        "nombre_usuario": datos["nombre_usuario"],
        "email": datos.get("email"),
        "nombre_completo": datos.get("nombre_completo"),
        "creado_en": str(datos["creado_en"])
    }), 200


# ── RECUPERAR CONTRASENA ─────────────────────────────
@app.route("/recuperar", methods=["POST"])
def recuperar():
    datos = request.json
    email = datos.get("email")
    if not email:
        return jsonify({"error": "Falta email"}), 400

    token = solicitar_recuperacion(email)
    if token:
        return jsonify({
            "mensaje": "Token de recuperacion generado.",
            "token": token
        }), 200
    else:
        return jsonify({"error": "Email no encontrado"}), 404


@app.route("/resetear", methods=["POST"])
def resetear():
    datos = request.json
    token = datos.get("token")
    nueva = datos.get("nueva_clave")
    if not token or not nueva:
        return jsonify({"error": "Faltan campos"}), 400

    resultado = resetear_contrasena(token, nueva)
    if resultado:
        return jsonify({"mensaje": "Contrasena actualizada"}), 200
    else:
        return jsonify({"error": "Token invalido o expirado"}), 400


# ── GENERADOR ─────────────────────────────────────────
@app.route("/generar", methods=["GET"])
def generar():
    longitud = request.args.get("longitud", 16, type=int)
    simbolos = request.args.get("simbolos", "1") == "1"
    nueva = generar_contrasena(longitud=longitud, incluir_simbolos=simbolos)
    analisis = analizar_seguridad(nueva)
    return jsonify({
        "contrasena": nueva,
        "longitud": len(nueva),
        "nivel": analisis["nivel"],
        "puntaje": analisis["puntaje"]
    }), 200


# ── CATEGORIAS ────────────────────────────────────────
@app.route("/categorias", methods=["GET"])
def categorias():
    datos = listar_categorias()
    return jsonify(datos), 200


# ── CONTRASENAS ───────────────────────────────────────
@app.route("/contrasenas", methods=["GET"])
def listar():
    nombre_usuario = request.args.get("nombre_usuario")
    categoria_id = request.args.get("categoria_id", type=int)
    if not nombre_usuario:
        return jsonify({"error": "Falta nombre_usuario"}), 400
    datos = mostrar_contrasenas(nombre_usuario, categoria_id=categoria_id)
    return jsonify(datos), 200


@app.route("/contrasenas", methods=["POST"])
def agregar():
    datos = request.json
    nombre_usuario = datos.get("nombre_usuario")
    usuario = datos.get("usuario")
    contrasena = datos.get("contrasena")
    usar_generada = datos.get("generada", False)
    categoria_id = datos.get("categoria_id")
    notas = datos.get("notas")
    url = datos.get("url")
    username = datos.get("username")

    if not nombre_usuario or not usuario:
        return jsonify({"error": "Faltan campos"}), 400

    if usar_generada:
        contrasena = generar_contrasena()

    if not contrasena:
        return jsonify({"error": "Falta contrasena"}), 400

    guardar_contrasena(nombre_usuario, usuario, contrasena,
                       es_generada=usar_generada, categoria_id=categoria_id,
                       notas=notas, url=url, username=username)
    return jsonify({"mensaje": "Guardado"}), 201


@app.route("/contrasenas/<int:id_c>", methods=["PATCH"])
def editar(id_c):
    datos = request.json
    nombre_usuario = datos.get("nombre_usuario")
    nueva = datos.get("contrasena")
    categoria_id = datos.get("categoria_id")
    notas = datos.get("notas")
    url = datos.get("url")
    username = datos.get("username")

    if not nombre_usuario or not nueva:
        return jsonify({"error": "Faltan campos"}), 400

    editar_contrasena(nombre_usuario, id_c, nueva,
                      categoria_id=categoria_id, notas=notas, url=url, username=username)
    return jsonify({"mensaje": "Actualizado"}), 200


@app.route("/contrasenas/<int:id_c>", methods=["DELETE"])
def eliminar(id_c):
    datos = request.json or {}
    nombre_usuario = datos.get("nombre_usuario")
    if not nombre_usuario:
        return jsonify({"error": "Falta nombre_usuario"}), 400
    eliminar_contrasena(nombre_usuario, id_c)
    return jsonify({"mensaje": "Eliminado"}), 200


@app.route("/contrasenas", methods=["DELETE"])
def eliminar_todas():
    datos = request.json or {}
    nombre_usuario = datos.get("nombre_usuario")
    if not nombre_usuario:
        return jsonify({"error": "Falta nombre_usuario"}), 400
    eliminar_todas_contrasenas(nombre_usuario)
    return jsonify({"mensaje": "Todas eliminadas"}), 200


# ── ALERTAS ───────────────────────────────────────────
@app.route("/alertas", methods=["GET"])
def alertas():
    nombre_usuario = request.args.get("nombre_usuario")
    solo_no_leidas = request.args.get("solo_no_leidas", "0") == "1"
    if not nombre_usuario:
        return jsonify({"error": "Falta nombre_usuario"}), 400
    datos = obtener_alertas(nombre_usuario, solo_no_leidas=solo_no_leidas)
    return jsonify(datos), 200


@app.route("/alertas/<int:id_a>/leer", methods=["PATCH"])
def leer_alerta(id_a):
    datos = request.json or {}
    nombre_usuario = datos.get("nombre_usuario")
    if not nombre_usuario:
        return jsonify({"error": "Falta nombre_usuario"}), 400
    ok = marcar_alerta_leida(id_a, nombre_usuario)
    if ok:
        return jsonify({"mensaje": "Alerta marcada como leida"}), 200
    else:
        return jsonify({"error": "Alerta no encontrada"}), 404


# ── HISTORIAL ─────────────────────────────────────────
@app.route("/historial", methods=["GET"])
def historial():
    nombre_usuario = request.args.get("nombre_usuario")
    if not nombre_usuario:
        return jsonify({"error": "Falta nombre_usuario"}), 400
    datos = obtener_historial(nombre_usuario)
    return jsonify(datos), 200


@app.route("/logs", methods=["GET"])
def logs():
    nombre_usuario = request.args.get("nombre_usuario")
    if not nombre_usuario:
        return jsonify({"error": "Falta nombre_usuario"}), 400
    datos = obtener_logs_acceso(nombre_usuario)
    return jsonify(datos), 200


@app.route("/resumen", methods=["GET"])
def resumen():
    nombre_usuario = request.args.get("nombre_usuario")
    if not nombre_usuario:
        return jsonify({"error": "Falta nombre_usuario"}), 400
    datos = resumen_seguridad(nombre_usuario)
    return jsonify(datos), 200


# ── INICIO ────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)
