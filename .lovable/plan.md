
# Plan de Implementación — Guardián de Contraseñas (Web Desktop-First)

## 1. Visión y reinterpretación

La app móvil es un gestor de contraseñas gamificado con mascota. Para web **no replicamos** la experiencia tipo "phone mockup centrado": la rediseñamos como **SaaS de productividad/seguridad** (referencias: 1Password Web, Linear, Vercel Dashboard, Raycast) preservando las dos señas de identidad emocional:

- **La mascota** (gato guardián) como acento de marca, no como protagonista a pantalla completa.
- **La gamificación** (XP, nivel, logros) integrada en el chrome de la app, no como pantalla destino.

Principio rector: **trabajo serio, recompensa lúdica.** El cuerpo de la app es denso, claro y profesional; el júbilo aparece en micro-momentos (subida de XP, logro desbloqueado, celebración en hover de la mascota).

---

## 2. UX Web Desktop-First

### 2.1 Cambios de paradigma vs móvil

| Móvil | Web desktop |
|---|---|
| Bottom tab bar 4 tabs | **Sidebar lateral** persistente con nav vertical |
| Pantallas separadas (Inicio, Bóveda, Logros) | **Dashboard como home** + Vault como workspace principal |
| Hero con mascota gigante | Mascota **compacta** en sidebar/topbar como "guardian status" |
| Cards verticales 1-col | **Lista densa + panel detalle** (master-detail) en Vault |
| Modal de "agregar contraseña" | **Slide-over panel derecho** (no interrumpe contexto) |
| Logros como pantalla | **Logros = sección del dashboard** + drawer celebratorio |
| Ajustes como tab | Página propia, pero accesible desde menú de usuario |

### 2.2 Layouts por pantalla

**Dashboard (`/`)** — Resumen ejecutivo
```
┌─ Sidebar ─┬──────────────────────────────────────────┐
│           │  Topbar: search global · user menu        │
│  Logo     ├──────────────────────────────────────────┤
│  Mascot   │  Welcome + Guardian status hero (compact)│
│  + L.12   │                                          │
│           │  ┌─KPI─┬─KPI─┬─KPI─┬─KPI─┐              │
│  Nav      │  │ 12  │ 4   │ 87% │ L.12│              │
│  Dashbrd  │  └─────┴─────┴─────┴─────┘              │
│  Vault    │                                          │
│  Achiev.  │  ┌─Favorites (grid 3 col)──┬─Activity─┐ │
│  Settings │  │ [card][card][card]       │  feed    │ │
│           │  └──────────────────────────┴──────────┘ │
│  ─────    │                                          │
│  + New    │  ┌─Recent achievements (horizontal)────┐ │
│           │  └──────────────────────────────────────┘ │
└───────────┴──────────────────────────────────────────┘
```

**Vault (`/vault`)** — Master-detail de credenciales
```
Sidebar │ Topbar (search filtra vault)
        │ Filters: All · Favorites · Strong · Weak · by category
        ├─────────────────┬─────────────────────────────┐
        │ List (40% width)│ Detail panel (60%)          │
        │ ┌─Gmail─────⭐─┐ │ ┌─Service header──────────┐ │
        │ ├─Netflix──────┤ │ │ Big icon · name · url   │ │
        │ ├─Facebook─────┤ │ ├─────────────────────────┤ │
        │ │ ...          │ │ │ Username · Password     │ │
        │ └──────────────┘ │ │ Strength meter          │ │
        │                  │ │ Notes · 2FA · history   │ │
        │                  │ └─────────────────────────┘ │
        └─────────────────┴─────────────────────────────┘
```

**Achievements (`/achievements`)** — Galería
- Header con progreso global (X / Y desbloqueados, anillo de progreso).
- Grid 4 columnas desktop / 3 laptop / 2 tablet / 1 móvil.
- Filtros: Todos · Desbloqueados · En progreso · Bloqueados.

**Settings (`/settings`)** — Layout 2 columnas
- Nav vertical secundaria (Cuenta · Seguridad · Apariencia · Notificaciones · Acerca de) + panel de contenido.

**Add Password** — Slide-over derecho (560px) sobre cualquier pantalla, no ruta dedicada.

### 2.3 Patrones UX a introducir

