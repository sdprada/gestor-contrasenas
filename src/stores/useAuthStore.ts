import { create } from "zustand";
import {
  apiLogin,
  apiRegister,
  apiLogout,
} from "@/lib/api";

export type AuthUser = {
  usuario_id: number;
  nombre_usuario: string;
  alertas_pendientes: number;
};

const STORAGE_KEY = "guardian_user";

function saveUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

type State = {
  user: AuthUser | null;
  loading: boolean;
  checked: boolean;
  checkSession: () => Promise<void>;
  login: (nombre_usuario: string, clave: string) => Promise<void>;
  register: (payload: {
    nombre_usuario: string;
    clave: string;
    email?: string;
    nombre_completo?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<State>((set) => ({
  user: null,
  loading: false,
  checked: false,

  checkSession: async () => {
    // Verificar localStorage primero
    const savedUser = loadUser();
    if (savedUser) {
      set({ user: savedUser, checked: true });
    } else {
      set({ user: null, checked: true });
    }
  },

  login: async (nombre_usuario, clave) => {
    set({ loading: true });
    try {
      const data = await apiLogin(nombre_usuario, clave);
      const user: AuthUser = {
        usuario_id: data.usuario_id,
        nombre_usuario: data.nombre_usuario,
        alertas_pendientes: data.alertas_pendientes ?? 0,
      };
      saveUser(user);
      set({ user, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      await apiRegister(payload);
      set({ loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await apiLogout();
    } catch {
      // ignorar error de red al logout
    }
    saveUser(null);
    set({ user: null, loading: false, checked: true });
  },
}));
