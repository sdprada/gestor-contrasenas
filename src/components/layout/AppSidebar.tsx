import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  KeyRound,
  Trophy,
  Settings,
  Plus,
  Bell,
  History,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MascotAvatar } from "@/components/guardian/MascotAvatar";
import { XpBar } from "@/components/guardian/XpBar";
import { useGuardian } from "@/hooks/useGuardian";
import { useUiStore } from "@/stores/useUiStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/vault", label: "Bóveda", icon: KeyRound, exact: false },
  { to: "/alerts", label: "Alertas", icon: Bell, exact: false },
  { to: "/history", label: "Historial", icon: History, exact: false },
  { to: "/security", label: "Seguridad", icon: ShieldAlert, exact: false },
  { to: "/achievements", label: "Logros", icon: Trophy, exact: false },
  { to: "/settings", label: "Ajustes", icon: Settings, exact: false },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { level, xpInLevel, xpNeeded } = useGuardian();
  const openAdd = useUiStore((s) => s.openAdd);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isActive = (to: string, exact: boolean) =>
    exact ? path === to : path === to || path.startsWith(`${to}/`);

  const handleLogout = async () => {
    await logout();
    toast.success("Sesión cerrada");
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <MascotAvatar size="sm" level={level} animate={false} />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold leading-tight">Guardián</span>
            <span className="text-xs text-foreground-muted">Nivel {level}</span>
          </div>
        </Link>
        <div className="mt-3 group-data-[collapsible=icon]:hidden">
          <XpBar value={xpInLevel} max={xpNeeded} />
          <p className="mt-1.5 text-[11px] text-foreground-muted tabular">
            {xpInLevel} / {xpNeeded} XP
          </p>
        </div>
        {user && (
          <p className="mt-2 text-[11px] text-foreground-muted truncate group-data-[collapsible=icon]:hidden">
            {user.nombre_usuario}
          </p>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((n) => (
                <SidebarMenuItem key={n.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(n.to, n.exact)}
                    tooltip={n.label}
                  >
                    <Link to={n.to}>
                      <n.icon className="size-4" />
                      <span>{n.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Button
          onClick={openAdd}
          variant="xp"
          className="w-full justify-start group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
        >
          <Plus className="size-4" />
          <span className="group-data-[collapsible=icon]:hidden">
            Nueva contraseña
          </span>
        </Button>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-foreground-muted hover:text-destructive group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
        >
          <LogOut className="size-4" />
          <span className="group-data-[collapsible=icon]:hidden">Cerrar sesión</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
