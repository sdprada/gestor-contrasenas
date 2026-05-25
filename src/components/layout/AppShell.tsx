import { Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { AddPasswordSheet } from "@/components/vault/AddPasswordSheet";

/**
 * AppShell — persistent application chrome.
 *
 * Hosts the collapsible sidebar, the sticky topbar, the global command
 * palette and the add-password slide-over. Routes render inside a
 * standardized `PageContainer` so every page shares the same padding,
 * max-width and vertical rhythm.
 */
export function AppShell() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </SidebarInset>
      <CommandPalette />
      <AddPasswordSheet />
    </SidebarProvider>
  );
}
