// Centralized data store for CodeNest Dashboard — derived from uploaded spec files.
// Sectors, templates, API keys, companies, and sub-node definitions.

export const SECTOR_LIST = {
  "agriculture": { name: "🌱 Agriculture & Biotech" },
  "fsf": { name: "🥦 Food, Soil & Farming" },
  "banking": { name: "🏦 Banking & Finance" },
  "creative": { name: "🖋️ Creative Tech" },
  "logistics": { name: "📦 Logistics & Packaging" },
  "education-ip": { name: "📚 Education & IP" },
  "fashion": { name: "✂ Fashion & Identity" },
  "gaming": { name: "🎮 Gaming & Simulation" },
  "health": { name: "🧠 Health & Hygiene" },
  "housing": { name: "🏗️ Housing & Infrastructure" },
  "justice": { name: "⚖ Justice & Ethics" },
  "knowledge": { name: "📖 Knowledge & Archives" },
  "micromesh": { name: "☰ Micro-Mesh Logistics" },
  "media": { name: "🎬 Motion, Media & Sonic" },
  "nutrition": { name: "✿ Nutrition & Food Chain" },
  "ai-logic": { name: "🧠 AI, Logic & Grid" },
  "packaging": { name: "📦 Packaging & Materials" },
  "quantum": { name: "✴️ Quantum Protocols" },
  "ritual": { name: "☯ Ritual & Culture" },
  "saas": { name: "🔑 SaaS & Licensing" },
  "trade": { name: "🧺 Trade Systems" },
  "utilities": { name: "🔋 Utilities & Energy" },
  "voice": { name: "🎙️ Voice & Audio" },
  "webless": { name: "📡 Webless Tech & Nodes" },
  "nft": { name: "🔁 NFT & Ownership" },
  "education-youth": { name: "🎓 Education & Youth" },
  "zerowaste": { name: "♻️ Zero Waste" },
  "professional": { name: "🧾 Professional Services" },
  "payroll-mining": { name: "🪙 Payroll Mining & Accounting" },
  "mining": { name: "⛏️ Mining & Resources" },
  "wildlife": { name: "🦁 Wildlife & Habitat" },
  "admin-panel": { name: "⚙️ Admin Panel" },
};

export const ALL_SECTORS_DATA = {
  "ai-logic": {
    name: "🧠 AI, Logic & Grid",
    repoName: "ai-logic-seedwave-admin",
    baseUrl: "ai-logic.seedwave.faa.zone",
    brands: [
      { name: "OmniKey", subnodes: ["TraceBeam", "VaultEcho", "QRPath", "MeshID"] },
      { name: "SignalPulse", subnodes: ["BeamNode", "VaultTrack", "QRLogic", "SignalDrop"] },
      { name: "MeshIndex", subnodes: ["YieldTrack", "VaultMap", "QRClaim", "OmniPath"] },
    ],
  },
  "agriculture": {
    name: "🌱 Agriculture & Biotech",
    repoName: "agriculture-seedwave-admin",
    baseUrl: "agriculture.seedwave.faa.zone",
    brands: [
      { name: "CropLink", subnodes: ["CropLink ID", "CropLink Vault", "CropLink Field", "CropLink Yield"] },
      { name: "SoilPulse", subnodes: ["SoilPulse Trace", "SoilPulse Data", "SoilPulse Alert"] },
    ],
  },
  "media": {
    name: "🎬 Motion, Media & Sonic",
    repoName: "media-seedwave-admin",
    baseUrl: "media.seedwave.faa.zone",
    brands: [{ name: "SoundWave", subnodes: ["VisualSync", "SonicForge"] }],
  },
  "banking": {
    name: "🏦 Banking & Finance",
    repoName: "banking-seedwave-admin",
    baseUrl: "banking.seedwave.faa.zone",
    brands: [{ name: "CoinFlow", subnodes: ["LedgerTrack", "AssetVault"] }],
  },
  "logistics": {
    name: "📦 Logistics & Packaging",
    repoName: "logistics-seedwave-admin",
    baseUrl: "logistics.seedwave.faa.zone",
    brands: [{ name: "CrateLogic", subnodes: ["RouteOptimize", "FleetTrack", "WarehouseSync"] }],
  },
  "health": {
    name: "🧠 Health & Hygiene",
    repoName: "health-seedwave-admin",
    baseUrl: "health.seedwave.faa.zone",
    brands: [{ name: "MediVault", subnodes: ["DiagAI", "PatientLink"] }],
  },
  "creative": {
    name: "🖋️ Creative Tech",
    repoName: "creative-seedwave-admin",
    baseUrl: "creative.seedwave.faa.zone",
    brands: [{ name: "PixelFlow", subnodes: ["RenderEngine", "SonicWave", "VisualStory"] }],
  },
  "saas": {
    name: "🔑 SaaS & Licensing",
    repoName: "saas-seedwave-admin",
    baseUrl: "saas.seedwave.faa.zone",
    brands: [{ name: "LicenseKey", subnodes: ["ClaimFlow", "TokenGate"] }],
  },
};

