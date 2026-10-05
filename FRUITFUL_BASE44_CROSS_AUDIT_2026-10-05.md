# FRUITFUL™ / FAA.ZONE™ Base44 Cross-Audit

**Report ID:** `FRUITFUL_BASE44_CROSS_AUDIT_2026-10-05`
**Classification:** Read-only evidence-led audit snapshot
**Prepared for:** Perplexity Project cross-reference

---

## 1. Audit Receipt

| Field | Value |
|---|---|
| Audit date | 2026-10-05 |
| Audit time | ~19:00–20:00 SAST (Africa/Johannesburg) |
| Application name | FRUITFUL (`base44/config.jsonc` → `"name": "FRUITFUL"`) |
| Displayed product identity | FAA.ZONE™ / Seedwave Admin (per `index.html` `<title>`) |
| Audited URL | Published app: `https://fruitfulapp.base44.app` (platform-declared) |
| Auditor scope | Application inventory, workflow audit, data model, security/governance, product/UX, ecosystem integration readiness |
| Methods | Static inspection of source tree, entity schemas, backend function sources, workflow definition, route table, auth context, and build configuration; plus review of the supplied intake index |
| Read-only | **YES** — no records created, modified, deleted, published, or deployed |
| Backend function execution | **NOT POSSIBLE** — the workspace plan does not include backend functions; the seven functions and the scheduled workflow could not be invoked |
| Overall audit confidence | **Medium** |

### Materials reviewed

1. Application source (`src/`): routing (`App.jsx`), page registry (`pages.config.js`), layout (`Layout.jsx`), auth (`lib/AuthContext.jsx`), 60 page modules, ~40 component folders.
2. Data model: 43 entity schemas under `base44/entities/`.
3. Backend logic: 7 function sources under `base44/functions/`, 1 workflow (`base44/workflows/HourlySheetSync.jsonc`), 1 agent (`base44/agents/video_script_agent.jsonc`).
4. Build/deployment surface: `package.json`, `vite.config.js`, `index.html`, `base44/config.jsonc`.
5. Supplied intake: `FruitfulOperationalIntakeIndex2.md` (456 records, read-only metadata intake dated 24 September 2026).

### Explicit scope exclusions

- No live third-party API calls were made (Supabase, GitHub, Shopify, Monday, WordPress, Ticket Tailor, Google Drive, Gmail).
- No production data was queried beyond what static source inspection reveals.
- No credential values were validated, decrypted, or reproduced.
- Visual/interaction testing of the running app was **not** performed in this pass; findings about runtime behaviour are derived from source logic, not observed sessions. See Section 2.

### Executive conclusion

FAA.ZONE™ / FRUITFUL is a **large, visually ambitious multi-domain application shell** — 60 routed pages, 43 entities, and substantial breadth across commerce, agriculture, artisan marketplaces, coffee procurement, vault infrastructure, and an AI build studio. Its information architecture and component organisation are better than typical prototypes. However, it currently behaves as a **broad prototype rather than a dependable operational system**: the primary revenue workflow (checkout → order → payment) writes to entities whose create rules are restricted to the `admin` role, so a normal buyer or guest cannot persist an order; there is no server-side payment webhook, so paid state is client-asserted; automation capability (workflows + backend functions) is presently unavailable on the workspace plan; 25 of 43 entities permit public reads, several of which expose commercially sensitive procurement and licensing data; and a significant number of pages present static in-file datasets under copy that claims "Real data · No mocks". The single highest-value corrective action is to make the **checkout-to-payment sequence truthful and functional end-to-end**, followed immediately by **tightening public read exposure** and **eliminating UI claims of live data where none exists**.

---

## 2. Evidence Boundary

### Directly inspected (evidence-backed)

- Full file inventory of `src/pages`, `src/components`, `base44/entities`, `base44/functions`, `base44/workflows`, `base44/agents`.
- The routing table in `src/App.jsx` and the page registry in `src/pages.config.js`.
- The complete or partial source of representative pages and payment components (`Checkout.jsx`, `Payments.jsx`, `components/payments/PaymentGateway.jsx`, `DataSyncCenter.jsx`, `BushPortal.jsx`, `BanimalAdmin.jsx`).
- All seven backend function source headers and the workflow JSON.
- 25 entity schemas in full (via the retained schema snapshot) and the RLS posture of all 43 entities via schema scan.

### Taken from the intake file (not independently verified)

- Repository names, branch counts and file counts (`GH-*`, `GHORG-FGP`, `FGR-*`).
- Supabase project and table observations (`SB-*`, `TBL-*`).
- Commerce/ops surface existence (Shopify, Ticket Tailor, Monday, two WordPress sites).
- The three RLS-disabled Supabase tables (`public.samfox_prints`, `public.grand_paintings`, `public.bashedi_kidswear`).
- Gmail/drive metadata-only records and the credential-bearing mail reference.

### Inaccessible / not verified in this audit

- Live app runtime behaviour (auth prompts, actual empty/error states, responsive rendering).
- Whether the app is publicly readable or login-gated (derived only from `AuthContext` logic, not from live public settings).
- Actual database row counts and whether any entity holds production data.
- Whether any environment secret is currently set or valid.
- Whether the published deployment matches the current source tree.

### Limitations statement

**Repository names, page titles, entity names, route paths, and metadata references do not prove deployed functionality.** A route existing in `App.jsx` proves only that a component is bound to a path — not that its data is live, its workflow completes, or its integration is connected. Every claim in this report is labelled `CONFIRMED`, `PARTIALLY CONFIRMED`, `INFERRED`, `UNVERIFIED`, or `CONTRADICTED`. Any statement without such a label should be read as `UNVERIFIED`.

---

## 3. Executive Scorecard

| Dimension | Score / 10 | Confidence | Status | Core finding |
|---|---:|---|---|---|
| Product definition | 5 | Medium | Fragmented breadth | Multiple distinct products (commerce, coffee, vault, artisan, AI studio, WordPress docs) share one app with no single governing purpose statement in-app. |
| Information architecture | 6 | High | Structured | `Dashboard.jsx` groups 50+ destinations into 10 labelled categories — genuinely usable, though duplicated by a second global nav. |
| UX and interface quality | 6 | Medium | Visually strong, inconsistent | Rich Tailwind/shadcn UI; several routes render outside the shared `Layout` (no nav, no back button); heavy inline hex styling bypasses the design-token system. |
| End-to-end workflows | 3 | High | Largely incomplete | Checkout cannot persist orders under current RLS; no payment webhook; most "workflows" are single-screen displays. |
| Data model | 5 | High | Broad, uneven | 43 entities with sensible field detail in places (`Order`, `GreenCoffeeReceipt`), but duplicated concepts (Subscription vs SubscriptionBox vs BoxSubscription), loose string relations, and no canonical brand/order spine. |
| Data integrity | 3 | Medium | Weak | No duplicate-prevention keys; `SageItemRaw` stores 36 opaque `col_N` columns; statuses diverge across entities; no canonicalisation strategy. |
| Security and access control | 4 | High | Material gaps | Create rules block the app's own checkout; 25 entities publicly readable; secret-collection UI in the browser. |
| Auditability and governance | 3 | High | Minimal | Only `Order`/`PaymentTransaction` carry partial history; no app-wide audit entity; no approval trail for admin mutations. |
| Integration readiness | 5 | Medium | Scaffolded, unverified | Proxies exist for BlockVault, Cropster, Algrano, Alibaba GPDB; Google Sheets connector referenced; none verifiable as live. |
| Operational readiness | 3 | High | Not yet operational | Automation (workflow + functions) unavailable on plan; no ops queue, no exception handling, no alerting. |
| Deployment readiness | 4 | Medium | Single environment | No dev/staging/prod separation evidenced; one workflow, no rollback procedure, secrets status unknown. |
| Maintainability | 4 | High | Improving but uneven | Code-splitting by folder is good; but 6 pages exceed 450 lines, one reaches 874, and domain logic is duplicated across pages. |
| **Overall** | **4.1 / 10** | Medium | — | — |

**Readiness classification: `Prototype`** (approaching `Internal Alpha`).

### The three largest blockers

1. **Checkout cannot complete for a real buyer.** `Order` and `Payment` create rules are `admin`-only, yet `Checkout.jsx` and `PaymentGateway.jsx` call `.create()` as the buyer/guest. (CONFIRMED — code + schema)
2. **No server-side payment verification.** No Paystack webhook or signature-verifying function exists in the codebase. Order/payment success is asserted by client-side JavaScript. (CONFIRMED)
3. **Automation and integrations are inert and partly unverified.** The scheduled sync workflow and all seven backend functions require a workspace plan that currently does not include backend functions; several depend on secrets whose presence is unverified. (CONFIRMED plan limitation; UNVERIFIED secret state)

---

## 4. Confirmed Inventory

Coverage note: 60 routes are bound in `src/App.jsx`. The table below covers every distinct area class observed, including unrendered/static ones. "Data state" reports what the source shows, not live database content.

