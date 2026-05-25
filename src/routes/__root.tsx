import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
  redirect,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeManager } from "@/components/ThemeManager";
import { Toaster } from "@/components/ui/sonner";
import { apiSession } from "@/lib/api";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          La ruta que buscas no existe.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Algo no cargó</h1>
        <p className="mt-2 text-sm text-foreground-muted">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

const PUBLIC_ROUTES = ["/login", "/register", "/recover"];

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Guardián de Contraseñas" },
      {
        name: "description",
        content:
          "Gestor de contraseñas gamificado: tu mascota guardiana protege tus credenciales.",
      },
      { property: "og:title", content: "Guardián de Contraseñas" },
      { name: "twitter:title", content: "Guardián de Contraseñas" },
      { name: "description", content: "Web Canvas is a desktop-first web application that refactors and reinterprets a mobile experience." },
      { property: "og:description", content: "Web Canvas is a desktop-first web application that refactors and reinterprets a mobile experience." },
      { name: "twitter:description", content: "Web Canvas is a desktop-first web application that refactors and reinterprets a mobile experience." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8c9394ae-f040-4b3a-93c7-4d78da32927a/id-preview-8339ca5c--650864fa-50cf-49ba-b677-efdb2b4fcf49.lovable.app-1778631992992.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8c9394ae-f040-4b3a-93c7-4d78da32927a/id-preview-8339ca5c--650864fa-50cf-49ba-b677-efdb2b4fcf49.lovable.app-1778631992992.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  beforeLoad: async ({ location }) => {
    if (PUBLIC_ROUTES.includes(location.pathname)) return;
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("guardian_user");
      const user = raw ? JSON.parse(raw) : null;
      if (!user || !user.nombre_usuario) {
        throw redirect({ to: "/login" });
      }
    } catch (e: any) {
      if (e?.to === "/login") throw e;
      throw redirect({ to: "/login" });
    }
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem('guardian-ui')||'{}');if(s&&s.state&&s.state.theme==='dark'){document.documentElement.classList.add('dark');}}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeManager />
      <AppShell />
      <Toaster richColors position="bottom-right" />
    </QueryClientProvider>
  );
}

function _ignore() {
  return <Outlet />;
}
void _ignore;
