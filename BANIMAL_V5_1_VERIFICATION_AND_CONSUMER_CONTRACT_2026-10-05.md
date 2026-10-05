# BANIMAL v5.1 — VERIFICATION & CONSUMER CONTRACT

**Phase A evidence file** · `BANIMAL_V5_1_VERIFICATION_AND_CONSUMER_CONTRACT_2026-10-05.md`
**Status: `BLOCKED` — verification complete, installation NOT performed**
**Report ID:** `BNML-V51-VERIFY-2026-10-05`
**Prepared:** 2026-10-05, ~19:20 SAST (Africa/Johannesburg)
**Target application:** FRUITFUL Base44 app — `https://fruitfulapp.base44.app`
**Method:** read-only anonymous inspection of public GitHub REST API, `raw.githubusercontent.com` source files, and live HTTPS reachability probes. No credentials supplied, requested, or inspected. No Base44 application file was created, modified, or deleted.

---

## 1. Verification receipt

| Field | Value |
|---|---|
| Task | Phase A — locate and verify the latest authoritative Banimal v5.1 release, inventory its public contract, compare to FRUITFUL |
| Phase A outcome | **Completed** |
| Phase B outcome | **NOT STARTED — blocked at the A6 stop gate** |
| Application changes made | **NONE** |
| Files created by this task | This report only |
| Files created in `src/integrations/banimal/` | **NONE** |
| Backend functions created | **NONE** |
| Entities created or modified | **NONE** |
| Routes or UI modified | **NONE** |
| Secrets requested / viewed / stored / rendered | **NONE** |
| GitHub authentication used | **NONE** (anonymous public reads only) |
| Verification confidence | **High** for the blockers; **Medium** for contract breadth |
| Blocking conditions found | **6** (see §13) |

### What was actually inspected

- GitHub REST API: repository metadata, branches, tags, releases, commits, contents, recursive tree (anonymous).
- `raw.githubusercontent.com` source files: `README.md`, `package.json`, `INTEGRATION_CHECKLIST.md`, `wrangler.json`, `.dev.vars.example`, `src/worker/index.ts`, `banimal-connector/README.md`, `wordpress-plugin/banimal-ecosystem-connector/readme.txt`, `banimal_api_connector.html`.
- Directory listings: root, `src/worker/routes/`, `wordpress-plugin/banimal-ecosystem-connector/`, `migrations/`.
- Live HTTPS probes: `banimal.vercel.app`, `www.banimal.co.za/api/health`, `www.banimal.co.za/api/brand-guide`, `banimal.faa.zone/api/health`.

### What was deliberately NOT inspected

- `.dev.vars` (actual values file) — not requested.
- Any secret, token, credential, connection string, or environment value.
- Any private repository (`heyns1000/banimal`, `Fruitful-Global-Planet/banimal-global-loop`) — inaccessible anonymously and not attempted via authentication.
- The full body of `src/worker/routes/brand-guide.ts` (76,659 bytes) — only its mount and its in-source public-contract declaration were read.

> **Note on `.dev.vars.example`:** this file is a committed *template*. Every value field in it is **empty**; it contains configuration **key names only**. No value was present, and none was recorded. It is cited in §7 solely to inventory required secret *names*, which is necessary for the secret-boundary assessment.

---

## 2. Git/GitHub source and authority

### Candidate repositories located

| # | Repository | Visibility | Verifiable | Role |
|---|---|---|---|---|
| C1 | `heyns1000/banimal` | **private** (intake) / 404 anonymously | **NO** | The repository named in the intake. Cannot be read or verified. |
| C2 | `fruitfulplanetchange/banimal` | **public** | **YES** | The only publicly verifiable Banimal repository. Used as the evidence base. |
| C3 | `Fruitful-Global-Planet/banimal-global-loop` | **private** (404 anonymously) | **NO** | Organization fork/instance. Cannot be read. |
| C4 | `sicon2002/bAnimal` | public | unrelated | Third-party repository, description "UI". **Excluded — not this ecosystem.** |

### Authoritative source (per the mandate's priority order)

| Priority | Criterion | Result |
|---|---|---|
| 1 | Signed/published release or immutable tag with release notes | **ABSENT** — zero releases, zero tags |
| 2 | Official version declaration on release/default branch | **PARTIALLY PRESENT** — declarations exist but materially contradict each other (§3) |
| 3 | Merged release PR with matching version bump and deploy evidence | **PARTIAL** — `Merge pull request #40` (dependabot) is the head commit; no release PR is version-labelled v5.1 |
| 4 | Commit hash documented as approved release candidate | **PRESENT** — head of `main` (§4) |

**Authority determination: `C2 fruitfulplanetchange/banimal`, default branch `main`, commit `bfb6af75dc499de738199cee0cbebf04ca736cfc` is the highest-priority verifiable source that exists.** It satisfies criterion 4 and partially criterion 2. Criteria 1 and 3 are unmet.

### Authority contradictions (must be resolved by the owner — not by inference)

| Contradiction | Evidence |
|---|---|
| The intake names `heyns1000/banimal`; the only readable Banimal repository is owned by a **different account**, `fruitfulplanetchange` (user id 328849706 vs `heyns1000` id 204596054). | Intake `GH-banimal` vs `api.github.com/search/repositories?q=banimal`. |
| The two accounts are linked in authorship but not in ownership. Commits on `C2` are authored by "Heyns Schoeman 🔥 CodeNest `heynsschoeman@gmail.com`" and merge PRs **from** `heyns1000` (`Merge pull request #40 from heyns1000/dependabot/...`). | Commit `bfb6af75…`, commit `d830ee53…`. |
| `INTEGRATION_CHECKLIST.md` names the source of truth as **`heyns1000/banimal`**, i.e. the *private* repo, not the readable one. | `INTEGRATION_CHECKLIST.md`, line 1 quote. |
| `INTEGRATION_CHECKLIST.md` further declares **two** competing backends existed and diverged (Cloudflare Worker vs an Express app on Vercel `banimal-six`), with the Express app retired as order owner. A divergence of order ownership is recorded as an upstream fact. | `INTEGRATION_CHECKLIST.md` §0. |

**Conclusion: `PARTIALLY CONFIRMED`.** A readable Banimal source exists, but the intake's named repository is private, and the readable repository's own documentation points at the private one as canonical. Owner confirmation of the authoritative namespace is required before any consumer coupling.

### Repository metadata (`C2`, read 2026-10-05)

| Field | Value |
|---|---|
| Owner | `fruitfulplanetchange` (user) |
| Repository | `banimal` |
| Visibility | `public` |
| Fork | `false` |
| Default branch | `main` |
| License | Apache-2.0 |
| Created | 2026-09-13T22:35:57Z |
| Pushed | 2026-09-13T22:44:37Z |
| Head commit on `main` | `bfb6af75dc499de738199cee0cbebf04ca736cfc` |
| Head commit date | 2026-09-10T14:21:26Z (PGP `verified: true`, `reason: valid`) |
| Homepage declared | `https://banimal.vercel.app` |
| Language (GitHub-detected) | `null` |
| Stars / forks / watchers | 0 / 0 / 0 |
| Branches | 30+ (see §5) |
| Tags | **0** |
| Releases | **0** |

> Observed inconsistency: `pushed_at` (2026-09-13) is **later** than the head commit author date (2026-09-10). This is consistent with a later ref push (e.g. a branch) rather than `main` activity, but it cannot be resolved anonymously. Recorded as `UNVERIFIED`.

