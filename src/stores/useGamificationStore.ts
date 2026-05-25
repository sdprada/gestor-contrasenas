import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Achievement = {
  id: string;
  name: string;
  description: string;
  goal: number;
  icon: "shield" | "target" | "zap" | "crown" | "key" | "sparkles";
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "Primer Paso",
    description: "Guarda tu primera contraseña",
    goal: 1,
    icon: "shield",
  },
  {
    id: "collector",
    name: "Coleccionista",
    description: "Guarda 10 contraseñas",
    goal: 10,
    icon: "key",
  },
  {
    id: "swift-guardian",
    name: "Guardián Veloz",
    description: "Copia 5 contraseñas",
    goal: 5,
    icon: "zap",
  },
  {
    id: "master",
    name: "Maestro Seguro",
    description: "Ten 3 contraseñas fuertes",
    goal: 3,
    icon: "crown",
  },
  {
    id: "explorer",
    name: "Explorador",
    description: "Usa el command palette",
    goal: 1,
    icon: "target",
  },
  {
    id: "polish",
    name: "Pulcro",
    description: "Marca 5 favoritas",
    goal: 5,
    icon: "sparkles",
  },
];

type State = {
  copyCount: number;
  paletteUsed: number;
  incCopy: () => void;
  incPalette: () => void;
};

export const useGamificationStore = create<State>()(
  persist(
    (set) => ({
      copyCount: 0,
      paletteUsed: 0,
      incCopy: () => set((s) => ({ copyCount: s.copyCount + 1 })),
      incPalette: () => set((s) => ({ paletteUsed: s.paletteUsed + 1 })),
    }),
    { name: "guardian-gamification" },
  ),
);
