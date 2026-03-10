import React, { useState, useRef, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ECOSYSTEM_DATA, SECTOR_LIST } from '../data/ecosystemData';
import {
  Download, Upload, RefreshCw, CheckSquare, Square,
  DollarSign, AlertTriangle, CheckCircle2, Loader2, FileText
} from 'lucide-react';

// ── CSV helpers ──────────────────────────────────────────────────────────────
function toCSV(rows, headers) {
  const escape = (v) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  rows.forEach(r => lines.push(headers.map(h => escape(r[h])).join(',')));
  return lines.join('\n');
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    vals.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
    return obj;
  });
}

// ── Sector pricing from ecosystem data ───────────────────────────────────────
function getEcosystemPricingRows() {
  const rows = [];
  Object.entries(ECOSYSTEM_DATA).forEach(([sector, brands]) => {
    if (!brands.length) return;
    brands.forEach(b => {
      rows.push({
        sector,
        sector_label: (SECTOR_LIST[sector] || sector).replace(/^\S+\s/, ''),
        brand: b.name,
        subnodes: b.subNodes.join(' | '),
        subnode_count: b.subNodes.length,
        master_license_price: b.masterLicensePrice,
      });
    });
  });
  return rows;
}

const EXPORT_HEADERS = ['sector', 'sector_label', 'brand', 'subnodes', 'subnode_count', 'master_license_price'];

