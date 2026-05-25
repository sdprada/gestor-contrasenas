import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUiStore } from "@/stores/useUiStore";
import { useVaultStore } from "@/stores/useVaultStore";
import { StrengthMeter } from "./StrengthMeter";
import { toast } from "sonner";

export function AddPasswordSheet() {
  const open = useUiStore((s) => s.sheetOpen);
  const editingId = useUiStore((s) => s.editingId);
  const close = useUiStore((s) => s.closeSheet);
  const entries = useVaultStore((s) => s.entries);
  const categories = useVaultStore((s) => s.categories);
  const add = useVaultStore((s) => s.add);
  const update = useVaultStore((s) => s.update);
  const generate = useVaultStore((s) => s.generate);
  const fetchCategories = useVaultStore((s) => s.fetchCategories);

  const editing = editingId ? entries.find((e) => e.id === editingId) : null;

  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (editing) {
        setCategoriaId(editing.categoria_id);
        setName(editing.name);
        setUsername(editing.username);
        setPassword(editing.password);
        setUrl(editing.url ?? "");
        setNotes(editing.notes ?? "");
        setFavorite(editing.favorite);
      } else {
        setCategoriaId(categories[0]?.id);
        setName("");
        setUsername("");
        setPassword("");
        setUrl("");
        setNotes("");
        setFavorite(false);
        // generate initial password asynchronously
        generate().then((pw) => setPassword(pw));
      }
    }
  }, [open, editing]);

  const submit = () => {
    if (!name.trim() || !password) {
      toast.error("Completa nombre y contraseña");
      return;
    }
    if (editing) {
      update(editing.id, { name, username, password, url, notes, favorite, categoria_id: categoriaId });
    } else {
      add({ name, username, password, url, notes, categoria_id: categoriaId });
    }
    close();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && close()}>
      <SheetContent className="w-full sm:max-w-[560px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {editing ? "Editar contraseña" : "Nueva contraseña"}
          </SheetTitle>
          <SheetDescription>
            Guarda una nueva credencial en tu bóveda segura.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="cat">Categoría</Label>
            <Select
              value={categoriaId ? String(categoriaId) : ""}
              onValueChange={(v) => setCategoriaId(Number(v))}
            >
              <SelectTrigger id="cat">
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre / App *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Gmail trabajo"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user">Usuario / email</Label>
            <Input
              id="user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ana@ejemplo.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pw">Contraseña *</Label>
            <div className="flex gap-2">
              <Input
                id="pw"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => generate().then((pw) => setPassword(pw))}
                aria-label="Generar"
                title="Generar contraseña fuerte"
              >
                <Sparkles className="size-4" />
              </Button>
            </div>
            <StrengthMeter password={password} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="size-4 accent-primary"
            />
            Marcar como favorita
          </label>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button onClick={submit} variant="xp">
            {editing ? "Guardar cambios" : "Crear"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
