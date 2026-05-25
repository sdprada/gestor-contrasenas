import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !clave) {
      toast.error("Completa todos los campos");
      return;
    }
    try {
      await login(usuario.trim(), clave);
      toast.success("Bienvenido de vuelta");
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="size-6 text-primary" />
          <h1 className="text-xl font-bold">Guardián de Contraseñas</h1>
        </div>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="user">Usuario</Label>
            <Input
              id="user"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Tu nombre de usuario"
              autoComplete="username"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pass">Contraseña</Label>
            <Input
              id="pass"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={loading} variant="xp" className="w-full">
            {loading ? "Entrando..." : "Iniciar sesión"}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link to="/register" className="text-primary hover:underline">
            Crear cuenta
          </Link>
          <Link to="/recover" className="text-foreground-muted hover:text-foreground">
            ¿Olvidaste tu clave?
          </Link>
        </div>
      </Card>
    </div>
  );
}
