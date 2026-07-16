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
    <div className="bg-card border border-border rounded-xl p-3 text-xs shadow-lg">
      <p className="text-foreground font-bold mb-2">{label}</p>
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
    { key: 'base', label: 'Base Case', color: '#0d9488', rate: monthlyRate },
    { key: 'optimistic', label: 'Optimistic', color: '#16a34a', rate: monthlyRate * 1.4 },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Master License Value Projection
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Based on subnode expansion trends across {Object.keys(ECOSYSTEM_DATA).length} active sectors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Projection window:</span>
          {[12, 24].map(m => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                months === m
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary'
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
          { label: 'Current Portfolio', value: fmt(totalValue), Icon: DollarSign, color: 'text-primary' },
          { label: `${months}mo Projected (Base)`, value: fmt(finalPoint?.base || 0), Icon: TrendingUp, color: 'text-fruitful-green' },
          { label: 'Projected Growth', value: `+${growthPct.toFixed(1)}%`, Icon: BarChart2, color: 'text-hotstack-amber' },
          { label: 'Monthly Rate (Base)', value: `${(monthlyRate * 100).toFixed(2)}%/mo`, Icon: Layers, color: 'text-primary' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-muted border border-border rounded-xl p-4 text-center">
            <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
            <p className={`text-lg font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#64748b', fontSize: 10 }}
              interval={months === 12 ? 1 : 3}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={{ stroke: '#e2e8f0' }}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: '#64748b' }}
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
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Top 5 Sectors by License Portfolio Value
        </h3>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top5Sectors} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tickFormatter={fmt} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#e2e8f0' }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Current Value" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth rate table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {['Sector', 'Brands', 'Subnodes', 'Current Value', 'Monthly Rate', `${months}mo Projected`].map(h => (
                <th key={h} className="text-left text-muted-foreground font-semibold uppercase tracking-wide pb-2 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...sectorMetrics].sort((a, b) => b.value - a.value).slice(0, 8).map(s => {
              const rate = getSectorGrowthRate(s.avgSubnodesPerBrand);
              const projected = s.value * Math.pow(1 + rate, months);
              return (
                <tr key={s.sector} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-2 pr-4 text-foreground font-medium">{s.label.slice(0, 20)}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{s.brands}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{s.subnodes}</td>
                  <td className="py-2 pr-4 text-primary font-bold">{fmt(s.value)}</td>
                  <td className="py-2 pr-4 text-hotstack-amber">{(rate * 100).toFixed(2)}%</td>
                  <td className="py-2 pr-4 text-fruitful-green font-bold">{fmt(projected)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Projections use compound growth modelling weighted by subnode density per sector. Not financial advice.
      </p>
    </div>
  );
}
