import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingDown, AlertTriangle, Package, Truck } from 'lucide-react';

const BRAND_GREEN = '#4ECDC4';
const BRAND_RED = '#E91E63';
const BRAND_ORANGE = '#FF9800';

// Source: KioskLandedCost single-unit amortized basis
const UNIT_FOB_ZAR = 3500 * 17;        // R59,500
const UNIT_FREIGHT = 58510.50;         // Afristar estimate
const TRUE_UNIT_LANDED = UNIT_FOB_ZAR + UNIT_FREIGHT; // R118,010.50

// Build batch comparison data — current + projected fleet rollouts
const BATCHES = [
  { batch: 'Batch 1\n(Kiosk #1)',  estimate: UNIT_FREIGHT, actual: TRUE_UNIT_LANDED, hardware: UNIT_FOB_ZAR, freight: UNIT_FREIGHT },
  { batch: 'Batch 2\n(Kiosk #2)',  estimate: UNIT_FREIGHT, actual: TRUE_UNIT_LANDED, hardware: UNIT_FOB_ZAR, freight: UNIT_FREIGHT },
  { batch: 'Batch 3\n(Kiosk #3)',  estimate: UNIT_FREIGHT, actual: TRUE_UNIT_LANDED, hardware: UNIT_FOB_ZAR, freight: UNIT_FREIGHT },
  { batch: 'Batch 4\n(Kiosk #4)',  estimate: UNIT_FREIGHT, actual: TRUE_UNIT_LANDED, hardware: UNIT_FOB_ZAR, freight: UNIT_FREIGHT },
  { batch: 'Batch 5\n(Kiosk #5)',  estimate: UNIT_FREIGHT, actual: TRUE_UNIT_LANDED, hardware: UNIT_FOB_ZAR, freight: UNIT_FREIGHT },
];

const CUMULATIVE = BATCHES.map((b, i) => ({
  batch: `Batch ${i + 1}`,
  estimate: UNIT_FREIGHT * (i + 1),
  actual: TRUE_UNIT_LANDED * (i + 1),
}));

export default function LandedCostComparisonChart() {
  const [view, setView] = useState('per-unit');

  const variance = TRUE_UNIT_LANDED - UNIT_FREIGHT;
  const variancePct = ((variance / UNIT_FREIGHT) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: BRAND_ORANGE }} />
              Estimate vs. True Landed Cost
            </h3>
            <p className="text-sm text-gray-400">
              Original Afristar freight estimate vs. true amortized landed cost (hardware + freight)
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase">Original Estimate</p>
              <p className="text-2xl font-black" style={{ color: BRAND_GREEN }}>R{UNIT_FREIGHT.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="text-gray-600 text-2xl">→</div>
            <div>
              <p className="text-xs text-gray-500 uppercase">True Landed</p>
              <p className="text-2xl font-black" style={{ color: BRAND_ORANGE }}>R{TRUE_UNIT_LANDED.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-2">
              <p className="text-xs text-red-400 uppercase">Variance</p>
              <p className="text-2xl font-black text-red-400">+{variancePct}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('per-unit')}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={view === 'per-unit'
            ? { background: BRAND_RED, color: 'white' }
            : { background: 'white', color: '#666', border: '1px solid #e5e7eb' }}
        >
          Per-Unit Comparison
        </button>
        <button
          onClick={() => setView('cumulative')}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={view === 'cumulative'
            ? { background: BRAND_RED, color: 'white' }
            : { background: 'white', color: '#666', border: '1px solid #e5e7eb' }}
        >
          Cumulative Fleet Rollout
        </button>
        <button
          onClick={() => setView('composition')}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={view === 'composition'
            ? { background: BRAND_RED, color: 'white' }
            : { background: 'white', color: '#666', border: '1px solid #e5e7eb' }}
        >
          Cost Composition
        </button>
      </div>

      {/* Per-unit bar chart */}
      {view === 'per-unit' && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-1">📊 Per-Kiosk: Estimate vs True Landed Cost</h3>
          <p className="text-xs text-gray-400 mb-5">Each batch = 1 kiosk unit. Original estimate covered freight only; true cost includes PI hardware FOB.</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={BATCHES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="batch" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `R${v.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} />
              <Legend />
              <Bar dataKey="estimate" name="Original Estimate (Freight)" fill={BRAND_GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="True Landed Cost" fill={BRAND_RED} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cumulative line chart */}
      {view === 'cumulative' && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-1">📈 Cumulative Fleet Rollout: Estimate vs True Cost</h3>
          <p className="text-xs text-gray-400 mb-5">Running total across 5-kiosk deployment. Gap widens with each unit.</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={CUMULATIVE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="batch" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={v => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `R${v.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} />
              <Legend />
              <Line type="monotone" dataKey="estimate" name="Cumulative Estimate" stroke={BRAND_GREEN} strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="actual" name="Cumulative True Landed" stroke={BRAND_RED} strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Composition stacked bar */}
      {view === 'composition' && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-1">🧩 True Landed Cost Composition (Per Unit)</h3>
          <p className="text-xs text-gray-400 mb-5">Hardware FOB vs Freight & Clearing — stacked to show true total.</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={BATCHES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="batch" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `R${v.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} />
              <Legend />
              <Bar dataKey="hardware" name="Hardware FOB (ZAR)" stackId="a" fill={BRAND_GREEN} radius={[0, 0, 0, 0]} />
              <Bar dataKey="freight" name="Freight & Clearing (ZAR)" stackId="a" fill={BRAND_RED} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Variance callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-md border-l-4" style={{ borderColor: BRAND_GREEN }}>
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5" style={{ color: BRAND_GREEN }} />
            <p className="text-xs text-gray-500 font-medium uppercase">Hardware FOB (Per Unit)</p>
          </div>
          <p className="text-xl font-bold text-gray-800">R{UNIT_FOB_ZAR.toLocaleString('en-ZA')}</p>
          <p className="text-xs text-gray-400">$3,500 USD × 17.0 ZAR/USD</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-md border-l-4" style={{ borderColor: BRAND_RED }}>
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-5 h-5" style={{ color: BRAND_RED }} />
            <p className="text-xs text-gray-500 font-medium uppercase">Freight & Clearing (Per Unit)</p>
          </div>
          <p className="text-xl font-bold text-gray-800">R{UNIT_FREIGHT.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400">Afristar Quote #108923 · incl. VAT</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-md border-l-4" style={{ borderColor: BRAND_ORANGE }}>
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5" style={{ color: BRAND_ORANGE }} />
            <p className="text-xs text-gray-500 font-medium uppercase">Cost Gap Per Unit</p>
          </div>
          <p className="text-xl font-bold text-gray-800">R{variance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400">+{variancePct}% above original estimate</p>
        </div>
      </div>
    </div>
  );
}