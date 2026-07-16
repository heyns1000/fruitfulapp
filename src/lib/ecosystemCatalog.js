/* =========================================================================
   ECOSYSTEM CATALOG  —  FAA.ZONE™ / Fruitful™  (SINGLE SOURCE OF TRUTH)

   Injected & renovated from the FruitfulPlanetChange repository's Global Tech
   Marketplace system (13,713+ brands, GitHub-Marketplace style) and unified
   with this app's live ecosystem dataset (ALL_SECTOR_DATA / FAA_ZONE_INDEX).

   Everything commerce-facing — the Brand Marketplace, the entity/API fallback
   layer, cart pricing and checkout — reads brands and pricing from HERE, so the
   whole app stays in sync as ONE system.
   ========================================================================= */

import { ALL_SECTOR_DATA, FAA_ZONE_INDEX } from '@/components/data/AllSectorData';

/* ---------------------------------------------------------------------------
   1. SECTOR METADATA
   Display labels + canonical USD subscription pricing / tier names, injected
   verbatim from the reference repo's global-sector-pricing-integration.
--------------------------------------------------------------------------- */

const SECTOR_LABELS = {
  agriculture: 'Agriculture',
  fsf: 'Food, Soil & Farming',
  banking: 'Banking & Finance',
  creative: 'Creative Studio',
  logistics: 'Logistics & Supply',
  'education-ip': 'Education & IP',
  fashion: 'Fashion & Textile',
  gaming: 'Gaming & Play',
  health: 'Health & Wellbeing',
  housing: 'Housing & Build',
  justice: 'Justice & Legal',
  knowledge: 'Knowledge & Archives',
  micromesh: 'Micro-Mesh',
  media: 'Motion, Media & Rights',
  nutrition: 'Nutrition & Provenance',
  'ai-logic': 'AI & Logic',
  packaging: 'Packaging & Materials',
  quantum: 'Quantum & Research',
  ritual: 'Ritual & Culture',
  saas: 'SaaS & Platforms',
  trade: 'Trade & Markets',
  utilities: 'Utilities & Energy',
  voice: 'Voice & Audio',
  webless: 'Webless & IoT',
  nft: 'NFT & Digital IP',
  'education-youth': 'Youth Education',
  zerowaste: 'Zero Waste',
  professional: 'Professional Services',
  'payroll-mining': 'Payroll & Treasury',
  mining: 'Mining & Resources',
  wildlife: 'Wildlife & Conservation',
};

// Canonical USD pricing & tier names from the reference repo (source of truth).
const REFERENCE_PRICING = {
  agriculture: { monthly: 179.99, annual: 1799.99, tier: 'Growth' },
  fsf: { monthly: 159.99, annual: 1599.99, tier: 'Eco' },
  banking: { monthly: 299.99, annual: 2999.99, tier: 'Enterprise Plus' },
  creative: { monthly: 199.99, annual: 1999.99, tier: 'Creative Pro' },
  logistics: { monthly: 189.99, annual: 1899.99, tier: 'Operations' },
  'education-ip': { monthly: 169.99, annual: 1699.99, tier: 'Education' },
  fashion: { monthly: 149.99, annual: 1499.99, tier: 'Style' },
  gaming: { monthly: 229.99, annual: 2299.99, tier: 'Gaming Pro' },
  health: { monthly: 219.99, annual: 2199.99, tier: 'Healthcare' },
  housing: { monthly: 249.99, annual: 2499.99, tier: 'Infrastructure' },
  justice: { monthly: 279.99, annual: 2799.99, tier: 'Legal Pro' },
  knowledge: { monthly: 139.99, annual: 1399.99, tier: 'Archive' },
  micromesh: { monthly: 119.99, annual: 1199.99, tier: 'Micro' },
  media: { monthly: 209.99, annual: 2099.99, tier: 'Media Pro' },
  nutrition: { monthly: 129.99, annual: 1299.99, tier: 'Wellness' },
  'ai-logic': { monthly: 349.99, annual: 3499.99, tier: 'AI Enterprise' },
  packaging: { monthly: 159.99, annual: 1599.99, tier: 'Materials' },
  quantum: { monthly: 499.99, annual: 4999.99, tier: 'Quantum Elite' },
  ritual: { monthly: 109.99, annual: 1099.99, tier: 'Culture' },
  saas: { monthly: 199.99, annual: 1999.99, tier: 'SaaS Pro' },
  trade: { monthly: 189.99, annual: 1899.99, tier: 'Trade' },
  utilities: { monthly: 159.99, annual: 1599.99, tier: 'Infrastructure' },
  voice: { monthly: 179.99, annual: 1799.99, tier: 'Audio Pro' },
  webless: { monthly: 169.99, annual: 1699.99, tier: 'IoT' },
  nft: { monthly: 299.99, annual: 2999.99, tier: 'Blockchain' },
  'education-youth': { monthly: 129.99, annual: 1299.99, tier: 'Youth' },
  zerowaste: { monthly: 59.99, annual: 599.99, tier: 'Eco' },
  professional: { monthly: 239.99, annual: 2399.99, tier: 'Professional' },
  'payroll-mining': { monthly: 259.99, annual: 2599.99, tier: 'FinTech' },
  mining: { monthly: 279.99, annual: 2799.99, tier: 'Enterprise' },
  wildlife: { monthly: 149.99, annual: 1499.99, tier: 'Conservation' },
};

