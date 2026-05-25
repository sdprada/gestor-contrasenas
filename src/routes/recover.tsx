import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRecuperar, apiResetear } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/recover")({
  component: RecoverPage,
});

function RecoverPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [nueva, setNueva] = useState("");
  const [nueva2, setNueva2] = useState("");
  const [step, setStep] = useState<"email" | "token">("email");
  const [loading, setLoading] = useState(false);

  const solicitar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Ingresa tu correo");
      return;
    }
    setLoading(true);
    try {
      const data = await apiRecuperar(email.trim());
      toast.success(data.mensaje);
      setStep("token");
    } catch (err: any) {
      toast.error(err.message || "Email no encontrado");
    } finally {
      setLoading(false);
    }
  };

  const resetear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !nueva) {
      toast.error("Completa todos los campos");
      return;
    }
    if (nueva !== nueva2) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await apiResetear(token.trim(), nueva);
      toast.success("Contraseña actualizada. Ahora inicia sesión.");
      setStep("email");
      setEmail("");
      setToken("");
      setNueva("");
      setNueva2("");
    } catch (err: any) {
      toast.error(err.message || "Token inválido o expirado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-2">
          {step === "email" ? (
            <ShieldCheck className="size-6 text-primary" />
          ) : (
            <KeyRound className="size-6 text-primary" />
          )}
          <h1 className="text-xl font-bold">
            {step === "email" ? "Recuperar acceso" : "Restablecer contraseña"}
          </h1>
        </div>

        {step === "email" ? (
          <form onSubmit={solicitar} className="grid gap-4">
            <p className="text-sm text-foreground-muted">
              Ingresa el correo asociado a tu cuenta. Si existe, generaremos un token de recuperación.
            </p>
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
            <Button type="submit" disabled={loading} variant="xp" className="w-full">
              {loading ? "Enviando..." : "Solicitar token"}
            </Button>
          </form>
        ) : (
          <form onSubmit={resetear} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="token">Token de recuperación</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Pega aquí el token"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nueva">Nueva contraseña</Label>
              <Input
                id="nueva"
                type="password"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nueva2">Repetir nueva contraseña</Label>
              <Input
                id="nueva2"
                type="password"
                value={nueva2}
                onChange={(e) => setNueva2(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={loading} variant="xp" className="w-full">
              {loading ? "Actualizando..." : "Restablecer"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep("email")}
            >
              Volver a solicitar token
            </Button>
          </form>
        )}

        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Volver al login
          </Link>
        </div>
      </Card>
    </div>
  );
}
