import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminGlobalIndex({ brands, sectors }) {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let list = [...brands];
    if (search) list = list.filter(b =>
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()) ||
      b.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
    if (sectorFilter !== 'all') list = list.filter(b => b.sector === sectorFilter);
    list.sort((a, b) => {
      let av = sortField === 'subnodes' ? (a.subnodes?.length || 0) : (a[sortField] || '');
      let bv = sortField === 'subnodes' ? (b.subnodes?.length || 0) : (b[sortField] || '');
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [brands, search, sectorFilter, sortField, sortDir]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-indigo-600" /> : <ChevronDown className="w-3 h-3 ml-1 text-indigo-600" />;
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">🌐 Global Brand Index</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search brands, tags, descriptions..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={sectorFilter}
          onChange={e => setSectorFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm min-w-[160px]"
        >
          <option value="all">All Sectors</option>
          {Object.entries(sectors).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-500 mb-3">{filtered.length} brand{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">
                <button className="flex items-center font-semibold text-gray-700" onClick={() => toggleSort('name')}>
                  Brand <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button className="flex items-center font-semibold text-gray-700" onClick={() => toggleSort('sector')}>
                  Sector <SortIcon field="sector" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button className="flex items-center font-semibold text-gray-700" onClick={() => toggleSort('subnodes')}>
                  Subnodes <SortIcon field="subnodes" />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Tags</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">System</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No brands match your filters.</td></tr>
            ) : filtered.map(brand => (
              <tr key={brand.id} className="hover:bg-indigo-50/40 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{brand.name}™</td>
                <td className="px-4 py-3 text-gray-600">{sectors[brand.sector] || brand.sector || '—'}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-indigo-600">{brand.subnodes?.length || 0}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(brand.tags || []).slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {brand.isSystemBrand && <Badge className="bg-purple-100 text-purple-700 text-xs">Core</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}