| Area / route | Intended purpose | Evidence | Actual behavior | Data state | Workflow state | Confidence | Findings |
|---|---|---|---|---|---|---|---|
| `/` + `/Dashboard` | Admin hub / nav index | `pages.config.js` (`mainPage: "Dashboard"`), `Dashboard.jsx` | Renders 10 category groups of page links + admin tabs (AdminPanel, DataSeeder, Bulk ops, BlockVault admin) | Live entities + static link config | `WORKING` (navigation only) | CONFIRMED | Duplicates navigation also present in `GlobalNavBar`. |
| `/Marketplace` | Service/product storefront | `pages.config.js`, `MarketplaceService` entity | Lists marketplace services | `base44.entities.MarketplaceService` | `PARTIALLY IMPLEMENTED` | PARTIALLY CONFIRMED | Catalogue source-of-truth unclear vs `BarcodeMapping`/`PIMFItem`. |
| `/Checkout` | Buyer checkout → order → payment | `Checkout.jsx` (595 lines) | On Paystack callback, creates `Order` then `Payment`; falls back to "demo mode" instant order if no public key | Writes `Order`, `Payment` | `BROKEN` for non-admin buyers | CONFIRMED | `Order`/`Payment` create = admin-only RLS; demo mode silently completes orders. |
| `/Payments` | Gateway + subscription + history admin | `Payments.jsx`, `components/payments/*` | Tabs: gateway, subscriptions, transactions, Paystack settings, Xero guide, child-node | Reads `Payment`, `Subscription` | `PARTIALLY IMPLEMENTED` | CONFIRMED | Transaction history reads only; no reconciliation job evidenced. |
| `/DataSyncCenter` | Google Sheets → entity sync | `DataSyncCenter.jsx`, `SyncLog`, `SheetSyncConfig` entities | React-Query lists + bulk sync actions; session entity inventory | Reads/writes `Brand`, `MarketplaceService`, `PaymentTransaction` | `PARTIALLY IMPLEMENTED` | CONFIRMED | Depends on backend functions unavailable on plan. |
| `/Analytics`, `/SectorAnalytics`, `/MarketIntelligence`, `/PulseTradeAnalytics` | KPI dashboards | Page sources; `Metrics` entity (admin-only read) | Charts render from page-level datasets | Mixed static + entity | `UI-ONLY / MOCK` (per-page) | PARTIALLY CONFIRMED | `Metrics` is admin-only, so public dashboards cannot read it. |
| `/FruitfulCoffee`, `/KioskLandedCost` | Coffee costing engine | `coffee/*`, `CoffeeCostInput`, `CoffeeProjection`, `GreenCoffeeReceipt` | Costing model + landed-cost comparison render from in-file constants | Static constants in `KioskLandedCost.jsx` (`PI`, source data) | `UI-ONLY / MOCK` | CONFIRMED | Procurement cost constants are in the client bundle. |
| `/BlockVault`, `/VaultMesh` | Vault administration | `BlockVault.jsx`, `vaultmesh/*`, `blockVaultProxy` | Admin console + vault/audit UI | `ComplianceAudit`, `Vault`, `VaultItem` + proxy | `PARTIALLY IMPLEMENTED` | PARTIALLY CONFIRMED | Proxy requires `BLOCKVAULT_API_KEY` + admin role; intake flags upstream read-only permission issue. |
| `/BanimalDashboard`, `/BanimalStore`, `/BanimalAdmin` | Banimal commerce + admin | `banimal/*`, 646-line dashboard | Tabbed dashboard, store, and admin incl. secrets input form | Entities + static portal data | `PARTIALLY IMPLEMENTED` | CONFIRMED | `BanimalAdmin.jsx` binds `PAYSTACK_SECRET_KEY` to a browser state field. |
| `/CodeNestDashboard`, `/HotStack` | AI build studio | `codenest/*`, `appbuilder/*`, `ScrollProject`, `ScrollLicense` | Templates, scroll builder, analytics, checkout; HotStack drop-zone | Entities + `InvokeLLM` + static template data | `PARTIALLY IMPLEMENTED` | CONFIRMED | UI copy claims "Real data · No mocks" while analytics uses sample datasets. |
| `/FruitfulWordPressDocs` | Integration architecture doc | Page source (874 lines) | 14-section interactive blueprint | Static documentation | `WORKING` (as a doc) | CONFIRMED | Largest file in the repo. |
| `/ArtisanDashboard`, `/ArtisanShop`, `/ArtisanProfile`, `/ArtisanFinancials`, `/Gallery` | Artisan marketplace | `artisan/*`, `ArtisanProfile`, `PortfolioProject`, `Review` | Profile, shop, earnings, gallery | Entities | `PARTIALLY IMPLEMENTED` | PARTIALLY CONFIRMED | `ArtisanProfile` publicly readable. |
| `/SubscriptionBoxes`, `/SubscriptionShop`, `/MySubscriptions`, `/Subscription*` | Subscriptions | 3 related entities (`Subscription`, `SubscriptionBox`, `BoxSubscription`) | Plan browsing + management | Entities | `PARTIALLY IMPLEMENTED` | CONFIRMED | Three overlapping subscription entities with no clear canonical owner. |
| `/OrderHistory`, `/OrderDashboard`, `/OrderFulfillment` | Order ops | `Order` entity, `orders/*` components | Order list, timeline, packing slip, tracking | `Order` (RLS scoped to buyer/artisan/admin) | `PARTIALLY IMPLEMENTED` | CONFIRMED | Read scoping is correct; write path is blocked (see SEC-001). |
| `/LoyaltyProgram`, `/CollaborationSuite`, `/DiscoveryEngine`, `/AutomationEngine` | Engagement + automation | Page sources, `AutomationRule`, `LoyaltyAccount`, `RewardOffer` | UI + `InvokeLLM`; automation rules read/write | Entities + LLM | `PARTIALLY IMPLEMENTED` | PARTIALLY CONFIRMED | `AutomationRule` publicly readable. |
| `/LegalDocuments`, `/BushPortal`, `/BaobabTree` | Misc portals | Page sources | Static/portal content; BushPortal shows masked key list | Static (BushPortal: in-file constants) | `UI-ONLY / MOCK` | CONFIRMED | BushPortal renders masked `bsk_live_••••` strings in client state. |
| `/OAuthConsent` | OAuth consent screen | Page source | Consent UI | None | `WORKING` | INFERRED | Not reachable from Dashboard nav. |
| 20 pages with no data-layer calls | Various | `grep` of `base44.entities/functions/integrations/agents` | Render from in-file arrays only | Static | `UI-ONLY / MOCK` | CONFIRMED | Listed in Section 8. |

---

## 5. Workflow Matrix

A screen is **not** a workflow. Only sequences with an entry point, inputs, a write or state transition, and a completion condition qualify. Where none is evidenced, this is stated explicitly.

| Workflow | Entry point | Expected user outcome | Observed outcome | Data persistence | Permissions | Error handling | Status | Evidence | Priority |
|---|---|---|---|---|---|---|---|---|---|
| Buyer checkout → paid order | `/Checkout` | Buyer pays and receives a confirmed order | `Order.create()` + `Payment.create()` invoked by the buyer; **both create rules are admin-only** | Attempted write to `Order`/`Payment` | Blocked for `user`/guest roles | Inline toast on failure; Paystack callback assumed `success` | **BROKEN** | `Checkout.jsx` (create calls), `Order.jsonc`, `Payment.jsonc` | P0 |
| Payment verification via webhook | *(none)* | Server independently confirms payment | **No webhook handler or signature verifier exists** | None | N/A | N/A | **NOT PRESENT** | `grep` for `x-paystack-signature`/`webhook` across `base44/functions` returned nothing | P0 |
| Demo-mode order (no key) | `/Checkout` | *(ambiguous)* | Creates an order instantly with no payment | Writes `Order` | Blocked for non-admin | Toast: "Demo mode" | **UI-ONLY / MOCK** | `Checkout.jsx` demo branch | P0 |
| Sheet → entity sync | Workflow `Daily Sheet Sync` → `scheduledSheetSync` | Sheets refresh brand/coffee/food/barcode entities daily at 02:00 SAST | Definition valid (`0 2 * * *`, Africa/Johannesburg) but **cannot run — plan excludes backend functions** | Would upsert `Brand`, `CoffeeCostInput`, `FoodMenuItem`, `BarcodeMapping` | Service role | Not evidenced | **UNVERIFIED / BLOCKED** | `HourlySheetSync.jsonc`, `scheduledSheetSync/entry.ts` | P1 |
| Data Sync Center manual sync | `/DataSyncCenter` | Admin bulk-syncs brands/services | UI calls `bulkCreate` on live entities | Writes `Brand`, `MarketplaceService` | Admin-gated by entity RLS | Not evidenced | **PARTIALLY IMPLEMENTED** | `DataSyncCenter.jsx` | P2 |
| Transaction reconciliation | `/Payments` tab | Reconcile gateway vs local records | `checkPaystackTransactions` is a **read-only poller** requiring a logged-in user | No write | Any authenticated user | Returns error JSON | **PARTIALLY IMPLEMENTED** | `checkPaystackTransactions/entry.ts` | P1 |
| BlockVault entity management | `/BlockVault` | Admin CRUD over vault data | Proxy forwards to `blockboxvault.base44.app/api/entities` | Remote | Admin-only (correctly guarded) | Error JSON | **PARTIALLY IMPLEMENTED** | `blockVaultProxy/entry.ts` | P2 |
| Coffee procurement intake | `/FruitfulCoffee` | Record green coffee receipt with QC gating | Entities exist with defect/QC fields; UI is model-driven | `GreenCoffeeReceipt` | Public read (risk) | Not evidenced | **PARTIALLY IMPLEMENTED** | Entity schema + page | P1 |
| Scroll/CodeNest project creation | `/CodeNestDashboard` | Create scroll project, get AI assistance | `InvokeLLM` + `ScrollProject` write | Writes `ScrollProject` | Admin-only create | Toast on error | **PARTIALLY IMPLEMENTED** | `codenest/*` | P2 |
| AI Q&A on checkout | `/Checkout` FAQ panel | Answer buyer questions | `InvokeLLM` call, inline loading/error states | None (stateless) | Any visitor | Inline error copy | **WORKING END-TO-END** | `CheckoutAIFAQ.jsx` | P3 |
| Lead capture / wholesale enquiry | *(none found)* | Visitor submits an enquiry | **No form-action handoff or lead endpoint** | None | N/A | N/A | **NOT PRESENT** | No lead entity or endpoint in source | P1 |
| Role-based access provisioning | *(none found)* | Admin assigns roles to users | **No in-app user/role management screen** | None | N/A | N/A | **NOT PRESENT** | No `User` management page in routes | P2 |

