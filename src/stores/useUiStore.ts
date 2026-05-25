import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

type State = {
  theme: Theme;
  sheetOpen: boolean;
  paletteOpen: boolean;
  editingId: string | null;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  openAdd: () => void;
  openEdit: (id: string) => void;
  closeSheet: () => void;
  setPaletteOpen: (v: boolean) => void;
};

export const useUiStore = create<State>()(
  persist(
    (set) => ({
      theme: "light",
      sheetOpen: false,
      paletteOpen: false,
      editingId: null,
      setTheme: (t) => set({ theme: t }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      openAdd: () => set({ sheetOpen: true, editingId: null }),
      openEdit: (id) => set({ sheetOpen: true, editingId: id }),
      closeSheet: () => set({ sheetOpen: false, editingId: null }),
      setPaletteOpen: (v) => set({ paletteOpen: v }),
    }),
    { name: "guardian-ui", partialize: (s) => ({ theme: s.theme }) },
  ),
);
