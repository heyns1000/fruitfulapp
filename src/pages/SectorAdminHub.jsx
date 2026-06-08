import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Trash2, Edit2, Save, X, RefreshCw, TrendingUp, Package, Users, Zap } from 'lucide-react';

const SECTORS = {
  agriculture: { label: '🌱 Agriculture', color: '#22c55e', desc: 'Farming, crops, AgriTech' },
  fsf: { label: '🥦 Food & Farming', color: '#84cc16', desc: 'Food supply chain, processing' },
  banking: { label: '🏦 Banking', color: '#3b82f6', desc: 'Finance, payments, fintech' },
  creative: { label: '🖋️ Creative', color: '#ec4899', desc: 'Art, design, creative services' },
  logistics: { label: '📦 Logistics', color: '#f97316', desc: 'Transport, supply chain' },
  'education-ip': { label: '📚 Education', color: '#8b5cf6', desc: 'EdTech, IP, learning' },
  fashion: { label: '✂️ Fashion', color: '#f43f5e', desc: 'Clothing, textiles, apparel' },
  gaming: { label: '🎮 Gaming', color: '#06b6d4', desc: 'Games, esports, metaverse' },
  health: { label: '🧠 Health', color: '#10b981', desc: 'MedTech, wellness, biotech' },
  housing: { label: '🏗️ Housing', color: '#f59e0b', desc: 'PropTech, construction' },
  justice: { label: '⚖️ Justice', color: '#6366f1', desc: 'Legal, compliance, fairness' },
  knowledge: { label: '📖 Knowledge', color: '#0ea5e9', desc: 'Research, data, intelligence' },
  micromesh: { label: '☰ Micro-Mesh', color: '#a855f7', desc: 'Mesh networks, IoT' },
  media: { label: '🎬 Media', color: '#ef4444', desc: 'Broadcast, content, streaming' },
  nutrition: { label: '✿ Nutrition', color: '#f97316', desc: 'Food science, supplements' },
  'ai-logic': { label: '🤖 AI Logic', color: '#6ee7b7', desc: 'AI, ML, automation' },
  packaging: { label: '📦 Packaging', color: '#d97706', desc: 'Packaging, materials, print' },
  quantum: { label: '✴️ Quantum', color: '#c084fc', desc: 'Quantum computing, advanced' },
  ritual: { label: '☯️ Ritual', color: '#fb7185', desc: 'Culture, ceremony, heritage' },
  saas: { label: '🔑 SaaS', color: '#38bdf8', desc: 'Software platforms, subscriptions' },
  trade: { label: '🧺 Trade', color: '#fbbf24', desc: 'Commerce, exports, markets' },
  utilities: { label: '🔋 Utilities', color: '#4ade80', desc: 'Energy, water, infrastructure' },
  voice: { label: '🎙️ Voice', color: '#f472b6', desc: 'Speech, audio, comms' },
  webless: { label: '📡 Webless', color: '#94a3b8', desc: 'Offline systems, rural tech' },
  nft: { label: '🔁 NFT', color: '#818cf8', desc: 'Tokenisation, digital assets' },
  'education-youth': { label: '🎓 Youth', color: '#34d399', desc: 'Youth education, skills' },
  zerowaste: { label: '♻️ Zero Waste', color: '#86efac', desc: 'Sustainability, circular economy' },
  professional: { label: '🧾 Professional', color: '#a78bfa', desc: 'B2B services, consulting' },
  'payroll-mining': { label: '🪙 Payroll', color: '#fcd34d', desc: 'HR, payroll, UIF/PAYE' },
  mining: { label: '⛏️ Mining', color: '#d4a574', desc: 'Mining, minerals, extraction' },
  wildlife: { label: '🦁 Wildlife', color: '#65a30d', desc: 'Conservation, ecotourism' },
};

const COLORS = Object.values(SECTORS).map(s => s.color);

