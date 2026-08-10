import React from 'react';
import { Globe, ShieldCheck, TrendingUp, Layers, Anchor, Ship, MapPin } from 'lucide-react';
import SupplierMasterDirectory from './SupplierMasterDirectory';

const BRAND_GREEN = '#4ECDC4';
const BRAND_RED = '#E91E63';
const BRAND_DARK = '#1a1a2e';

const SUPPLIERS = [
  {
    name: 'Nonda Coffee',
    origin: 'Uganda',
    role: 'Primary Origin Volume',
    mechanism: 'FOB / CIF (USD)',
    note: 'Direct origin control. FOB for freight selection + insurance control; CIF to offload maritime variables.',
    flag: '🇺🇬',
    color: BRAND_GREEN,
  },
  {
    name: 'Royal Pacific Harvest',
    origin: 'Indonesia',
    role: 'Primary Origin Volume',
    mechanism: 'FOB / CIF (USD)',
    note: 'Secondary origin for blend diversification and supply continuity.',
    flag: '🇮🇩',
    color: '#FF9800',
  },
  {
    name: 'Algrano Network',
    origin: 'B2B Platform',
    role: 'Forward Contracting',
    mechanism: 'Decentralized B2B (USD)',
    note: 'Bypasses secondary brokers. Secures forward pricing and direct origin contracts.',
    flag: '🌐',
    color: '#9C27B0',
  },
  {
    name: 'Green Coffee Supply',
    origin: 'Durbanville, ZA',
    role: 'Localized Spot Allocation',
    mechanism: 'Direct Local Purchase (ZAR)',
    note: 'Zero import lead time. Deficit mitigation only — carries a localized premium.',
    flag: '🇿🇦',
    color: BRAND_RED,
  },
];

const QC_TOLERANCES = [
  { metric: 'Moisture Content', target: '9% – 12%', reject: '>12% mold/bacterial risk · <9% cellular damage & roast distortion', icon: ShieldCheck },
  { metric: 'Defect Matrix', target: 'SCA green grading', reject: 'Reject: full black, full sour, fungus, severe insect damage', icon: ShieldCheck },
  { metric: 'Cupping Threshold', target: 'SCA 80 baseline · 83+ premium', reject: 'Commercial floor 80; premium lines require 83+', icon: ShieldCheck },
];

const EXECUTION_PHASES = [
  { phase: '01', action: 'Spot Inventory', target: 'Green Coffee Supply (Durbanville)', mechanism: 'Direct Local Purchase (ZAR)', icon: MapPin },
  { phase: '02', action: 'Forward Contracts', target: 'Algrano Network', mechanism: 'B2B Platform (USD)', icon: Layers },
  { phase: '03', action: 'Bulk Origin Sourcing', target: 'Nonda / Royal Pacific', mechanism: 'FOB / CIF Contracts (USD)', icon: Ship },
];

