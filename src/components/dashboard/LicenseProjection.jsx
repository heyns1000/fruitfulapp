import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { ECOSYSTEM_DATA, SECTOR_LIST } from '../data/ecosystemData';
import { TrendingUp, DollarSign, Layers, BarChart2, Calendar } from 'lucide-react';

// Calculate base metrics from ecosystem data
function getEcosystemMetrics() {
  let totalValue = 0;
  let totalBrands = 0;
  let totalSubnodes = 0;
  const sectorMetrics = [];

  Object.entries(ECOSYSTEM_DATA).forEach(([sector, brands]) => {
    if (!brands.length) return;
    const sectorValue = brands.reduce((s, b) => s + b.masterLicensePrice, 0);
    const sectorSubnodes = brands.reduce((s, b) => s + b.subNodes.length, 0);
    totalValue += sectorValue;
    totalBrands += brands.length;
    totalSubnodes += sectorSubnodes;
    sectorMetrics.push({
      sector,
      label: (SECTOR_LIST[sector] || sector).replace(/^\S+\s/, ''),
      value: sectorValue,
      brands: brands.length,
      subnodes: sectorSubnodes,
      avgSubnodesPerBrand: sectorSubnodes / brands.length,
    });
  });

  return { totalValue, totalBrands, totalSubnodes, sectorMetrics };
}

// Growth rate model: sectors with higher subnode density grow faster
// Base monthly growth: 1.5% — high density sectors get up to 3.5%
function getSectorGrowthRate(avgSubnodesPerBrand) {
  const base = 0.015;
  const bonus = Math.min((avgSubnodesPerBrand / 10) * 0.02, 0.02);
  return base + bonus;
}

function buildProjection(totalValue, sectorMetrics, months) {
  const data = [];
  let runningValue = totalValue;
  // Composite monthly growth rate weighted by sector value
  const weightedMonthlyRate = sectorMetrics.reduce((sum, s) => {
    const w = s.value / totalValue;
    return sum + w * getSectorGrowthRate(s.avgSubnodesPerBrand);
  }, 0);

  for (let m = 0; m <= months; m++) {
    const label = m === 0 ? 'Now' : `M${m}`;
    const conservative = totalValue * Math.pow(1 + weightedMonthlyRate * 0.6, m);
    const base = totalValue * Math.pow(1 + weightedMonthlyRate, m);
    const optimistic = totalValue * Math.pow(1 + weightedMonthlyRate * 1.4, m);
    data.push({ label, conservative, base, optimistic, month: m });
  }
  return { data, monthlyRate: weightedMonthlyRate };
}