const SECTOR_BLURB = {
  agriculture: 'Precision agriculture, soil intelligence and yield tooling for the rural economy.',
  fsf: 'Food, soil and farming systems connecting growers to conscious markets.',
  banking: 'Compliant banking rails, payouts and financial infrastructure.',
  creative: 'Creative studio tooling for makers, writers and designers.',
  logistics: 'Route, track and fulfil across the ecosystem supply chain.',
  'education-ip': 'Education and IP protection for knowledge creators.',
  fashion: 'Heritage and modern fashion supply, from atelier to storefront.',
  gaming: 'Interactive gaming and play-to-earn ecosystem nodes.',
  health: 'Health, wellbeing and cognitive care platforms.',
  housing: 'Housing, construction and built-environment infrastructure.',
  justice: 'Legal, justice and compliance tooling.',
  knowledge: 'Global archives and knowledge management.',
  micromesh: 'Local and regional micro-mesh connectivity.',
  media: 'Media production, distribution and creative rights.',
  nutrition: 'Nutrition, provenance and wholesome supply.',
  'ai-logic': 'AI reasoning, automation and logic services.',
  packaging: 'Sustainable packaging and materials.',
  quantum: 'Quantum research and advanced computation.',
  ritual: 'Ritual, wellbeing and cultural practice.',
  saas: 'Software-as-a-service building blocks.',
  trade: 'Cross-border trade and marketplace rails.',
  utilities: 'Energy, water and utility infrastructure.',
  voice: 'Voice, audio and conversational interfaces.',
  webless: 'Webless / offline-first connectivity for the next billion.',
  nft: 'Digital IP, provenance and tokenised assets.',
  'education-youth': 'Youth education and skills development.',
  zerowaste: 'Circular, zero-waste operations.',
  professional: 'Professional services and advisory.',
  'payroll-mining': 'Payroll, treasury and resource finance.',
  mining: 'Mining, resources and extraction intelligence.',
  wildlife: 'Wildlife conservation and habitat protection.',
};