export const TEMPLATES = [
  { name: "Landing Scroll", description: "Perfect for product launches and branded homepage scrolls. ClaimRoot-ready with starter scroll pack.", icon: "Rocket", type: "landing" },
  { name: "Checkout Scroll", description: "Designed for single-item sales and embedded payment logic. ScrollCart + AutoClaim enabled.", icon: "ShoppingCart", type: "checkout" },
  { name: "ScrollBlog", description: "A content-first template with VaultDNS structure for newsletters, updates, or creative serials.", icon: "FileText", type: "blog" },
  { name: "Vault Microsite", description: "Multi-page scroll micro-infrastructure. Great for portfolios, micro-brand kits, or client claim hubs.", icon: "Layers", type: "microsite" },
  { name: "OmniDrop Hub", description: "Template for creating an Omnidrop-enabled brand or service portal.", icon: "CloudDownload", type: "omnidrop" },
  { name: "TreatyCommerce Storefront", description: "Advanced e-commerce solution with integrated VaultPay and royalty tracking.", icon: "Store", type: "storefront" },
  { name: "Interactive Audio Visualizer", description: "Template for dynamic audio visual experiences with real-time sound reactivity.", icon: "AudioWaveform", type: "audio" },
  { name: "Video Showcase Portal", description: "Showcase high-definition video content with integrated metadata and streaming optimization.", icon: "Video", type: "video" },
];

// API key index for the CodeNest dashboard panel.
// Client-safe / publishable identifiers are sourced from Vite env vars (VITE_*)
// with a masked placeholder fallback, so the panel always renders a value even
// when the env var is unset. Backend-only secrets (Xero client secret, Xero
// webhook key, Gemini) are NEVER embedded in client source — they are managed
// server-side and surfaced here only as a non-sensitive status label.
const KEY_ENV = import.meta.env;
const SERVER_MANAGED = 'Managed server-side — not exposed';

export const API_KEYS_INDEX = [
  { service: "PayPal (SDK)", key: KEY_ENV.VITE_PAYPAL_CLIENT_ID || '•••• (set VITE_PAYPAL_CLIENT_ID)', context: "Client-side SDK", locations: ["Various checkout scrolls"] },
  { service: "PayPal (Hosted Button)", key: KEY_ENV.VITE_PAYPAL_BUTTON_STARTER || '•••• (set VITE_PAYPAL_BUTTON_STARTER)', context: "Starter Package", locations: ["HotStack", "Various landing pages"] },
  { service: "PayPal (Hosted Button)", key: KEY_ENV.VITE_PAYPAL_BUTTON_PRO || '•••• (set VITE_PAYPAL_BUTTON_PRO)', context: "Pro Package", locations: ["HotStack", "Larger brand sites"] },
  { service: "PayPal (Hosted Button)", key: KEY_ENV.VITE_PAYPAL_BUTTON_ENTERPRISE || '•••• (set VITE_PAYPAL_BUTTON_ENTERPRISE)', context: "Enterprise Package", locations: ["HotStack", "Enterprise solutions"] },
  { service: "Google Maps", key: KEY_ENV.VITE_GOOGLE_MAPS_KEY || '•••• (set VITE_GOOGLE_MAPS_KEY)', context: "Maps JavaScript API", locations: ["Location-based microsites"] },
  { service: "Gemini AI", key: SERVER_MANAGED, context: "Generative AI — BACKEND ONLY", locations: ["AI-powered insights scrolls", "Baobab Terminal"] },
  { service: "Xero (Client ID)", key: KEY_ENV.VITE_XERO_CLIENT_ID || '•••• (set VITE_XERO_CLIENT_ID)', context: "OAuth 2.0", locations: ["Accounting/payroll integration scrolls"] },
  { service: "Xero (Client Secret)", key: SERVER_MANAGED, context: "OAuth 2.0 — BACKEND ONLY", locations: ["Accounting/payroll integration scrolls"] },
  { service: "Xero (Webhook Key)", key: SERVER_MANAGED, context: "Webhook verification — BACKEND ONLY", locations: ["Xero webhook configurations"] },
];

