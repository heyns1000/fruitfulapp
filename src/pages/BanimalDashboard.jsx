import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import { BANIMAL_LOGO } from '@/components/banimal/banimalProducts';

// ── REAL DATA FROM FILES ──────────────────────────────────────────────
const PORTAL_LOCATIONS = [
  { id: 1, name: 'SA Bush', country: 'South Africa', status: 'flagship', flag: '🇿🇦', coords: [-25.7, 28.2] },
  { id: 2, name: 'New York', country: 'USA', status: 'active', flag: '🇺🇸', coords: [40.7, -74.0] },
  { id: 3, name: 'Tokyo', country: 'Japan', status: 'active', flag: '🇯🇵', coords: [35.7, 139.7] },
  { id: 4, name: 'Texas', country: 'USA', status: 'active', flag: '🇺🇸', coords: [31.0, -100.0] },
  { id: 5, name: 'Botswana', country: 'Botswana', status: 'active', flag: '🇧🇼', coords: [-22.3, 24.7] },
  { id: 6, name: 'Mexico', country: 'Mexico', status: 'active', flag: '🇲🇽', coords: [23.6, -102.6] },
  { id: 7, name: 'Iceland', country: 'Iceland', status: 'active', flag: '🇮🇸', coords: [64.9, -18.1] },
  { id: 8, name: 'Zimbabwe', country: 'Zimbabwe', status: 'active', flag: '🇿🇼', coords: [-19.0, 29.2] },
  { id: 9, name: 'Egypt', country: 'Egypt', status: 'active', flag: '🇪🇬', coords: [26.0, 30.0] },
  { id: 10, name: 'Bangkok', country: 'Thailand', status: 'active', flag: '🇹🇭', coords: [13.8, 100.5] },
  { id: 11, name: 'Canada', country: 'Canada', status: 'opening_2026', flag: '🇨🇦', coords: [56.1, -106.3] },
];

const REVENUE_DATA = [
  { year: 'FY2026', revenue: 140426, cogs: 56170, grossProfit: 84256 },
  { year: 'FY2027', revenue: 739272, cogs: 295709, grossProfit: 443563 },
  { year: 'FY2028', revenue: 3176820, cogs: 1270728, grossProfit: 1906092 },
];

const SUBSCRIPTION_TIERS = [
  { name: 'Free Seedling', priceZAR: 0, sessions: '3/day', color: '#6b7280' },
  { name: 'Baobab Pro', priceZAR: 5300, sessions: 'Unlimited', color: '#47b3a8', note: 'Hat unlock' },
  { name: 'Professional', priceZAR: 299, sessions: 'Unlimited', color: '#3b82f6', note: '/month' },
  { name: 'Enterprise', priceZAR: 999, sessions: 'Unlimited', color: '#8b5cf6', note: '/month' },
];

const COMPANY = {
  name: 'Fruitful Holdings (Pty) Ltd',
  trading: 'Fruitful Shops (pty) ltd',
  reg: '2021/121654/07',
  paystack: '#1713776',
  founder: 'Heyns Schoeman',
  address: '302 Dykor St, Silverton Hub, Pretoria',
  whatsapp: '+27724140117',
  email: 'heynsschoeman@gmail.com',
  tagline: 'BUY ARTISAN. CREATE APPS. EAT PANCAKES.',
};

const KIOSK_HARDWARE = {
  supplier: 'Welink (Guangzhou, China)',
  invoice: 'WL20260401C',
  units: 9,
  unitPrice: 3500,
  total: 31500,
  leadTime: '25 days',
  type: 'Self-service fiberglass coffee kiosks',
};

// ── COMPONENTS ──────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color = 'text-teal-400' }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{label}</p>
    <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-teal-400 mb-4 border-b border-slate-700 pb-2">{children}</h2>
);