- **Command palette** (`⌘K`) — buscar contraseñas, navegar, ejecutar acciones (copy, reveal, add). Diferenciador SaaS clave.
- **Keyboard shortcuts** — `g d` dashboard, `g v` vault, `n` nueva contraseña, `/` enfocar search.
- **Optimistic UI** + toasts (Sonner) para copy/delete/favorite.
- **Auto-hide reveal** — contraseña visible 5s con countdown sutil.
- **Empty states** ilustrados con la mascota (único lugar donde vuelve a ser grande).
- **Skeleton loaders** densos para listas.

---

## 3. Design System

### 3.1 Paleta — moderna SaaS (oklch, AA/AAA)

Reinterpretación: bajamos saturación de los púrpuras móviles, subimos contraste, añadimos superficies neutras frías. Mantenemos acentos vibrantes solo para gamificación.

**Justificación:** la paleta móvil original es muy saturada (apropiada para un hero móvil) pero satura visualmente en sesiones largas de escritorio. Bajamos chroma en superficies, conservamos chroma en acentos y estados. Todos los pares texto/fondo verificados ≥ 4.5:1.

```css
/* Light */
--background:        oklch(0.99 0.005 280);   /* casi blanco con tinte violáceo */
--surface:           oklch(0.975 0.008 280);  /* card base */
--surface-elevated:  oklch(1 0 0);            /* modales, popovers */
--surface-muted:     oklch(0.96 0.012 280);   /* hover rows */
--border:            oklch(0.92 0.012 280);
--border-strong:     oklch(0.86 0.015 280);

--foreground:        oklch(0.20 0.03 270);    /* text primario, ~16:1 */
--foreground-muted:  oklch(0.48 0.025 270);   /* secundario, ~7:1 */
--foreground-subtle: oklch(0.62 0.02 270);    /* terciario, ~4.6:1 */

--primary:           oklch(0.55 0.20 295);    /* púrpura SaaS, AA blanco */
--primary-hover:     oklch(0.50 0.21 295);
--primary-foreground: oklch(0.99 0 0);
--primary-soft:      oklch(0.95 0.04 295);    /* fondo de badges */

--accent-pink:       oklch(0.65 0.22 350);    /* gradiente XP */
--accent-amber:      oklch(0.78 0.16 75);     /* favoritos / nivel */
--accent-orange:     oklch(0.70 0.18 50);     /* trofeo */

--success:           oklch(0.65 0.16 150);    /* contraseñas fuertes */
--warning:           oklch(0.78 0.15 80);
--danger:            oklch(0.60 0.22 25);

/* Service brand colors (Vault cards) */
--svc-gmail:    oklch(0.60 0.22 25);
--svc-facebook: oklch(0.55 0.18 250);
--svc-netflix:  oklch(0.55 0.22 15);

/* Gradientes de marca (XP, CTA primario opcional) */
--gradient-xp: linear-gradient(90deg, oklch(0.55 0.20 295), oklch(0.65 0.22 350));
--gradient-trophy: linear-gradient(135deg, oklch(0.70 0.18 50), oklch(0.78 0.16 75));
```

**Dark mode** (obligatorio para SaaS pro): mismo HUE, invierte L. Background `oklch(0.16 0.015 270)`, surface `oklch(0.20 0.018 270)`, primary se aclara a `oklch(0.70 0.18 295)` para contraste.

### 3.2 Tipografía

**Selección: Inter (UI) + JetBrains Mono (contraseñas/códigos).**

Justificación:
- **Inter** — diseñada específicamente para UI a tamaños pequeños, x-height alta, hinting excelente, soporta `cv11` (alt single-story `a`), open-source, peso completo 100–900. Es el estándar de facto en SaaS moderno (Linear, Vercel, GitHub copilot UI) precisamente porque optimiza legibilidad en pantalla. Cubre WCAG AA a 14px.
- **JetBrains Mono** — para campos de contraseña, hashes y dots: distingue `0/O`, `1/l/I`, ligadura desactivable. Fundamental en un password manager.
- Rechazamos SF Pro (no es web-safe), Poppins (geométrica con ascenders/descenders cortos, peor en cuerpo pequeño), y "Plus Jakarta" (carácter más expresivo pero menos neutro para densidad SaaS).

```css
--font-sans: "Inter", system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
--font-feature: "cv11", "ss01", "ss03";
```

**Escala tipográfica** (1.200 minor third, base 14px desktop):