**Explicit statement:** No complete, permission-valid, persistence-backed, end-to-end operational workflow was demonstrated for the app's primary revenue path. The only fully clean end-to-end sequence observed is the stateless AI FAQ response.

---

## 6. Data Model Audit

### Entity-by-entity assessment

Legend: **PR** = public read (`"read": null`); **AR** = admin-only read; **OW** = owner-scoped read.

| Entity | Purpose | Identifier | Source of truth | Key fields | Relationships | Integrity controls | Lifecycle/audit fields | Risks / gaps | Confidence |
|---|---|---|---|---|---|---|---|---|---|
| `Brand` | Brand registry + finance | `id` (built-in) | App | name, sector (29-value enum), subnodes, financialAllocation, revenue, budget | `subnodes` as loose string array | Enum on `sector`; no unique name | `allocationStatus` | No canonical brand key; duplicate brand risk; **PR** | CONFIRMED |
| `Order` | Commerce orders | `id`; `orderNumber` string | App + gateway | items[], buyerEmail, totalAmount, status (8 enum), paymentStatus, statusHistory | `artisanId`/`serviceId` loose strings | Enum status; `statusHistory` array | `statusHistory`, `trackingEvents` | `orderNumber` not declared unique; create admin-only (**PR-read via owner scope**) | CONFIRMED |
| `Payment` | Payment records | `id` | Gateway | amount, gateway, status, type, customerEmail | Customer email string | Required fields | None | No idempotency key; create admin-only | CONFIRMED |
| `PaymentTransaction` | Gateway transactions | `id`; `reference` | Paystack | reference, email, amount, currency, metadata | Email string | Required reference/email | None | `reference` not enforced unique; create admin-only | CONFIRMED |
| `Subscription` / `SubscriptionBox` / `BoxSubscription` | Subscription plans + instances | `id` | Unclear | plan/subscription fields | Cross-referenced by strings | None | None | **Triplicated concept, no canonical owner**; `Subscription`/`SubscriptionBox` publicly readable | CONFIRMED |
| `MarketplaceService` | Storefront catalogue | `id`; `productCode` | Ambiguous | serviceName, pricing{6 currencies}, category enum | `brandId` string | Category enum | None | Overlaps `BarcodeMapping`/`PIMFItem`/`SageCostRow` as product truth; **PR** | CONFIRMED |
| `BarcodeMapping` | SKU/barcode master (28 cols) | `SKU` (required) | Imported sheet | SKU, Barcode, Material, Range, MOQ… | `SKU` as join key | SKU required | None | Header-derived column names are display strings; **PR** exposes full SKU/pricing matrix | CONFIRMED |
| `PIMFItem` | Sage item master | `Code` | Imported | Code, Description, Price Inclusive/Exclusive, Cost, Quantity | `Code` | Code required | Active flag | Prices stored as **strings**; **PR** | CONFIRMED |
| `SageItemRaw` | Raw Sage rows | `row_index` | Imported | `col_0`…`col_35` | None | None | None | **Opaque positional columns — no semantic schema**; unqueryable without external legend; AR | CONFIRMED |
| `SageCostRow` | Costing rows (5 sections) | section + eps_code | Imported | ~45 costing fields | `sku`, `eps_code` strings | section required | None | Massive denormalised table; **PR** exposes cost structure | CONFIRMED |
| `CoffeeCostInput` | Costing variables | `id` | Sheet | category, label, value, unit, sheet | `label` string | label+sheet required | None | **PR** exposes cost inputs | CONFIRMED |
| `CoffeeProjection` | Monthly projections | `month` | Sheet | cups_to_sell, net_profit, scenario | `month` string | month required | `scenario` | **PR** exposes financial projections | CONFIRMED |
| `GreenCoffeeReceipt` | Procurement lots + QC | `lotReference` | Algrano/manual | quantityKg, moistureContent, scaCuppingScore, defect matrix, cMarketPrice | `supplierName` string; `cropsterLotId` string | Lifecycle enum; defect flags | `status` (5 enum), ETA/customs timestamps | **Rich and well-modelled**, but `lotReference` not enforced unique; **PR** exposes C-market pricing | CONFIRMED |
| `SupplierProfile` | Supplier network | `id` | App | name, type enum, origin, contacts, capacity, terms, minCuppingScore | `originRegions` array | name/type/origin/location required | `active` | **PR exposes supplier contacts, pricing terms and certifications** — commercial confidentiality risk | CONFIRMED |
| `KioskShippingEstimate` | Freight quotes | `quote_no` | Document | charges[], USD/ZAR rates, totals | `pi_reference` string | quote_no required | None | **PR exposes landed-cost and FX structure** | CONFIRMED |
| `DirectoryEntry` | Locations/directory | `id` | App | entity_name, country/province/town, contact, routing_code | `entity_name` string | 4 required fields | `status` enum | **PR exposes contact email/phone** — POPIA-relevant | CONFIRMED |
| `ArtisanProfile` | Artisan identity | `id` | App | bio, craft, certs | `user` linkage inferred | None | None | **PR exposes personal/professional profiles** | CONFIRMED |
| `PortfolioProject`, `Review`, `RewardOffer`, `BrandCollaboration`, `AutomationRule`, `ChangeRequest` | Engagement/review/rules | `id` | App | Various | Loose string refs | None/mixed | `ChangeRequest.status` | `ChangeRequest` (approvals) and `AutomationRule` publicly readable — **governance exposure** | CONFIRMED |
| `ScrollProject` / `ScrollLicense` | CodeNest assets + licensing | `projectId` / `licenseId` | App | name, region, royalty, htmlCode/cssCode | `licenseId` string | name/status/region required | status enums, `lastActivity` | **PR exposes licensing terms and royalty rates** to anonymous readers | CONFIRMED |
| `Metrics` | Platform KPIs | `timestamp` | App | activeNodes, licensesActive, vaultDeployments… | None | timestamp required | None | AR (correct) — but public dashboards therefore cannot read it | CONFIRMED |
| `ApiClient` | API key registry | `id`; `key_hash` | App | name, key_hash, key_prefix, scopes | None | key_hash required | `status` enum, `last_used_at` | AR (correct); `scopes` free-text array | CONFIRMED |
| `SyncLog`, `SheetSyncConfig` | Sync operations | `id` | App | client_name, direction, resource, record_count; spreadsheetId, lastSync* | None | Required fields | `lastSyncStatus` enum | AR (correct); `SyncLog` has no error-detail schema field beyond `details` string | CONFIRMED |
| `ComplianceAudit`, `Vault`, `VaultItem`, `AuditHandoff`, `FoodMenuItem`, `PackagingAsset`, `ArtisanNotification`, `BanimalOrder`, `Message`, `MessageThread`, `LoyaltyAccount`, `PaymentTransaction` | Domain-specific | Varies | Varies | Varies | Mostly loose strings | Mixed | Mixed | `AuditHandoff` has a single column header as a field name (`"ITEM MASTER - AUDIT & HANDOFF"`) — schema smell | PARTIALLY CONFIRMED |

### Canonical entity recommendations

1. **Establish one product/catalogue spine.** Choose a single canonical product entity (recommend a normalised `Product` with `sku` unique) and make `MarketplaceService`, `BarcodeMapping`, `PIMFItem` and `SageCostRow` **sources**, not peers. Each source maps into `Product` via a documented data contract.
2. **Collapse the subscription trio.** Keep `SubscriptionBox` as the plan definition and `Subscription` as the instance; retire or rename `BoxSubscription` after content comparison.
3. **Introduce a `Lead` entity** for enquiries, wholesale, and contact submissions — currently absent.
4. **Introduce an `AuditEvent` entity** (actor, action, entity, record_id, before/after hash, timestamp, source) as the app-wide change trail; today only `Order` carries partial history.
5. **Replace `SageItemRaw.col_N`** with a semantic schema (`account_code`, `description`, `debit`, `credit`, `period`, …) before any reporting depends on it.

### Data ownership boundaries

`created_by_id` exists on every Base44 record but is **not enforced as an ownership boundary** by any entity except via email-string matching on `Order`. Recommend replacing `buyerEmail`/`artisanEmail`/`customerEmail` string matching with `created_by_id` / explicit user-id fields, and defining tenant boundaries for Brand-scoped data (Banimal, Fruitful Coffee, BlockVault should not share one flat table).

### Required status taxonomy

Statuses currently diverge: `Order.status` (8 values), `Order.paymentStatus` (3), `payment.status` (free-text-ish), `GreenCoffeeReceipt.status` (5), `ChangeRequest.status` (4), `SyncLog.status` (free string), `SheetSyncConfig.lastSyncStatus` (3). Recommend a single documented enumeration set per domain and a shared `PAYMENT_STATE` and `APPROVAL_STATE` vocabulary.

