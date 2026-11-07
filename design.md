# VTG — Digital craftsmanship

Approved direction: Portuguese web-only editorial luxury portfolio. Light #F2F2F2, ink #101010, dynamic teal #00E696. Dark theme swaps surfaces. Manrope headings/body and JetBrains Mono code labels. Large tight-tracked typography, asymmetric hero, 64px gutters, hairline rules, generous whitespace, restrained rounding.

Hero: bold two-column headline and Three.js metallic extrusion of supplied SVG, teal orbital ellipse, technical annotations and thin orbit lines. Slow rotation, full drag, smooth return, permission-based mobile tilt and reduced-motion support. Fixed header, custom teal cursor, reveal animations and back-to-top.

Sections: expertise ribbon, about with dark IDE, education/experience timeline and undated Cisco certificates, two large project previews with filters, contact and social grid. No invented credentials. Resume clearly pending until supplied. No backend or database required. Main UI in pages/portfolio.tsx, logo-scene component, styles.css; assets in public. Verify desktop/mobile, theme, filters, keyboard colors, canvas and build.

The following scaffold notes are reference only; approved direction above overrides defaults.

> Starter design brief. Replace this content with the app you're building before writing any UI.
> Keep it short and concrete — it's the single source of truth for palette, typography, pages,
> screens, and flows across web, mobile, and desktop.

One-line description of the app, the platforms it ships on, the visual direction (style, feel), and the core job it does for the user.

## Brand & Colors

One token set, consumed per platform:

- **Web & desktop**: CSS variables in `packages/web/src/web/styles.css` (desktop loads the web UI).
- **Mobile**: `Colors.light` / `Colors.dark` in `packages/mobile/constants/theme.ts`, read via `useColors()`; `userInterfaceStyle: "automatic"` follows the system light/dark setting.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| primary | #1F1F1F | #E5E5E5 | Buttons, active tab, accents |
| background | #FFFFFF | #0A0A0A | Page/screen background |
| card | #FFFFFF | #1A1A1A | Cards, surfaces |
| foreground | #171717 | #FAFAFA | Primary text |
| mutedForeground | #737373 | #A3A3A3 | Secondary text |
| border | #E5E5E5 | #262626 | Hairlines |
| destructive | #DC2626 | #EF4444 | Delete / errors |

## Typography

Name the display + body pairing here. Web: set font families in `styles.css` (self-hosted files go in `packages/web/public/fonts/`). Mobile: system font by default; load custom fonts with `useFonts` from `expo-font` and reference them via `Fonts` in `constants/theme.ts`.

## Pages & Screens

List each page/screen, its route file, and what it shows. Example:

- **Web — Home** (`packages/web/src/web/pages/index.tsx`) — what the user sees first.
- **Mobile — Home** (`packages/mobile/app/(tabs)/index.tsx`) — main tab.
- Add web pages under `src/web/pages/` (+ route in `app.tsx`); mobile tabs under `app/(tabs)/`, stack/modal screens under `app/`.

## Key User Flows

1. Describe the primary flow end to end (open → action → result).
2. ...

## Architecture

- **API**: typed oRPC client (`lib/api.ts` in each package) → the backend in `@template/web`. Query/mutation hooks live in `queries/` (one file per feature); pages/screens call them with `@tanstack/react-query`.
- **State/sync**: TanStack Query with optimistic updates for instant-feel interactions.
- **Auth / payments / uploads**: see `skills/app/references/` when those features are needed.
