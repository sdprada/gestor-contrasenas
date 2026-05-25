import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageStack } from "@/components/layout/PageContainer";
import { VaultList } from "@/components/vault/VaultList";
import { useUiStore } from "@/stores/useUiStore";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Bóveda · Guardián de Contraseñas" },
      {
        name: "description",
        content:
          "Todas tus contraseñas almacenadas, con búsqueda, filtros e indicadores de fortaleza.",
      },
    ],
  }),
  component: VaultLayout,
});

function VaultLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const hasDetail = path !== "/vault" && path !== "/vault/";
  const openAdd = useUiStore((s) => s.openAdd);

  return (
    <PageStack density="tight">
      <PageHeader
        title="Bóveda Segura"
        description="Gestiona, busca y revisa la fortaleza de todas tus credenciales."
        actions={
          <Button onClick={openAdd} variant="xp" size="sm">
            <Plus className="size-4" />
            Nueva contraseña
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className={hasDetail ? "hidden lg:block" : "block"}>
          <div className="panel p-3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)]">
            <VaultList />
          </div>
        </div>
        <div className="panel p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </PageStack>
  );
}
