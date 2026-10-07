# AGENTS.md — Base44 dev environment notes

## What this app is
React 18 + Vite SPA (the "Fruitful™ / FAA.ZONE™" frontend). There is **no local
backend or database** — data lives on the Base44 hosted API, reached through the
`@base44/sdk` client and the `@base44/vite-plugin`. The dev server is the only
process.

Published URL: `https://fruitfulapp.base44.app` (app id `6953a072de46207f94f2b9d2`).

## Running it
```
docker compose -f docker-compose.base44.yml up -d
```
- Service `web` → node:22-slim, source bind-mounted at `/app`, `npm install &&
  npx vite --host 0.0.0.0 --port 3000`.
- Web entry on host port **3000** (`3000:3000`).

## CRITICAL: do NOT set `MODAL_SANDBOX_ID`
`@base44/vite-plugin` treats `MODAL_SANDBOX_ID` as "running in the Base44
sandbox" and then configures host/port/allowedHosts **without the `/api` proxy**.
With the var set, every `/api/*` request falls through to Vite and 404s (the app
renders, but loads no data and logs `Request failed with status code 404`).

Without it, the plugin's normal path runs and, when `VITE_BASE44_APP_BASE_URL`
is set, logs `[base44] Proxy enabled: /api -> <url>`.

Host allowlisting for the preview is handled by the platform-provided
`__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` (passed bare in compose; Vite ≥ 6.1
appends it), so no `allowedHosts` config is needed.

## Why the live backend is left UNWIRED here
`VITE_BASE44_APP_BASE_URL` is intentionally unset (commented out in
`.env.base44-defaults`). When it is set, `/api` reaches the real backend, which
answers **403 `auth_required`** (there is no session in the preview); the app then
calls `redirectToLogin()` → `https://<base>/login?from_url=...`.

- `fruitfulapp.base44.app/login` → `x-frame-options: DENY` → blank preview.
- `base44.app/login` → 404.
- `app.base44.com/login` → 200 and frameable, so `base44.com` CAN be used as the
  base URL if you want the preview to show a working login flow and load real
  data (the user logs in).

Unset ⇒ `public-settings` 404s, the app treats auth as "unknown" and **renders
its UI with empty data** — the only state that renders without an off-origin
redirect. This matches the original Base44 setup notes for this repo.

## Data-load failure handling
Without a backend every `base44.entities.*` call 404s. Pages using **react-query**
(`useQuery`) degrade safely; pages/components doing raw `await base44.…` in a
`useEffect` must wrap the body in `try/catch/finally` and clear their loading
flag in `finally`, or they hang on a spinner and raise an unhandled rejection.

Correct pattern (see `src/components/coffee/SupplierMasterDirectory.jsx`). The
coffee loaders (`src/pages/coffee/FruitfulCoffee.jsx`,
`src/components/coffee/SupplierPerformanceDashboard.jsx`) were fixed to match it.

Known files still doing unhandled raw awaits (they log the same 404 but mostly
don't gate rendering, so they don't hang):
`src/pages/{BanimalStore,Checkout,BanimalLoopCheckout,OrderDashboard,MarketplaceBlueprint,MarketIntelligence,VideoScriptStudio,BanimalAdmin,AssetLibrary,DiscoveryEngine}.jsx`
and several `src/components/**` files.

## Verifying it works
- `curl -sf http://localhost:3000/` → 200 and the HTML shell with `/@vite/client`.
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/src/pages/coffee/FruitfulCoffee.jsx` → 200.
- `docker compose -f docker-compose.base44.yml logs web` — Vite logLevel is
  `error`, so its "ready" banner is suppressed; look for `[base44] Proxy enabled`.

## Useful commands
- `npm run build`, `npm run lint` (both pass on the current tree).