export default function SourcingProcurement() {
  return (
    <div className="space-y-6">
      {/* Protocol header */}
      <div className="rounded-2xl p-6 shadow-md text-white" style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, #2d1b4e 60%, #1a3a3a 100%)` }}>
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-6 h-6" style={{ color: BRAND_GREEN }} />
          <h2 className="text-xl font-black">Global Sourcing Architecture & Cost Engine Protocol</h2>
        </div>
        <p className="text-sm text-gray-300 max-w-3xl">
          Multi-tier procurement combining direct origin FOB/CIF volume, decentralized Algrano forward-contracting,
          and localized ZAR spot allocation — all governed by strict QC tolerances and C-Market + differential pricing.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {['FOB/CIF Origin', 'Algrano Forward', 'ZAR Spot', '9–12% Moisture', 'C-Market + Differential', 'ZAR/USD Hedge'].map(t => (
            <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: BRAND_GREEN + '25', color: BRAND_GREEN, border: `1px solid ${BRAND_GREEN}50` }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 0. Supplier Master Directory — ingested from database */}
      <SupplierMasterDirectory />

      {/* 1. Procurement & Contracting */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Anchor className="w-5 h-5" style={{ color: BRAND_GREEN }} />
          1 · Procurement & Contracting Mechanisms
        </h3>
        <p className="text-xs text-gray-400 mb-5">Direct Origin (FOB/CIF) · Decentralized Tracking (Algrano) · Localized Spot (ZA)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPLIERS.map(s => (
            <div key={s.name} className="border rounded-xl p-4 hover:shadow-sm transition-shadow" style={{ borderColor: s.color + '40' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.flag}</span>
                  <div>
                    <p className="font-bold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.origin}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: s.color + '20', color: s.color }}>
                  {s.role}
                </span>
              </div>
              <p className="text-xs font-mono mb-2" style={{ color: s.color }}>{s.mechanism}</p>
              <p className="text-sm text-gray-600">{s.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="font-bold text-blue-800 text-sm mb-1">FOB (Free on Board)</p>
            <p className="text-xs text-blue-700">Risk transfers at port of departure. Granular freight + insurance control. Requires strict pre-shipment sample validation.</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="font-bold text-purple-800 text-sm mb-1">CIF (Cost, Insurance, Freight)</p>
            <p className="text-xs text-purple-700">Supplier absorbs freight + insurance. Higher landed cost but isolates operations from maritime variables.</p>
          </div>
        </div>
      </div>

      {/* 2. Quality Control */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" style={{ color: BRAND_RED }} />
          2 · Quality Control & Physical Tolerances
        </h3>
        <p className="text-xs text-gray-400 mb-5">Enforced at origin and port of discharge</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QC_TOLERANCES.map(q => {
            const Icon = q.icon;
            return (
              <div key={q.metric} className="border-l-4 rounded-r-xl p-4 bg-gray-50" style={{ borderColor: BRAND_RED }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: BRAND_RED }} />
                  <p className="font-bold text-gray-800 text-sm">{q.metric}</p>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: BRAND_GREEN }}>{q.target}</p>
                <p className="text-xs text-gray-500">{q.reject}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Financial Hedging & Price Construction */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: '#FF9800' }} />
          3 · Financial Hedging & Price Construction
        </h3>
        <p className="text-xs text-gray-400 mb-5">Pricing formula and currency risk isolation</p>
        <div className="bg-gray-900 rounded-xl p-5 text-center mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Pricing Formula</p>
          <p className="text-lg font-mono font-bold text-white">
            Final Price = <span style={{ color: BRAND_GREEN }}>New York C-Market (KC) Futures</span> + <span style={{ color: BRAND_RED }}>Origin Differential</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: BRAND_GREEN + '12' }}>
            <p className="font-bold text-sm mb-1" style={{ color: BRAND_GREEN }}>Differential Dynamics</p>
            <p className="text-xs text-gray-600">Accounts for local logistics, quality premiums, and scarcity. C-Market drives macro volatility; differentials reflect micro-level supply chain stability.</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FF9800' + '12' }}>
            <p className="font-bold text-sm mb-1" style={{ color: '#FF9800' }}>FX Hedging</p>
            <p className="text-xs text-gray-600">Lock ZAR/USD forward contracts on PI issuance. Isolates the BOM costing engine from fiat fluctuations during the 45–60 day transit window.</p>
          </div>
        </div>
      </div>

      {/* 4. Execution Path */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Layers className="w-5 h-5" style={{ color: '#9C27B0' }} />
          4 · Execution Path
        </h3>
        <p className="text-xs text-gray-400 mb-5">Sequenced procurement deployment</p>
        <div className="space-y-3">
          {EXECUTION_PHASES.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.phase} className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: '#9C27B0' + '30' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white shrink-0" style={{ backgroundColor: '#9C27B0' }}>
                  {p.phase}
                </div>
                <Icon className="w-5 h-5 text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{p.action}</p>
                  <p className="text-xs text-gray-500">{p.target} · {p.mechanism}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crux summary */}
      <div className="rounded-2xl p-6 shadow-md" style={{ background: `linear-gradient(135deg, ${BRAND_GREEN}15, ${BRAND_RED}10)` }}>
        <h3 className="text-lg font-black text-gray-800 mb-3">⚡ Crux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {[
            ['Origin', 'Nonda (Uganda) / Royal Pacific (Indonesia) via FOB/CIF'],
            ['Platform', 'Algrano for forward-contracting'],
            ['Spot', 'Green Coffee Supply (Durbanville) — zero-logistics deficit mitigation'],
            ['Metrics', 'Strict 9–12% moisture · C-Market + Differential pricing'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="font-bold text-gray-700 shrink-0">{k}:</span>
              <span className="text-gray-600">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}