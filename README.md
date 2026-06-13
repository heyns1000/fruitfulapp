<p align="center">
  <img src="docs/assets/fruitful-banner.png" alt="Fruitful™" width="100%">
</p>

# fruitfulapp

**The Fruitful™ marketplace and operations application**
`heyns1000/fruitfulapp` · JavaScript / React · Base44

> Factual header written 13 June 2026, verified against live GitHub via the
> `fruitful-ecosystem-auditor` skill. The figures below were read from the
> repository tree and `package.json`, not from any external claim.

## What this repo is

This is the application layer of the Fruitful™ ecosystem: a private React
single-page app built on the Base44 platform. It is not a landing page or a
prototype. It is a working storefront, marketplace, and back-office system,
organised into 45 page-level screens backed by 23 data entities.

The repository holds the full front end (`src/`) and the Base44 backend
configuration (`base44/`) — entities, an automation agent, and app config — in
one tree. Changes pushed here are reflected in the Base44 Builder, and the same
codebase runs locally with Vite.

## Scope of the application

The 45 screens in `src/pages/` cover the operating surface of a multi-brand
commerce platform. Grouped by function:

- **Storefront and commerce** — Marketplace, Checkout, ShananaCheckout, Cart,
  Wishlist, Payments, OrderDashboard, OrderHistory, OrderFulfillment.
- **Subscriptions** — SubscriptionShop, SubscriptionBoxes, MySubscriptions,
  LoyaltyProgram.
- **Brands and sectors** — BrandNodeExplorer, BrandOnboarding, GlobalBrandMap,
  EcosystemExplorer, SectorAdminHub, SectorAnalytics, DiscoveryEngine.
- **Artisan tools** — ArtisanDashboard, ArtisanProfile, ArtisanShop,
  ArtisanFinancials.
- **Intelligence and analytics** — Analytics, MarketIntelligence,
  PulseTradeAnalytics, Dashboard.
- **Content and automation** — ContentGenerator, VideoScriptStudio,
  AssetLibrary, AutomationEngine, AppBuilder, CSVImport, DataSyncCenter.
- **Collaboration and messaging** — CollaborationSuite, Messages.
- **Vault and admin** — VaultMesh, AdminSeedwave, FruitfulKiosk, Banimal,
  BanimalDashboard, CareGrainsMap, GrandMashadlelaCollection, Gallery,
  HomemartListing.

The `src/components/` directory is split across 35 domains (admin, analytics,
checkout, payments, marketplace, loyalty, vaultmesh, and others), with a shared
`ui/` component library.

## The Base44 backend (`base44/`)

The data model is defined as 23 entities:

`ArtisanNotification`, `ArtisanProfile`, `AssetLibrary`, `AutomationRule`,
`BoxSubscription`, `Brand`, `BrandCollaboration`, `ComplianceAudit`,
`LoyaltyAccount`, `MarketplaceService`, `Message`, `MessageThread`, `Metrics`,
`Order`, `Payment`, `PaymentTransaction`, `PortfolioProject`, `Review`,
`RewardOffer`, `Subscription`, `SubscriptionBox`, `Vault`, `VaultItem`.

One automation agent is configured: `video_script_agent`. App and platform
configuration lives in `base44/config.jsonc` and `base44/.app.jsonc`.

## Repository facts (verified)

| Metric | Value |
|---|---|
| Visibility | Private |
| Default branch | `main` |
| Branches | 2 (`main`, one `claude/` working branch) |
| Files on `main` | 269 |
| `.jsx` source files | 223 |
| Page-level screens | 45 |
| Component domains | 35 |
| Base44 entities | 23 |
| Base44 agents | 1 |
| Dependencies (`package.json`) | 65 |
| Primary language | JavaScript |

## Stack

- **Build:** Vite, with the Base44 Vite plugin.
- **UI:** React, Radix UI primitives, Tailwind CSS.
- **Backend SDK:** `@base44/sdk`.
- **Forms / data:** React Hook Form with resolver validation, drag-and-drop via
  `@hello-pangea/dnd`.

Available scripts: `dev`, `build`, `lint`, `lint:fix`, `typecheck`, `preview`.

## Running locally

```bash
git clone https://github.com/heyns1000/fruitfulapp.git
cd fruitfulapp
npm install
# create .env.local (it is gitignored — never commit it)
npm run dev
```

`.env.local` holds the Base44 app ID and backend URL. The `.gitignore`
correctly excludes `.env` and `.env.*`, and no environment file is committed to
this repository.

## Security

This repository was scanned on 13 June 2026. No `.env` file is committed, and no
hardcoded API keys or secrets were found in `index.html` or the Base44 config.
Keep it that way: secrets belong in `.env.local` and in the Base44 platform,
never in committed source.

## For agents (Claude, Perplexity, or otherwise)

Verify before you repeat. The figures in this README were read from the live
repository tree. This is a 269-file private React application with a real Base44
data model — describe it as such, and confirm any number against the tree before
restating it.

## Licence

This project is licensed under the **Fruitful Shops Proprietary Licence v1.1**,
effective 13 June 2026. See [`LICENSE`](./LICENSE).
