import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ChevronUp, ChevronDown } from 'lucide-react';

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6'];

export default function SectorAnalyticsChart({ sectorStats, brands, sectors }) {
  const [sortField, setSortField] = useState('brandCount');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedSector, setSelectedSector] = useState(null);

  const sorted = useMemo(() => {
    return [...sectorStats].sort((a, b) => {
      const av = a[sortField] || 0;
      const bv = b[sortField] || 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [sectorStats, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const selectedBrands = selectedSector
    ? brands.filter(b => b.sector === selectedSector)
    : [];

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-purple-700 mb-1">📊 Sector Analytics</h2>
        <p className="text-sm text-gray-500 mb-4">Brands per sector — click a bar to see brand snapshots</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sorted} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-40} textAnchor="end" interval={0} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(val, name) => [val, name === 'brandCount' ? 'Brands' : 'Subnodes']}
              labelFormatter={l => l}
            />
            <Bar dataKey="brandCount" name="brandCount" radius={[4,4,0,0]} cursor="pointer"
              onClick={(d) => setSelectedSector(prev => prev === d.key ? null : d.key)}>
              {sorted.map((entry, i) => (
                <Cell key={entry.key} fill={selectedSector === entry.key ? '#4f46e5' : COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sortable Brand Snapshots Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-bold text-gray-800 text-lg">
            {selectedSector ? `${sectors[selectedSector]} — Brand Snapshots` : 'All Sector Snapshots'}
          </h3>
          {selectedSector && (
            <button onClick={() => setSelectedSector(null)} className="text-xs text-indigo-600 underline">
              Clear filter
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Sector</th>
                <th className="text-left px-4 py-3">
                  <button className="flex items-center font-semibold text-gray-700" onClick={() => toggleSort('brandCount')}>
                    Brands {sortField === 'brandCount' ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />) : null}
                  </button>
                </th>
                <th className="text-left px-4 py-3">
                  <button className="flex items-center font-semibold text-gray-700" onClick={() => toggleSort('subnodeCount')}>
                    Subnodes {sortField === 'subnodeCount' ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />) : null}
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Brand Names</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(selectedSector
                ? sorted.filter(s => s.key === selectedSector)
                : sorted
              ).map(row => (
                <tr
                  key={row.key}
                  className="hover:bg-purple-50/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedSector(prev => prev === row.key ? null : row.key)}
                >
                  <td className="px-4 py-3 font-medium">{row.label}</td>
                  <td className="px-4 py-3 text-indigo-600 font-semibold">{row.brandCount}</td>
                  <td className="px-4 py-3 text-teal-600 font-semibold">{row.subnodeCount}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {brands.filter(b => b.sector === row.key).map(b => b.name).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brand Snapshot Cards for selected sector */}
      {selectedSector && selectedBrands.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-800 mb-4">Brand Snapshots — {sectors[selectedSector]}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedBrands.map(brand => (
              <div key={brand.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-bold text-indigo-700">{brand.name}™</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{brand.description || 'No description'}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                    {brand.subnodes?.length || 0} subnodes
                  </span>
                  {brand.isSystemBrand && (
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Core</span>
                  )}
                </div>
                {brand.subnodes?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {brand.subnodes.slice(0, 4).map((s, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                    {brand.subnodes.length > 4 && (
                      <span className="text-[10px] text-gray-400">+{brand.subnodes.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}