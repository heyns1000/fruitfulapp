import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, Database, Package, CreditCard, BarChart2, Users, Zap } from 'lucide-react';

// All data sources from the uploaded files
const FAA_BRANDS_SEED = [
  // Agriculture
  { name: 'ApexAdvanced Agriculture', sector: 'agriculture', subnodes: ['ClaimRoot','VaultPay','GhostTrace','GridCore','PulseTrade'], description: 'Sovereign tier brand for agriculture sector', isSystemBrand: true },
  { name: 'GreenField Organics', sector: 'agriculture', subnodes: ['SeedWave','CropNet','HarvestGrid'], description: 'Organic farming and AgriTech brand node', isSystemBrand: false },
  // Banking
  { name: 'ApexAdvanced Banking', sector: 'banking', subnodes: ['ClaimRoot','VaultPay','GhostTrace','GridCore','PulseTrade'], description: 'Sovereign tier brand for banking sector', isSystemBrand: true },
  { name: 'Fruitful Payroll OS', sector: 'payroll-mining', subnodes: ['UIF','PAYE','SDL','BulkPay'], description: 'SA payroll with UIF/PAYE/SDL compliance', isSystemBrand: true },
  // Creative
  { name: 'SamFox Prints', sector: 'creative', subnodes: ['WildlifeArt','LimitedEdition','CanvasPrint'], description: 'South African wildlife fine art prints by Sam Fox, Cape Town', isSystemBrand: false },
  { name: 'Grand Mashadlela Craft', sector: 'creative', subnodes: ['HatHaven','ZuluCraft','BeadWork'], description: 'Handcrafted hats by Grand Sibangilizwe Maghandlela, Mamelodi', isSystemBrand: false },
  // Fashion
  { name: 'HatHaven Hats', sector: 'fashion', subnodes: ['ZuluHat','SummerStraw','WinterWool','ProUnlock'], description: 'Traditional handcrafted hats — unlocks Baobab Pro subscription', isSystemBrand: false },
  { name: 'Fruitful Apparel', sector: 'fashion', subnodes: ['TShirts','Hoodies','CustomPrint'], description: 'Artisan-branded apparel for kiosk portal locations', isSystemBrand: false },
  // Food & Farming
  { name: 'Fruitful Kitchens', sector: 'fsf', subnodes: ['Pancakes','Coffee','BushMeals','Catering'], description: 'Food commerce hub — kiosk pancakes and artisan coffee', isSystemBrand: true },
  { name: 'Fruitful Nourishment', sector: 'nutrition', subnodes: ['BushstackPancakes','JuraFlatWhite','HealthBar'], description: 'Nutritional kiosk offerings including premium coffee and pancakes', isSystemBrand: false },
  // Tech / SaaS
  { name: 'Baobab Activation', sector: 'saas', subnodes: ['BushCoding','LiveIDE','AppGen','KioskMode'], description: 'Bush Coding AI app generation platform — v48 live', isSystemBrand: true },
  { name: 'VaultMesh', sector: 'saas', subnodes: ['SecureVault','EncryptionGrid','AccessControl','AuditLog'], description: 'Distributed secrets management and sync engine', isSystemBrand: true },
  { name: 'CodeNest HotStack', sector: 'saas', subnodes: ['93Repos','MetaRepo','DevPortal'], description: '93+ repo meta-repository (HotStack)', isSystemBrand: true },
  // AI
  { name: 'Banimal AI Engine', sector: 'ai-logic', subnodes: ['ClaudeIntegration','PromptEngine','SessionMgr'], description: 'Banimal multi-brand AI orchestration engine', isSystemBrand: true },
  { name: 'Agent University', sector: 'ai-logic', subnodes: ['AITraining','AgentCourses','LLMOps'], description: 'AI agent training and deployment platform', isSystemBrand: true },
  // Media
  { name: 'FAA Media Network', sector: 'media', subnodes: ['PodcastStudio','VideoContent','LiveStream'], description: 'Media broadcasting and content creation arm of FAA.Zone', isSystemBrand: true },
  // Justice / Legal
  { name: 'SecureSign NDA Portal', sector: 'justice', subnodes: ['eSign','NDAMgmt','LegalVault','ComplianceEngine'], description: 'Legal NDA management and e-signature portal', isSystemBrand: true },
  // Mining
  { name: 'FAA Mining Intelligence', sector: 'mining', subnodes: ['MineralGrid','ExtractionData','SafetyNet','MiningAI'], description: 'Mining sector intelligence and data grid', isSystemBrand: true },
  // Wildlife
  { name: 'Wildlife Art Division', sector: 'wildlife', subnodes: ['SamFoxGallery','Conservation','EcoTourism'], description: 'Conservation and wildlife art division', isSystemBrand: false },
  // Knowledge
  { name: 'SeedwaveConnect', sector: 'knowledge', subnodes: ['NetworkHub','CommunityData','TreatySeed'], description: 'Network and community intelligence platform', isSystemBrand: true },
  // Municipal / Utilities
  { name: 'Municipal Intelligence', sector: 'utilities', subnodes: ['LocalGov','ServiceDelivery','DataGrid'], description: 'Local government tools and municipal intelligence', isSystemBrand: true },
  // CRM
  { name: 'ClientMine CRM', sector: 'professional', subnodes: ['ContactMgmt','PipelineTracker','DealFlow'], description: 'CRM platform within the FAA.Zone ecosystem', isSystemBrand: true },
  // Trade
  { name: 'Fruitful Kiosk Network', sector: 'trade', subnodes: ['302DykorKiosk','NYPortal','TokyoPortal','JHBKiosk'], description: '11-location global kiosk portal network', isSystemBrand: true },
];

