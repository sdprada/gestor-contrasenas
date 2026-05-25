import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import {
  apiListarContrasenas,
  apiGuardarContrasena,
  apiEditarContrasena,
  apiEliminarContrasena,
  apiEliminarTodasContrasenas,
  apiCategorias,
  apiGenerar,
} from "@/lib/api";
import { scoreStrength } from "@/lib/strength";
import { toast } from "sonner";

export type PasswordEntry = {
  id: string;
  service: string;
  name: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
  nivel_seguridad?: string;
  estado?: string;
  categoria_id?: number;
};

export type Category = {
  id: number;
  nombre: string;
};

function mapBackendToEntry(row: any): PasswordEntry {
  // Heurística para mapear categoría a service conocido
  const cat = (row.categoria_nombre || "").toLowerCase();
  let service = "other";
  if (cat.includes("redes") || cat.includes("social")) service = "facebook";
  else if (cat.includes("banco")) service = "other";
  else if (cat.includes("trabajo")) service = "github";
  else if (cat.includes("entretenimiento")) service = "netflix";
  else if (cat.includes("compra")) service = "other";

  const created = row.creado_en ? new Date(row.creado_en).getTime() : Date.now();
  return {
    id: String(row.id),
    service,
    name: row.usuario || "Sin nombre",
    username: row.username || "",
    password: row.contrasena || "",
    url: row.url || undefined,
    notes: row.notas || undefined,
    favorite: false,
    createdAt: created,
    updatedAt: created,
    nivel_seguridad: row.nivel_seguridad,
    estado: row.estado,
    categoria_id: row.categoria_id,
  };
}

type State = {
  entries: PasswordEntry[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  add: (e: Partial<PasswordEntry> & { name: string; password: string }) => Promise<void>;
  update: (id: string, patch: Partial<PasswordEntry> & { password?: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  removeAll: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  generate: () => Promise<string>;
};

export const useVaultStore = create<State>((set, get) => ({
  entries: [],
  categories: [],
  loading: false,
  error: null,

  fetchEntries: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    set({ loading: true, error: null });
    try {
      const rows = await apiListarContrasenas(user.nombre_usuario);
      set({ entries: rows.map(mapBackendToEntry), loading: false });
    } catch (e: any) {
      set({ error: e.message || "Error al cargar", loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const rows = await apiCategorias();
      set({ categories: rows });
    } catch {
      // silently fail
    }
  },

  add: async (e) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    try {
      await apiGuardarContrasena({
        nombre_usuario: user.nombre_usuario,
        usuario: e.name,
        contrasena: e.password,
        categoria_id: e.categoria_id,
        notas: e.notes,
        url: e.url,
        username: e.username,
      });
      toast.success("Contraseña guardada");
      await get().fetchEntries();
    } catch (err: any) {
      toast.error(err.message || "Error al guardar");
    }
  },

  update: async (id, patch) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const entry = get().entries.find((x) => x.id === id);
    if (!entry) return;
    try {
      await apiEditarContrasena(Number(id), {
        nombre_usuario: user.nombre_usuario,
        contrasena: patch.password || entry.password,
        categoria_id: patch.categoria_id ?? entry.categoria_id,
        notas: patch.notes ?? entry.notes,
        url: patch.url ?? entry.url,
        username: patch.username ?? entry.username,
      });
      toast.success("Actualizada");
      await get().fetchEntries();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar");
    }
  },

  remove: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    try {
      await apiEliminarContrasena(Number(id), user.nombre_usuario);
      toast.success("Eliminada");
      await get().fetchEntries();
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar");
    }
  },

  removeAll: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    try {
      await apiEliminarTodasContrasenas(user.nombre_usuario);
      toast.success("Todas eliminadas");
      await get().fetchEntries();
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar");
    }
  },

  toggleFavorite: (id) => {
    set((s) => ({
      entries: s.entries.map((x) =>
        x.id === id ? { ...x, favorite: !x.favorite } : x,
      ),
    }));
  },

  generate: async () => {
    const data = await apiGenerar(18, true);
    return data.contrasena as string;
  },
}));