export const COMPANY_DATA = {
  "fruitful-global-hq": {
    name: "Fruitful Global HQ",
    sector_key: "admin-panel",
    details: {
      Location: "Fruitful Tower, Neo-Johannesburg, ZA",
      CEO: "Dr. Aris Thorne",
      "Primary Contact": "support@fruitful.global",
      "Deployment Servers": "Global (Managed by CodeNest)",
      "Active Licenses": "All Treaty Grid Protocols",
      "Compliance Standards": "ISO 27001, GDPR, Fruitful Treaty Law",
      "Security Audit": "Annual (Last: Q1 2025)",
      "System Uptime (YTD)": "99.998%",
      "VaultMesh Integration": "Full",
      "ClaimRoot Integration": "Full",
    },
  },
  "auranest-solutions": {
    name: "AuraNest Solutions",
    sector_key: "ai-logic",
    details: {
      Location: "Silicon Valley Nexus, CA, USA",
      CEO: "Jane Doe",
      "Primary Contact": "contact@auranest.com",
      "Deployment Servers": "North America (Hybrid Cloud)",
      "Active Licenses": "OmniKey, TraceBeam",
      "Compliance Standards": "HIPAA, CCPA",
      "Security Audit": "Bi-annual",
      "System Uptime (YTD)": "99.9%",
      "VaultMesh Integration": "Partial",
      "ClaimRoot Integration": "Partial",
    },
  },
  "terrasustain-agri": {
    name: "TerraSustain AgriTech",
    sector_key: "agriculture",
    details: {
      Location: "Rural Innovation Hub, UK",
      CEO: "John Smith",
      "Primary Contact": "info@terrasustain.co.uk",
      "Deployment Servers": "Europe (On-premise + Cloud)",
      "Active Licenses": "CropLink ID, SoilPulse Trace",
      "Compliance Standards": "Organic Certs, Food Safety Regulations",
      "Security Audit": "Annual",
      "System Uptime (YTD)": "99.7%",
      "VaultMesh Integration": "Planned Q3 2025",
      "ClaimRoot Integration": "Enabled",
    },
  },
  "vaultpay-finance": {
    name: "VaultPay Finance",
    sector_key: "banking",
    details: {
      Location: "Frankfurt, DE",
      CEO: "Lena Müller",
      "Primary Contact": "support@vaultpay.de",
      "Deployment Servers": "Europe (Private Cloud)",
      "Active Licenses": "CoinFlow, AssetVault",
      "Compliance Standards": "PSD2, Basel III, KYC/AML",
      "Security Audit": "Quarterly",
      "System Uptime (YTD)": "99.99%",
      "VaultMesh Integration": "Full",
      "ClaimRoot Integration": "Full",
    },
  },
};

export const ROYALTY_AGREEMENTS = [
  { id: "RA-001", name: "Standard Global License Agreement", status: "Pending Signature", description: "Comprehensive agreement for global scroll deployments, 6% standard royalty." },
  { id: "RA-002", name: "Regional Partnership Treaty", status: "Signed", description: "Specialized agreement for regional collaborators, 5% royalty, auto-renewal." },
  { id: "RA-003", name: "Enterprise Protocol Agreement", status: "Pending Signature", description: "Tailored for large-scale enterprise integration, 10% royalty, dedicated support." },
];