---

## 3. Version determination

### Every version declaration found

| Source file | Declared version | Scope of that declaration |
|---|---|---|
| `package.json` (`"name": "mocha-app"`) | **`0.0.1`** | The repository's own application manifest |
| `README.md` | **`v5.1.0`** | Describes the WordPress plugin |
| `wordpress-plugin/banimal-ecosystem-connector/readme.txt` | **`Stable tag: 5.1.1`** | WordPress plugin stable release tag; changelog documents `5.1.1`, `5.1.0`, `5.0.0` |
| `banimal-connector/README.md` | **`(v5.1.0)`** | Describes the WordPress plugin |
| `src/worker/index.ts` → `GET /api/health` | **`version: '5.1.0'`** | Worker runtime self-report |
| Git tags | **none** | — |
| GitHub releases | **none** | — |

### Determination

**`v5.1` is real, but it is a version *line*, not a release.** It denotes the **`banimal-ecosystem-connector` WordPress plugin** version series `5.1.x`. There is **no `v5.1` tag, no `v5.1.0` tag, no `v5.1.1` tag, and no published release of any kind.** Every version claim lives in a mutable file on `main`.

**Answering the mandate's required questions:**

| Question | Answer | Evidence |
|---|---|---|
| Is `v5.1` latest? | **`CONTRADICTED`** | `5.1.1` supersedes `5.1.0` in the same changelog; two other components declare unrelated versions |
| Is `v5.1` latest stable? | **`PARTIALLY CONFIRMED`** — the stable line is `5.1.x`, but the current stable tag is **`5.1.1`**, not `v5.1.0` | `readme.txt` → `Stable tag: 5.1.1` |
| Is `v5.1` latest available? | **`CONTRADICTED`** — `5.1.0` and `5.1.1` are both available on `main`; `package.json` says `0.0.1` | §3 table |
| Is `v5.1` merely a candidate? | **`CONFIRMED` — candidate only** | No tag, no release, no signed artifact, no installable versioned package reference |

### Version contradiction summary

Three mutually inconsistent version identities coexist in one repository:

1. **`0.0.1`** — the repository's own app manifest (`mocha-app`).
2. **`5.1.0`** — the Worker's runtime self-report and two README files.
3. **`5.1.1`** — the WordPress plugin's declared Stable tag.

A consumer cannot honestly pin "v5.1" without an owner decision, because `5.1.0` and `5.1.1` are different artefacts (the `5.1.1` changelog entry records a security hardening: hex-colour validation in the brand-guide module), and the repository's own top-level manifest disagrees with both.

**Version verdict: `BLOCKED`.** `v5.1` cannot be verified as an authoritative, immutable release.

---

## 4. Release / tag / commit evidence

| Artefact | Present | Detail |
|---|---|---|
| Git tag | **NO** | `GET /repos/fruitfulplanetchange/banimal/tags` → `[]` |
| GitHub release | **NO** | `GET /repos/fruitfulplanetchange/banimal/releases` → `[]` |
| Release notes | **NO** | No release object to carry them; a plugin changelog exists in `readme.txt` |
| Signed/published artefact | **NO** | No downloadable versioned package referenced; a `Banimal Store Integration Guide.zip` exists in-repo but is documentation, not a release |
| Immutable commit reference | **YES** | `bfb6af75dc499de738199cee0cbebf04ca736cfc` |
| Commit signature | **YES — PGP `verified: true`, `reason: valid`** | GitHub-verified merge commit |
| Commit date | 2026-09-10T14:21:26Z | — |
| Commit subject | `Merge pull request #40 from heyns1000/dependabot/npm_and_yarn/npm_and_yarn-961cc5bc3d` — *"chore(deps): bump hono from 4.13.4 to 4.13.7"* | A **dependency bump** is the head of `main`, not a release commit |
| Deploy evidence | **NEGATIVE** | See runtime probes below |

### Deployment evidence — all hostnames unreachable

| URL probed | Result |
|---|---|
| `https://banimal.vercel.app` | **"This deployment is temporarily paused"** |
| `https://www.banimal.co.za/api/health` | **"This deployment is temporarily paused"** |
| `https://www.banimal.co.za/api/brand-guide` | **"This deployment is temporarily paused"** |
| `https://banimal.faa.zone/api/health` | **"This deployment is temporarily paused"** |

Every Banimal hostname — including `/api/*` paths — resolves to a **paused Vercel deployment**. `wrangler.json` declares a Cloudflare Worker, a D1 database binding, and an R2 bucket binding, but:

- the Worker's `name` is an opaque UUID (`019b7175-b3fc-7a74-b270-61b38749851a`), not a routable service name;
- `wrangler.json` declares **no `routes` or `custom_domain` stanza**, so no public Worker hostname is configured in the repository.

**Therefore: the Cloudflare Worker described in the README is not demonstrably serving at any public address.** The published frontend is explicitly paused.

**Deployment verdict: `BLOCKED` — no deployment evidence exists.** The head of `main` is also a routine dependency bump, which is not a release event.

---

## 5. Release inventory and file manifest summary

### Headline structure (per `README.md`, corroborated by the tree API)

| Area | Purpose | Evidence |
|---|---|---|
| `src/react-app/` | React 19 + React Router 7 storefront UI (`pages/`, `components/`, `contexts/`) | `README.md`; `package.json` |
| `src/worker/` | Hono 4.13.7 backend on Cloudflare Workers; `index.ts` + `routes/` (13 modules) | `index.ts` read directly |
| `src/shared/` | Shared types/utilities | `README.md` |
| `wordpress-plugin/banimal-ecosystem-connector/` | The v5.1.x WordPress plugin (thin signed client) | Directory listing read |
| `banimal-connector/` | Claude Code plugin + `samfox-ci-guide` skill | `banimal-connector/README.md` read |
| `docs/` | `brand/ci-guide.html`, `brand/banimal-connector-icons.html`, `atlas/seedwave-atlas.html`, `manual/user-manual.html` | `README.md`; `docs/manual/user-manual.html` fetched |
| `migrations/` | D1 SQL schema (`1.sql` … `N.sql`, `2.sql` 1,424 B, `3.sql` 12,404 B, `0002_storefront_tables.sql` 1,934 B, `4.sql`, `5.sql`) | Directory listing read |
| `dist/` | **Committed build output**, incl. brand PNGs `BR001-…`, `BR002-…` | Recursive tree |
| `.github/workflows/` | 5 workflows: `brand-alignment.yml`, `connector-plugin.yml`, `deploy-pages.yml`, `deploy-worker.yml`, `fruitful-wordpress-core-plugin.yml` | Recursive tree |

### Notable root files

| Path | Size | Significance |
|---|---|---|
| `README.md` | 4,974 B | The only architecture overview; declares the plugin version line |
| `INTEGRATION_CHECKLIST.md` | 11,370 B | The closest thing to an integration contract; **backend-reconciliation and secret-exposure warnings** |
| `MOTION_LANGUAGE.md` | 16,636 B | Design system documentation |
| `LICENSE` | 11,357 B | Apache-2.0 |
| `.dev.vars.example` | 1,397 B | Secret **key names** only; all values empty |
| `banimal_api_connector.html` | 13,311 B | **Legacy** API documentation — see §6 contradiction |
| `Banimal Store Integration Guide.zip` | 140,007 B | Documentation archive (contents not read) |
| `assets` | 45 B | Pointer file |
| `.vercel-deploy` | 62 B | Deploy marker |