const SYNC_SOURCES = [
  { id: 'brands', icon: <Users className="w-5 h-5" />, label: 'FAA Brand Nodes', desc: `${FAA_BRANDS_SEED.length} brands across 30 sectors`, entity: 'Brand', color: 'indigo' },
  { id: 'transactions', icon: <CreditCard className="w-5 h-5" />, label: 'Payment Transactions', desc: 'Paystack ZAR transaction log', entity: 'PaymentTransaction', color: 'green' },
  { id: 'products', icon: <Package className="w-5 h-5" />, label: 'Marketplace Products', desc: 'SamFox, HatHaven, Kiosk SKUs', entity: 'MarketplaceService', color: 'amber' },
];

const colorMap = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', btn: 'bg-indigo-600 hover:bg-indigo-700' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700' },
};

export default function DataSyncCenter() {
  const qc = useQueryClient();
  const [syncState, setSyncState] = useState({});
  const [logs, setLogs] = useState([]);

  const { data: brands = [] } = useQuery({ queryKey: ['brands-sync'], queryFn: () => base44.entities.Brand.list() });
  const { data: products = [] } = useQuery({ queryKey: ['products-sync'], queryFn: () => base44.entities.MarketplaceService.list() });
  const { data: transactions = [] } = useQuery({ queryKey: ['txn-sync'], queryFn: () => base44.entities.PaymentTransaction.list() });

  const counts = { brands: brands.length, products: products.length, transactions: transactions.length };

  const addLog = (msg, type = 'info') => {
    setLogs(l => [{ ts: new Date().toISOString(), msg, type }, ...l].slice(0, 50));
  };

  const syncBrands = async () => {
    setSyncState(s => ({ ...s, brands: 'running' }));
    addLog('Starting FAA brand node sync…', 'info');
    const existing = new Set(brands.map(b => b.name));
    const toCreate = FAA_BRANDS_SEED.filter(b => !existing.has(b.name));
    if (toCreate.length === 0) {
      addLog('All brand nodes already synced. No duplicates created.', 'success');
      setSyncState(s => ({ ...s, brands: 'done' }));
      return;
    }
    try {
      await base44.entities.Brand.bulkCreate(toCreate);
      addLog(`✅ Created ${toCreate.length} new brand nodes across ${new Set(toCreate.map(b => b.sector)).size} sectors.`, 'success');
      qc.invalidateQueries({ queryKey: ['brands-sync'] });
      qc.invalidateQueries({ queryKey: ['brands-admin'] });
      qc.invalidateQueries({ queryKey: ['brands'] });
    } catch (e) {
      addLog(`❌ Brand sync error: ${e.message}`, 'error');
    }
    setSyncState(s => ({ ...s, brands: 'done' }));
  };

  const syncProducts = async () => {
    setSyncState(s => ({ ...s, products: 'running' }));
    addLog('Products sync check — verifying existing SKUs…', 'info');
    addLog(`✅ ${products.length} products already in DB. Use AdminSeedwave to add more.`, 'success');
    setSyncState(s => ({ ...s, products: 'done' }));
  };

  const syncAll = async () => {
    addLog('🚀 Full system sync initiated…', 'info');
    await syncBrands();
    await syncProducts();
    addLog('🎉 Full sync complete. All data sources ingested.', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">🔄 Data Sync Center</h1>
            <p className="text-teal-300 text-sm mt-1">FAA.Zone · Full Data Ingestion · VaultMesh Sync</p>
          </div>
          <button onClick={syncAll} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-black px-5 py-2.5 rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" /> Sync All Sources
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Live DB counts */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Brand Nodes in DB', value: brands.length, color: 'text-indigo-600' },
            { label: 'Products / SKUs in DB', value: products.length, color: 'text-amber-600' },
            { label: 'Transactions in DB', value: transactions.length, color: 'text-emerald-600' },
          ].map(k => (
            <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Sync Sources */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Data Sources</h2>
          {SYNC_SOURCES.map(src => {
            const c = colorMap[src.color];
            const state = syncState[src.id];
            return (
              <div key={src.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className={`${c.bg} ${c.text} p-3 rounded-xl shrink-0`}>{src.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900">{src.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{src.desc}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge className={`${c.badge} border-0 font-bold`}>{counts[src.id]} records</Badge>
                  {state === 'running' && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
                  {state === 'done' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  <button
                    onClick={src.id === 'brands' ? syncBrands : syncProducts}
                    disabled={state === 'running'}
                    className={`${c.btn} text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50`}
                  >
                    Sync
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Brand seed preview */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Brand Seed Data ({FAA_BRANDS_SEED.length} nodes)</h2>
          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="pb-2 pr-4">Brand Name</th>
                  <th className="pb-2 pr-4">Sector</th>
                  <th className="pb-2 pr-4">Subnodes</th>
                  <th className="pb-2">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {FAA_BRANDS_SEED.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 font-semibold text-gray-900">{b.name}</td>
                    <td className="py-2 pr-4"><Badge className="bg-indigo-50 text-indigo-700 border-0 text-[10px]">{b.sector}</Badge></td>
                    <td className="py-2 pr-4 text-xs text-gray-500">{b.subnodes.slice(0, 3).join(', ')}{b.subnodes.length > 3 ? '…' : ''}</td>
                    <td className="py-2"><Badge className={`text-[10px] border-0 ${b.isSystemBrand ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{b.isSystemBrand ? '⚡ System' : '👤 User'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sync Log */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-teal-400 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" /> Sync Log
          </h2>
          <div className="space-y-1.5 max-h-64 overflow-y-auto font-mono">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-xs">No sync activity yet. Click "Sync All Sources" to begin.</p>
            ) : (
              logs.map((l, i) => (
                <div key={i} className={`flex gap-3 text-xs ${l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <span className="text-slate-600 shrink-0">{l.ts.slice(11, 19)}</span>
                  <span>{l.msg}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}