/** Parse a "$1,250" style fee into a number. */
function parseFee(str) {
  if (typeof str !== 'string') return 0;
  const n = Number(str.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** Deterministic small hash from a string (stable across reloads). */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * SECTOR_CATALOG — merged, canonical per-sector configuration.
 * Combines live index (glyph/region/tier/fees) with reference USD pricing.
 */
export const SECTOR_CATALOG = Object.keys(FAA_ZONE_INDEX).map((slug) => {
  const idx = FAA_ZONE_INDEX[slug] || {};
  const ref = REFERENCE_PRICING[slug];
  const monthlyUSD = ref ? ref.monthly : parseFee(idx.monthlyFee);
  const annualUSD = ref ? ref.annual : parseFee(idx.annualFee);
  const brandCount = (ALL_SECTOR_DATA?.[slug]?.brands || []).length;
  return {
    slug,
    label: SECTOR_LABELS[slug] || slug,
    glyph: idx.glyph || '',
    region: idx.region || 'Global',
    payoutTier: idx.payoutTier || 'B',
    tierName: ref ? ref.tier : 'Core',
    monthlyUSD,
    annualUSD,
    blurb: SECTOR_BLURB[slug] || 'FAA.ZONE ecosystem sector.',
    brandCount,
  };
});

const SECTOR_BY_SLUG = Object.fromEntries(SECTOR_CATALOG.map((s) => [s.slug, s]));

export function getSectorConfig(slug) {
  return SECTOR_BY_SLUG[slug] || null;
}

/* ---------------------------------------------------------------------------
   2. BRAND CATALOG
   Full brand list built from ALL_SECTOR_DATA. IDs and prices are DETERMINISTIC
   so cart items, product links and orders stay stable across reloads.
--------------------------------------------------------------------------- */

const INTEGRATIONS = ['Paystack', 'PayFast', 'PayPal', 'PulseTrade', 'TreatyMesh', 'ScrollGrid'];

function buildBrand(sectorSlug, name, index) {
  const cfg = SECTOR_BY_SLUG[sectorSlug];
  const subNodes = ALL_SECTOR_DATA?.[sectorSlug]?.subNodes?.[index];
  const seed = hash(`${sectorSlug}:${name}`);

  // Deterministic monthly price: sector base +/- up to ~18% variance, ".99" ending.
  const base = cfg?.monthlyUSD || 99;
  const variance = ((seed % 37) - 18) / 100; // -0.18 .. +0.18
  const monthly = Math.max(9, Math.round(base * (1 + variance)) - 0.01);
  const annual = Math.round(monthly * 10) - 0.01; // ~2 months free

  const popularity = 40 + (seed % 61); // 40..100
  const rating = (3.6 + ((seed % 14) / 10)).toFixed(1); // 3.6..4.9
  const installs = 200 + (seed % 900) * (1 + (seed % 9)); // pseudo installs
  const featured = seed % 11 === 0;
  const integrations = [
    INTEGRATIONS[seed % INTEGRATIONS.length],
    INTEGRATIONS[(seed >> 3) % INTEGRATIONS.length],
  ].filter((v, i, a) => a.indexOf(v) === i);

  return {
    id: `${sectorSlug}-${index}`,
    name,
    sector: sectorSlug,
    sectorLabel: cfg?.label || sectorSlug,
    glyph: cfg?.glyph || '',
    subnodes: Array.isArray(subNodes) ? subNodes : [],
    tags: [sectorSlug, `tier-${cfg?.payoutTier || 'B'}`, cfg?.tierName].filter(Boolean),
    description: cfg?.blurb || 'FAA.ZONE ecosystem brand.',
    tierName: cfg?.tierName || 'Core',
    payoutTier: cfg?.payoutTier || 'B',
    region: cfg?.region || 'Global',
    priceMonthly: monthly,
    priceAnnual: annual,
    currency: 'USD',
    popularity,
    rating: Number(rating),
    installs,
    featured,
    integrations,
    health_score: 70 + (seed % 30),
    metadata: {
      code: `${name.slice(0, 3).toUpperCase()}-${sectorSlug.slice(0, 3).toUpperCase()}-${1000 + (seed % 9000)}`,
      glyph: cfg?.glyph || '',
      monthlyFee: `$${monthly.toFixed(2)}`,
      annualFee: `$${annual.toFixed(2)}`,
      payoutTier: cfg?.payoutTier || 'B',
      region: cfg?.region || 'Global',
      activeNodes: 100 + (seed % 5000),
    },
    isSystemBrand: true,
    aiGenerated: false,
  };
}

let _catalog = null;

/** Full brand catalog across all sectors (memoized). */
export function getBrandCatalog() {
  if (_catalog) return _catalog;
  const out = [];
  for (const [slug, data] of Object.entries(ALL_SECTOR_DATA || {})) {
    const brands = data?.brands || [];
    for (let i = 0; i < brands.length; i++) {
      if (!brands[i]) continue;
      out.push(buildBrand(slug, brands[i], i));
    }
  }
  _catalog = out;
  return out;
}

/** Lightweight totals for hero stats. */
export function getCatalogStats() {
  const brands = getBrandCatalog();
  return {
    totalBrands: brands.length,
    totalSectors: SECTOR_CATALOG.length,
    totalNodes: brands.reduce((s, b) => s + (b.metadata?.activeNodes || 0), 0),
  };
}

export function formatUSD(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);
}
