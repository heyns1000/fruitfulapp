export const SECTORS = [
  { key: 'agriculture',     glyph: '🌱', label: 'Agriculture',      monthly: 45,  annual: 450,  tier: 'B+', region: 'Global Rural',       subnodes: ['AgriNest', 'SoilSync', 'HarvestGrid', 'CropLink', 'RootVault'] },
  { key: 'fsf',             glyph: '🥦', label: 'Food, Soil & Farm', monthly: 46,  annual: 480,  tier: 'B+', region: 'Rural',              subnodes: ['FoodMesh', 'SoilPath', 'FarmGrid', 'NutriNode', 'GrowSync'] },
  { key: 'banking',         glyph: '🏦', label: 'Banking',           monthly: 125, annual: 1250, tier: 'A+', region: 'Div A-E',           subnodes: ['FinGrid', 'VaultCore', 'TrustMesh', 'LedgerNode', 'ClearSync'] },
  { key: 'creative',        glyph: '🖋️', label: 'Creative',          monthly: 67,  annual: 720,  tier: 'A',  region: 'Div E',             subnodes: ['MediaGrid', 'StudioPath', 'ArtMesh', 'DesignSync', 'CraftNode'] },
  { key: 'logistics',       glyph: '📦', label: 'Logistics',         monthly: 58,  annual: 595,  tier: 'B+', region: 'Div B-F',           subnodes: ['CrateLogic', 'PackChain', 'RouteSync', 'FleetMesh', 'DepotNode', 'CargoGrid', 'TrackVault', 'ShipLink', 'HubSync', 'FreightPath'] },
  { key: 'education-ip',   glyph: '📚', label: 'Education IP',      monthly: 39,  annual: 420,  tier: 'A',  region: 'Tribal/Global',     subnodes: ['EduNest', 'MindLift', 'LearnGrid', 'SkillSync', 'KnowVault'] },
  { key: 'fashion',         glyph: '✂️', label: 'Fashion',           monthly: 70,  annual: 750,  tier: 'A',  region: 'Global Metro',      subnodes: ['FashionNest', 'StyleForm', 'ThreadMesh', 'TrendSync', 'WearNode', 'LoomGrid', 'FabricVault', 'SeamPath', 'CoutureLink', 'DesignNode'] },
  { key: 'gaming',          glyph: '🎮', label: 'Gaming',            monthly: 80,  annual: 820,  tier: 'A',  region: 'Global Digital',    subnodes: ['PixelPulse', 'SimuLink', 'GameMesh', 'QuestGrid', 'LevelSync'] },
  { key: 'health',          glyph: '🧠', label: 'Health',            monthly: 52,  annual: 550,  tier: 'B',  region: 'Div F',             subnodes: ['MedVault', 'SteriMesh', 'CareGrid', 'BioSync', 'HealthNode'] },
  { key: 'housing',         glyph: '🏗️', label: 'Housing',           monthly: 59,  annual: 610,  tier: 'B+', region: 'Div A-F',           subnodes: ['BuildNest', 'InfraGrid', 'StructMesh', 'DwellSync', 'ZoneNode'] },
  { key: 'justice',         glyph: '⚖️', label: 'Justice',           monthly: 90,  annual: 920,  tier: 'A',  region: 'Global Legal',      subnodes: ['LawLedger', 'EthicGrid', 'CourtMesh', 'JustSync', 'RightNode'] },
  { key: 'knowledge',       glyph: '📖', label: 'Knowledge',         monthly: 55,  annual: 580,  tier: 'B+', region: 'Global Archives',   subnodes: ['InfoVault', 'ArchiveGrid', 'DataMesh', 'WisdomSync', 'ScholarNode'] },
  { key: 'micromesh',       glyph: '☰',  label: 'Micromesh',         monthly: 62,  annual: 650,  tier: 'B+', region: 'Local/Regional',    subnodes: ['NanoLink', 'PicoMesh', 'MicroGrid', 'NanoSync', 'AtomNode'] },
  { key: 'media',           glyph: '🎬', label: 'Media',             monthly: 72,  annual: 740,  tier: 'A',  region: 'Creative',          subnodes: ['FrameCast', 'SonicGrid', 'BroadMesh', 'StreamSync', 'CastNode'] },
  { key: 'nutrition',       glyph: '✿',  label: 'Nutrition',         monthly: 48,  annual: 500,  tier: 'B+', region: 'Global',            subnodes: ['AgriNest', 'FreshSync', 'NutriGrid', 'VitalMesh', 'DietNode'] },
  { key: 'ai-logic',        glyph: '🤖', label: 'AI Logic',          monthly: 104, annual: 1050, tier: 'A+', region: 'Global',            subnodes: ['OmniKey', 'SignalPulse', 'LogicMesh', 'NeuralSync', 'ThinkNode'] },
  { key: 'packaging',       glyph: '🗃️', label: 'Packaging',         monthly: 65,  annual: 680,  tier: 'B',  region: 'Div B',             subnodes: ['PackVault', 'WrapGrid', 'BoxMesh', 'SealSync', 'LabelNode'] },
  { key: 'quantum',         glyph: '✴️', label: 'Quantum',           monthly: 130, annual: 1300, tier: 'A+', region: 'Global Research',   subnodes: ['QuantumMesh', 'PulseQ', 'QubitGrid', 'WaveSync', 'EntangleNode'] },
  { key: 'ritual',          glyph: '☯️', label: 'Ritual',            monthly: 68,  annual: 725,  tier: 'A',  region: 'Div C',             subnodes: ['RiteNest', 'PulseSpirit', 'CereMesh', 'AncestorSync', 'SacredNode'] },
  { key: 'saas',            glyph: '🔑', label: 'SaaS',              monthly: 95,  annual: 980,  tier: 'A',  region: 'Global',            subnodes: ['SaaSChain', 'LicenseGrid', 'CloudMesh', 'ApiSync', 'TenantNode'] },
  { key: 'trade',           glyph: '🧺', label: 'Trade',             monthly: 88,  annual: 888,  tier: 'A+', region: 'Div A-F',           subnodes: ['TradeFlow', 'MarketGrid', 'CommerceMesh', 'ExchangeSync', 'MerchNode'] },
  { key: 'utilities',       glyph: '🔋', label: 'Utilities',         monthly: 70,  annual: 710,  tier: 'B+', region: 'Div A-Z',           subnodes: ['PowerGrid', 'HydroFlow', 'EnergyMesh', 'WireSync', 'GridNode'] },
  { key: 'voice',           glyph: '🎙️', label: 'Voice',             monthly: 60,  annual: 630,  tier: 'B',  region: 'Global',            subnodes: ['AudioMesh', 'SonicNode', 'VoiceGrid', 'SpeakSync', 'ToneVault'] },
  { key: 'webless',         glyph: '📡', label: 'Webless',           monthly: 76,  annual: 770,  tier: 'A',  region: 'Div D-G',           subnodes: ['OmniQR', 'MeshSync', 'OfflineGrid', 'SignalNode', 'AirVault'] },
  { key: 'nft',             glyph: '🔁', label: 'NFT',               monthly: 120, annual: 1200, tier: 'A',  region: 'FAA IP',            subnodes: ['ClaimGrid', 'TokenSync', 'MintMesh', 'ChainNode', 'LedgerVault'] },
  { key: 'education-youth', glyph: '🎓', label: 'Education Youth',   monthly: 40,  annual: 430,  tier: 'A',  region: 'Global Youth',      subnodes: ['YouthSpark', 'EduFlow', 'PlayGrid', 'LearnMesh', 'GrowNode'] },
  { key: 'zerowaste',       glyph: '♻️', label: 'Zero Waste',        monthly: 40,  annual: 450,  tier: 'B',  region: 'Global',            subnodes: ['EcoNest', 'GreenLoop', 'RecycleMesh', 'EarthSync', 'WasteNode'] },
  { key: 'professional',    glyph: '🧾', label: 'Professional',      monthly: 110, annual: 1100, tier: 'A',  region: 'Global',            subnodes: ['LedgerNest', 'OmniBooks', 'ProfMesh', 'ConsultSync', 'AdvisoryNode'] },
  { key: 'payroll-mining',  glyph: '🪙', label: 'Payroll Mining',    monthly: 100, annual: 1000, tier: 'A+', region: 'Global Finance',    subnodes: ['PayMine', 'CoinLedger', 'WageMesh', 'StakeSync', 'YieldNode'] },
  { key: 'mining',          glyph: '⛏️', label: 'Mining',            monthly: 150, annual: 1800, tier: 'A+', region: 'Global Resources',  subnodes: ['MineNest', 'DrillCoreX', 'ExtractMesh', 'OreSync', 'ShaftNode'] },
  { key: 'wildlife',        glyph: '🦁', label: 'Wildlife',          monthly: 35,  annual: 380,  tier: 'B',  region: 'Conservation Zones', subnodes: ['EcoGuard', 'HabitatLink', 'WildMesh', 'BiomeSync', 'SpeciesNode'] },
];