const fmt = (v) => {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  return `$${(v / 1000).toFixed(0)}K`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3 text-xs shadow-2xl">
      <p className="text-[#90cdf4] font-bold mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="mb-0.5">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function LicenseProjection() {
  const [months, setMonths] = useState(12);
  const [activeScenario, setActiveScenario] = useState('base');

  const { totalValue, totalBrands, totalSubnodes, sectorMetrics } = useMemo(getEcosystemMetrics, []);
  const { data: projectionData, monthlyRate } = useMemo(
    () => buildProjection(totalValue, sectorMetrics, months),
    [totalValue, sectorMetrics, months]
  );

  const finalPoint = projectionData[projectionData.length - 1];
  const growth = finalPoint ? finalPoint[activeScenario] - totalValue : 0;
  const growthPct = totalValue ? (growth / totalValue) * 100 : 0;

  const top5Sectors = [...sectorMetrics]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const scenarios = [
    { key: 'conservative', label: 'Conservative', color: '#f59e0b', rate: monthlyRate * 0.6 },
    { key: 'base', label: 'Base Case', color: '#22d3ee', rate: monthlyRate },
    { key: 'optimistic', label: 'Optimistic', color: '#4ade80', rate: monthlyRate * 1.4 },
  ];

  return (
    <div className="bg-[#0f172a] border border-[#1e3a5f] rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#90cdf4] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Master License Value Projection
          </h2>
          <p className="text-[#64748b] text-sm mt-0.5">
            Based on subnode expansion trends across {Object.keys(ECOSYSTEM_DATA).length} active sectors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#64748b]" />
          <span className="text-xs text-[#94a3b8]">Projection window:</span>
          {[12, 24].map(m => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                months === m
                  ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white'
                  : 'border-[#334155] text-[#94a3b8] hover:border-[#0ea5e9]'
              }`}
            >
              {m}mo
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Current Portfolio', value: fmt(totalValue), icon: DollarSign, color: 'text-[#22d3ee]' },
          { label: `${months}mo Projected (Base)`, value: fmt(finalPoint?.base || 0), icon: TrendingUp, color: 'text-[#4ade80]' },
          { label: 'Projected Growth', value: `+${growthPct.toFixed(1)}%`, icon: BarChart2, color: 'text-[#f59e0b]' },
          { label: 'Monthly Rate (Base)', value: `${(monthlyRate * 100).toFixed(2)}%/mo`, icon: Layers, color: 'text-[#c084fc]' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 text-center">
            <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
            <p className={`text-lg font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-[#64748b] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Scenario selector */}
      <div className="flex flex-wrap gap-2">
        {scenarios.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveScenario(s.key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activeScenario === s.key ? 'opacity-100 border-current' : 'opacity-50 border-[#334155]'
            }`}
            style={{ color: s.color, borderColor: activeScenario === s.key ? s.color : undefined }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label} — {(s.rate * 100).toFixed(2)}%/mo
          </button>
        ))}
      </div>

      {/* Main projection chart */}
      <div className="w-full" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {scenarios.map(s => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#64748b', fontSize: 10 }}
              interval={months === 12 ? 1 : 3}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={{ stroke: '#1e293b' }}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
              formatter={(val) => scenarios.find(s => s.key === val)?.label || val}
            />
            {scenarios.map(s => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={activeScenario === s.key ? 2.5 : 1}
                fill={`url(#grad-${s.key})`}
                fillOpacity={activeScenario === s.key ? 1 : 0.3}
                dot={false}
                activeDot={{ r: 4, fill: s.color }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top sectors by value */}
      <div>
        <h3 className="text-sm font-bold text-[#94a3b8] uppercase tracking-widest mb-3">
          Top 5 Sectors by License Portfolio Value
        </h3>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top5Sectors} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tickFormatter={fmt} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e293b' }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Current Value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth rate table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1e3a5f]">
              {['Sector', 'Brands', 'Subnodes', 'Current Value', 'Monthly Rate', `${months}mo Projected`].map(h => (
                <th key={h} className="text-left text-[#64748b] font-semibold uppercase tracking-wide pb-2 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...sectorMetrics].sort((a, b) => b.value - a.value).slice(0, 8).map(s => {
              const rate = getSectorGrowthRate(s.avgSubnodesPerBrand);
              const projected = s.value * Math.pow(1 + rate, months);
              return (
                <tr key={s.sector} className="border-b border-[#1e293b] hover:bg-[#1e293b]/50 transition-colors">
                  <td className="py-2 pr-4 text-[#e2e8f0] font-medium">{s.label.slice(0, 20)}</td>
                  <td className="py-2 pr-4 text-[#94a3b8]">{s.brands}</td>
                  <td className="py-2 pr-4 text-[#94a3b8]">{s.subnodes}</td>
                  <td className="py-2 pr-4 text-[#22d3ee] font-bold">{fmt(s.value)}</td>
                  <td className="py-2 pr-4 text-[#f59e0b]">{(rate * 100).toFixed(2)}%</td>
                  <td className="py-2 pr-4 text-[#4ade80] font-bold">{fmt(projected)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-[#475569] text-center">
        Projections use compound growth modelling weighted by subnode density per sector. Not financial advice.
      </p>
    </div>
  );
}