### Duplicate-handling approach

No entity declares a unique constraint besides `SKU` (implied) and `Code`. Recommend: (a) define natural keys per entity, (b) add pre-create lookup-by-natural-key in every import path, (c) build a one-off dedupe report for `Brand`, `MarketplaceService`, `SupplierProfile`, and the subscription trio.

### Minimum audit-history model

`AuditEvent { id, timestamp, actor_id, actor_email, action, entity, record_id, field_changes, source, request_id }` written by every create/update/delete path, with `source ∈ {ui, import, workflow, api}`.

### Data provenance / freshness model

Every imported or calculated record should carry `provenance` (manual | import | calculation | integration), `source_system`, `imported_at`, and `is_estimated`. Today only `GreenCoffeeReceipt.status` and `SheetSyncConfig.lastSyncedAt` hint at provenance. Without this, users cannot distinguish live, draft, imported, calculated, estimated and unverified data — a core requirement stated in the mandate.

---

## 7. Security and Governance Findings

Severity scale: `CRITICAL` · `HIGH` · `MEDIUM` · `LOW` · `INFO`

| ID | Severity | Finding | Evidence | Impact | Recommended remediation | Verification test | Confidence |
|---|---|---|---|---|---|---|---|
| SEC-001 | CRITICAL | `Order` create rule is admin-only, but the buyer checkout path calls `Order.create()` as a normal user/guest | `Order.jsonc` (`create.user_condition.role = admin`); `Checkout.jsx` create call | Checkout cannot persist for real buyers; the app's primary revenue workflow is non-functional; may fail silently with an uncaught error toast | Change `Order.create` to allow authenticated buyers (owner-scoped) and move guest orders behind a server function; never make it public | As a logged-in non-admin, complete checkout → order row exists and is readable by that buyer | CONFIRMED |
| SEC-002 | CRITICAL | `Payment` and `PaymentTransaction` create rules are admin-only, but payment components create them client-side | `Payment.jsonc`, `PaymentTransaction.jsonc` (`create = admin`); `PaymentGateway.jsx`, `Checkout.jsx` | Payment records cannot be written by the actor who made the payment; ledger will be incomplete/empty | Move payment record creation to a **server-side webhook/verification function** using service role | Successful gateway payment produces exactly one `Payment` row created by the server, not the browser | CONFIRMED |
| SEC-003 | HIGH | 25 of 43 entities are publicly readable (`"read": null`), several of them commercially sensitive | Schema scan; list below | Anonymous/internet readers can read supplier contacts, pricing terms, landed-cost/FX structures, cost inputs, royalty rates, licence terms, directory PII and approval requests | Set `read` to owner/admin scope on all non-marketing entities; keep public read only for genuinely public catalogue/brand data | Unauthenticated fetch of `SupplierProfile`, `GreenCoffeeReceipt`, `CoffeeCostInput`, `KioskShippingEstimate`, `ScrollLicense`, `ChangeRequest`, `DirectoryEntry` returns 403/empty | CONFIRMED |
| SEC-004 | HIGH | No server-side payment verification or webhook handler exists | `grep` for `x-paystack-signature`/`webhook` in `base44/functions` → no matches; only `checkPaystackTransactions` (read-only poller) | Paid state is trusted from client-side JS; orders can be marked confirmed without verifiable payment; no idempotency | Add a signature-verifying webhook function (`x-paystack-signature` HMAC with `PAYSTACK_SECRET_KEY`) that is the **single** writer of confirmed order/payment state | Replaying a valid webhook creates/updates once (idempotent); a tampered signature is rejected | CONFIRMED |
| SEC-005 | HIGH | Admin UI binds a payment **secret key** to a browser-controlled state field | `BanimalAdmin.jsx` state includes `PAYSTACK_SECRET_KEY` | Secret material can be entered, held in memory, and potentially echoed in the page/DevTools/telemetry | Replace with a read-only "set in Secrets" instruction panel; never bind secret inputs in client state | Source contains no state field named for any `*_SECRET_KEY`; secrets set only via the Secrets surface | CONFIRMED |
| SEC-006 | MEDIUM | Masked live-looking API keys are rendered in the client bundle | `BushPortal.jsx` in-file constants `bsk_live_••••…` | Misleading (implies live keys are browsable) and trains users to expect keys in the UI | Remove; if keys must be shown, fetch metadata server-side and never render key material | `BushPortal` renders no `*_live_*` strings | CONFIRMED |
| SEC-007 | MEDIUM | Integration proxies depend on secrets whose presence/validity is unverified | `blockVaultProxy` (`BLOCKVAULT_API_KEY`), `alibabaGpdbProxy` (Alibaba keys), `checkPaystackTransactions` (`PAYSTACK_SECRET_KEY`) | Features silently fail or return configuration errors; users may believe integrations are live | Add a "configuration status" panel that reports *set/not set* (never values) per integration, plus graceful empty states | Each proxy returns a typed `not_configured` state surfaced in the UI | CONFIRMED (dependency) / UNVERIFIED (validity) |
| SEC-008 | MEDIUM | Demo mode completes orders without payment | `Checkout.jsx` (`"Running in demo mode — simulating Paystack payment…"`, instant order creation) | Orders can enter the system unpaid; finance records drift from reality | Gate demo mode behind an explicit environment flag that is disabled in production, and label such orders `paymentStatus: pending`, not confirmed | With the public key absent in production config, checkout cannot create a `confirmed` order | CONFIRMED |
| SEC-009 | MEDIUM | Only `Order` carries a partial change trail; no app-wide audit entity | Schema review; `AuditHandoff` is not an audit log | Admin mutations are untraceable; no who-changed-what evidence | Introduce `AuditEvent` and write on every mutation path | A brand financial edit produces one `AuditEvent` with actor and before/after | CONFIRMED |
| SEC-010 | MEDIUM | Public read on `ChangeRequest` and `AutomationRule` | Schema scan | Approval queues and automation rules are visible to any authenticated (and anonymous) reader | Restrict both to admin | Anonymous read returns no rows | CONFIRMED |
| SEC-011 | LOW | Several routes render outside the shared `Layout`, bypassing nav, cart and back affordances | `App.jsx`: `/HotStack`, `/CodeNestDashboard`, `/FruitfulWordPressDocs`, `/BlockBox`, `/BanimalLoopCheckout` | Users can reach a dead-end screen with no navigation | Wrap all routes in the same layout wrapper (or a deliberate full-bleed variant) | Every route shows a consistent way back | CONFIRMED |
| SEC-012 | LOW | Heavy inline hex styling and unmapped brand colours bypass the design-token system | Numerous pages (`KioskLandedCost.jsx`, `BushPortal.jsx`, …) use inline `style={{ color: '#…' }}` | Inconsistent theming; dark-mode/token changes do not propagate | Move to `src/index.css` tokens + mapped Tailwind classes | No inline hex colour literals remain in page files | CONFIRMED |
| SEC-013 | INFO | Reported import error for `KioskLandedCost` appears to be a tooling false positive | `KioskLandedCost.jsx` **does** `export default function KioskLandedCost()`; the import path matches | If genuine it would break the build; evidence suggests it is not | Confirm with a clean `npm run build`; treat as resolved if green | `npm run build` completes with no unresolved-import error | CONTRADICTED (tooling report vs source) |
| SEC-014 | INFO | Masked secret strings in `BushPortal` are **not** real secrets | The values are literal `•` masks in source | No credential leak | No action | — | CONFIRMED |

### External security-routing note (NOT an app defect)

**ROUTE-001 — `MEDIUM` (external).** The intake flags `public.samfox_prints` (10 rows), `public.grand_paintings` (1 row) and `public.bashedi_kidswear` (43 rows) as tables with **RLS disabled** in the Supabase project `FruitfulGlobalPlanet-2026` (`SB-poyxundlvczciihdrkkk`), exposing them to anon/authenticated client roles.

**Scoping statement:** Nothing in the audited Base44 application references Supabase, these tables, or this project. No Supabase client, connection string, or table name appears anywhere in `src/` or `base44/`. This is therefore recorded **only** as an external security-routing item for the Supabase owner to review — **it is not an assumed defect of this app**. Recommended remediation: enable RLS with restrictive policies and audit existing rows; see the Supabase RLS guide referenced in the intake.

**Related external references (for routing only):** intake record `MAIL-1a0a456cf55d1e92` is described as a credential-bearing Gmail message (value omitted, correctly). No credential value was reproduced in this audit.

---

## 8. Missing, Incorrect, and Misleading Elements

### Missing capabilities

| ID | Category | Finding | Why it matters | Evidence | Recommended fix | Acceptance criteria | Priority |
|---|---|---|---|---|---|---|---|
| MIS-001 | Missing | No server-side payment webhook / verification | Payment truth is unverifiable; revenue reporting is unreliable | Absence in `base44/functions` | Add signature-verifying webhook function | Tampered signature rejected; valid event idempotently applied once | P0 |
| MIS-002 | Missing | No `Lead`/enquiry entity or endpoint | Cannot capture wholesale/contact demand — a core commercial workflow | No lead entity/route in source | Add `Lead` entity + narrow server endpoint | A submitted enquiry creates one `Lead` with source metadata and consent | P1 |
| MIS-003 | Missing | No app-wide audit trail | Admin/financial changes are untraceable; blocks governance and dispute handling | Only `Order.statusHistory` exists | Add `AuditEvent` entity + writers | Any brand financial edit yields one `AuditEvent` | P1 |
| MIS-004 | Missing | No in-app user/role management | Roles drive all access; admins cannot self-serve provisioning | No user-admin page in routes | Add an admin users screen (invite + role) | Admin can invite a user as `user` and see the pending record | P2 |
| MIS-005 | Missing | No provenance/freshness fields on records | Users cannot distinguish live vs imported vs estimated data | Schema review | Add `provenance`, `source_system`, `imported_at`, `is_estimated` | Every imported record shows provenance in the UI | P1 |
| MIS-006 | Missing | No ops exception queue / alerts | Failures (sync, payment, proxy) surface nowhere durable | No alerting entity or view | Add an ops/exception view backed by `SyncLog` + a new `OpsEvent` | Failed sync appears in the queue within one run | P2 |
| MIS-007 | Missing | No dev/staging/production separation evidenced | Changes go straight to one environment; no rollback | Single `config.jsonc`; no env matrix | Define environments and a promotion path | Staging deploy validated before production promotion | P1 |