const SECTORS_MAP = Object.fromEntries(
  Object.entries(SECTOR_LIST).map(([k, v]) => [k, v])
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function BulkOperations() {
  const queryClient = useQueryClient();
  const fileRef = useRef();

  // DB brands for CSV export + import target
  const { data: dbBrands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date'),
  });

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExportEcosystem = () => {
    const rows = getEcosystemPricingRows();
    downloadCSV(toCSV(rows, EXPORT_HEADERS), 'faa_ecosystem_pricing.csv');
  };

  const handleExportDBBrands = () => {
    const rows = dbBrands.map(b => ({
      id: b.id,
      name: b.name,
      sector: b.sector,
      subnodes: (b.subnodes || []).join(' | '),
      subnode_count: (b.subnodes || []).length,
      description: b.description || '',
      tags: (b.tags || []).join(' | '),
    }));
    downloadCSV(
      toCSV(rows, ['id', 'name', 'sector', 'subnodes', 'subnode_count', 'description', 'tags']),
      'faa_database_brands.csv'
    );
  };

  // ── Import ──────────────────────────────────────────────────────────────────
  const [importStatus, setImportStatus] = useState(null); // null | 'loading' | { created, updated, errors }
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCSV(text);
    setImportStatus('loading');
    let created = 0, updated = 0, errors = 0;
    for (const row of rows) {
      const name = row.name?.trim() || row.brand?.trim();
      const sector = row.sector?.trim();
      if (!name || !sector) { errors++; continue; }
      const subnodes = row.subnodes ? row.subnodes.split('|').map(s => s.trim()).filter(Boolean) : [];
      const payload = { name, sector, subnodes, description: row.description || '', tags: row.tags ? row.tags.split('|').map(t => t.trim()) : [] };
      const existing = dbBrands.find(b => b.name.toLowerCase() === name.toLowerCase() && b.sector === sector);
      try {
        if (existing) {
          await base44.entities.Brand.update(existing.id, payload);
          updated++;
        } else {
          await base44.entities.Brand.create(payload);
          created++;
        }
      } catch { errors++; }
    }
    setImportStatus({ created, updated, errors });
    queryClient.invalidateQueries({ queryKey: ['brands'] });
    e.target.value = '';
  };

  // ── Batch Price Update ──────────────────────────────────────────────────────
  const allSectors = useMemo(() => {
    const keys = new Set();
    Object.keys(ECOSYSTEM_DATA).forEach(k => keys.add(k));
    dbBrands.forEach(b => b.sector && keys.add(b.sector));
    return [...keys].sort();
  }, [dbBrands]);

  const [selectedSectors, setSelectedSectors] = useState(new Set());
  const [priceMode, setPriceMode] = useState('percent'); // 'percent' | 'fixed'
  const [priceValue, setPriceValue] = useState('');
  const [batchStatus, setBatchStatus] = useState(null);

  const toggleSector = (s) => {
    setSelectedSectors(prev => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });
  };
  const toggleAll = () => {
    if (selectedSectors.size === allSectors.length) setSelectedSectors(new Set());
    else setSelectedSectors(new Set(allSectors));
  };

  const handleBatchPriceUpdate = async () => {
    if (!priceValue || selectedSectors.size === 0) return;
    const val = parseFloat(priceValue);
    if (isNaN(val)) return;
    setBatchStatus('loading');
    const targets = dbBrands.filter(b => selectedSectors.has(b.sector));
    let ok = 0, fail = 0;
    for (const brand of targets) {
      const currentSubnodes = brand.subnodes?.length || 1;
      // Store pricing signal in metadata
      const basePrice = priceMode === 'percent'
        ? Math.round(currentSubnodes * 1250 * (1 + val / 100))
        : Math.round(val);
      try {
        await base44.entities.Brand.update(brand.id, {
          metadata: {
            ...brand.metadata,
            activeNodes: basePrice,
            securityRating: `${priceMode === 'percent' ? `+${val}%` : `$${val}`}`,
          }
        });
        ok++;
      } catch { fail++; }
    }
    setBatchStatus({ ok, fail, total: targets.length });
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  };

  // Sector current avg price from ecosystem data
  const sectorSummary = useMemo(() => {
    return allSectors.map(s => {
      const eco = ECOSYSTEM_DATA[s] || [];
      const db = dbBrands.filter(b => b.sector === s);
      const avgPrice = eco.length
        ? Math.round(eco.reduce((sum, b) => sum + b.masterLicensePrice, 0) / eco.length)
        : 0;
      return { key: s, label: (SECTOR_LIST[s] || s).replace(/^\S+\s/, ''), eco: eco.length, db: db.length, avgPrice };
    });
  }, [allSectors, dbBrands]);

  return (
    <div className="bg-[#0f172a] border border-[#1e3a5f] rounded-2xl p-6 space-y-8 text-sm">
      <div className="flex items-center gap-3">
        <RefreshCw className="w-5 h-5 text-[#22d3ee]" />
        <h2 className="text-lg font-black text-[#90cdf4]">Bulk Operations Centre</h2>
        <span className="ml-auto text-[#475569] text-xs">{dbBrands.length} brands in DB · {getEcosystemPricingRows().length} ecosystem entries</span>
      </div>

      {/* ── EXPORT ── */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-widest flex items-center gap-2">
          <Download className="w-3.5 h-3.5" /> Export Data
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportEcosystem}
            className="flex items-center gap-3 bg-[#1e293b] hover:bg-[#0e4976] border border-[#334155] hover:border-[#0ea5e9] rounded-xl p-4 transition-all text-left group"
          >
            <FileText className="w-5 h-5 text-[#0ea5e9] shrink-0" />
            <div>
              <p className="font-semibold text-[#e2e8f0] group-hover:text-white">Ecosystem Pricing CSV</p>
              <p className="text-xs text-[#64748b]">{getEcosystemPricingRows().length} rows · all sectors + master license prices</p>
            </div>
            <Download className="w-4 h-4 text-[#64748b] ml-auto" />
          </button>
          <button
            onClick={handleExportDBBrands}
            className="flex items-center gap-3 bg-[#1e293b] hover:bg-[#0e4976] border border-[#334155] hover:border-[#0ea5e9] rounded-xl p-4 transition-all text-left group"
          >
            <FileText className="w-5 h-5 text-[#4ade80] shrink-0" />
            <div>
              <p className="font-semibold text-[#e2e8f0] group-hover:text-white">Database Brands CSV</p>
              <p className="text-xs text-[#64748b]">{dbBrands.length} brands · includes subnodes, tags, descriptions</p>
            </div>
            <Download className="w-4 h-4 text-[#64748b] ml-auto" />
          </button>
        </div>
      </section>

      {/* ── IMPORT ── */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-widest flex items-center gap-2">
          <Upload className="w-3.5 h-3.5" /> Import CSV
        </h3>
        <div className="bg-[#1e293b] border-2 border-dashed border-[#334155] hover:border-[#0ea5e9] rounded-xl p-6 text-center transition-colors">
          <Upload className="w-8 h-8 text-[#64748b] mx-auto mb-2" />
          <p className="text-[#94a3b8] mb-1 font-medium">Upload brands CSV</p>
          <p className="text-xs text-[#475569] mb-3">Columns: <code className="text-[#0ea5e9]">name, sector, subnodes, description, tags</code> — existing brands updated, new ones created</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importStatus === 'loading'}
            className="px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
          >
            {importStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Choose CSV File
          </button>
        </div>
        {importStatus && importStatus !== 'loading' && (
          <div className="flex items-center gap-3 bg-[#1e293b] border border-[#22d3ee]/30 rounded-xl p-4">
            <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
            <span className="text-[#94a3b8]">
              Import complete — <span className="text-[#4ade80] font-bold">{importStatus.created} created</span>,{' '}
              <span className="text-[#22d3ee] font-bold">{importStatus.updated} updated</span>
              {importStatus.errors > 0 && <span className="text-[#f87171] font-bold">, {importStatus.errors} skipped</span>}
            </span>
          </div>
        )}
      </section>

      {/* ── BATCH PRICE UPDATE ── */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-widest flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5" /> Batch Master License Pricing
        </h3>

        {/* Price input */}
        <div className="flex flex-wrap items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-xl p-4">
          <div className="flex gap-1">
            {['percent', 'fixed'].map(m => (
              <button
                key={m}
                onClick={() => setPriceMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${priceMode === m ? 'bg-[#0ea5e9] text-white' : 'text-[#94a3b8] hover:bg-[#334155]'}`}
              >
                {m === 'percent' ? '% Adjust' : '$ Fixed'}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder={priceMode === 'percent' ? 'e.g. 10 (for +10%)' : 'e.g. 25000'}
            value={priceValue}
            onChange={e => setPriceValue(e.target.value)}
            className="flex-1 min-w-[180px] bg-[#0f172a] border border-[#334155] text-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0ea5e9]"
          />
          <button
            onClick={handleBatchPriceUpdate}
            disabled={!priceValue || selectedSectors.size === 0 || batchStatus === 'loading'}
            className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-40"
          >
            {batchStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Apply to {selectedSectors.size} sector{selectedSectors.size !== 1 ? 's' : ''}
          </button>
        </div>

        {batchStatus && batchStatus !== 'loading' && (
          <div className={`flex items-center gap-3 rounded-xl p-3 border text-xs ${batchStatus.fail > 0 ? 'bg-[#1e293b] border-[#f87171]/30' : 'bg-[#1e293b] border-[#4ade80]/30'}`}>
            {batchStatus.fail > 0 ? <AlertTriangle className="w-4 h-4 text-[#f87171]" /> : <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />}
            <span className="text-[#94a3b8]">
              Updated <span className="text-[#4ade80] font-bold">{batchStatus.ok}</span> of{' '}
              <span className="text-[#22d3ee] font-bold">{batchStatus.total}</span> brands
              {batchStatus.fail > 0 && <span className="text-[#f87171]"> ({batchStatus.fail} failed)</span>}
            </span>
          </div>
        )}

        {/* Sector selection table */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#334155] bg-[#0f172a]">
            <button onClick={toggleAll} className="flex items-center gap-2 text-xs text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
              {selectedSectors.size === allSectors.length
                ? <CheckSquare className="w-4 h-4 text-[#0ea5e9]" />
                : <Square className="w-4 h-4" />}
              {selectedSectors.size === allSectors.length ? 'Deselect All' : 'Select All'} ({allSectors.length} sectors)
            </button>
            <span className="text-xs text-[#475569]">
              {selectedSectors.size > 0 && `${dbBrands.filter(b => selectedSectors.has(b.sector)).length} brands will be updated`}
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-[#1e293b]">
            {sectorSummary.map(s => (
              <label
                key={s.key}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[#0f172a]/60 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSectors.has(s.key)}
                  onChange={() => toggleSector(s.key)}
                  className="accent-[#0ea5e9] w-4 h-4"
                />
                <span className="flex-1 text-[#e2e8f0] font-medium">{s.label}</span>
                <span className="text-[#64748b] text-xs w-20 text-right">{s.eco} eco · {s.db} db</span>
                <span className="text-[#22d3ee] font-bold w-24 text-right text-xs">
                  {s.avgPrice ? `$${s.avgPrice.toLocaleString()}` : '—'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}