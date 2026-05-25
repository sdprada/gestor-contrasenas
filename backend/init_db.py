import sqlite3
from database import get_connection


def crear_tablas():
    conn = get_connection()
    try:
        cursor = conn.cursor()

        # 1. USUARIOS
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre_usuario TEXT NOT NULL UNIQUE,
                clave TEXT NOT NULL,
                email TEXT UNIQUE,
                nombre_completo TEXT,
                token_recuperacion TEXT,
                token_expiracion TEXT,
                bloqueado_hasta TEXT,
                activo INTEGER DEFAULT 1,
                creado_en TEXT DEFAULT (datetime('now'))
            )
        """)
        print("Tabla 'usuarios' creada o ya existente.")

        # 2. CATEGORIAS
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categorias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL UNIQUE,
                descripcion TEXT,
                creado_en TEXT DEFAULT (datetime('now'))
            )
        """)
        cursor.execute("SELECT COUNT(*) as total FROM categorias")
        if cursor.fetchone()["total"] == 0:
            cursor.executemany(
                "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
                [
                    ('Redes Sociales', 'Facebook, Instagram, Twitter, etc.'),
                    ('Bancos', 'Cuentas bancarias y financieras'),
                    ('Trabajo', 'Herramientas y plataformas laborales'),
                    ('Entretenimiento', 'Netflix, Spotify, juegos, etc.'),
                    ('Compras', 'Amazon, eBay, tiendas online'),
                    ('Otros', 'Cualquier otra categoria'),
                ]
            )
            print("Categorias por defecto insertadas.")
        print("Tabla 'categorias' creada o ya existente.")

        # 3. CONTRASENAS
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contrasenas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                usuario TEXT NOT NULL,
                contrasena TEXT NOT NULL,
                nivel_seguridad TEXT,
                fecha_expiracion TEXT,
                es_generada INTEGER DEFAULT 0,
                categoria_id INTEGER,
                notas TEXT,
                url TEXT,
                username TEXT,
                creado_en TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
            )
        """)
        print("Tabla 'contrasenas' creada o ya existente.")

        # 4. HISTORIAL SEGURIDAD
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS historial_seguridad (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                id_contrasena INTEGER,
                accion TEXT NOT NULL,
                detalle TEXT,
                fecha TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        """)
        print("Tabla 'historial_seguridad' creada o ya existente.")

        # 5. INTENTOS LOGIN
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS intentos_login (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                ip_address TEXT,
                exito INTEGER DEFAULT 0,
                fecha TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        """)
        print("Tabla 'intentos_login' creada o ya existente.")

        # 6. ALERTAS SEGURIDAD
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alertas_seguridad (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                tipo TEXT NOT NULL,
                mensaje TEXT NOT NULL,
                leida INTEGER DEFAULT 0,
                fecha TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        """)
        print("Tabla 'alertas_seguridad' creada o ya existente.")

        # 7. LOGS ACCESO
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS logs_acceso (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER,
                accion TEXT NOT NULL,
                ip_address TEXT,
                detalle TEXT,
                fecha TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        """)
        print("Tabla 'logs_acceso' creada o ya existente.")

        conn.commit()
        print("\nBase de datos y tablas listas para usar.")
    finally:
        conn.close()


if __name__ == "__main__":
    crear_tablas()