export const TIER_COLORS = {
  'A+': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'A':  'bg-blue-100 text-blue-800 border-blue-300',
  'B+': 'bg-teal-100 text-teal-800 border-teal-300',
  'B':  'bg-gray-100 text-gray-700 border-gray-300',
};

// Generate deterministic brand names using modulo indexing
const BRAND_PREFIXES = ['Alpha','Beta','Core','Prime','Ultra','Nexus','Nova','Apex','Vega','Delta','Sigma','Omega','Pulse','Flux','Arc','Zen','Sol','Lux','Echo','Volt'];
const BRAND_SUFFIXES = ['Systems','Works','Labs','Tech','Hub','Co','Net','IO','Link','Flow','Grid','Sync','Mesh','Node','Base','Forge','Stack','Wave','Vault','Core'];

export function generateBrands(sector, count = 12) {
  return Array.from({ length: count }, (_, i) => {
    const subnode = sector.subnodes[i % sector.subnodes.length];
    const prefix = BRAND_PREFIXES[(i * 7 + sector.key.length) % BRAND_PREFIXES.length];
    const suffix = BRAND_SUFFIXES[(i * 3 + i) % BRAND_SUFFIXES.length];
    return {
      id: `${sector.key}-${i}`,
      name: i < sector.subnodes.length ? `${subnode}™` : `${prefix} ${suffix}`,
      subnode,
      code: `${sector.key.toUpperCase().slice(0,3)}-${String(i + 1).padStart(3, '0')}`,
      visitCount: Math.floor(Math.random() * 500),
    };
  });
}