### Branch inventory (30+ branches observed; all `protected: false`)

Release-shaped names that are **branches, not releases**: `claude/shock-launch-v5`, `claude/shock-launch-v4`, `claude/shock-launch-v2`, `claude/banimal-connector-production-ready`, `claude/banimal-connector-audit-19`, `claude/fruitful-wordpress-core`, `claude/fruitful-wordpress-core-final`, `claude/banimal-ecosystem-api-er1klo`, `claude/banimal-vercel-deploy-c9l2xk`, `add/welcome-to-fruitful-v1`.

> **The `v5` in `claude/shock-launch-v5` is a branch name.** Per the mandate, a branch name is not proof of a release. There is no evidence `claude/shock-launch-v5` corresponds to the `5.1.x` plugin line, and its head commit (`3326922677894388db159ca618bf598a71d49e67`) is not referenced by any release. `UNVERIFIED`.

### Test and CI posture (from `package.json` scripts and workflow names)

Present: `lint` (ESLint 9), `test` (Vitest 4), `check` (tsc + build + `wrangler deploy --dry-run`), `plugin:verify-version`, `plugin:build`, `brand:verify`, `brand:generate-palette`. Vitest with `@cloudflare/vitest-pool-workers`.

**A version-verification discipline exists** — `bin/verify-version.sh` is documented (in the `5.1.1` changelog entry) as asserting that the plugin header, the `BANIMAL_CONNECTOR_VERSION` constant, and the `readme.txt` Stable tag all agree. This is a genuine positive finding. It also explains why `5.1.1` superseding `5.1.0` is authoritative *for the plugin* — while leaving the repo-level `package.json` and the Worker's `/api/health` string out of that check.

---

## 6. Verified public interfaces

### The one genuine public contract

`src/worker/index.ts` mounts `GET /api/brand-guide` (`src/worker/routes/brand-guide.ts`, 76,659 B) with this in-source declaration:

> *"Sam Fox™ CI Guide, machine-readable — the single source every brand-facing consumer (the WordPress connector's brand module, the banimal-connector Claude Code skill, **any future adapter**) pulls from instead of holding its own copy. **Public, unauthenticated, read-only.**"*

This is `CONFIRMED` as a declared, intentional, versioned, secret-free, read-only public contract with an explicitly anticipated consumer role. It is the **only** surface the mandate's Phase B could safely target.

### Contract inventory

| Contract element | Version | Location | Authentication | Stable / public? | Safe for Base44? | Evidence |
|---|---|---|---|---|---|---|
| `GET /api/brand-guide` | 5.1.x line | `src/worker/routes/brand-guide.ts` (76,659 B) | **None** — declared public, unauthenticated, read-only | **Yes, by design** | **YES** — read-only, no secret, no PII declared | `CONFIRMED` (source comment + mount) |
| `GET /api/health` | self-reports `5.1.0` | `src/worker/index.ts` | None | Yes | Yes — status/version only | `CONFIRMED` |
| `GET /api/systems` | undeclared | `index.ts` (D1 `brand_systems`) | None visible | Public GET, not documented | Yes (read-only) | `CONFIRMED` (source) |
| `GET /api/tiers` | undeclared | `index.ts` (D1 `brand_tiers`) | None visible | Public GET, not documented | Yes (read-only) | `CONFIRMED` (source) |
| `GET /api/brands` | undeclared | `index.ts` (D1 `brands`, paginated) | None visible | Public GET, not documented | Yes (read-only) | `CONFIRMED` (source) |
| `GET /api/brands/:id` | undeclared | `index.ts` | None visible | Public GET, not documented | Yes (read-only) | `CONFIRMED` (source) |
| `GET /api/stats` | undeclared | `index.ts` (aggregates) | None visible | Public GET, not documented | Yes (read-only) | `CONFIRMED` (source) |
| **`POST /api/webhook/brands`** | undeclared | `index.ts` | **No guard visible in the mounted route table** | **Public write, undocumented** | **NO — never consume** | `CONFIRMED` (source) |
| `POST /api/wp` (WP bridge) | plugin 5.1.x | `src/worker/routes/wp-bridge.ts` | **HMAC-SHA256 shared secret** (`WP_BRIDGE_SECRET`) | Internal, signed | **NO** — requires a shared secret | `CONFIRMED` (`index.ts` comment, `readme.txt`, `.dev.vars.example`) |
| `/api/licenses` | undeclared | `routes/licenses.ts` (7,933 B) | Not documented as public | Not public | **NO** | `CONFIRMED` (mount) / `UNVERIFIED` (auth) |
| `/api/configuration` | undeclared | `routes/configuration.ts` (2,356 B) | Not documented | Not public | **NO** | `CONFIRMED` / `UNVERIFIED` |
| `/api/auth` | undeclared | `routes/auth.ts` (7,487 B) + `AUTH_SESSION_SECRET`, optional `OAUTH_*` | JWT sessions | Internal | **NO** | `CONFIRMED` (mount) |
| `/api/delivery` **and** `/api/shipping` | undeclared | `routes/delivery.ts` (5,210 B) | `BOBGO_API_KEY` bearer | Internal | **NO** | `CONFIRMED`; same handler mounted twice |
| `/api/orders` | undeclared | `routes/orders.ts` | Not documented | Order-owning | **NO — order write path** | `CONFIRMED` (mount) |
| `/api/email`, `/api/notifications`, `/api/analytics`, `/api/coupons`, `/api/giving` | undeclared | respective route modules | Not documented | Internal | **NO** | `CONFIRMED` (mounts) |
| WordPress REST `/wp-json/banimal/v1/*` (3 endpoints) | **legacy 4.7.x** | `banimal_api_connector.html` | "master API key" | **SUPERSEDED** | **NO — contradicts current architecture** | `CONTRADICTED` — see below |
| OpenAPI / JSON Schema specification | — | **not found** | — | **Absent** | — | `CONFIRMED absent` |
| Published SDK / npm client | — | `package.json` is `private: true`, name `mocha-app` | — | **Absent** | — | `CONFIRMED absent` |
| Outbound webhooks | — | **none found** | — | **Absent** | — | `CONFIRMED absent` |
| Static catalogue export / public JSON feed | — | **none found** | — | **Absent** | — | `CONFIRMED absent` |
| D1 database schema | migrations `1.sql`–`N.sql` | `migrations/` | Direct DB, Worker-bound | Readable in repo | **NO** — no direct DB connection permitted | `PARTIALLY CONFIRMED` (listing only) |
| Embed / widget contract | — | **none found** | — | **Absent** | — | `CONFIRMED absent` |
| Event schema | — | The WP bridge relays signed WooCommerce order events; no published schema found | HMAC-signed | Not published | **NO** | `PARTIALLY CONFIRMED` |

### Contract contradiction — `banimal_api_connector.html` is legacy

`banimal_api_connector.html` documents three WordPress REST endpoints:

- `https://www.banimal.co.za/wp-json/banimal/v1/update-user-profile`
- `https://www.banimal.co.za/wp-json/banimal/v1/sync-user-product`
- `https://www.banimal.co.za/wp-json/banimal/v1/create-or-update-product`

