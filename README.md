# uroboros-frontend

Next.js 16 (App Router, Turbopack) + TypeScript storefront and admin panel for the Uroboros
stationery store. Talks to [`uroboros-backend`](../uroboros-backend) for everything — products,
categories, checkout, payments, auth — and to Cloudinary directly from the browser for signed
image uploads.

## Stack

- **Next.js 16** App Router, React 19, Turbopack (default bundler for both `dev` and `build`)
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.ts`) + **shadcn/ui** (this generation
  is built on **Base UI**, not Radix — components use a `render` prop for polymorphism instead of
  `asChild`)
- **Zustand** for cart state (persisted to `localStorage`)
- **react-hook-form** + **zod** for all forms, using schemas imported from
  [`uroboros-types`](../uroboros-types) — the same validation rules the backend enforces
- **Vitest** + **React Testing Library** for unit tests, **Playwright** for a single scoped
  checkout smoke test

## Architecture note: every backend call is server-side

The admin JWT lives in an **httpOnly cookie** — it can never be read by client-side JavaScript, so
every call to `uroboros-backend` happens server-side: Server Components (`src/lib/api/*.ts`) for
reads, Server Actions (`actions.ts` next to the pages that need them) for mutations. Client
components only hold local UI/cart state and call Server Actions directly as plain async
functions. This also means the browser never talks to the backend directly — no CORS handshake to
worry about, and no way for a JWT to leak into client-side JS, browser storage, or an XSS payload.

Admin route protection is layered:

1. `src/proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`) redirects to `/admin/login` when
   the admin cookie is simply *absent* — a cheap, fast check.
2. Every admin Server Action/Server Component still calls `requireAdminToken()` and sends the
   token as a Bearer header — the backend's `JwtAuthGuard` is the actual authority; proxy.ts is
   just UX, not the security boundary.

## Prerequisites

- Node.js 22
- `uroboros-backend` running locally (see its README) — the storefront fetches real product data
  at request time (and, for a few pages, at build time — see below)
- `uroboros-types` checked out as a sibling directory (`../uroboros-types`)

## Setup

```bash
cp .env.example .env.local     # fill in real values — see below
pnpm install
pnpm run dev
```

## A note on Turbopack and pnpm's node_modules layout

Turbopack (Next 16's default bundler, used by both `next dev` and `next build`) has known issues
resolving symlinked packages — reproducible on this exact setup as
`Module not found: Can't resolve 'uroboros-types'`. This first came up with npm's `file:` local
dependency (fixed there via `install-links=true`); pnpm's *default* linking mode symlinks
essentially the entire dependency tree from a central `.pnpm` store, not just local/git deps, so it
hits the same class of bug far more broadly. `pnpm-workspace.yaml` sets `nodeLinker: hoisted`,
which gives a flat, non-symlinked `node_modules` — closer to npm's default layout, and confirmed
working with Turbopack.

**Trade-off**: none really — `hoisted` is simply a less isolated layout than pnpm's default
(a package can technically `require()` an undeclared dependency that happens to be hoisted nearby,
same phantom-dependency risk npm/yarn classic always had). Given this is a 3-package project, not a
large monorepo, that risk is minimal.

## CI/CD secrets

`uroboros-types` and the backend's published Docker image are both private, so CI needs two
GitHub Actions repo secrets (Settings → Secrets and variables → Actions):

- **`UROBOROS_TYPES_TOKEN`** — the same fine-grained PAT described in `uroboros-backend`'s README
  (Contents: Read-only, scoped to only the `uroboros-types` repo). Used to resolve the private git
  dependency during `pnpm install --frozen-lockfile`.
- **`GHCR_PULL_TOKEN`** — a classic PAT with only the `read:packages` scope (fine-grained PATs
  don't yet reliably support scoping to a single container package, so this one is broader —
  read-only across whatever packages the account can see, still no write/repo access). Used to
  pull `ghcr.io/uroborosdesigns/uroboros-backend` as a service container in the `e2e` job.

```bash
gh secret set UROBOROS_TYPES_TOKEN --repo UroborosDesigns/uroboros-frontend
gh secret set GHCR_PULL_TOKEN --repo UroborosDesigns/uroboros-frontend
```
(paste each token when prompted — keeps it out of shell history and any chat/log.)

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm run dev` | Turbopack dev server |
| `pnpm run build` / `pnpm run start` | Production build / run it |
| `pnpm run lint` | ESLint (flat config) |
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm run test` | Vitest unit tests |
| `pnpm run test:e2e` | Playwright — see below |

## Environment variables

See `.env.example`. All three are `NEXT_PUBLIC_*` because they're either genuinely public (a
Mercado Pago **public** key, a Cloudinary cloud name — both meant to be client-visible) or the
backend's own public URL. Nothing secret lives in this repo's env — the JWT is a runtime cookie,
never a build-time value.

## Testing

- `pnpm run test` — no external dependencies, safe to run any time.
- `pnpm run test:e2e` — a single Playwright test covering browse → add to cart → checkout submit
  (the highest-value, highest-risk flow). Locally, requires `uroboros-backend` running with at
  least one seeded, active product (`pnpm run prisma:seed` in that repo). The Mercado Pago call
  itself isn't mocked (this app calls the backend server-side, so browser-level route
  interception can't reach it) — the test accepts either a redirect to Mercado Pago (real test
  credentials configured) or a visible error toast (placeholder dev credentials) as proof the flow
  reached the network boundary correctly.
- **NixOS**: Playwright's downloaded Chromium binary is a generic-glibc build and won't run as-is
  (`NixOS cannot run dynamically linked executables...`). Either use `nix-ld`, or use
  `nix shell nixpkgs#playwright-driver.browsers` and point Playwright at it via
  `PLAYWRIGHT_BROWSERS_PATH`, or just trust CI — GitHub Actions runners are standard Ubuntu and
  `pnpm exec playwright install --with-deps chromium` there works without any of this.
- CI runs `test:e2e` only on pushes to `main` (or manual dispatch), not on every PR, to keep PR CI
  fast — see `.github/workflows/ci.yml`. That job runs `uroboros-backend`'s published Docker
  image (`ghcr.io/uroborosdesigns/uroboros-backend:latest`) as a service container alongside a
  Postgres service, migrates automatically on container start (the image's own `CMD`), then seeds
  it (`docker exec ... pnpm exec prisma db seed`) before Playwright runs — no source checkout of the
  backend needed, and it's the exact image Render would deploy.

## Build-time data fetching

Pages that only need public data (`/`, `/productos`, category listing) are statically generated
with `revalidate: 60`, and admin mutations call `revalidateTag(..., 'max')` to bust that cache
immediately — so `next build` needs `uroboros-backend` reachable at `NEXT_PUBLIC_API_BASE_URL` to
succeed. Locally that's fine (backend running on `:4000`); in CI, `pnpm run build` is skipped in
favor of just lint/typecheck/unit-tests, since Vercel's own deploy build is what actually needs to
succeed, against the real deployed backend.

## Deployment (Vercel)

1. Connect this repo to [Vercel](https://vercel.com) — zero extra config, Next.js is
   auto-detected.
2. Set env vars in the Vercel dashboard (Production + Preview): `NEXT_PUBLIC_API_BASE_URL`
   (the deployed Render backend URL), `NEXT_PUBLIC_MP_PUBLIC_KEY`,
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3. Deploy. Then go back to `uroboros-backend`'s env vars and set its `FRONTEND_URL` to this
   deployment's real URL (needed for CORS and Mercado Pago `back_urls`).
