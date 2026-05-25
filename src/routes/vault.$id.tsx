import { createFileRoute, useParams, Navigate } from "@tanstack/react-router";
import { useVaultStore } from "@/stores/useVaultStore";
import { VaultDetail } from "@/components/vault/VaultDetail";

export const Route = createFileRoute("/vault/$id")({
  component: VaultDetailPage,
});

function VaultDetailPage() {
  const { id } = useParams({ from: "/vault/$id" });
  const entry = useVaultStore((s) => s.entries.find((e) => e.id === id));
  if (!entry) return <Navigate to="/vault" />;
  return <VaultDetail entry={entry} />;
}