| Token | Size / Line-height | Weight | Uso |
|---|---|---|---|
| `text-xs` | 12 / 16 | 500 | captions, meta |
| `text-sm` | 13 / 20 | 400 | body secundario |
| `text-base` | 14 / 22 | 400 | body principal |
| `text-md` | 16 / 24 | 500 | inputs, labels |
| `text-lg` | 18 / 26 | 600 | section titles |
| `text-xl` | 22 / 30 | 600 | page subtitles |
| `text-2xl` | 28 / 34 | 700 | page titles |
| `text-3xl` | 36 / 42 | 700 | hero numbers (KPIs) |
| `text-display` | 48 / 54 | 800 | empty states |

Tracking: `-0.01em` en ≥ text-xl. Numerals: `font-variant-numeric: tabular-nums` global en KPIs y contadores.

### 3.3 Spacing scale (base 4px)

```
0   2   4   6   8   10  12  16  20  24  32  40  48  64  80  96  128
```
Tokens Tailwind ya cubren esto. Reglas internas:
- Padding card: `p-6` (24).
- Gap grid: `gap-4` desktop / `gap-3` denso.
- Section spacing: `py-10` desktop, `py-6` móvil.
- Sidebar width: `w-60` (240) colapsado a `w-16` (64).
- Topbar height: `h-14` (56).
- Slide-over: `w-[560px]`.

### 3.4 Border radius system

Reducimos los 20–24px móviles (lúdicos pero "infantiles" en desktop) a un sistema más restrained:

```
--radius-xs: 4px    /* dots, micro-tags */
--radius-sm: 6px    /* inputs, small buttons */
--radius-md: 8px    /* buttons default, badges */
--radius-lg: 12px   /* cards */
--radius-xl: 16px   /* modales, slide-over */
--radius-2xl: 20px  /* hero cards (mascota, achievements) */
--radius-full: 9999px
```

### 3.5 Shadow system

Sombras frías, cortas, multicapa (estilo Linear/Vercel):

```css
--shadow-xs:  0 1px 2px 0 oklch(0.20 0.03 270 / 0.04);
--shadow-sm:  0 1px 3px 0 oklch(0.20 0.03 270 / 0.06),
              0 1px 2px -1px oklch(0.20 0.03 270 / 0.04);
--shadow-md:  0 4px 8px -2px oklch(0.20 0.03 270 / 0.08),
              0 2px 4px -2px oklch(0.20 0.03 270 / 0.04);
--shadow-lg:  0 12px 24px -8px oklch(0.20 0.03 270 / 0.12),
              0 4px 8px -4px oklch(0.20 0.03 270 / 0.06);
--shadow-xl:  0 24px 48px -12px oklch(0.20 0.03 270 / 0.18);
--shadow-glow-primary: 0 0 0 4px oklch(0.55 0.20 295 / 0.15); /* focus ring */
--shadow-celebrate:    0 8px 32px oklch(0.65 0.22 350 / 0.30); /* achievement unlock */
```

### 3.6 Motion

- Duración: `120ms` micro, `180ms` transición default, `240ms` modales, `400ms` celebraciones.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (out-quint) para entradas; `cubic-bezier(0.4, 0, 0.6, 1)` para exits.
- Reduced motion respetado en `prefers-reduced-motion`.

### 3.7 Responsive breakpoints

Desktop-first pero adaptable. Tailwind v4 custom:

| Token | Min-width | Target |
|---|---|---|
| `xs` | 480px | móvil grande |
| `sm` | 640px | tablet portrait |
| `md` | 768px | tablet landscape |
| `lg` | 1024px | laptop pequeño — punto donde aparece el sidebar |
| `xl` | 1280px | laptop estándar — layout full master-detail |
| `2xl` | 1536px | desktop |
| `3xl` | 1920px | monitores grandes — content max-width 1600px, no infinito |

Reglas:
- < `lg`: sidebar colapsa a topbar con menú hamburguesa, master-detail Vault se vuelve stack.
- < `md`: KPIs en 2x2, favoritas grid 2 col.
- < `sm`: KPIs en 1 col, slide-over ocupa 100vw.

---

## 4. Arquitectura Frontend

### 4.1 Stack

