const API_BASE = "http://localhost:5000";

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Error ${res.status}`);
    (err as any).status = res.status;
    (err as any).data = data;
    throw err;
  }
  return data;
}

// Auth
export const apiSession = () => apiFetch("/session");
export const apiLogin = (nombre_usuario: string, clave: string) =>
  apiFetch("/login", { method: "POST", body: JSON.stringify({ nombre_usuario, clave }) });
export const apiRegister = (payload: {
  nombre_usuario: string;
  clave: string;
  email?: string;
  nombre_completo?: string;
}) => apiFetch("/registro", { method: "POST", body: JSON.stringify(payload) });
export const apiLogout = () => apiFetch("/logout", { method: "POST" });
export const apiPerfil = () => apiFetch("/perfil");
export const apiRecuperar = (email: string) =>
  apiFetch("/recuperar", { method: "POST", body: JSON.stringify({ email }) });
export const apiResetear = (token: string, nueva_clave: string) =>
  apiFetch("/resetear", { method: "POST", body: JSON.stringify({ token, nueva_clave }) });

// Passwords
export const apiListarContrasenas = (nombre_usuario: string, categoria_id?: number) => {
  const params = new URLSearchParams({ nombre_usuario });
  if (categoria_id) params.append("categoria_id", String(categoria_id));
  return apiFetch(`/contrasenas?${params}`);
};
export const apiGuardarContrasena = (payload: Record<string, unknown>) =>
  apiFetch("/contrasenas", { method: "POST", body: JSON.stringify(payload) });
export const apiEditarContrasena = (id: number, payload: Record<string, unknown>) =>
  apiFetch(`/contrasenas/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const apiEliminarContrasena = (id: number, nombre_usuario: string) =>
  apiFetch(`/contrasenas/${id}`, { method: "DELETE", body: JSON.stringify({ nombre_usuario }) });
export const apiEliminarTodasContrasenas = (nombre_usuario: string) =>
  apiFetch("/contrasenas", { method: "DELETE", body: JSON.stringify({ nombre_usuario }) });

// Categories
export const apiCategorias = () => apiFetch("/categorias");

// Generator & analysis
export const apiGenerar = (longitud = 16, simbolos = true) =>
  apiFetch(`/generar?longitud=${longitud}&simbolos=${simbolos ? 1 : 0}`);

// Alerts
export const apiAlertas = (nombre_usuario: string, soloNoLeidas = false) =>
  apiFetch(`/alertas?nombre_usuario=${encodeURIComponent(nombre_usuario)}&solo_no_leidas=${soloNoLeidas ? 1 : 0}`);
export const apiMarcarAlerta = (id: number, nombre_usuario: string) =>
  apiFetch(`/alertas/${id}/leer`, { method: "PATCH", body: JSON.stringify({ nombre_usuario }) });

// History / Logs / Summary
export const apiHistorial = (nombre_usuario: string) =>
  apiFetch(`/historial?nombre_usuario=${encodeURIComponent(nombre_usuario)}`);
export const apiLogs = (nombre_usuario: string) =>
  apiFetch(`/logs?nombre_usuario=${encodeURIComponent(nombre_usuario)}`);
export const apiResumen = (nombre_usuario: string) =>
  apiFetch(`/resumen?nombre_usuario=${encodeURIComponent(nombre_usuario)}`);