### Incorrect or broken capabilities

| ID | Category | Finding | Why it matters | Evidence | Recommended fix | Acceptance criteria | Priority |
|---|---|---|---|---|---|---|---|
| INC-001 | Broken | Checkout cannot persist an order for a buyer (admin-only RLS) | Primary revenue path fails | `Order.jsonc` + `Checkout.jsx` | Owner-scope `Order.create`; guest orders via server | Non-admin completes checkout → order persisted and visible to them | P0 |
| INC-002 | Broken | Payment records cannot be created by the paying actor | Ledger never reconciles to reality | `Payment.jsonc` + `PaymentGateway.jsx` | Server-side creation via webhook | One server-created `Payment` per successful transaction | P0 |
| INC-003 | Incorrect | Demo mode marks orders confirmed without payment | Corrupts finance data | `Checkout.jsx` demo branch | Environment-gate demo; never set `confirmed` on demo | Production config cannot create a confirmed unpaid order | P0 |
| INC-004 | Incorrect | Public dashboards read `Metrics`, but `Metrics` is admin-only | Dashboards are empty for non-admins | `Metrics.jsonc` read = admin; analytics pages | Either aggregate publicly-safe metrics into a view entity or gate the pages | Non-admin analytics page shows real, permitted data | P1 |
| INC-005 | Incorrect | `SageItemRaw` stores 36 positional `col_N` fields | Unqueryable, unreportable, fragile to source changes | `SageItemRaw.jsonc` | Replace with semantic schema | Named columns exist; a by-field query returns expected values | P2 |
| INC-006 | Incorrect | Prices stored as strings (`PIMFItem.Price Inclusive/Exclusive`) | Cannot compute reliably; sorting/aggregation wrong | `PIMFItem.jsonc` | Migrate to numeric; keep display format separately | Price arithmetic works without casting | P2 |
| INC-007 | Incorrect | Duplicated subscription entities with no canonical owner | Data splits across three tables; reports conflict | `Subscription`/`SubscriptionBox`/`BoxSubscription` | Designate canonical plan + instance entities | One plan source; instances reference it | P2 |
| INC-008 | Incorrect | Status vocabularies diverge across entities | Cross-entity reporting and queueing impossible | Section 6 status taxonomy | Publish shared enumerations | A single `PAYMENT_STATE` vocabulary is used app-wide | P2 |
| INC-009 | Incorrect | No duplicate-prevention on imports (brands, products, suppliers) | Silent duplication compounds over time | `scheduledSheetSync` upsert is keyed only where a key exists | Natural-key lookup before create | Re-running an import creates zero duplicates | P1 |

### Misleading representations

| ID | Category | Finding | Why it matters | Evidence | Recommended fix | Acceptance criteria | Priority |
|---|---|---|---|---|---|---|---|
| MSE-001 | Misleading | Build-studio copy claims "Real data · No mocks" while analytics surfaces use sample datasets | Users cannot tell live from illustrative; erodes trust in every number shown | `HotStackHeader.jsx` ("Real data · No mocks"), `HotStackGenerator.jsx` ("No mock data"), `CodenestAnalytics.jsx` (sample datasets) | Either wire the datasets to real sources or label them "sample"; remove absolute claims until true | Copy matches data provenance in all cases | P0 |
| MSE-002 | Misleading | 20 pages render entirely from in-file constants but present as operational screens | A user believes the screen reflects the business when it is static | Pages with no data-layer calls (list below) | Add visible "static preview / not connected" banners, or connect to entities | Every such page states its data source | P1 |
| MSE-003 | Misleading | BushPortal presents masked live API keys | Implies keys are browseable; confusing and risky by example | `BushPortal.jsx` | Replace with server-fetched metadata | No key-like strings rendered | P1 |
| MSE-004 | Misleading | Checkout "Order Confirmed" screen can appear for demo/unpaid orders | Buyer is told payment succeeded when it did not | `Checkout.jsx` demo branch + confirmation copy | Differentiate confirmed vs pending; state payment status honestly | Confirmation copy reflects true `paymentStatus` | P0 |
| MSE-005 | Misleading | Marketplace Blueprint asserts "KEYS EXIST — PAYSTACK_SECRET_KEY + PUBLIC_KEY" and "Ready for immediate checkout activation" | Presents configuration as done when it is unverified | `MarketplaceBlueprint.jsx` | Replace assertions with a live configuration-status check | Blueprint reports actual set/not-set state | P1 |

**Pages rendering with no data-layer calls (MSE-002 evidence):** `Analytics`, `BaobabTree`, `BlockBox`, `BlockVault`, `BrandNodeExplorer`, `BushPortal`, `CSVImport`, `CareGrainsMap`, `CodeNestDashboard`, `CollaborationSuite`, `FruitfulKiosk`, `FruitfulWordPressDocs`, `Gallery`, `HotStack`, `LegalDocuments`, `OAuthConsent`, `PulseTradeAnalytics`, `ShananaCheckout`, `Wishlist`, `coffee/KioskLandedCost`.

---

## 9. Ecosystem Integration Map

Connection status is strictly one of: `CONFIRMED CONNECTED` · `PARTIALLY EVIDENCED` · `REFERENCED ONLY` · `NO EVIDENCE OF CONNECTION` · `NOT APPLICABLE`.

