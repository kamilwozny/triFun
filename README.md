# Trifun

A full-stack platform for discovering, creating, and joining fitness & sports training events. Users can browse events by sport, location, and difficulty, sign up to participate, review fellow athletes after events, and track their own activity stats — all in English and Polish.

---

## Features

- **Event discovery** — search and filter training events by sport type, location, date, and difficulty level
- **Event management** — create events with map-picked location, activity distances, and privacy settings
- **Attendance** — join public events instantly or request access to private ones; hosts manage the attendee list
- **Reviews** — rate and comment on other participants after an event ends
- **User profiles** — bio, location, custom avatar (uploaded to cloud), activity chart, and stats
- **Authentication** — Google OAuth, Strava OAuth, and credentials sign-in
- **Internationalization** — full English and Polish support with server-side language detection
- **Interactive maps** — pick event location on a Leaflet map, view clustered markers for nearby events

---

## Tech Stack

### Framework — Next.js 15 (App Router)

Next.js 15 with the App Router was the clear choice for a data-heavy app like this. React Server Components (RSC) let most pages fetch data on the server with zero client-side JS overhead — better for SEO and first-load performance. `'use client'` is used only where the browser is genuinely needed: the Navbar, map, forms, and context providers. Server Actions replace a traditional REST API for all mutations, eliminating the need for a separate API layer and keeping auth checks server-side by default.

### Database — Turso (SQLite) + Drizzle ORM

**Turso** is a distributed SQLite database accessible over HTTP, making it ideal for serverless/edge deployments (no persistent TCP connections required). It is also free-tier friendly — no managed Postgres cluster needed for a side project.

**Drizzle ORM** was chosen over Prisma for its lightweight footprint and fully type-safe query builder. Drizzle generates zero runtime overhead (no query engine process), produces TypeScript types directly from the schema, and its SQL-close API makes it easy to understand exactly what query runs. Schema lives in `db/schema.ts`; migrations are managed by `drizzle-kit`.

### Authentication — NextAuth v5

NextAuth v5 (Auth.js) handles three providers in a single configuration file:

- **Google OAuth** — for standard social sign-in
- **Strava OAuth** — sports-focused, lets us pull athlete location from their profile on first sign-in
- **Credentials** — for local testing without OAuth setup

The session strategy is `database` (sessions stored in Turso via DrizzleAdapter), which gives server-side session revocation and avoids JWT secret management complexity.

### Forms & Validation — React Hook Form + Zod

Zod schemas are defined once in `actions/schemas.ts` and reused on both sides: React Hook Form uses them for client-side validation via `@hookform/resolvers`, and Server Actions receive the same types for server-side safety. This "single source of truth" pattern prevents client/server validation drift without duplicating rules.

### Styling — Tailwind CSS + DaisyUI + shadcn/ui

Three layers of UI tooling, each serving a distinct purpose:

- **Tailwind CSS** — utility classes eliminate context-switching between CSS files and JSX; purging keeps bundle size small
- **DaisyUI** — semantic component classes (`btn`, `badge`, `navbar`, `avatar`) and a custom `mytheme` design token set (primary red `#ff204e`, dark neutral `#00224d`) that apply globally with one `data-theme` attribute
- **shadcn/ui** — copy-paste Radix UI primitives (Dialog, DropdownMenu, Form, etc.) for accessible, fully controllable components that inherit the Tailwind theme instead of shipping their own CSS

This combination lets DaisyUI handle layout and theming speed while shadcn covers complex accessibility patterns (keyboard navigation, ARIA attributes) that would be painful to implement by hand.

### Maps — React Leaflet

Leaflet was chosen over Google Maps because it is open-source (no billing, no API quota), works with OpenStreetMap tiles, and has a rich ecosystem (`leaflet-geosearch` for geocoding, `leaflet.markercluster` for grouped pins). `react-leaflet` provides a declarative React API on top of Leaflet's imperative core. Because Leaflet manipulates the DOM directly, map components must be client components and are dynamically imported to avoid SSR issues with `window`.

### Internationalization — i18next

Language is detected server-side on every request (from `Accept-Language` headers or a cookie) via a custom `detectLanguage` helper, then the resolved `lng` is passed to the client through a provider in `app/providers.tsx`. This avoids the common "flash of wrong language" problem that occurs when i18n is initialized purely on the client. Translation namespaces are flat JSON files in `localization/locales/{en,pl}/global.json`.

### State Management

Client state is intentionally minimal. The main list of training events is fetched server-side and passed to `TrainingEventsProvider` (React Context), which holds it for client-side filtering without re-fetching. All mutations go through Server Actions and invalidate the cache via `revalidateTag`. No Redux or Zustand — the complexity isn't warranted.

### Animations — Framer Motion

Used for micro-interactions (page transitions, list animations). Framer Motion's declarative `motion.*` components integrate cleanly with RSC because animated elements are client components by nature.

### Charts — Recharts

Activity stats in user profiles are visualised with Recharts, a composable chart library built on D3 and React SVG. It fits naturally into the existing component model with no canvas setup required.

---

## Architecture Decisions

### Server Components as the default

Every page and layout is a Server Component unless it needs browser APIs. This keeps the client JS bundle small and lets data fetching happen in parallel at the server level using `Promise.all` patterns, with Suspense boundaries + skeleton components for progressive loading.

### Server Actions instead of a REST API

Mutations (create event, sign up, update profile, submit review) are all Server Actions. This co-locates logic with the components that invoke it, removes the need for `fetch()` calls to internal API routes, and enforces auth checks in one place before any DB write. The tradeoff is that Server Actions are less reusable than a public API — acceptable here since there is no external consumer.

### On-demand ISR

The trainings list is cached with Next.js's data cache and invalidated explicitly via `revalidateTrainings()` (calls `revalidatePath('/trainings')`) after any mutation. This gives static-page performance without stale data — no polling interval needed.

### Dynamic imports for heavy client components

The Leaflet map and other large client components are loaded with `next/dynamic` + `{ ssr: false }` to exclude them from the server bundle and avoid `window is not defined` errors during SSR.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Turso](https://turso.tech) database (free tier available)
- Google OAuth credentials (Google Cloud Console)
- Strava API application (optional)

### Installation

```bash
git clone https://github.com/your-username/trifun.git
cd trifun
npm install
```

### Environment Variables

Create a `.env` file at the root:

```env
# Database
TURSO_CONNECTION_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token

# Auth
AUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

# Strava OAuth (optional)
STRAVA_ID=your-strava-client-id
STRAVA_SECRET=your-strava-client-secret

```

### Database Setup

```bash
npm run db:push     # Push schema to Turso
npm run db:seed     # Optional: seed sample data
npm run db:studio   # Open Drizzle Studio GUI
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For quick testing without OAuth, use the built-in credentials:

- `test1@donotreply.com` / `pass`
- `test2@donotreply.com` / `pass`

---

## Key Commands

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run build`     | Production build         |
| `npm run db:push`   | Sync schema to database  |
| `npm run db:studio` | Open database GUI        |
| `npm run db:seed`   | Seed sample data         |
