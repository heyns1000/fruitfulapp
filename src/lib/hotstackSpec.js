/* =========================================================================
   HotStack™ Spec Engine
   Turns the user's prompt + selected ecosystem brands into a live app
   blueprint, INSTANTLY (pure, synchronous, no network). This is what powers
   the immediate visual preview — every keystroke / brand selection re-derives
   the spec so the preview always reflects the user's personal brand vision.
   ========================================================================= */

/* Fruitful CI is the chrome; each sector keeps its ecosystem accent so the
   preview is "brand realised" to whatever the user stacks. */
export const SECTOR_META = {
  agriculture:      { label: 'Agriculture',   accent: '#16a34a' },
  fsf:              { label: 'Food & Soil',   accent: '#22c55e' },
  banking:          { label: 'Banking',       accent: '#0ea5e9' },
  creative:         { label: 'Creative',      accent: '#8b5cf6' },
  logistics:        { label: 'Logistics',     accent: '#f97316' },
  'education-ip':   { label: 'Education IP',  accent: '#eab308' },
  fashion:          { label: 'Fashion',       accent: '#ec4899' },
  gaming:           { label: 'Gaming',        accent: '#6366f1' },
  health:           { label: 'Health',        accent: '#14b8a6' },
  housing:          { label: 'Housing',       accent: '#64748b' },
  justice:          { label: 'Justice',       accent: '#f59e0b' },
  knowledge:        { label: 'Knowledge',     accent: '#06b6d4' },
  micromesh:        { label: 'Micromesh',     accent: '#84cc16' },
  media:            { label: 'Media',         accent: '#ef4444' },
  nutrition:        { label: 'Nutrition',     accent: '#22c55e' },
  'ai-logic':       { label: 'AI Logic',      accent: '#0d9488' },
  packaging:        { label: 'Packaging',     accent: '#f97316' },
  quantum:          { label: 'Quantum',       accent: '#0ea5e9' },
  ritual:           { label: 'Ritual',        accent: '#d946ef' },
  saas:             { label: 'SaaS',          accent: '#f59e0b' },
  trade:            { label: 'Trade',         accent: '#d97706' },
  utilities:        { label: 'Utilities',     accent: '#10b981' },
  voice:            { label: 'Voice',         accent: '#ec4899' },
  webless:          { label: 'Webless',       accent: '#22d3ee' },
  nft:              { label: 'NFT / IP',      accent: '#8b5cf6' },
  'education-youth':{ label: 'Youth Edu',     accent: '#facc15' },
  zerowaste:        { label: 'Zero Waste',    accent: '#34d399' },
  professional:     { label: 'Professional',  accent: '#3b82f6' },
  'payroll-mining': { label: 'Payroll',       accent: '#f59e0b' },
  mining:           { label: 'Mining',        accent: '#a16207' },
  wildlife:         { label: 'Wildlife',      accent: '#65a30d' },
};

export const FRUITFUL_TEAL = '#0d9488';
export const HOTSTACK_EMBER = '#f97316';

export const APP_TYPES = [
  { val: 'webapp',      label: 'Web App' },
  { val: 'marketplace', label: 'Marketplace' },
  { val: 'dashboard',   label: 'Dashboard' },
  { val: 'website',     label: 'Website' },
  { val: 'mobile',      label: 'Mobile App' },
];

export const VIBE_TEMPLATES = [
  { label: 'Artisan Marketplace', type: 'marketplace', prompt: 'A premium artisan marketplace connecting heritage craft makers with conscious buyers — artisan profiles, product galleries, subscription boxes and loyalty rewards.' },
  { label: 'Cross-Sector Hub',    type: 'dashboard',   prompt: 'An ecosystem dashboard showing cross-pollination between agriculture, fashion and logistics brands — synergy scoring, collaboration proposals and unified analytics.' },
  { label: 'Creative Studio',     type: 'webapp',      prompt: 'A creative studio platform for artists to showcase work, sell digital products, manage commissions and collaborate with brands.' },
  { label: 'Loyalty Engine',      type: 'webapp',      prompt: 'A loyalty and rewards platform where members earn points across every brand, unlock tier benefits and redeem curated artisan offers.' },
  { label: 'Sub Box Platform',    type: 'marketplace', prompt: 'A subscription box platform where artisans curate monthly collections — gifting, customisation, subscriber dashboards and shipping management.' },
  { label: 'B2B Collaboration',   type: 'webapp',      prompt: 'A B2B collaboration suite for ecosystem brands to propose joint ventures, co-brand products, share data and track synergy metrics.' },
];

const titleCase = (s) =>
  s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());

export function deriveAppName(appName, prompt) {
  if (appName && appName.trim()) return appName.trim();
  const clean = (prompt || '').replace(/[^a-zA-Z ]/g, ' ').trim();
  if (!clean) return 'Untitled Stack';
  const words = clean.split(/\s+/).filter((w) => w.length > 2).slice(0, 3);
  return words.length ? titleCase(words.join(' ')) : 'Untitled Stack';
}

const PAGES_BY_TYPE = {
  webapp:      ['Home', 'Dashboard', 'Activity', 'Settings'],
  marketplace: ['Storefront', 'Collections', 'Cart', 'Orders', 'Account'],
  dashboard:   ['Overview', 'Analytics', 'Reports', 'Team'],
  website:     ['Home', 'About', 'Services', 'Contact'],
  mobile:      ['Home', 'Explore', 'Activity', 'Profile'],
};