**These are superseded.** The plugin's own changelog for `5.0.0` states: *"Full rewrite as a thin, signed client to the Banimal Cloudflare Worker. Removed all direct third-party API calls (Paystack, GitHub, Google Drive, Cloudflare R2) from WordPress"*, and *"Removed the admin page that decrypted and emitted the master API key into browser JavaScript."* The `4.7.x` line the HTML documents was **replaced, not patched**.

The HTML file additionally renders a **hardcoded "Connected & Listening" status badge** with a pulsing green dot and a **simulated** usage chart, and its own inline comments label the data "simulated". It is a static demonstration page, not a contract, and not a status indicator. It also references governance protocols (`P_INV-001`…`P_INV-004`) whose own status reads *"Pending Target Implementation"*.

**Verdict: `CONTRADICTED`.** A consumer must not treat this file, or the `/wp-json/banimal/v1/*` paths, as the Banimal v5.1 contract.

### Interface-level verdict

A stable, documented, secret-free, read-only public contract **does exist** — `GET /api/brand-guide` — so the A6 gate *"no stable public integration contract exists"* is **NOT** triggered.

However, that contract is **not reachable at runtime** (§4), and consuming it from the Base44 app requires a server-side call that this workspace cannot create (§13). The availability of a good contract does not resolve those two blockers.

---

## 7. Authentication and secret-boundary assessment

### Required secret names (names only — no values present or recorded)

From `.dev.vars.example` (all values empty):