// ── Sub-components ─────────────────────────────────────────────────────
function BrandNodeCard({ brand, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{brand.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{brand.description || 'No description'}</p>
          {brand.subnodes?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {brand.subnodes.slice(0, 4).map(s => (
                <span key={s} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{s}</span>
              ))}
              {brand.subnodes.length > 4 && <span className="text-[10px] text-gray-400">+{brand.subnodes.length - 4}</span>}
            </div>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(brand)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(brand.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Badge className={`text-[10px] ${brand.isSystemBrand ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
          {brand.isSystemBrand ? '⚡ System' : '👤 User'}
        </Badge>
        <span className="text-[10px] text-gray-400">{brand.subnodes?.length || 0} subnodes</span>
      </div>
    </div>
  );
}

function BrandEditModal({ brand, sectorKey, onSave, onClose }) {
  const [form, setForm] = useState({
    name: brand?.name || '',
    description: brand?.description || '',
    subnodes: brand?.subnodes?.join(', ') || '',
    isSystemBrand: brand?.isSystemBrand || false,
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-gray-900">{brand ? 'Edit Brand Node' : 'New Brand Node'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Brand Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
              rows={3} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Subnodes (comma separated)</label>
            <input value={form.subnodes} onChange={e => setForm(f => ({...f, subnodes: e.target.value}))}
              placeholder="e.g. NodeA, NodeB, NodeC"
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isSystemBrand} onChange={e => setForm(f => ({...f, isSystemBrand: e.target.checked}))} className="rounded" />
            <span className="text-sm text-gray-700">System Brand</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            onClick={() => onSave({
              ...form,
              sector: sectorKey,
              subnodes: form.subnodes.split(',').map(s => s.trim()).filter(Boolean),
            })}
            className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

function SectorPanel({ sectorKey, sectorMeta, brands, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const qc = useQueryClient();

  const createMutation = useMutation({
    mutationFn: data => base44.entities.Brand.create(data),
    onSuccess: () => { onRefresh(); setShowModal(false); setEditBrand(null); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Brand.update(id, data),
    onSuccess: () => { onRefresh(); setShowModal(false); setEditBrand(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.Brand.delete(id),
    onSuccess: () => onRefresh(),
  });

  const handleSave = (formData) => {
    if (editBrand?.id) {
      updateMutation.mutate({ id: editBrand.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const totalSubnodes = brands.reduce((s, b) => s + (b.subnodes?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Sector stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-indigo-600">{brands.length}</p>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Brand Nodes</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-purple-600">{totalSubnodes}</p>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Total Subnodes</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-emerald-600">{brands.filter(b => b.isSystemBrand).length}</p>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">System Brands</p>
        </div>
      </div>

      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900">{sectorMeta.label} — Brand Nodes</h3>
          <p className="text-xs text-gray-500">{sectorMeta.desc}</p>
        </div>
        <button
          onClick={() => { setEditBrand(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Brand Node
        </button>
      </div>

      {/* Brands grid */}
      {brands.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400 font-medium">No brands in this sector yet</p>
          <button onClick={() => setShowModal(true)} className="mt-3 text-indigo-600 font-bold text-sm hover:underline">+ Add the first one</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map(b => (
            <BrandNodeCard key={b.id} brand={b}
              onEdit={b => { setEditBrand(b); setShowModal(true); }}
              onDelete={id => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Subnodes analytics */}
      {brands.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-4">Subnodes Per Brand</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brands.map(b => ({ name: b.name.slice(0, 12), subnodes: b.subnodes?.length || 0 }))}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="subnodes" fill={sectorMeta.color} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showModal && (
        <BrandEditModal
          brand={editBrand}
          sectorKey={sectorKey}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditBrand(null); }}
        />
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function SectorAdminHub() {
  const [selectedSector, setSelectedSector] = useState('agriculture');
  const [view, setView] = useState('grid'); // 'grid' | 'sector'
  const [searchQ, setSearchQ] = useState('');
  const qc = useQueryClient();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands-admin'],
    queryFn: () => base44.entities.Brand.list('-updated_date', 500),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products-admin'],
    queryFn: () => base44.entities.MarketplaceService.list('-created_date', 200),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions-admin'],
    queryFn: () => base44.entities.PaymentTransaction.list('-created_date', 100),
  });

  const sectorStats = useMemo(() =>
    Object.entries(SECTORS).map(([key, meta]) => {
      const sb = brands.filter(b => b.sector === key);
      return {
        key, ...meta,
        brandCount: sb.length,
        subnodeCount: sb.reduce((s, b) => s + (b.subnodes?.length || 0), 0),
        systemCount: sb.filter(b => b.isSystemBrand).length,
      };
    }), [brands]
  );

  const filteredSectors = useMemo(() =>
    searchQ
      ? sectorStats.filter(s => s.label.toLowerCase().includes(searchQ.toLowerCase()) || s.desc.toLowerCase().includes(searchQ.toLowerCase()))
      : sectorStats,
    [sectorStats, searchQ]
  );

  const pieData = sectorStats.filter(s => s.brandCount > 0).map(s => ({ name: s.label.split(' ').slice(1).join(' '), value: s.brandCount, color: s.color }));
  const totalBrands = brands.length;
  const totalSubnodes = brands.reduce((s, b) => s + (b.subnodes?.length || 0), 0);
  const activeSectors = sectorStats.filter(s => s.brandCount > 0).length;

  const refresh = () => qc.invalidateQueries({ queryKey: ['brands-admin'] });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-6 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight">⚙️ Sector Admin Hub</h1>
              <p className="text-indigo-300 text-sm mt-1">Brand Node Management · Analytics · Full CRUD · FAA.Zone</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={refresh} className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                <RefreshCw className="w-4 h-4" /> Sync
              </button>
              <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
                <button onClick={() => setView('grid')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${view === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Overview</button>
                <button onClick={() => setView('sector')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${view === 'sector' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Sector</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Users className="w-5 h-5" />, label: 'Brand Nodes', value: totalBrands, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { icon: <Zap className="w-5 h-5" />, label: 'Total Subnodes', value: totalSubnodes, color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Active Sectors', value: activeSectors, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: <Package className="w-5 h-5" />, label: 'Marketplace SKUs', value: products.length, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(k => (
            <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
              <div className={`${k.bg} ${k.color} p-3 rounded-xl`}>{k.icon}</div>
              <div>
                <p className={`text-2xl font-black ${k.color}`}>{isLoading ? '…' : k.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Grid View — All Sectors */}
        {view === 'grid' && (
          <div className="space-y-6">
            {/* Search + pie chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-black uppercase tracking-wider text-gray-500">All Sectors ({Object.keys(SECTORS).length})</p>
                  <input
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search sectors…"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-48 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {filteredSectors.map(s => (
                    <button
                      key={s.key}
                      onClick={() => { setSelectedSector(s.key); setView('sector'); }}
                      className="text-left p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                    >
                      <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 truncate">{s.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black" style={{ color: s.color }}>{s.brandCount}</span>
                        <span className="text-[10px] text-gray-400">brands</span>
                        {s.brandCount > 0 && <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: s.color }} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Brand Distribution</p>
                {pieData.length > 0 ? (
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
                )}
              </div>
            </div>

            {/* Brands per sector bar chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Brands Per Sector (top 15)</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorStats.sort((a,b) => b.brandCount - a.brandCount).slice(0, 15).map(s => ({ name: s.label.split(' ').slice(1).join(' '), brands: s.brandCount, subnodes: s.subnodeCount }))}>
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="brands" fill="#6366f1" radius={[4,4,0,0]} name="Brands" />
                    <Bar dataKey="subnodes" fill="#a5b4fc" radius={[4,4,0,0]} name="Subnodes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Sector View */}
        {view === 'sector' && (
          <div className="space-y-4">
            {/* Sector selector */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-2">
              {Object.entries(SECTORS).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSector(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedSector === key ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={selectedSector === key ? { backgroundColor: meta.color } : {}}
                >
                  {meta.label}
                </button>
              ))}
            </div>

            <SectorPanel
              key={selectedSector}
              sectorKey={selectedSector}
              sectorMeta={SECTORS[selectedSector]}
              brands={brands.filter(b => b.sector === selectedSector)}
              onRefresh={refresh}
            />
          </div>
        )}
      </main>
    </div>
  );
}