export default function BanimalDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['marketplace-services'],
    queryFn: () => base44.entities.MarketplaceService.list('-created_date', 100),
  });

  const brandGroups = useMemo(() => {
    const groups = {};
    products.forEach(p => {
      if (!groups[p.brandId]) groups[p.brandId] = [];
      groups[p.brandId].push(p);
    });
    return groups;
  }, [products]);

  const totalStockValue = useMemo(() =>
    products.reduce((s, p) => s + ((p.pricing?.ZAR || 0) * (p.inventory?.available || 0)), 0),
  [products]);

  const TABS = [
    { id: 'overview', label: '🏠 Overview' },
    { id: 'products', label: '🛍️ Products' },
    { id: 'portals', label: '🌍 Portals' },
    { id: 'financials', label: '📊 Financials' },
    { id: 'company', label: '🏢 Company' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={BANIMAL_LOGO} alt="Banimal" className="h-10 object-contain brightness-0 invert" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-teal-400">Dashboard · Node 042</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/BanimalStore" className="text-xs font-bold text-amber-400 bg-amber-900/40 border border-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-800/50 transition-colors">
              🛍️ Store
            </Link>
            <Link to="/BanimalAdmin" className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors">
              ⚙️ Admin
            </Link>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-xs font-bold text-slate-300">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tagline Banner */}
      <div className="bg-teal-600 py-2 px-6 text-center">
        <p className="text-sm font-black uppercase tracking-[0.4em] text-white">{COMPANY.tagline}</p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 py-2 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Products" value={isLoading ? '…' : products.length} sub="In MarketplaceService DB" color="text-teal-400" />
              <StatCard label="Active Portals" value="11" sub="Globally deployed" color="text-emerald-400" />
              <StatCard label="Stock Value" value={`R${Math.round(totalStockValue / 1000)}k`} sub="ZAR inventory value" color="text-amber-400" />
              <StatCard label="Kiosk Units" value="9" sub="Welink order active" color="text-purple-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subscription Tiers */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <SectionTitle>Subscription Tiers</SectionTitle>
                <div className="space-y-3">
                  {SUBSCRIPTION_TIERS.map(t => (
                    <div key={t.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="font-bold text-sm text-white">{t.name}</span>
                        {t.note && <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">{t.note}</Badge>}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm" style={{ color: t.color }}>R{t.priceZAR.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500">{t.sessions}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kiosk Hardware */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <SectionTitle>Welink Kiosk Hardware Order</SectionTitle>
                <div className="space-y-2">
                  {Object.entries(KIOSK_HARDWARE).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-slate-700 last:border-0">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-xs font-bold text-white">{typeof v === 'number' && k === 'total' ? `$${v.toLocaleString()} USD` : typeof v === 'number' && k === 'unitPrice' ? `$${v.toLocaleString()} USD` : v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Preview */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>3-Year Revenue Projection (USD)</SectionTitle>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v, n) => [`$${v.toLocaleString()}`, n]} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                    <Bar dataKey="revenue" fill="#47b3a8" radius={[4,4,0,0]} name="Revenue" />
                    <Bar dataKey="grossProfit" fill="#6ee7b7" radius={[4,4,0,0]} name="Gross Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {isLoading ? (
              <div className="text-center py-16 text-slate-500">Loading products…</div>
            ) : (
              Object.entries(brandGroups).map(([brandId, items]) => (
                <div key={brandId} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <SectionTitle>{items[0]?.brandName || brandId}</SectionTitle>
                    <Badge className="bg-teal-900 text-teal-300 border-teal-700">{items.length} products</Badge>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-700">
                          <th className="pb-2 pr-4">Product</th>
                          <th className="pb-2 pr-4">SKU</th>
                          <th className="pb-2 pr-4">ZAR</th>
                          <th className="pb-2 pr-4">USD</th>
                          <th className="pb-2 pr-4">Stock</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {items.map(p => (
                          <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="py-2.5 pr-4 font-medium text-white">{p.serviceName}</td>
                            <td className="py-2.5 pr-4 font-mono text-[11px] text-teal-400">{p.productCode}</td>
                            <td className="py-2.5 pr-4 text-amber-400 font-bold">R{(p.pricing?.ZAR || 0).toLocaleString()}</td>
                            <td className="py-2.5 pr-4 text-slate-400">${(p.pricing?.USD || 0)}</td>
                            <td className="py-2.5 pr-4 text-slate-300">{p.inventory?.unlimited ? '∞' : p.inventory?.available}</td>
                            <td className="py-2.5">
                              <Badge className={p.status === 'active' ? 'bg-emerald-900 text-emerald-300 border-emerald-700' : 'bg-slate-700 text-slate-400'}>
                                {p.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PORTALS */}
        {activeTab === 'portals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Active Portals" value="10" color="text-emerald-400" />
              <StatCard label="Flagship" value="SA Bush" sub="302 Dykor St, Pretoria" color="text-amber-400" />
              <StatCard label="Opening 2026" value="Canada" color="text-blue-400" />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Global Portal Network (11 Locations)</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PORTAL_LOCATIONS.map(loc => (
                  <div key={loc.id} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-700">
                    <span className="text-2xl">{loc.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{loc.name}</p>
                      <p className="text-xs text-slate-500">{loc.country}</p>
                    </div>
                    <Badge className={
                      loc.status === 'flagship' ? 'bg-amber-900 text-amber-300 border-amber-700' :
                      loc.status === 'active' ? 'bg-emerald-900 text-emerald-300 border-emerald-700' :
                      'bg-blue-900 text-blue-300 border-blue-700'
                    }>
                      {loc.status === 'opening_2026' ? '2026' : loc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FINANCIALS */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="FY2026 Revenue" value="$140K" sub="Conservative year 1" color="text-teal-400" />
              <StatCard label="FY2027 Revenue" value="$739K" sub="Year 2 projection" color="text-emerald-400" />
              <StatCard label="FY2028 Revenue" value="$3.2M" sub="Year 3 projection" color="text-amber-400" />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>P&L 3-Year Projection (USD)</SectionTitle>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="revenue" stroke="#47b3a8" strokeWidth={3} dot={{ fill: '#47b3a8', r: 5 }} name="Revenue" />
                    <Line type="monotone" dataKey="grossProfit" stroke="#6ee7b7" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#6ee7b7', r: 4 }} name="Gross Profit" />
                    <Line type="monotone" dataKey="cogs" stroke="#f87171" strokeWidth={2} dot={{ fill: '#f87171', r: 4 }} name="COGS" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <SectionTitle>Baobab Pro Hat Model</SectionTitle>
                <div className="space-y-3">
                  {[
                    { label: 'Hat Price', value: 'R699' },
                    { label: 'Pro Annual Value', value: 'R5,300' },
                    { label: 'Value Multiple', value: '7.6×' },
                    { label: 'Artisan', value: 'Grand Sibangilizwe Maghandlela' },
                    { label: 'Location', value: 'Mamelodi, Pretoria' },
                  ].map(i => (
                    <div key={i.label} className="flex justify-between py-1.5 border-b border-slate-700 last:border-0">
                      <span className="text-xs text-slate-500">{i.label}</span>
                      <span className="text-xs font-bold text-teal-400">{i.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <SectionTitle>Paystack Revenue Scenarios</SectionTitle>
                <div className="space-y-3">
                  {[
                    { label: 'Conservative (10 Pro)', value: 'R2,990/mo' },
                    { label: 'Mid-range (5 Enterprise)', value: 'R4,995/mo' },
                    { label: 'Combined', value: 'R7,985/mo' },
                    { label: 'Account', value: '#1713776 (Fruitful Shops)' },
                    { label: 'Mode', value: 'TEST → LIVE pending' },
                  ].map(i => (
                    <div key={i.label} className="flex justify-between py-1.5 border-b border-slate-700 last:border-0">
                      <span className="text-xs text-slate-500">{i.label}</span>
                      <span className="text-xs font-bold text-amber-400">{i.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPANY */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Legal Identity — Fruitful Holdings</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Legal Entity', value: COMPANY.name },
                  { label: 'Trading Name', value: COMPANY.trading },
                  { label: 'Registration', value: COMPANY.reg },
                  { label: 'Paystack Account', value: COMPANY.paystack },
                  { label: 'Founder', value: COMPANY.founder },
                  { label: 'Address', value: COMPANY.address },
                  { label: 'WhatsApp', value: COMPANY.whatsapp },
                  { label: 'Email', value: COMPANY.email },
                ].map(i => (
                  <div key={i.label} className="flex flex-col p-3 bg-slate-900 rounded-lg">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{i.label}</span>
                    <span className="text-sm font-semibold text-white">{i.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <SectionTitle>Ecosystem Products (FAA.Zone Network)</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'VaultMesh', 'BaobabTree', 'BushPortal', 'Banimal e-commerce',
                  'Fruitful Kitchens', 'Municipal Intelligence', 'Fruitful Payroll OS',
                  'SecureSign NDA Portal', 'Agent University', 'ClientMine CRM',
                  'SeedwaveConnect', 'FAA Mining Grid', 'CodeNest (HotStack)',
                ].map(p => (
                  <div key={p} className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg">
                    <span className="text-teal-400 text-xs">✦</span>
                    <span className="text-xs font-semibold text-slate-300">{p}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">93+ repos · GitHub: heyns1000/faa.zone</p>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800 py-6 px-6 mt-8 text-center space-y-2">
        <img src={BANIMAL_LOGO} alt="Banimal" className="h-8 mx-auto object-contain brightness-0 invert opacity-40" />
        <p className="text-xs font-bold uppercase tracking-[0.5em] text-slate-600">
          © 2026 Fruitful Holdings (Pty) Ltd · Reg: 2021/121654/07 · Seeds of Appreciation
        </p>
      </footer>
    </div>
  );
}