export const VAULTMESH_SECTIONS = [
  { title: "Introduction to VaultMesh", icon: "BookOpen", body: "VaultMesh transforms disorganized digital content into claimable, trackable assets. It bridges enterprise content systems, decentralized data vaults, and monetization layers through FAA-compliant infrastructure." },
  { title: "Core System Components", icon: "Settings", items: ["VaultDNA: Immutable identifiers for scroll content", "ClaimRoot: Origin anchor & timestamp", "ScrollClaim Contracts: Programmable wrappers", "PulseGrid Sync: Real-time scroll presence & sync", "OmniSignal: Global scroll verification", "GhostTrace Gen2: Scroll interaction backtrace"] },
  { title: "ScrollClaim Infrastructure", icon: "FileContract", items: ["Set tier access (e.g., Diamond)", "Define royalty logic (10-11%)", "Lock scrolls with PulseGrid sync and OmniSignal", "Deploy via FAA.Zone with compliant ZIP bundles"] },
  { title: "Data Flow and Claim Lifecycle", icon: "GitBranch", items: ["Ingest — content enters VaultMesh", "Encode — metadata & VaultDNA attached", "Wrap — ScrollClaim smart-wrapped", "Deploy — FAA.Zone push (ZIP, manifest, HTML)", "Sync — PulseGrid status & OmniSignal locked", "Enforce — Royalties, access & scroll activity logged via GhostTrace"] },
  { title: "Tiering, Royalties, and Compliance", icon: "Award", items: ["Diamond Tier: 10-11% royalty enforced", "SmartWallet Integration: ScrollClaim payments and transfers", "VaultPay Tier III: Required for commercial deployments", "Compliance: FAA scroll ID, ClaimRoot hash, and royalty schema"] },
  { title: "Integration with FAA.Zone", icon: "Globe", items: ["Native support for /public/diamond/ structure", "ZIP, HTML, Manifest deployment bundles", "ClaimRoot timestamp validation", "Seamless PulseGrid auto-sync for live claim state", "Brand hosting via vault.faa.zone"] },
  { title: "Market Segments & Use Cases", icon: "Briefcase", items: ["GPT Conversations & Expert Threads", "Knowledge/Training Archives", "Creative IP Scrolls (music, literature, visuals)", "GeoSector Deployment Archives", "Enterprise Scroll Logs & Audit Trails"] },
  { title: "Revenue Streams & Monetization", icon: "DollarSign", items: ["Diamond Royalties (10-11%)", "Scroll Packaging Fees", "VaultMesh API Subscriptions", "PulseGrid and OmniSignal Licensing"] },
  { title: "Technology Roadmap", icon: "Roadmap", items: ["Q2 2025: ScrollClaim v2.2 with multi-claim staking", "Q3 2025: GhostTrace Gen3 with forensic backtrace tooling", "Q4 2025: Autonomous AI Sector Agents", "Q1 2026: Inter-vault Federation"] },
  { title: "Team & Governance", icon: "Users", items: ["FAA-certified engineers (scroll claimers)", "Scroll Ministers: Compliance + tiering", "Vault Admins: Metadata + ClaimRoot enforcement", "HSOMNI9000 Operators: Diamond-tier execution agents"] },
];

export const SUB_NODES = [
  { id: "omnisignal", name: "OmniSignal", description: "Advanced multi-protocol messaging for decentralized apps.", icon: "Radio" },
  { id: "pulsegrid", name: "PulseGrid", description: "High-performance data orchestration grid.", icon: "Network" },
  { id: "vaultdna", name: "VaultDNA", description: "Immutable digital fingerprints for content.", icon: "Fingerprint" },
  { id: "claimroot", name: "ClaimRoot", description: "Anchors digital claims and timestamps.", icon: "Clock" },
  { id: "scrollclaim", name: "ScrollClaim Contracts", description: "Programmable wrappers for digital rights.", icon: "FileContract" },
  { id: "ghosttrace", name: "GhostTrace Gen2", description: "Next-gen traceability protocol.", icon: "Ghost" },
  { id: "baobab-terminal", name: "Baobab Terminal", description: "CLI for Treaty Grid interaction.", icon: "TreePine" },
];

export const GLOBAL_FOOTER_LINKS = [
  { label: "Privacy", url: "https://footer.global.repo.seedwave.faa.zone/privacy.html" },
  { label: "Terms", url: "https://footer.global.repo.seedwave.faa.zone/terms.html" },
  { label: "Contact", url: "https://footer.global.repo.seedwave.faa.zone/contact.html" },
  { label: "Copyright", url: "https://footer.global.repo.seedwave.faa.zone/copyright.html" },
  { label: "Developers", url: "https://footer.global.repo.seedwave.faa.zone/developers.html" },
  { label: "VaultMesh", url: "https://footer.global.repo.seedwave.faa.zone/vaultmesh.html" },
  { label: "Fruitful", url: "https://footer.global.repo.seedwave.faa.zone/fruitful.html" },
  { label: "FAA.Zone", url: "https://faa.zone/" },
  { label: "About", url: "https://footer.global.repo.seedwave.faa.zone/about.html" },
  { label: "Accessibility", url: "https://footer.global.repo.seedwave.faa.zone/accessibility.html" },
];