- **TanStack Start v1** (ya instalado) — SSR + file-based routing.
- **React 19 + TypeScript strict.**
- **Tailwind v4** vía `src/styles.css` (`@theme inline`).
- **shadcn/ui** componentes ya disponibles (Button, Dialog, Sheet, Command, etc.) — extender con variantes.
- **TanStack Query** — estado servidor / cache (preparado para Lovable Cloud cuando se conecte).
- **Zustand** — estado UI local (slide-over abierto, command palette, filtros vault).
- **Sonner** — toasts.
- **Framer Motion** — animaciones (XP bar, achievement unlock, mascot idle).
- **cmdk** (vía shadcn `command`) — command palette.
- **Lucide React** — iconos (ya usado por shadcn).

> Persistencia de contraseñas se planifica pero no se implementa hasta confirmar Lovable Cloud + cifrado client-side. En esta fase: mock data + Zustand persistido en localStorage como prototipo.

### 4.2 Routing (TanStack file-based)

```
src/routes/
├── __root.tsx              → shell + providers + CommandPalette + Toaster
├── _app.tsx                → layout autenticado: <Sidebar/> + <Topbar/> + <Outlet/>
├── _app.index.tsx          → "/" Dashboard
├── _app.vault.tsx          → "/vault" layout master-detail con <Outlet/>
├── _app.vault.index.tsx    → "/vault" lista (sin selección)
├── _app.vault.$id.tsx      → "/vault/:id" detalle de credencial
├── _app.achievements.tsx   → "/achievements"
├── _app.settings.tsx       → "/settings" layout con sub-nav + <Outlet/>
├── _app.settings.index.tsx → redirige a /settings/account
├── _app.settings.account.tsx
├── _app.settings.security.tsx
├── _app.settings.appearance.tsx
└── _app.settings.notifications.tsx
```

Cada ruta define `head()` con `title` y `description` propios. `_app` envuelve el chrome y se podrá proteger con auth cuando exista.

El **slide-over "Add Password"** NO es ruta — se controla por estado global (`useUiStore`) abierto desde cualquier pantalla con `n` o botón "+ Nueva".

### 4.3 Estructura de carpetas

```
src/
├── routes/                       (file-based, ver arriba)
├── components/
│   ├── ui/                       (shadcn — no tocar salvo variantes)
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarNavItem.tsx
│   │   ├── Topbar.tsx
│   │   ├── UserMenu.tsx
│   │   └── PageHeader.tsx        (title + actions slot)
│   ├── guardian/
│   │   ├── MascotAvatar.tsx      (3 sizes: xs sidebar, md hero, xl empty-state)
│   │   ├── LevelBadge.tsx
│   │   ├── XpBar.tsx
│   │   └── GuardianStatusCard.tsx
│   ├── vault/
│   │   ├── VaultList.tsx
│   │   ├── VaultListItem.tsx
│   │   ├── VaultDetail.tsx
│   │   ├── VaultFilters.tsx
│   │   ├── PasswordField.tsx     (reveal + copy + countdown)
│   │   ├── StrengthMeter.tsx
│   │   ├── ServiceIcon.tsx       (resuelve color por servicio)
│   │   └── AddPasswordSheet.tsx  (slide-over)
│   ├── dashboard/
│   │   ├── KpiCard.tsx
│   │   ├── FavoritesGrid.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── RecentAchievements.tsx
│   ├── achievements/
│   │   ├── AchievementCard.tsx   (variants: unlocked, in-progress, locked)
│   │   ├── AchievementsGrid.tsx
│   │   ├── ProgressRing.tsx
│   │   └── UnlockCelebration.tsx (Framer Motion overlay)
│   ├── settings/
│   │   ├── SettingsNav.tsx
│   │   └── ToggleRow.tsx
│   └── shared/
│       ├── CommandPalette.tsx
│       ├── EmptyState.tsx
│       ├── ConfirmDialog.tsx
│       └── KeyboardHint.tsx      (renderiza ⌘K, etc.)
├── hooks/
│   ├── useClipboard.ts
│   ├── usePasswordStrength.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useRevealCountdown.ts
│   └── useAchievementsEngine.ts
├── stores/
│   ├── useUiStore.ts             (slide-over, command palette, theme)
│   ├── useVaultStore.ts          (mock CRUD; futuro: TanStack Query)
│   └── useGamificationStore.ts   (XP, nivel, logros)
├── lib/
│   ├── utils.ts                  (cn helper — ya existe)
│   ├── service-registry.ts       (catálogo servicios + colores + iconos)
│   ├── strength.ts               (zxcvbn-like simplificado)
│   └── shortcuts.ts
├── data/
│   └── mock.ts                   (passwords, achievements seed)
└── styles.css                    (tokens completos del DS)
```

