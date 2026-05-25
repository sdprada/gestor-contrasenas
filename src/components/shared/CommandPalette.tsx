import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  KeyRound,
  Trophy,
  Settings,
  Plus,
  Sun,
  Moon,
} from "lucide-react";
import { useUiStore } from "@/stores/useUiStore";
import { useVaultStore } from "@/stores/useVaultStore";
import { useGamificationStore } from "@/stores/useGamificationStore";
import { useClipboard } from "@/hooks/useClipboard";

export function CommandPalette() {
  const open = useUiStore((s) => s.paletteOpen);
  const setOpen = useUiStore((s) => s.setPaletteOpen);
  const openAdd = useUiStore((s) => s.openAdd);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const theme = useUiStore((s) => s.theme);
  const incPalette = useGamificationStore((s) => s.incPalette);
  const entries = useVaultStore((s) => s.entries);
  const copy = useClipboard();
  const nav = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "n" && !open && !isTyping(e)) {
        e.preventDefault();
        openAdd();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen, openAdd]);

  useEffect(() => {
    if (open) incPalette();
  }, [open, incPalette]);

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 50);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar contraseñas o ejecutar acción…" />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandGroup heading="Acciones">
          <CommandItem onSelect={() => run(openAdd)}>
            <Plus /> Nueva contraseña
          </CommandItem>
          <CommandItem onSelect={() => run(toggleTheme)}>
            {theme === "dark" ? <Sun /> : <Moon />} Cambiar a modo{" "}
            {theme === "dark" ? "claro" : "oscuro"}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navegación">
          <CommandItem onSelect={() => run(() => nav({ to: "/" }))}>
            <LayoutDashboard /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => run(() => nav({ to: "/vault" }))}>
            <KeyRound /> Bóveda
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => nav({ to: "/achievements" }))}
          >
            <Trophy /> Logros
          </CommandItem>
          <CommandItem onSelect={() => run(() => nav({ to: "/settings" }))}>
            <Settings /> Ajustes
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Contraseñas">
          {entries.map((e) => (
            <CommandItem
              key={e.id}
              value={`${e.name} ${e.username}`}
              onSelect={() =>
                run(() => nav({ to: "/vault/$id", params: { id: e.id } }))
              }
            >
              <KeyRound />
              <span className="flex-1">{e.name}</span>
              <span className="text-xs text-foreground-muted">
                {e.username}
              </span>
              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  setOpen(false);
                  copy(e.password, e.name);
                }}
                className="ml-2 rounded border border-border px-1.5 py-0.5 text-[10px] hover:bg-surface-muted"
              >
                copiar
              </button>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    (t as HTMLElement).isContentEditable
  );
}
