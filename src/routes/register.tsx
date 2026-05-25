import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);

  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [email, setEmail] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !clave) {
      toast.error("Usuario y contraseña son obligatorios");
      return;
    }
    if (clave !== clave2) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    try {
      await register({
        nombre_usuario: nombre.trim(),
        clave,
        email: email.trim() || undefined,
        nombre_completo: nombreCompleto.trim() || undefined,
      });
      toast.success("Cuenta creada. Ahora inicia sesión.");
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error(err.message || "No se pudo registrar");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="size-6 text-primary" />
          <h1 className="text-xl font-bold">Crear cuenta</h1>
        </div>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="user">Nombre de usuario *</Label>
            <Input
              id="user"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="ej. ana_guardian"
              autoComplete="username"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              placeholder="Ana García"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ana@ejemplo.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pass">Contraseña maestra *</Label>
            <Input
              id="pass"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pass2">Repetir contraseña *</Label>
            <Input
              id="pass2"
              type="password"
              value={clave2}
              onChange={(e) => setClave2(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={loading} variant="xp" className="w-full">
            {loading ? "Creando..." : "Crear cuenta"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Ya tengo cuenta
          </Link>
        </div>
      </Card>
    </div>
  );
}