### 4.4 Estrategia de componentes

**Tres niveles:**

1. **Primitivos (`components/ui/`)** — shadcn intactos. Extendemos solo vía `cva` variants nuevas (ej: `Button` gana variant `gradient` para CTAs gamificados).
2. **Compuestos de dominio** — `PasswordField`, `StrengthMeter`, `XpBar`. Sin lógica de fetch; reciben props.
3. **Conectados (containers)** — viven cerca de las rutas, conectan stores/queries y componen primitivos+dominio. No reutilizables fuera de su feature.

**Reglas:**
- Cero colores hex/oklch en componentes — solo clases semánticas (`bg-primary`, `text-foreground-muted`, `shadow-sm`).
- Variantes con `cva` en cualquier componente con ≥ 2 estados visuales.
- Props `className` y `asChild` (Radix) en primitivos para composición flexible.
- Server Components no aplica (TanStack Start usa client components por default + server functions cuando haga falta backend).

### 4.5 Layouts compartidos

- `__root.tsx` — `QueryClientProvider`, `ThemeProvider`, `<Toaster/>`, `<CommandPalette/>` global, registro de `useKeyboardShortcuts`.
- `_app.tsx` — `AppShell` = grid `[sidebar 240px | main 1fr]`, topbar sticky, `<Outlet/>` con `max-w-[1600px] mx-auto px-8 py-6`.
- `_app.vault.tsx` — sub-layout master-detail; en < `lg` el `<Outlet/>` ocupa toda la pantalla y la lista se oculta.
- `_app.settings.tsx` — sub-layout 2 cols con sub-nav vertical.

### 4.6 Estado y datos (fase prototipo)

- Datos en `data/mock.ts` cargados a `useVaultStore` (Zustand + persist).
- `useGamificationStore` deriva XP/nivel del nº de contraseñas y acciones (engine en `useAchievementsEngine`).
- Cuando se conecte Lovable Cloud: reemplazar Zustand por TanStack Query + server functions (`*.functions.ts` en `src/lib/`).

### 4.7 Accesibilidad

- Focus visible: ring `--shadow-glow-primary` sobre todos los interactivos.
- Contraste verificado AA en todos los pares definidos.
- Slide-over y modales con focus trap (Radix lo da por defecto).
- Atajos de teclado anunciados en tooltips y command palette.
- `aria-live="polite"` en toasts y reveal countdown.
- Mascota con `role="img" aria-label="Gato guardián nivel 12"`.

---

## 5. Roadmap de implementación (orden sugerido)

1. **Design tokens** en `src/styles.css` (paleta + tipografía + radii + sombras + breakpoints custom Tailwind v4).
2. **Fuentes** Inter + JetBrains Mono (vía `@import` o local).
3. **AppShell + Sidebar + Topbar** + rutas `_app` esqueleto.
4. **Mascot** (SVG inline simple, animación idle Framer).
5. **Dashboard** con mock data.
6. **Vault** master-detail + `PasswordField` + `StrengthMeter`.
7. **AddPasswordSheet** (slide-over).
8. **Achievements** + engine + celebración.
9. **Settings** + theme switcher (dark mode real).
10. **Command palette** + shortcuts.
11. **Responsive pass** (lg → md → sm).
12. **A11y pass** + lighthouse.

---

## 6. Decisiones explícitas a confirmar

- **Mascota**: ¿usamos un SVG nuevo (más SaaS, geométrico) o conservamos el estilo kawaii del móvil reducido? Recomiendo SVG nuevo más estilizado (line + 2 colores) para coherencia desktop.
- **Dark mode**: ¿lo entregamos en v1 o lo dejamos como toggle visible pero sin tema implementado? Recomiendo entregarlo (mucho público SaaS lo exige).
- **Persistencia**: ¿Lovable Cloud ya o seguimos con mock local en esta fase? Recomiendo mock + diseñar el shape de datos pensando en migración.
- **Auth**: fuera de alcance de este plan; añadir cuando se decida persistencia.