| System / repository / service | Relevance to app | Connection status | Minimum data contract | Auth boundary | Risks | Recommended action | Priority | Evidence required |
|---|---|---|---|---|---|---|---|---|
| Google Sheets (`googlesheets` connector) | Brand/coffee/food/barcode source data | `PARTIALLY EVIDENCED` — `syncSheetMetrics` calls `connectors.getConnection('googlesheets')`; connector config file present | Spreadsheet id + range → typed rows per entity | OAuth connector, service role, server-side only | Sheets as de-facto source of truth; silent failures; header drift | Keep as import source only; add schema validation + provenance stamps; surface sync status | P1 | A live sync run producing rows with `lastSyncedAt` updated |
| Paystack | Payment processing | `PARTIALLY EVIDENCED` — client inline JS, `checkPaystackTransactions`, `PaymentTransaction` entity; **no webhook** | Transaction reference ↔ order id; signed webhook payload → payment state | `PAYSTACK_SECRET_KEY` server-side only; public key client-side | No server verification (SEC-004); key validity unverified | Add webhook; treat Paystack as the payment system of record | P0 | A verified webhook event applied idempotently |
| Supabase (`FruitfulGlobalPlanet-2026`, `-superbase`) | Possible system of record for brands/subnodes/orders | `NO EVIDENCE OF CONNECTION` to this app | `brands`/`subnodes`/`orders` table contract | Would need server-side key + RLS | Duplicate source of truth with Base44 entities; the RLS-disabled tables are an external risk | Decide the single system of record (recommend Base44 app OR Supabase, not both); do not connect until decided | P1 (decision) | A documented decision plus a read-only contract test |
| GitHub (`heyns1000`, `Fruitful-Global-Planet`) | Code/asset provenance; WordPress plugin source (`banimal` PRs #34/#41/#43 referenced) | `REFERENCED ONLY` — intake lists 109 + 16 repos; e-mail subjects reference Banimal WordPress Core plugin PRs | Repo → product mapping; release/version metadata | GitHub OAuth or app token, server-side | Repo names ≠ deployed products; 15 private repos; ownership unverified | Do **not** connect until a repo→product mapping is agreed; then read-only metadata | P2 | Confirmed repo→deployment mapping |
| WordPress (2 sites) | Publishing surface for Fruitful/Banimal | `REFERENCED ONLY` — intake lists `explorerecosystem-naqwf.wordpress.com`, `heyns1000.wordpress.com`; app hosts a WordPress/Elementor blueprint page | Brand/product read contract → Elementor widgets | WordPress plugin server-side token | Duplicates the app's own content; site-scoped MCP plan-gated | Treat the blueprint page as design guidance; connect only when a real site is nominated | P2 | A named site + plugin install |
| Shopify (1 store) | Commerce channel | `REFERENCED ONLY` | Product/order sync contract | Shopify admin API token, server-side | Order duplication with Base44 `Order`; store ownership unverified | Defer until order source-of-truth is resolved | P2 | Store ↔ app order mapping decision |
| Monday (workspace/board) | Ops/project tracking | `REFERENCED ONLY` | Board item ↔ task contract | Monday API token | Owner account differs from primary identity (intake) | Defer; consider as ops-queue source later | P3 | Documented owner confirmation |
| Ticket Tailor | Events/ticketing | `REFERENCED ONLY` | Event → listing contract | API token | Currency USD vs app ZAR; no products inventoried | Defer | P3 | Event inventory |
| Google Drive | Documents (NDAs, financial models) | `REFERENCED ONLY` (intake 20 hits); app has an internal Asset Library instead | File metadata → asset contract | Drive OAuth (previously declined) | Duplicate with `AssetLibrary` entity | Keep app-internal asset library; do not connect Drive | P3 | — |
| Cloudflare / Vercel | Hosting/deploy surfaces | `REFERENCED ONLY` / `NO EVIDENCE OF CONNECTION` — intake reports Cloudflare invalid auth and no Vercel read tool | N/A | N/A | Deployment state unknown | Clarify actual hosting path before any DevOps work | P2 | Valid deployment evidence |
| Cropster | Coffee ERP inventory | `PARTIALLY EVIDENCED` (proxy exists) | Lot id ↔ `cropsterLotId` | Client id/secret server-side | Credentials unverified | Keep as intended integration; surface config status | P2 | Successful authenticated call |
| Algrano | Green coffee procurement | `PARTIALLY EVIDENCED` (proxy exists) | Lot/shipment ↔ `GreenCoffeeReceipt` | API key server-side | Prior secret-management objections; credentials unverified | Keep as intended; resolve secret policy first | P2 | Successful authenticated call |
| Alibaba Cloud GPDB | Analytics warehouse | `PARTIALLY EVIDENCED` (proxy exists, HMAC signing implemented) | Query → result contract | Access key id/secret server-side | Credentials unverified | Keep as intended; surface config status | P3 | Successful authenticated call |
| BlockVault (`blockboxvault.base44.app`) | Vault entity store | `PARTIALLY EVIDENCED` (proxy exists, admin-guarded) | Entity CRUD contract | `BLOCKVAULT_API_KEY` server-side | Intake reports upstream read-only permission issue | Verify upstream key scope before relying on it | P2 | Successful create operation |
| Base44 CodeNest / HotStack | AI build studio | `NOT APPLICABLE` (in-app feature, not external) | — | — | — | — | — | — |

**Do not "connect everything."** Only Sheets (P1, exists), Paystack (P0, fix verification), and the three coffee/vault proxies (P2, already scaffolded) justify near-term work. Supabase, Shopify and WordPress all create a **duplicate source of truth** and must wait for an explicit canonical-owner decision.

---

## 10. Prioritized Remediation Backlog

### P0 — Block production or create material risk

| ID | Priority | Title | Problem | Proposed change | Dependencies | Acceptance criteria | Test method | Owner role | Effort | Evidence link |
|---|---|---|---|---|---|---|---|---|---|---|
| P0-1 | P0 | Enable buyer order creation | `Order.create` is admin-only; checkout fails for buyers | Owner-scope `Order.create` for authenticated users; route guest checkout through a server function | RLS capability | Non-admin buyer completes checkout and can read their own order | Manual checkout as `user` role; assert row exists & is readable | Backend + security | S | `Order.jsonc`, `Checkout.jsx` |
| P0-2 | P0 | Add Paystack webhook + server-side verification | No webhook; paid state is client-asserted | Create a signature-verifying webhook function using `PAYSTACK_SECRET_KEY`; it becomes the sole writer of confirmed payment/order state | P0-3 | Tampered signature rejected; valid event applied exactly once | Replay same event twice → one state change; tamper signature → 401 | Backend | M | `base44/functions` (absence) |
| P0-3 | P0 | Make payment records server-authoritative | `Payment`/`PaymentTransaction` create is admin-only | Create/update payment rows only inside the webhook function using service role | P0-2 | Exactly one `Payment` row per successful transaction, created by server | Gateway sandbox payment → assert single row | Backend | S | `Payment.jsonc` |
| P0-4 | P0 | Remove false "live data" claims | "Real data · No mocks" shown over sample datasets | Label sample data as sample; delete absolute claims until true | None | No page claims real data while rendering constants | Grep + visual review of listed pages | Frontend | S | `HotStackHeader.jsx`, `CodenestAnalytics.jsx` |
| P0-5 | P0 | Stop confirming unpaid orders | Demo mode creates confirmed orders | Environment-gate demo mode; demo orders are `paymentStatus: pending`; confirmation copy reflects true state | P0-2 | With no public key in prod config, no `confirmed` order is creatable | Force demo mode; assert resulting status | Frontend + backend | S | `Checkout.jsx` |

### P1 — Needed for a credible pilot

| ID | Priority | Title | Problem | Proposed change | Dependencies | Acceptance criteria | Test method | Owner role | Effort | Evidence link |
|---|---|---|---|---|---|---|---|---|---|---|
| P1-1 | P1 | Restrict public reads on sensitive entities | 25 entities publicly readable incl. supplier/cost/licence data | Set `read` to owner/admin for `SupplierProfile`, `GreenCoffeeReceipt`, `CoffeeCostInput`, `CoffeeProjection`, `KioskShippingEstimate`, `SageCostRow`, `PIMFItem`, `DirectoryEntry`, `ScrollLicense`, `ScrollProject`, `ChangeRequest`, `AutomationRule`, `ArtisanProfile`, `AssetLibrary` | RLS capability | Anonymous read of each returns no rows | Unauthenticated fetch per entity → empty/403 | Security | M | Schema scan |
| P1-2 | P1 | Add `AuditEvent` trail | Only `Order` has partial history | Add `AuditEvent` entity + writer on all mutations | None | Any brand financial edit creates one audit row with actor + before/after | Edit a brand → assert audit row | Backend | M | Schema review |
| P1-3 | P1 | Add provenance/freshness fields | Users cannot distinguish live vs imported | Add `provenance`, `source_system`, `imported_at`, `is_estimated`; render in UI | None | Imported records display provenance badge | Import → assert badge | Full-stack | M | Section 6 |
| P1-4 | P1 | Add `Lead` entity + endpoint | No enquiry capture | Add `Lead` entity and a narrow rate-limited server endpoint | Functions plan | Submitted form creates one `Lead` with source | Submit form → assert row | Full-stack | M | Section 5 |
| P1-5 | P1 | Guard secrets in admin UI | `BanimalAdmin` binds a secret key in browser state | Replace with read-only instruction panel | None | No `*_SECRET_KEY` state field in source | Grep + manual review | Frontend | S | `BanimalAdmin.jsx` |
| P1-6 | P1 | Duplicate-prevention on import | Imports can silently duplicate | Natural-key lookup before create in `scheduledSheetSync` | Functions plan | Re-running import creates zero duplicates | Run import twice → row count stable | Backend | M | `scheduledSheetSync/entry.ts` |
| P1-7 | P1 | Label static pages | 20 pages present constants as live | Add data-source banner or connect to entities | None | Each such page states its data source | Visual review | Frontend | M | Section 8 |
| P1-8 | P1 | Decide single system of record | Base44 entities vs Supabase tables overlap | Owner decision; document canonical source per domain | None | Written decision doc per domain | Review | Owner | S | Section 9 |
| P1-9 | P1 | Restore automation capability | Workflow + 7 functions cannot run on current plan | Upgrade workspace plan, then validate `scheduledSheetSync` with provenance + validation | Plan upgrade | Daily 02:00 sync completes and stamps `lastSyncedAt` | Force-run workflow | Owner | S | Plan limitation |
| P1-10 | P1 | Fix analytics data access | `Metrics` admin-only vs public dashboards | Add a permitted aggregate view or gate pages | RLS capability | Non-admin analytics shows permitted data | Load as `user` role | Backend | M | `Metrics.jsonc` |

### P2 — Needed for scalable operations

| ID | Priority | Title | Problem | Proposed change | Dependencies | Acceptance criteria | Test method | Owner role | Effort | Evidence link |
|---|---|---|---|---|---|---|---|---|---|---|
| P2-1 | P2 | Canonical product spine | Product truth split across 4 entities | One `Product` (unique `sku`); sources map in via contract | P1-8 | A SKU resolves to exactly one product card | SKU lookup | Architect | L | Section 6 |
| P2-2 | P2 | Collapse subscription trio | 3 overlapping entities | Designate plan + instance entities; migrate | P1-8 | One plan source; instances reference it | Data audit | Architect | M | Section 6 |
| P2-3 | P2 | Semantic `SageItemRaw` schema | 36 positional columns | Replace with named fields | Import mapping | By-field query works | Query test | Backend | M | `SageItemRaw.jsonc` |
| P2-4 | P2 | Numeric price fields | Prices as strings | Migrate to numbers | Data migration | Arithmetic without casting | Unit test | Backend | S | `PIMFItem.jsonc` |
| P2-5 | P2 | Ops exception queue | Failures surface nowhere | `OpsEvent` + queue view | None | Failed sync appears in queue | Simulate failure | Full-stack | M | Section 5 |
| P2-6 | P2 | Integration config-status panel | Silent integration failures | Report set/not-set per integration | None | Each proxy shows its status | Toggle a secret | Full-stack | S | SEC-007 |
| P2-7 | P2 | In-app user/role management | No provisioning UI | Admin users screen | None | Admin invites user + sees pending | Invite flow | Full-stack | M | Section 5 |
| P2-8 | P2 | Standardise status vocabularies | Divergent statuses | Shared enumerations | None | One `PAYMENT_STATE` used app-wide | Grep + review | Architect | M | Section 6 |
| P2-9 | P2 | Layout consistency | 5 routes bypass layout | Wrap all routes uniformly | None | Every route has consistent nav | Route sweep | Frontend | S | SEC-011 |
| P2-10 | P2 | Token-based styling | Inline hex everywhere | Move to `index.css` tokens | None | No inline hex left | Grep | Frontend | M | SEC-012 |

### P3 — Useful enhancement

| ID | Priority | Title | Problem | Proposed change | Dependencies | Acceptance criteria | Test method | Owner role | Effort | Evidence link |
|---|---|---|---|---|---|---|---|---|---|---|
| P3-1 | P3 | Split oversized pages | 6 pages > 450 lines, one 874 | Extract section components | None | No page > 300 lines | Build + review | Frontend | M | `wc -l` results |
| P3-2 | P3 | Accessibility pass | Unverified a11y | Add labels, focus states, contrast checks | None | No critical a11y findings | Axe audit | Frontend | M | — |
| P3-3 | P3 | Empty/loading/error state audit | Consistency unverified | Standardise three states across data pages | None | Every data page has all three | Manual sweep | Frontend | M | — |
| P3-4 | P3 | Observability dashboard | No runtime insight | Error-rate + sync + payment metrics view | P2-5 | Dashboard shows live error rate | Load dashboard | Full-stack | M | — |

---

## 11. Recommended Target Architecture

| Layer | Recommendation | Evidence status |
|---|---|---|
| Front end | React + Vite + Tailwind + shadcn (unchanged), with strict token-based styling, all routes wrapped in one shared `Layout`, and oversized pages decomposed into section components | `PARTIALLY EVIDENCED` — stack present; consistency recommendations new |
| Backend / database | Base44 entities as the app's operational store; one canonical entity per concept; unique natural keys; numeric money fields; provenance fields on every record | `RECOMMENDED` (current model is `PARTIALLY EVIDENCED` and uneven) |
| Auth & RBAC | Platform auth; roles `admin` / `user` plus a future `artisan`; ownership by `created_by_id`/user-id, **not** email strings | `PARTIALLY EVIDENCED` — auth exists; ownership-by-email is `RECOMMENDED` to replace |
| Data model boundaries | Domain-isolated tables: Commerce (`Product`,`Order`,`Payment`,`Lead`), Coffee (`GreenCoffeeReceipt`,`SupplierProfile`,`CoffeeCostInput`), Vault (`Vault*`), CodeNest (`Scroll*`), Platform (`AuditEvent`,`SyncLog`, `OpsEvent`) | `RECOMMENDED` |
| Integration layer | Server-side proxy functions only; one function per external system; no generic path-forwarding proxy; every proxy returns a typed `not_configured` state | `PARTIALLY EVIDENCED` — proxies exist; the config-status contract is `RECOMMENDED` |
| Event / audit log | `AuditEvent` written on every mutation; `OpsEvent` for failures; `SyncLog` retained for imports | `RECOMMENDED` |
| File / document management | Keep the app-internal `AssetLibrary` for brand assets; private uploads via the private-file path; no external Drive dependency | `PARTIALLY EVIDENCED` — `AssetLibrary` exists |
| Observability | Runtime error log review + integration status panel + ops exception queue | `UNVERIFIED` — no observability surface evidenced |
| Deployment separation | Development / staging / production with configuration (not code) differences and a documented promotion path | `RECOMMENDED` — none evidenced |
| Backup & rollback | Documented backup schedule plus a tested restore procedure before any schema migration | `UNVERIFIED` |

---

## 12. Build Sequence

Ordered per the mandate's priority stack. Each step is designed to be independently verifiable.

1. **Truthful app state and product boundary.** Goal: state what the app is (and is not). Prereq: none. Deliverable: in-app "data source" labels on all static pages + a product-boundary statement. Acceptance: every static page declares its source. Dependency: none. Risk if skipped: users keep trusting invented numbers.
2. **Stop false "live data" claims.** Goal: remove absolute claims. Prereq: step 1 inventory. Deliverable: corrected copy. Acceptance: no page claims real data over constants. Risk: trust erosion continues.
3. **Buyer order creation (RLS).** Goal: checkout persists. Prereq: RLS guide loaded. Deliverable: owner-scoped `Order.create`. Acceptance: non-admin order persists + is readable. Risk: no revenue.
4. **Paystack webhook function.** Goal: verified payment state. Prereq: plan includes functions. Deliverable: signature-verifying function. Acceptance: idempotent + tamper-rejecting. Risk: unverifiable payments.
5. **Server-authoritative payment records.** Goal: trustworthy ledger. Prereq: step 4. Deliverable: service-role writers in the webhook. Acceptance: one row per transaction. Risk: reconciliation drift.
6. **Demo-mode gating.** Goal: no unpaid confirmations. Prereq: step 5. Deliverable: env-gated demo + honest status copy. Acceptance: prod cannot create confirmed unpaid orders. Risk: finance corruption.
7. **Secret handling in admin UI.** Goal: no secrets in browser state. Prereq: none. Deliverable: read-only instruction panel. Acceptance: no secret state field. Risk: secret exposure.
8. **Public read tightening.** Goal: close exposure. Prereq: RLS guide. Deliverable: owner/admin read scopes on listed entities. Acceptance: anonymous reads empty. Risk: data leakage/POPIA exposure.
9. **Role model & provisioning UI.** Goal: manageable access. Prereq: step 8. Deliverable: admin users screen. Acceptance: invite + role assign works. Risk: manual DB edits.
10. **Canonical data model decisions.** Goal: one source of truth per domain. Prereq: owner decision (P1-8). Deliverable: decision doc + entity plan. Acceptance: documented per domain. Risk: permanent duplication.
11. **Provenance & freshness fields.** Goal: users can trust data labelling. Prereq: step 10. Deliverable: fields + UI badges. Acceptance: imported rows show provenance. Risk: unlabelable data.
12. **Core workflow completion — order lifecycle.** Goal: pending→paid→fulfilled→delivered. Prereq: steps 3–6. Deliverable: full lifecycle with history. Acceptance: each transition recorded with actor/timestamp. Risk: ops blind spots.
13. **Audit trail (`AuditEvent`).** Goal: traceability. Prereq: step 12. Deliverable: entity + writers. Acceptance: any mutation produces one event. Risk: no governance evidence.
14. **Error handling & user-facing states.** Goal: no silent failures. Prereq: none. Deliverable: loading/empty/error across data pages. Acceptance: each has all three. Risk: users can't tell broken from empty.
15. **Ops exception queue + alerts.** Goal: failures become visible. Prereq: step 13. Deliverable: `OpsEvent` + queue. Acceptance: failed sync appears. Risk: invisible breakage.
16. **Lead capture endpoint.** Goal: commercial demand captured. Prereq: functions plan. Deliverable: `Lead` entity + endpoint. Acceptance: form → row with source. Risk: lost demand.
17. **Integration hardening.** Goal: proxies trustworthy. Prereq: steps 13–15. Deliverable: config-status panel + typed errors. Acceptance: status reflects reality. Risk: silent misconfiguration.
18. **Canonical product spine.** Goal: one product truth. Prereq: step 10. Deliverable: `Product` + source mappings. Acceptance: SKU→one card. Risk: conflicting catalogues.
19. **Deployment separation & observability.** Goal: safe releases. Prereq: steps 12–18. Deliverable: staging/prod configs, backup + tested rollback, metrics view. Acceptance: staging validated pre-prod; restore tested. Risk: unrecoverable incidents.
20. **UX refinement & scale features.** Goal: polish at scale. Prereq: all above. Deliverable: a11y pass, page decomposition, consistent theming. Acceptance: no critical a11y findings, pages < 300 lines. Risk: maintainability decay.

---

## 13. Questions Requiring Owner Decisions

| # | Decision needed | Why it is needed | Options | Recommended default | Consequence of delaying |
|---|---|---|---|---|---|
| Q1 | Which system is the canonical source of truth for brands, products and orders — this Base44 app, or Supabase (`FruitfulGlobalPlanet-2026`)? | Both hold overlapping concepts; connecting them without a decision guarantees conflicting records | (a) Base44 app, (b) Supabase, (c) Base44 for app data + Supabase read-only warehouse | (a) Base44 app owns operational data; Supabase becomes a downstream copy if needed | Every integration and dedupe decision stalls; duplication compounds |
| Q2 | Is guest (anonymous) checkout a requirement? | It determines RLS shape and whether a server function is required | (a) Authenticated only, (b) Guest allowed via server endpoint | (a) authenticated only for pilot | Order RLS cannot be finalised; P0-1 blocked |
| Q3 | Are the coffee procurement and supplier records commercially confidential? | 25 entities are currently world-readable | (a) Confidential (lock down), (b) Partly public (supplier names yes, terms no) | (a) confidential until reviewed | Data exposure continues |
| Q4 | Does the app target one persona (internal operator) or many (buyer, artisan, admin, public)? | 60 pages and mixed RLS suggest many personas, but no role model reflects it | (a) Internal ops first, (b) multi-persona with explicit roles | (a) internal ops first for pilot | Role model and IA keep fragmenting |
| Q5 | Is the workspace plan being upgraded to include backend functions? | 7 functions + the only workflow cannot run without it | (a) Upgrade, (b) reimplement as scheduled client actions (not advisable) | (a) upgrade | All automation and integration work stays inert |
| Q6 | Which WordPress site (if any) is the nominated integration target? | The blueprint page describes an architecture but no site is chosen | (a) `explorerecosystem-naqwf`, (b) `heyns1000`, (c) none yet | (c) none yet — keep as design guidance | WordPress work cannot begin safely |
| Q7 | Is the Shopify store intended to feed or receive orders from this app? | Determines order source-of-truth and duplication risk | (a) Shopify receives, (b) Base44 app is source, (c) unrelated | (c) unrelated until decided | Order duplication risk |
| Q8 | Who is the accountable owner of the Supabase RLS-disabled tables? | External security exposure with no owner identified | (a) same owner as this app, (b) separate owner | (a) same owner reviews immediately | Live public exposure persists |

---

## 14. Appendix: Evidence Ledger

| Evidence ID | Source type | Location | Claim supported | Confidence | Notes |
|---|---|---|---|---|---|
| APP-001 | App source | `src/App.jsx` | 60 routes bound; 30 via `pagesConfig` loop, 30 explicit; 5 routes unwrapped by Layout | CONFIRMED | Route table read directly |
| APP-002 | App source | `src/pages.config.js` | `mainPage: "Dashboard"`; 30 registered pages; `Layout` wired | CONFIRMED | File read directly |
| APP-003 | App source | `src/Layout.jsx` | Global banner, nav, cart icon, back button; providers wrap children | CONFIRMED | File read |
| APP-004 | App source | `src/lib/AuthContext.jsx` | App public-settings check drives `auth_required` / `user_not_registered`; `base44.auth.me()` verifies session | CONFIRMED | Auth logic read |
| APP-005 | App source | `src/pages` listing | 60 page modules (58 + 2 in `coffee/`) | CONFIRMED | Directory listing |
| APP-006 | App source | `src/components` listing | 36 domain component folders incl. `admin`, `payments`, `coffee`, `vaultmesh`, `codenest` | CONFIRMED | Directory listing |
| APP-007 | App source | `base44/functions` | 7 functions: `algranoProxy`, `alibabaGpdbProxy`, `blockVaultProxy`, `checkPaystackTransactions`, `cropsterProxy`, `scheduledSheetSync`, `syncSheetMetrics` | CONFIRMED | Listing + headers read |
| APP-008 | App source | `base44/workflows/HourlySheetSync.jsonc` | One workflow, name "Daily Sheet Sync", cron `0 2 * * *`, tz Africa/Johannesburg, calls `scheduledSheetSync` | CONFIRMED | JSON read |
| APP-009 | App source | `base44/agents` | One agent: `video_script_agent.jsonc` | CONFIRMED | Directory listing |
| APP-010 | App source | `base44/entities` scan | 43 entities; **all** declare an `rls` block (none missing) | CONFIRMED | Schema scan |
| APP-011 | App source | `base44/entities/*.jsonc` scan | 25 entities set `"read": null` (public read) | CONFIRMED | Enumerated list in Section 7 |
| APP-012 | App source | `Order.jsonc` | `create` admin-only; `read`/`update` scoped by `buyerEmail`/`artisanEmail` or admin | CONFIRMED | Full schema read |
| APP-013 | App source | `Payment.jsonc`, `PaymentTransaction.jsonc` | `create` admin-only; `read` scoped by email or admin | CONFIRMED | Schemas read |
| APP-014 | App source | `Checkout.jsx` | On success creates `Order` then `Payment`; demo branch creates order with no payment; uses `VITE_PAYSTACK_PUBLIC_KEY` | CONFIRMED | Source grep + read |
| APP-015 | App source | `components/payments/PaymentGateway.jsx` | Creates `Payment`; inline Paystack; demo fallback | CONFIRMED | Source grep |
| APP-016 | App source | `grep` across `base44/functions` | No `x-paystack-signature` / webhook handler present | CONFIRMED | Negative evidence |
| APP-017 | App source | `checkPaystackTransactions/entry.ts` | Read-only Paystack poller requiring logged-in user | CONFIRMED | Header read |
| APP-018 | App source | `blockVaultProxy/entry.ts` | Admin-guarded; forwards to `blockboxvault.base44.app/api/entities`; needs `BLOCKVAULT_API_KEY` | CONFIRMED | Header read |
| APP-019 | App source | `syncSheetMetrics/entry.ts` | Uses `base44.asServiceRole.connectors.getConnection('googlesheets')` | CONFIRMED | Header read |
| APP-020 | App source | `scheduledSheetSync/entry.ts` | Generic upsert by key field; lists up to 500 existing | CONFIRMED | Header read |
| APP-021 | App source | `alibabaGpdbProxy/entry.ts` | HMAC-signed Alibaba GPDB REST proxy; `secrets` from runtime | CONFIRMED | Header read |
| APP-022 | App source | `BanimalAdmin.jsx` | Browser state includes `PAYSTACK_SECRET_KEY` field | CONFIRMED | Source grep |
| APP-023 | App source | `BushPortal.jsx` | Masked `bsk_live_••••` constants rendered in client | CONFIRMED | Source grep |
| APP-024 | App source | `MarketplaceBlueprint.jsx` | Asserts "KEYS EXIST" / "Ready for immediate checkout activation" | CONFIRMED | Source grep |
| APP-025 | App source | `HotStackHeader.jsx`, `HotStackGenerator.jsx`, `HotStackPrompt.jsx` | Copy: "Real data · No mocks", "No mock data" | CONFIRMED | Source grep |
| APP-026 | App source | `CodenestAnalytics.jsx` | Uses sample datasets for charts | CONFIRMED | File summary + read |
| APP-027 | App source | `grep -rl base44.entities src` | 98 source files reference the entity SDK | CONFIRMED | Count |
| APP-028 | App source | `grep` for data-layer calls in pages | 20 pages make no `entities/functions/integrations/agents` calls | CONFIRMED | Enumerated in Section 8 |
| APP-029 | App source | `grep -rl InvokeLLM src` | 25 files use the LLM integration | CONFIRMED | Count |
| APP-030 | App source | `index.html` | Loads Paystack inline JS; title "FAA.ZONE™ — Seedwave Admin"; manifest + favicon | CONFIRMED | File read |
| APP-031 | App source | `base44/config.jsonc` | App name "FRUITFUL" | CONFIRMED | File read |
| APP-032 | App source | `KioskLandedCost.jsx` | **Does** `export default function KioskLandedCost()` — contradicts reported import error | CONTRADICTED | Tooling report vs source |
| BASE44-001 | Platform config | Workspace context | Plan excludes backend functions; 7 functions + workflow not executable | CONFIRMED | Platform-provided |
| BASE44-002 | Platform config | Workspace context | Published URL `https://fruitfulapp.base44.app` | CONFIRMED | Platform-provided |
| INTAKE-001 | Intake file | Executive receipt | 10 record-bearing systems reached; 419 records indexed at metadata level | CONFIRMED (as intake) | Not independently verified |
| INTAKE-002 | Intake file | Critical routing queue | `samfox_prints`/`grand_paintings`/`bashedi_kidswear` RLS disabled on `FruitfulGlobalPlanet-2026` | CONFIRMED (as intake) | Recorded as external routing item |
| INTAKE-003 | Intake file | Critical routing queue | Credential-bearing Gmail reference `MAIL-1a0a456cf55d1e92` (value omitted) | CONFIRMED (as intake) | No value reproduced |
| INTAKE-004 | Intake file | Critical routing queue | Cloudflare invalid auth header; Slack search blocked; WordPress MCP plan-gated; Vercel no read tool | CONFIRMED (as intake) | Access limitations |
| INTAKE-005 | Intake file | Critical routing queue | `codenest` PR 111 merged with 0 changed files; `omnigrid` PR 35 merged with 491 additions | CONFIRMED (as intake) | Factual contradiction logged |
| INTAKE-006 | Intake file | Critical routing queue | Claims of 13,713 brands / 77 sectors not established by the index | CONFIRMED (as intake) | Contradicts internal copy claims |
| REPO-001 | Intake file | Canonical index | 109 `heyns1000` repositories incl. 15 private; notable: `codenest`, `fruitful`, `fruitfulapp`, `omnigrid`, `seedwave`, `banimal`, `faa.zone` | CONFIRMED (as intake) | Repo ≠ deployment |
| REPO-002 | Intake file | Canonical index | `Fruitful-Global-Planet` org with 16 listed repos | CONFIRMED (as intake) | Ownership of corporate entity unverified |
| DB-001 | Intake file | Canonical index | Supabase projects: 6 total, 2 active (`FruitfulGlobalPlanet-2026`, `-superbase`) | CONFIRMED (as intake) | — |
| DB-002 | Intake file | Canonical index | `public.brands`, `public.subnodes`, `public.orders` report 0 rows; RLS enabled | CONFIRMED (as intake) | — |
| DB-003 | Intake file | Canonical index | `public.samfox_prints` (10), `grand_paintings` (1), `bashedi_kidswear` (43); RLS DISABLED | CONFIRMED (as intake) | External routing item |
| COMM-001 | Intake file | Canonical index | Shopify store `accio-master-bafana.myshopify.com` active (ZAR/SAST) | CONFIRMED (as intake) | No app connection evidence |
| COMM-002 | Intake file | Canonical index | Ticket Tailor store `st_77422` (USD) | CONFIRMED (as intake) | No app connection evidence |
| COMM-003 | Intake file | Canonical index | Monday workspace `7703418`, board `5104516750`; owner account differs | CONFIRMED (as intake) | Identity relationship inferred only |
| COMM-004 | Intake file | Canonical index | Two WordPress sites: `explorerecosystem-naqwf`, `heyns1000` | CONFIRMED (as intake) | Site-scoped MCP plan-gated |

---

*This report is an evidence-led audit snapshot. It distinguishes confirmed implementation from references, inference, and unverified intent. No system changes were made as part of this audit.*