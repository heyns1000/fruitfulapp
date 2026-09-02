# AGENTS.md — Base44 dev environment notes

## What this app is
A React 18 + Vite single-page app (the "Fruitful™ / FAA.ZONE™" marketplace & ops
frontend) that talks to the **Base44 hosted backend** via the `@base44/sdk`
client and the `@base44/vite-plugin`. There is no local backend or database —
all data lives on Base44's hosted API. The dev server is the only process.

## Running it
```
docker compose -f docker-compose.base44.yml up -d
```
- Service `web` → node:22, source bind-mounted at `/app`, deps in a named
  volume, runs `npm install && npx vite --host 0.0.0.0 --port 3000`.
- Web entry on host port **3000**.
- Vite serves live source with HMR (polling watch enabled for bind mounts).

## Vite / preview host quirk (important)
The `@base44/vite-plugin` only enables `allowedHosts: true` when
`MODAL_SANDBOX_ID` is set, but setting that var triggers a heavy pre-bundle
path that hangs Vite here. Instead, `vite.config.js` sets
`server.allowedHosts: true` + `server.host: true` directly so the preview's
external hostname is accepted. Do NOT re-add `MODAL_SANDBOX_ID`.

## Credentials (external Base44 backend)
The app needs these Vite env vars to connect to its backend (delivered via
`/run/base44/app.env`, declared in `docker-compose.base44.yml` as the last
`env_file`):
- `VITE_BASE44_APP_ID` — Base44 app id (sent as `X-App-Id`).
- `VITE_BASE44_APP_BASE_URL` — Base44 backend URL; the vite plugin proxies `/api`
  → this URL when set. Without it, `/api` 404s and the app renders with no data.
- `VITE_BASE44_FUNCTIONS_VERSION` — backend functions version.
- `VITE_PAYSTACK_PUBLIC_KEY` — Paystack public key (payments only).
- `VITE_PAYPAL_CLIENT_ID` — PayPal client id (payments only).

Without the backend vars the frontend still boots and renders (static/demo
content, zeros for data) — it just can't load real data or authenticate.

## Verifying it works
- `curl -sf -H "Host: x.example" http://localhost:3000/` → 200 and the HTML
  shell with `/@vite/client`.
- Preview shows the Seedwave admin dashboard (nav + stat cards + charts).
- With backend vars set, the `App state check failed: 404` console errors
  disappear and data populates.

## Useful commands
- `docker compose -f docker-compose.base44.yml logs web` — dev server logs
  (logLevel is `error`, so Vite's "ready" banner is suppressed).
- `npm run lint`, `npm run typecheck`, `npm run build` — available inside the
  container via `docker compose exec web npx ...`.