| Group | Names |
|---|---|
| WP bridge | `WP_BRIDGE_SECRET` (shared HMAC-SHA256, must match the plugin's signing-secret field) |
| Storefront checkout | `PAYSTACK_SECRET_KEY`, `PAYSTACK_LIVE_SECRET_KEY`, `BOBGO_API_KEY`, `SITE_URL` |
| Session auth | `AUTH_SESSION_SECRET` |
| OAuth providers (all optional; a provider is offered only once both values are set) | `OAUTH_{GOOGLE,FACEBOOK,GITHUB,MICROSOFT,APPLE,TIKTOK,SUBSTACK,INSTAGRAM}_{CLIENT_ID,CLIENT_SECRET}` |
| Web push (not required for the connector) | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` |

### Authentication model

| Surface | Model | Assessment |
|---|---|---|
| `/api/brand-guide` | **None** — deliberately public | Clean. No secret crosses the boundary. Safe for a read-only consumer. |
| `/api/health` | None | Safe; exposes a version string only. |
| Public `GET` brand/tier endpoints | None visible | `UNVERIFIED` — no documented public/private classification. Treat as undocumented. |
| **`POST /api/webhook/brands`** | **No guard visible in the mounted route table** | **Significant upstream risk.** The handler writes to D1 (`INSERT`/`UPDATE brands`) and is reachable on the same origin as the public GETs. Any consumer that mirrors Banimal's public surface inherits this exposure. **Do not consume; flag to the Banimal owner.** |
| `POST /api/wp` | HMAC-SHA256 signed events (`WP_BRIDGE_SECRET`) | Sound design — the plugin holds only a base URL and a signing secret and never calls Paystack/BobGo/GitHub directly. Correctly documented. |
| `/api/auth` | JWT sessions (`AUTH_SESSION_SECRET`) | `UNVERIFIED` in detail. |
| WordPress plugin secret storage | Encrypted; **fails closed** if `AUTH_KEY` is missing/short/default; diagnostics server-side and nonce-protected; **never returns a secret to the browser** | **Strong positive.** The `5.0.0` changelog explicitly records removing the admin page that emitted a master API key into browser JavaScript — the same anti-pattern flagged in the FRUITFUL audit of `BanimalAdmin.jsx`. |

### Secret-management posture (upstream)

- Secrets are documented as `wrangler secret put <NAME>`, set one at a time, *"never checked into wrangler.json or source"*. `.dev.vars` is gitignored.
- `.dev.vars.example` is correctly committed with **names only and empty values** — **no leak**. `CONFIRMED`.
- **Upstream exposure warning (quoted from `INTEGRATION_CHECKLIST.md`):** the checklist states, against `PAYSTACK_SECRET_KEY`: *"Regenerate — the old live key was exposed in a screenshot."* This is a `CONFIRMED` upstream record of a previously exposed live payment key requiring rotation. It is recorded here as an integration risk flag, not as a FRUITFUL finding. **No value was seen, sought, or reproduced.**

### CORS boundary — decisive for any browser-side consumer

`src/worker/index.ts` restricts CORS to exactly three origins:

```
https://banimal.co.za
https://banimal.faa.zone
https://www.banimal.co.za
```

**`https://fruitfulapp.base44.app` is not in that allowlist.** A browser running the Base44 app therefore cannot read any response from the Banimal Worker: the request may leave, but the response is withheld from JavaScript.

Implication: a client-only consumer is **structurally impossible** without an upstream CORS change or a server-side intermediary — and this workspace cannot create the server-side intermediary. See §11 and §13.

### Secret-boundary verdict

| Requirement | Status |
|---|---|
| No secret requested, copied, stored, rendered, or inspected | **PASS** — none touched |
| No secret value present in any file read | **PASS** — `.dev.vars.example` contains names only, all values empty |
| Target contract requires no secret | **PASS** — `/api/brand-guide` is unauthenticated by design |
| No client-side secret handling proposed | **PASS** — nothing proposed that would put a secret in the browser |
| Upstream secret hygiene | **PASS with one flag** — correct posture, plus a recorded past Paystack key exposure requiring rotation |

---

## 8. Data-contract inventory

### What Banimal holds (as declared by its own source, not by live inspection)

| Domain | Storage | Fields evidenced | Confidence |
|---|---|---|---|
| Brands | D1 `brands` | `name`, `system`, `tier`, `category`, `description`, `emoji`, `fee`, `royalty`, `division`, `vault_mesh_id`, `parent_id`, `use_phrase`, `subnodes` (JSON), `metadata` (JSON), `is_active`, `created_at`, `updated_at` | `CONFIRMED` (from the `INSERT`/`UPDATE` column list in `index.ts`) |
| Brand systems | D1 `brand_systems` | `system_name`, `is_active` | `CONFIRMED` |
| Brand tiers | D1 `brand_tiers` | `priority`, `is_active` | `CONFIRMED` |
| Products / inventory | D1 `products_v24` (named in the checklist as **master** for images, descriptions, price, stock) | Not read — table schema not retrieved | `PARTIALLY CONFIRMED` |
| Orders | D1, single lifecycle record | `orderId` (`BNML-…`, also the Paystack reference), `customer{name,email,phone}`, `items[{sku,name,qty,priceZAR}]`, `subtotal`, `deliveryOption`, `deliveryFee`, `total`, `paystackReference`, `paymentStatus` (`pending→paid→failed`), `bobgoShipmentId`, `waybill`, `trackingStatus` (`booked→in_transit→delivered`), `emailStatus`, `welcomeSent`, `confirmationSent`, `status` (`pending→paid→booked→fulfilled`) | `CONFIRMED` (documented JSONC in the checklist) |
| Brand Guide | Served from the Worker, machine-readable | Palette, icon rules, typography; consumed as CSS custom properties (`--banimal-sage`, `--banimal-coral`, …) | `CONFIRMED` (README, changelog, `index.ts` comment) |
| Licenses | D1 via `licenses.ts` (7,933 B) | Not read | `PARTIALLY CONFIRMED` |
| Media | R2 bucket (`R2_BUCKET` binding) | Object storage | `CONFIRMED` (binding) |
| Migrations | `migrations/1.sql` … `N.sql` | Numbered schema evolution; `3.sql` is 12,404 B | `PARTIALLY CONFIRMED` (listing only) |

### Prohibited-for-import assessment

The mandate forbids importing: customer PII, supplier contacts, internal costs, licence/royalty terms, payment secrets, gateway transaction payloads, staff notes, internal admin configuration.

**Assessment against the identified contract:**

| Prohibited category | Present in the Banimal contract? | Consequence |
|---|---|---|
| Customer PII | **YES** — `customer{name,email,phone}` inside the order record; `/api/auth` | Orders must remain out of scope entirely |
| Internal costs / royalty / fee | **YES** — `brands.fee`, `brands.royalty`, `brands.division`, `brands.vault_mesh_id`, `brands.metadata` | A naÃ¯ve `/api/brands` mirror would import exactly the fields the mandate forbids. Any future catalogue mapping must be an **explicit allowlist**, never a passthrough. |
| Payment secrets / gateway payloads | **YES** — `PAYSTACK_SECRET_KEY`, `PAYSTACK_LIVE_SECRET_KEY`, `paystackReference` | Never touch any payment path |
| Licence / royalty terms | **YES** | Excluded |
| Supplier contacts | Not evidenced in what was read | `UNVERIFIED` |

**Critical consequence:** the generic public GETs (`/api/brands`, `/api/brands/:id`) return **whole rows**, including `fee`, `royalty`, `division`, and `vault_mesh_id`. They are therefore **unsafe to mirror wholesale** into the Base44 app. Only `/api/brand-guide` (design tokens) is unambiguously safe. Any future catalogue consumption would need a field allowlist applied server-side — which requires the server-side adapter this workspace cannot create.

### Data-contract verdict

**`BLOCKED` for catalogue consumption; `PERMITTED` in principle for design-token consumption only.** The single safe surface (`/api/brand-guide`) is unreachable at runtime (§4).

---

## 9. Base44 compatibility matrix

Every row is labelled `MATCH` · `PARTIAL MATCH` · `CONFLICT` · `DUPLICATE` · `MISSING IN BASE44` · `MISSING IN BANIMAL` · `UNVERIFIED`. "Verified Banimal v5.1 evidence" means repository source, not a live system — the live system is paused.

| Area | Verified Banimal v5.1 evidence | Current Base44 evidence | Relationship | Compatibility | Required action |
|---|---|---|---|---|---|
| Product / catalogue | D1 `products_v24` declared **master** for images, descriptions, price, stock; `brands` table with `subnodes` | `MarketplaceService`, `BarcodeMapping`, `PIMFItem`, `SageCostRow` (4 competing peers) | **DUPLICATE** | **Incompatible** — two catalogue masters, and Banimal's rows carry `fee`/`royalty`/`division` that must not be imported | No action now. Owner must decide the catalogue owner before any mapping. |
| User / customer identity | JWT sessions (`/api/auth`, `AUTH_SESSION_SECRET`); WooCommerce customers; `customer{name,email,phone}` | Base44 platform auth; `User` entity; `Order.buyerEmail` string matching | **CONFLICT** | **Incompatible** — different identity systems; Base44 matches identity by email string, which the audit already flags | Do not sync identity. Never import `customer` PII. |
| Seller / artisan / supplier | `brands` multi-tier (`system`, `tier`, `parent_id`, `vault_mesh_id`) | `ArtisanProfile`, `SupplierProfile`, `Brand` | **PARTIAL MATCH** | Partially compatible — comparable tiering, different keys | No action now. |
| Orders | D1 single lifecycle record, `BNML-…` id also used as the Paystack reference; documented state machine `pending→paid→booked→fulfilled` | `Order` + `BanimalOrder` (two entities) | **DUPLICATE + CONFLICT** | **Incompatible** — two order owners already exist inside Base44, and a third would exist upstream | **Never sync orders.** The audit's P0 finding (buyer cannot persist an order) must be fixed first, independently. |
| Payment state | `paymentStatus` `pending→paid→failed`; **HMAC-SHA512 webhook verification designed** (code supplied in the checklist), with `/api/payments/verify` server-side verification | `Payment`, `PaymentTransaction`; **no webhook handler exists** | **CONFLICT** | **Incompatible for writes.** Banimal's model is materially *more* complete than Base44's — but adopting it would import a second payment authority and bypass the audit's P0 gates | **Prohibited.** Banimal must not become a payment path for Base44. |
| Checkout | WooCommerce ↔ Worker bridge, signed | `/Checkout` (client-asserted success) | **CONFLICT** | **Incompatible** — two checkouts, and Base44's is already broken | No action now. |
| Inventory | `products_v24` is stock master | **No inventory entity** in Base44 | **MISSING IN BASE44** | N/A | No action now. |
| Fulfilment | BobGo v2 (`BOBGO_API_KEY`), `bobgoShipmentId`, `waybill`, `trackingStatus` | `Order.trackingEvents`, `orders/*` components, no carrier integration | **PARTIAL MATCH** | Partially compatible; no shared carrier contract | No action now. |
| Subscriptions | **Not evidenced** | `Subscription`, `SubscriptionBox`, `BoxSubscription` (3 overlapping entities) | **MISSING IN BANIMAL** | N/A | No action now. |
| Licence / vault | `/api/licenses` (7,933 B) + `brands.vault_mesh_id` | `ScrollLicense`, `ApiClient`, `Vault`, `VaultItem` (BlockVault is a separate system) | **PARTIAL MATCH** | Different licence models; royalty terms are import-prohibited | No action now. |
| Loyalty | **Not evidenced** | `LoyaltyAccount`, `RewardOffer` | **MISSING IN BANIMAL** | N/A | No action now. |
| Media / assets | Cloudflare R2 (`R2_BUCKET`); `dist/assets/BR001-…` PNGs | `AssetLibrary` entity + page | **PARTIAL MATCH** | Comparable intent, different storage | No action now. |
| Admin role | JWT-protected admin surfaces | Base44 role `admin` enforced via entity RLS | **PARTIAL MATCH** | Conceptually aligned, technically separate | No action now. |
| Customer role | WooCommerce customers | Base44 role `user` | **PARTIAL MATCH** | Separate | No action now. |
| API configuration | `/api/configuration` route (2,356 B) | **No equivalent** | **MISSING IN BASE44** | N/A | No action now. |
| Secret management | `wrangler secret put`; `.dev.vars` gitignored; plugin **fails closed**; diagnostics never return a secret to the browser | `BanimalAdmin.jsx` binds `PAYSTACK_SECRET_KEY` in **browser state** | **CONFLICT** | **Incompatible — and Base44 is the weaker party.** Banimal's `5.0.0` changelog removed precisely this anti-pattern. | **The Base44-side fix is already an audit P1 item (P1-5) and is independent of this task.** |
| Events / webhooks | Inbound signed HMAC bridge `POST /api/wp`; unguarded `POST /api/webhook/brands` | 1 workflow + 7 functions; **no inbound webhook** | **PARTIAL MATCH** | Incompatible for consumption; Base44 cannot even run its own functions on the current plan | No action now. |
| Auditability | `observability.enabled`, `upload_source_maps`, migration history, PGP-verified commits, version-verification CI | **No `AuditEvent` entity** (audit finding SEC-009) | **MISSING IN BASE44** | N/A | No action now. |
| Brand tokens / CI Guide | **`GET /api/brand-guide`** — public, unauthenticated, read-only, explicitly designed for "any future adapter" | No brand-token consumer; Base44 uses hardcoded hex literals (`SEC-012`) | **MISSING IN BASE44** | **The one compatible area** — safe, secret-free, read-only | The only viable Phase B target — **but it is unreachable at runtime and requires a server-side adapter (§13).** |

### Compatibility verdict

Of 20 assessed areas: **1** is compatible (`brand-guide`), **1** is a hard duplicate conflict, **1** is a duplicate-plus-conflict, **5** are partial matches, **4** are missing on the Base44 side, **2** are missing on the Banimal side, and **6** are outright conflicts or duplicates.

**There is no safe, current, bidirectional integration.** Only a single narrow read-only surface is even theoretically compatible — and it is not reachable.

---

## 10. Security and commerce implications

| # | Implication | Severity | Evidence | Status |
|---|---|---|---|---|
| I1 | Consuming Banimal would create a **third order owner** (D1 + Base44 `Order` + Base44 `BanimalOrder`) | CRITICAL if attempted | §9 orders row; `INTEGRATION_CHECKLIST.md` §0 records that two backends already diverged and that this was the root cause of a "payments, delivery and comms are disconnected" failure mode | Avoided — no integration performed |
| I2 | Adopting Banimal's payment model would **bypass the audit's P0 gates** (server-authoritative payment, no client-confirmed payment) | CRITICAL if attempted | Audit SEC-001/SEC-002/SEC-004; Banimal's webhook code is *described* but not deployed | Avoided |
| I3 | **`POST /api/webhook/brands` appears unguarded** in the mounted route table while writing to D1 | HIGH (upstream) | `src/worker/index.ts` | **Flagged to owner — not consumed** |
| I4 | The generic public GETs return **whole brand rows**, including `fee`, `royalty`, `division`, `vault_mesh_id` | HIGH | `index.ts` `SELECT *` on `/api/brands` | Would breach the mandate's import prohibition if mirrored naÃ¯vely → any future mapping must use an explicit allowlist |
| I5 | A previously exposed **live Paystack secret key** is recorded as requiring rotation | HIGH (upstream) | `INTEGRATION_CHECKLIST.md` Phase 1 env table | Recorded as an integration risk. Do not couple payments until rotated. |
| I6 | The published Banimal deployment is **paused**; the declared frontend is offline | HIGH | Four runtime probes (§4) | **Hard blocker** |
| I7 | **CORS allowlist excludes the Base44 origin** | HIGH | `src/worker/index.ts` | **Hard blocker** for any browser-side consumer |
| I8 | Base44's own secret-handling anti-pattern (`BanimalAdmin.jsx` browser secret state) would be aggravated by any Banimal work | MEDIUM | Audit SEC-005 | Independent P1 item (P1-5); must be fixed before any Banimal integration |
| I9 | Legacy API documentation (`banimal_api_connector.html`) actively misleads — it documents superseded endpoints and renders a fake "Connected & Listening" badge over simulated data | MEDIUM | §6 contradiction; the file's own comments say "simulated" | A consumer following it would integrate against a dead contract |
| I10 | No `AuditEvent` on either side of the boundary | MEDIUM | Audit SEC-009 | No change provenance would exist for any sync |
| I11 | Version ambiguity (three competing version identities) | MEDIUM | §3 | Cannot pin a consumer to a reproducible artefact |

**Commerce conclusion:** nothing in this verification justifies changing FRUITFUL's commerce behaviour. Banimal's payment design is better documented than FRUITFUL's, but it is not deployed, and merging it would import a second payment authority ahead of unresolved P0 findings. **Payment remains disconnected, and no Banimal payment path is to be adopted.**

---

## 11. Recommended consumer-integration pattern

### Recommended pattern (for when the blockers clear)

```text
FRUITFUL Base44 app  (pages, admin UI)
        │
        ▼
Banimal integration adapter        ← src/integrations/banimal/  (pure types + mapper + status)
        │
        ▼
Narrow server-side read-only function(s)   ← REQUIRED; bypasses browser CORS
        │
        ▼
GET /api/brand-guide  +  GET /api/health   ← the ONLY two surfaces in scope
        │
        ▼
Banimal Cloudflare Worker  (currently paused)
```

**Scope: design tokens and health status only. Nothing else.**

Rationale:

1. `/api/brand-guide` is the only surface with an explicit, in-source, public, unauthenticated, read-only, adapter-anticipated contract.
2. It carries no PII, no costs, no royalty terms, no payment data, and no secret.
3. A server-side call sidesteps the CORS restriction — but creating that function requires a plan that includes backend functions.
4. Both remaining capabilities in scope are `GET`-only, so the adapter can be structurally read-only: no write verbs, no order path, no payment path, no identity sync.

### Explicitly rejected patterns

| Pattern | Verdict | Reason |
|---|---|---|
| Copy the Banimal repository into the Base44 app | **Rejected** | Forbidden by the mandate; would create a divergent fork of a 22 MB multi-component repo |
| Merge Banimal React screens into Base44 | **Rejected** | React 19 + React Router 7 + Hono do not port into this stack; screens are not the contract |
| Mirror `/api/brands` into a Base44 catalogue | **Rejected** | Returns whole rows including `fee`, `royalty`, `division`, `vault_mesh_id` — violates the import prohibition |
| Browser-side fetch of the Worker | **Rejected** | CORS allowlist excludes the Base44 origin; also would put the app at the mercy of a paused upstream |
| Generic path-forwarding proxy | **Rejected** | Forbidden by the mandate; and the upstream has an unguarded write route that a generic proxy could reach |
| Order or payment sync in any direction | **Rejected** | Two order owners already exist; would bypass P0 payment gates |
| Runtime reads of repository source files | **Rejected** | Forbidden by the mandate; a git ref is a build-time input, never a runtime dependency |
| Direct D1 connection | **Rejected** | D1 is Worker-bound; no approved access control exists |

### What must be true before Phase B

1. An owner decision naming the authoritative repository/namespace (§2).
2. A pinned, agreed version with a resolvable identity (§3) — and ideally a real git tag for the plugin's `5.1.x` line.
3. The Banimal deployment un-paused, with `/api/health` and `/api/brand-guide` returning `200` over HTTPS (§4).
4. A workspace plan that includes backend functions, to host the narrow read-only adapter (§13).
5. An upstream field-allowlist contract for any future catalogue read — or a decision to consume `brand-guide` only, permanently.
6. Audit P1-5 (no secret in browser state) closed, so the integration does not sit beside a known secret-handling defect.

---

## 12. Installation plan (NOT EXECUTED)

This plan would have produced the mandate's Phase B boundary. **None of it was created.** It is recorded so the work is ready when the blockers clear.

### Files that were NOT created

| Path | Purpose (if unblocked) |
|---|---|
| `src/integrations/banimal/README.md` | Boundary documentation and scope limits |
| `src/integrations/banimal/banimalContract.ts` | The two in-scope endpoint descriptors and their expected shapes |
| `src/integrations/banimal/banimalTypes.ts` | Consumer-side types for brand-guide tokens and health status |
| `src/integrations/banimal/banimalAdapter.ts` | Read-only call surface; returns typed states, never raw errors |
| `src/integrations/banimal/banimalMapper.ts` | Maps verified contract fields → Base44 consumer fields, allowlist only |
| `src/integrations/banimal/banimalStatus.ts` | `not_configured` · `configured` · `reachable` · `degraded` · `disabled` · `verification_required` |
| `src/integrations/banimal/banimalFixtures.ts` | **Omitted by design** — no fixture would be shipped that could be mistaken for live data |

### Backend functions that were NOT created

`base44/functions/banimalHealth/` and `base44/functions/banimalCatalogSync/` (read-only).

**Not created `banimalOrderStatus`** — order-status lookup is out of scope until user ownership can be verified and the audit's P0 order findings are closed. **No generic proxy of any kind** was planned.

### UI changes that were NOT made

A bounded "Banimal Integration" section under the existing Banimal administration experience, showing: claimed consumer version; verified source reference (repository + commit SHA, never a token or private URL); integration mode (`read-only`, `dry-run`, `disabled`, or `active`); last-checked time; contract version; configuration status **with no secret values**; data freshness; and explicit warnings when `not_configured` or `verification_required`.

**The only honest default state for this install is `not_configured` — because the upstream is paused.**

---

## 13. Blockers and owner decisions

### Stop-gate evaluation (mandate A6)

| A6 condition | Triggered | Evidence |
|---|---|---|
| No v5.1 version can be verified | **PARTIALLY TRIGGERED** | Version exists only as mutable text on `main`; no tag or release (§3) |
| Multiple competing v5.1 candidates cannot be resolved | **TRIGGERED** | `5.1.0` vs `5.1.1` vs `0.0.1` across four sources (§3) |
| No stable public integration contract exists | Not triggered | `GET /api/brand-guide` is explicitly public, unauthenticated, read-only, adapter-anticipated (§6) |
| The only available integration requires importing secrets to the client | Not triggered | The in-scope contract requires no secret (§7) |
| The integration would require a direct database connection without approved access controls | Not triggered | D1 is Worker-bound |
| The version/repository is unrelated to the current Banimal route implementation | Not triggered | Same domain. The Base44 Banimal pages are an independent reimplementation, not derived from this repository (§9) |
| **The workspace cannot safely create the required server-side adapter/function** | **TRIGGERED** | The current plan does not include backend functions; the seven existing functions are inaccessible and new ones cannot be created |
| The task would require modifying payment behaviour before the P0 payment issues are resolved | Not triggered | No payment change was proposed |

**Additional blockers found during verification:**

| B# | Blocker | Severity | Evidence |
|---|---|---|---|
| B1 | **Upstream deployment is paused** — every Banimal hostname, including `/api/*`, returns "This deployment is temporarily paused" | CRITICAL | §4 runtime probes |
| B2 | **CORS allowlist excludes the Base44 origin** — a browser-side consumer is structurally impossible | CRITICAL | `src/worker/index.ts` |
| B3 | **No backend functions on the current plan** — the required narrow server-side adapter cannot be created, and this is an explicit A6 gate | CRITICAL | Workspace plan limitation |
| B4 | **No immutable release artefact** — no tag, no release, no signed package; head of `main` is a dependency bump | HIGH | §4 |
| B5 | **Version ambiguity** — three competing version identities | HIGH | §3 |
| B6 | **Authority ambiguity** — the intake names a private repo; the readable repo's own docs point at that same private repo | HIGH | §2 |

**Six blockers stand. Four are CRITICAL or HIGH and none is addressable from inside this workspace.**

### Decisions required from the owner

| # | Decision | Options | Recommended | Consequence of delaying |
|---|---|---|---|---|
| D1 | Which repository is the authoritative Banimal source: the private `heyns1000/banimal`, or the public `fruitfulplanetchange/banimal`? | (a) Private `heyns1000/banimal`, (b) public `fruitfulplanetchange/banimal`, (c) designate a new canonical repo | (b) — the only verifiable source — **or** grant read access to (a) so it can be verified on equal terms | No consumer can be pinned to a reproducible artefact |
| D2 | Is the target version `v5.1.0`, `5.1.1`, or a new tag? | (a) `5.1.0` as stated, (b) `5.1.1` (current Stable tag), (c) create a signed git tag and use it | (c) — tag the intended release properly | "v5.1" cannot be honestly cited in any interface or document |
| D3 | Will a real git tag/release be published (with the existing `verify-version.sh` discipline extended to cover `package.json` and the Worker's `/api/health`)? | (a) Yes, tag the plugin line, (b) Yes, extend to all components, (c) No | (b) | The three-way version contradiction persists |
| D4 | Will the Banimal deployment be un-paused, and will the Base44 origin be added to the CORS allowlist — or will all access go through a server-side adapter? | (a) Un-pause + add origin, (b) server-side only, (c) neither yet | (b) — server-side only; never widen CORS for a consumer | No runtime verification is possible |
| D5 | Is the workspace being upgraded to a plan that includes backend functions? | (a) Yes, (b) No | (a) — required for any safe Banimal adapter | The entire Phase B boundary stays unbuildable |
| D6 | Should `POST /api/webhook/brands` be guarded upstream? | (a) Yes, add a signature/admin guard, (b) Leave as-is | (a) — it appears reachable without a visible guard | A public write surface remains reachable on the host that serves the public read contract |
| D7 | Is catalogue consumption ever in scope, or is `brand-guide`-only permanent? | (a) Brand-guide only (permanent), (b) Add a field-allowlisted catalogue read later | (a) for now | Prevents a naÃ¯ve whole-row mirror that would import `fee`/`royalty`/`division` |
| D8 | Has the exposed live Paystack key been rotated? | (a) Rotated, (b) Unknown, (c) Not yet | (a) — and confirm before any payment coupling | Payment remains permanently out of scope |

### Explicit statement on the stop

Per the mandate's rule 1 and gate A6, and because the workspace cannot create the required server-side adapter **and** the upstream contract is unreachable at runtime **and** the version cannot be pinned to an immutable artefact, **Phase A ends here and Phase B was not started.** No Base44 application file, entity, route, component, function, or record was created, modified, or deleted by this task.

---

## 14. Evidence ledger

| ID | Source type | Location | Claim supported | Confidence |
|---|---|---|---|---|
| GH-001 | GitHub API | `api.github.com/users/heyns1000` | Account exists: 87 public repos, 71 followers, created 2025-03-23 | CONFIRMED |
| GH-002 | GitHub API | `api.github.com/repos/heyns1000/banimal` | **404 anonymously** — private; the intake-named repo is not publicly verifiable | CONFIRMED |
| GH-003 | GitHub API | `api.github.com/repos/heyns1000/banimal/{releases,tags}` | 404 — no public release or tag surface | CONFIRMED |
| GH-004 | GitHub API | `api.github.com/search/repositories?q=banimal+in:name` | `fruitfulplanetchange/banimal` is public; `sicon2002/bAnimal` is unrelated | CONFIRMED |
| GH-005 | GitHub API | `api.github.com/repos/Fruitful-Global-Planet/banimal-global-loop` | 404 — private | CONFIRMED |
| GH-006 | GitHub API | `api.github.com/repos/fruitfulplanetchange/banimal` | Public; default `main`; Apache-2.0; created 2026-09-13; homepage `banimal.vercel.app` | CONFIRMED |
| GH-007 | GitHub API | `.../releases` | **`[]` — zero releases** | CONFIRMED |
| GH-008 | GitHub API | `.../tags` | **`[]` — zero tags** | CONFIRMED |
| GH-009 | GitHub API | `.../branches` | 30+ unprotected branches; `claude/shock-launch-v5`, `-v4`, `-v2`, `claude/fruitful-wordpress-core` | CONFIRMED |
| GH-010 | GitHub API | `.../commits?per_page=15` | Head `bfb6af75…` is a **dependabot hono bump** merge PR #40; PGP `verified: true`, `reason: valid`; authored by `heynsschoeman@gmail.com`, PR from `heyns1000` | CONFIRMED |
| GH-011 | GitHub API | `.../git/trees/main?recursive=1` | 22 MB repo; `src/`, `worker`, `wordpress-plugin`, `banimal-connector`, `migrations`, `dist` (committed build), 5 workflows | CONFIRMED |
| GH-012 | GitHub API | `.../contents/src/worker/routes` | 13 route modules incl. `brand-guide.ts` (76,659 B) | CONFIRMED |
| GH-013 | GitHub API | `.../contents/wordpress-plugin/banimal-ecosystem-connector` | Plugin structure + `readme.txt` (2,969 B), `banimal-ecosystem-connector.php` (1,522 B), `legacy/`, `bin/` | CONFIRMED |
| GH-014 | GitHub API | `.../contents/migrations` | D1 SQL schema files, `1.sql`–`N.sql`, `2.sql` 1,424 B, `3.sql` 12,404 B, `0002_storefront_tables.sql` 1,934 B | PARTIALLY CONFIRMED |
| GH-015 | GitHub API | `api.github.com/search/code` | **401 Requires authentication** — code search not available anonymously | CONFIRMED (limitation) |
| SRC-001 | Repo source | `README.md` | Stack; Architecture; declares plugin **v5.1.0**; describes Worker `/api/*`; documents scripts | CONFIRMED |
| SRC-002 | Repo source | `package.json` | `"name": "mocha-app"`, **`"version": "0.0.1"`**, `private: true`; React 19, Hono 4.13.7, Vite 7, Vitest 4, Zod | CONFIRMED |
| SRC-003 | Repo source | `src/worker/index.ts` | **CORS allowlist = `banimal.co.za`, `banimal.faa.zone`, `www.banimal.co.za` only**; route mounts; **`/api/brand-guide` declared "Public, unauthenticated, read-only"**; `/api/health` returns **`version: '5.1.0'`**; **`POST /api/webhook/brands` has no visible guard**; `/api/brands` uses `SELECT *` | CONFIRMED |
| SRC-004 | Repo source | `wordpress-plugin/.../readme.txt` | **`Stable tag: 5.1.1`**; changelog `5.1.1` (hex-validation hardening, version-verification CI), `5.1.0` (brand module pulling `/api/brand-guide`), `5.0.0` (full rewrite; removed direct third-party calls; **removed the admin page that emitted a master API key into browser JS**; encryption fails closed) | CONFIRMED |
| SRC-005 | Repo source | `INTEGRATION_CHECKLIST.md` | Names source of truth as **`heyns1000/banimal`**; records two diverged backends and their retirement decision; documents the order lifecycle record; supplies HMAC-SHA512 webhook code; records the **exposed live Paystack key requiring regeneration**; `products_v24` is master | CONFIRMED |
| SRC-006 | Repo source | `wrangler.json` | Worker name is a **UUID**; D1 binding `DB`; R2 binding `R2_BUCKET`; `observability.enabled`; **no `routes` / `custom_domain` stanza** | CONFIRMED |
| SRC-007 | Repo source | `.dev.vars.example` | Secret **names only**; **every value empty**; documents `WP_BRIDGE_SECRET`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_LIVE_SECRET_KEY`, `BOBGO_API_KEY`, `AUTH_SESSION_SECRET`, optional `OAUTH_*`, `VAPID_*`; states secrets are set via `wrangler secret put` and never committed | CONFIRMED |
| SRC-008 | Repo source | `banimal-connector/README.md` | Claude Code plugin installing the Sam Fox™ CI Guide skill; states the WordPress plugin is the real connector; repeats **v5.1.0** | CONFIRMED |
| SRC-009 | Repo source | `banimal_api_connector.html` | Legacy `wp-json/banimal/v1/*` endpoints; **hardcoded "Connected & Listening" badge**; inline comments label the data **"simulated"**; governance protocols marked "Pending Target Implementation" | CONFIRMED |
| SRC-010 | Repo source | `docs/manual/user-manual.html` | Manual exists (32 KB); design-token based; documents setup/API/roadmap sections | CONFIRMED |
| RT-001 | Runtime probe | `https://banimal.vercel.app` | **"This deployment is temporarily paused"** | CONFIRMED |
| RT-002 | Runtime probe | `https://www.banimal.co.za/api/health` | **"This deployment is temporarily paused"** | CONFIRMED |
| RT-003 | Runtime probe | `https://www.banimal.co.za/api/brand-guide` | **"This deployment is temporarily paused"** | CONFIRMED |
| RT-004 | Runtime probe | `https://banimal.faa.zone/api/health` | **"This deployment is temporarily paused"** | CONFIRMED |
| BASE44-001 | Platform config | Workspace | Backend functions **not included on the current plan**; the 7 existing functions are inaccessible and new ones cannot be created | CONFIRMED |
| BASE44-002 | Platform config | Workspace | Published app: `https://fruitfulapp.base44.app` | CONFIRMED |
| AUD-001 | Prior audit | `FRUITFUL_BASE44_CROSS_AUDIT_2026-10-05.md` | `BanimalAdmin.jsx` binds `PAYSTACK_SECRET_KEY` in browser state (SEC-005); no `AuditEvent` (SEC-009); `Order`/`Payment` create is admin-only (SEC-001/002); no payment webhook (SEC-004); inline hex styling (SEC-012) | CONFIRMED |
| AUD-002 | Prior audit | same | Base44 Banimal surfaces: `/BanimalDashboard`, `/BanimalStore`, `/BanimalAdmin`; `BanimalOrder`, `MarketplaceService`, `Order`, `Payment`, `PaymentTransaction` entities | CONFIRMED |
| GAP-001 | Limitation | — | `src/worker/routes/brand-guide.ts` (76,659 B) body not read; only its mount and public-contract declaration | UNVERIFIED (body) |
| GAP-002 | Limitation | — | D1 table schemas not read (`migrations/*.sql` listing only); `products_v24` schema unconfirmed | UNVERIFIED |
| GAP-003 | Limitation | — | Per-route auth for `/api/licenses`, `/api/orders`, `/api/configuration`, `/api/notifications`, `/api/analytics`, `/api/coupons`, `/api/email`, `/api/giving` not read | UNVERIFIED |
| GAP-004 | Limitation | — | Private repositories could not be inspected; no GitHub authentication was used or requested | BLOCKED |
| GAP-005 | Limitation | — | No live Banimal system was reachable, so no contract was verified against a running instance | BLOCKED |

---

> This verification report distinguishes repository evidence, published interfaces, inferred compatibility, and unverified intent. No application changes were made during the verification phase.