const SECTIONS_POOL = [
  'Hero banner', 'Featured grid', 'Live metrics', 'Activity feed',
  'Quick actions', 'Search & filter', 'Detail cards', 'Timeline',
  'Recommendations', 'Notifications',
];

/**
 * Derive a complete, preview-ready app spec from the user's inputs.
 * Pure & synchronous — safe to call on every render.
 */
export function deriveAppSpec({ prompt = '', brands = [], appName = '', appType = 'webapp', roles = ['admin', 'member'] }) {
  const name = deriveAppName(appName, prompt);
  const sectors = [...new Set(brands.map((b) => b.sector).filter(Boolean))];
  const primarySector = sectors[0] || 'ai-logic';
  const accent = SECTOR_META[primarySector]?.accent || FRUITFUL_TEAL;

  const totalNodes = brands.reduce((s, b) => s + (b.subnodes?.length || 0), 0);

  const tagline = sectors.length
    ? `A ${APP_TYPES.find((t) => t.val === appType)?.label.toLowerCase() || 'app'} uniting ${sectors
        .slice(0, 3)
        .map((s) => SECTOR_META[s]?.label || s)
        .join(', ')}${sectors.length > 3 ? ' & more' : ''}.`
    : 'Describe your idea and stack brands to shape your app.';

  // Base pages by type + one page per stacked sector
  const basePages = PAGES_BY_TYPE[appType] || PAGES_BY_TYPE.webapp;
  const sectorPages = sectors.slice(0, 4).map((s) => `${SECTOR_META[s]?.label || s} Hub`);
  const pageNames = [...basePages, ...sectorPages];

  const pages = pageNames.map((pn, i) => ({
    name: pn,
    route: '/' + pn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `The ${pn} experience for ${name}.`,
    sections: SECTIONS_POOL.slice(i % 4, (i % 4) + 3 + (i % 2)),
  }));

  // Features derived from brands (real names)
  const features = brands.slice(0, 8).map((b) => ({
    name: `${b.name} integration`,
    description: (b.description || `Powered by ${b.name}.`).slice(0, 90),
    sector: b.sector,
    accent: SECTOR_META[b.sector]?.accent || accent,
  }));

  // Cross-pollination pairs
  const crossPollination = [];
  for (let i = 0; i < brands.length - 1 && crossPollination.length < 4; i++) {
    const a = brands[i];
    const b = brands[i + 1];
    if (a.sector !== b.sector) {
      crossPollination.push({
        brand1: a.name,
        brand2: b.name,
        feature: `${SECTOR_META[a.sector]?.label || a.sector} × ${SECTOR_META[b.sector]?.label || b.sector} bridge`,
        synergyScore: 60 + ((i * 13) % 40),
      });
    }
  }

  const kpis = [
    { label: 'Pages', value: pages.length, sub: 'generated' },
    { label: 'Features', value: features.length, sub: 'active' },
    { label: 'Brands', value: brands.length, sub: 'stacked' },
    { label: 'Nodes', value: totalNodes, sub: 'wired' },
  ];

  const techStack = {
    frontend: ['React', 'Vite', 'Tailwind CSS'],
    backend: ['Base44 SDK', 'Serverless Functions'],
    database: 'FAA.ZONE Entities',
  };

  const databaseSchema = [
    { tableName: 'User', fields: ['id', 'name', 'email', 'role'] },
    { tableName: 'Brand', fields: ['id', 'name', 'sector', 'subnodes'] },
    ...(appType === 'marketplace'
      ? [{ tableName: 'Order', fields: ['id', 'user_id', 'items', 'total', 'status'] }]
      : []),
  ];

  return {
    appName: name,
    tagline,
    appType,
    roles,
    accent,
    sectors,
    primarySector,
    pages,
    features,
    crossPollination,
    kpis,
    techStack,
    databaseSchema,
    brands,
    generatedAt: new Date().toISOString(),
  };
}

/* ---------- Export helpers ---------- */
export function downloadBlob(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function specToReadme(spec) {
  return `# ${spec.appName}
> ${spec.tagline}

Generated by HotStack™ · FAA.ZONE · ${new Date(spec.generatedAt).toLocaleDateString()}

## Stacked Brands
${spec.brands.map((b) => `- **${b.name}** (${b.sector}) · ${b.subnodes?.length || 0} subnodes`).join('\n') || '- none'}

## Pages
${spec.pages.map((p) => `### ${p.name} \`${p.route}\`\n${p.description}`).join('\n\n')}

## Stack
- Frontend: ${spec.techStack.frontend.join(', ')}
- Backend: ${spec.techStack.backend.join(', ')}
- Database: ${spec.techStack.database}
`;
}

export function specToReactStarter(spec) {
  return `// ${spec.appName} — React starter generated by HotStack™
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const THEME = { primary: '${FRUITFUL_TEAL}', accent: '${spec.accent}' };
export const ROLES = ${JSON.stringify(spec.roles)};

function App() {
  return (
    <BrowserRouter>
      <Routes>
${spec.pages.map((p) => `        <Route path="${p.route}" element={<div>{/* ${p.name} */}</div>} />`).join('\n')}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`;
}
