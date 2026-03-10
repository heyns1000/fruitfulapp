import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ECOSYSTEM_DATA, SECTOR_LIST } from '../data/ecosystemData';
import {
  ShieldCheck, ShieldAlert, ShieldX, Activity, Search,
  Download, RefreshCw, Loader2, ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';

// ── Benchmark: compute sector-level stats from static ecosystem data ──────────
function buildSectorBenchmarks() {
  const benchmarks = {};
  Object.entries(ECOSYSTEM_DATA).forEach(([sector, brands]) => {
    if (!brands.length) return;
    const counts = brands.map(b => b.subNodes.length);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    const stddev = Math.sqrt(counts.reduce((s, c) => s + Math.pow(c - avg, 2), 0) / counts.length);
    const avgPrice = brands.reduce((s, b) => s + b.masterLicensePrice, 0) / brands.length;
    benchmarks[sector] = { avg, max, min, stddev, avgPrice, total: brands.length };
  });
  return benchmarks;
}

// ── Health scoring ─────────────────────────────────────────────────────────────
function scoreBrand(brand, benchmarks) {
  const bench = benchmarks[brand.sector];
  const subnodeCount = brand.subnodes?.length || 0;
  const anomalies = [];
  const warnings = [];
  let score = 100;

  if (!bench) {
    anomalies.push('No benchmark data for this sector');
    score -= 20;
  } else {
    // Subnode count vs average
    const deviation = bench.stddev > 0 ? (subnodeCount - bench.avg) / bench.stddev : 0;
    if (subnodeCount === 0) {
      anomalies.push('Zero subnodes detected — asset completely hollow');
      score -= 50;
    } else if (deviation < -1.5) {
      anomalies.push(`Subnodes (${subnodeCount}) critically below sector avg (${bench.avg.toFixed(1)})`);
      score -= 35;
    } else if (deviation < -0.75) {
      warnings.push(`Subnodes (${subnodeCount}) below sector avg (${bench.avg.toFixed(1)})`);
      score -= 15;
    } else if (deviation > 2) {
      warnings.push(`Subnodes (${subnodeCount}) unusually high vs avg (${bench.avg.toFixed(1)}) — verify legitimacy`);
      score -= 5;
    }
  }

  // Missing metadata
  if (!brand.description) { warnings.push('No brand description'); score -= 5; }
  if (!brand.tags?.length) { warnings.push('No tags defined'); score -= 5; }
  if (!brand.metadata?.vault) { warnings.push('No vault assigned'); score -= 5; }

  // Age signal: recently updated is good
  const updatedDaysAgo = brand.updated_date
    ? (Date.now() - new Date(brand.updated_date)) / 86400000
    : 999;
  if (updatedDaysAgo > 180) { warnings.push(`No update in ${Math.round(updatedDaysAgo)} days`); score -= 10; }

  score = Math.max(0, Math.min(100, score));
  const status = score >= 80 ? 'healthy' : score >= 55 ? 'warning' : 'critical';
  return { score, status, anomalies, warnings, subnodeCount, bench };
}

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS = {
  healthy: { label: 'Healthy', color: 'text-[#4ade80]', bg: 'bg-[#4ade80]/10', border: 'border-[#4ade80]/30', Icon: ShieldCheck },
  warning: { label: 'Warning', color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10', border: 'border-[#f59e0b]/30', Icon: ShieldAlert },
  critical: { label: 'Critical', color: 'text-[#f87171]', bg: 'bg-[#f87171]/10', border: 'border-[#f87171]/30', Icon: ShieldX },
};

function ScoreBar({ score, status }) {
  const color = status === 'healthy' ? '#4ade80' : status === 'warning' ? '#f59e0b' : '#f87171';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

function BrandRow({ brand, audit }) {
  const [open, setOpen] = useState(false);
  const { label, color, bg, border, Icon } = STATUS[audit.status];
  const issues = [...audit.anomalies, ...audit.warnings];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${border} ${open ? bg : 'border-[#334155]'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1e293b]/60 transition-colors text-left"
      >
        <Icon className={`w-4 h-4 shrink-0 ${color}`} />
        <span className="flex-1 font-semibold text-[#e2e8f0] text-sm truncate">{brand.name}</span>
        <span className="text-[10px] text-[#64748b] hidden sm:block w-32 truncate">
          {(SECTOR_LIST[brand.sector] || brand.sector || '—').replace(/^\S+\s/, '')}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${bg} ${color} hidden sm:block`}>{label}</span>
        <div className="w-28 hidden md:block">
          <ScoreBar score={audit.score} status={audit.status} />
        </div>
        <span className="text-[#64748b] text-xs w-16 text-right">{audit.subnodeCount} nodes</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#64748b] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#64748b] shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#334155] pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { label: 'Health Score', value: `${audit.score}/100`, v: color },
              { label: 'Subnodes', value: audit.subnodeCount, v: 'text-[#22d3ee]' },
              { label: 'Sector Avg', value: audit.bench ? audit.bench.avg.toFixed(1) : '—', v: 'text-[#94a3b8]' },
              { label: 'Issues', value: issues.length, v: issues.length ? 'text-[#f87171]' : 'text-[#4ade80]' },
            ].map(({ label, value, v }) => (
              <div key={label} className="bg-[#0f172a] rounded-lg p-2 text-center">
                <p className={`font-bold text-base ${v}`}>{value}</p>
                <p className="text-[#64748b] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          {audit.anomalies.length > 0 && (
            <div className="space-y-1">
              {audit.anomalies.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#f87171] bg-[#f87171]/5 rounded-lg px-3 py-2">
                  <ShieldX className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {a}
                </div>
              ))}
            </div>
          )}
          {audit.warnings.length > 0 && (
            <div className="space-y-1">
              {audit.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#f59e0b] bg-[#f59e0b]/5 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {w}
                </div>
              ))}
            </div>
          )}
          {issues.length === 0 && (
            <p className="text-xs text-[#4ade80] bg-[#4ade80]/5 rounded-lg px-3 py-2 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> No issues detected — asset is performing within benchmarks
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── CSV export ─────────────────────────────────────────────────────────────────
function exportReport(results) {
  const headers = ['brand', 'sector', 'status', 'score', 'subnodes', 'sector_avg', 'anomalies', 'warnings'];
  const rows = results.map(({ brand, audit }) => ({
    brand: brand.name,
    sector: brand.sector,
    status: audit.status,
    score: audit.score,
    subnodes: audit.subnodeCount,
    sector_avg: audit.bench?.avg.toFixed(1) ?? '',
    anomalies: audit.anomalies.join('; '),
    warnings: audit.warnings.join('; '),
  }));
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h]).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'brand_health_report.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BrandHealthAudit() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | healthy | warning | critical
  const [sortBy, setSortBy] = useState('score_asc'); // score_asc | score_desc | name | sector

  const { data: brands = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['brands-audit'],
    queryFn: () => base44.entities.Brand.list('-updated_date', 500),
  });

  const benchmarks = useMemo(buildSectorBenchmarks, []);

  const auditResults = useMemo(() => {
    return brands.map(brand => ({ brand, audit: scoreBrand(brand, benchmarks) }));
  }, [brands, benchmarks]);

  const summary = useMemo(() => {
    const healthy = auditResults.filter(r => r.audit.status === 'healthy').length;
    const warning = auditResults.filter(r => r.audit.status === 'warning').length;
    const critical = auditResults.filter(r => r.audit.status === 'critical').length;
    const avgScore = auditResults.length ? Math.round(auditResults.reduce((s, r) => s + r.audit.score, 0) / auditResults.length) : 0;
    return { healthy, warning, critical, avgScore, total: auditResults.length };
  }, [auditResults]);

  const filtered = useMemo(() => {
    let list = auditResults;
    if (filter !== 'all') list = list.filter(r => r.audit.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => r.brand.name.toLowerCase().includes(q) || (r.brand.sector || '').includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'score_asc') return a.audit.score - b.audit.score;
      if (sortBy === 'score_desc') return b.audit.score - a.audit.score;
      if (sortBy === 'name') return a.brand.name.localeCompare(b.brand.name);
      if (sortBy === 'sector') return (a.brand.sector || '').localeCompare(b.brand.sector || '');
      return 0;
    });
  }, [auditResults, filter, search, sortBy]);

  return (
    <div className="bg-[#0f172a] border border-[#1e3a5f] rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-[#22d3ee]" />
          <div>
            <h2 className="text-lg font-black text-[#90cdf4]">Brand Health Audit</h2>
            <p className="text-xs text-[#475569]">Automated anomaly detection vs sector benchmarks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg border border-[#334155] text-[#94a3b8] hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => exportReport(auditResults)}
            disabled={!auditResults.length}
            className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] border border-[#334155] hover:border-[#0ea5e9] text-[#94a3b8] hover:text-[#0ea5e9] rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#0ea5e9]" />
          <span className="ml-3 text-[#64748b] text-sm">Running audit…</span>
        </div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Avg Health Score', value: `${summary.avgScore}/100`, color: 'text-[#22d3ee]', Icon: Activity },
              { label: 'Healthy Assets', value: summary.healthy, color: 'text-[#4ade80]', Icon: ShieldCheck },
              { label: 'Warnings', value: summary.warning, color: 'text-[#f59e0b]', Icon: ShieldAlert },
              { label: 'Critical', value: summary.critical, color: 'text-[#f87171]', Icon: ShieldX },
            ].map(({ label, value, color, Icon }) => (
              <div key={label} className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
                <p className={`text-xl font-black ${color}`}>{value}</p>
                <p className="text-[10px] text-[#64748b] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters & search */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search brand or sector…"
                className="w-full pl-8 pr-3 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#0ea5e9]"
              />
            </div>
            <div className="flex gap-1">
              {['all', 'healthy', 'warning', 'critical'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${
                    filter === f ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white' : 'border-[#334155] text-[#94a3b8] hover:border-[#0ea5e9]'
                  }`}
                >
                  {f === 'all' ? `All (${summary.total})` : f === 'healthy' ? `✓ ${summary.healthy}` : f === 'warning' ? `⚠ ${summary.warning}` : `✕ ${summary.critical}`}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-[#1e293b] border border-[#334155] text-[#94a3b8] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="score_asc">Worst first</option>
              <option value="score_desc">Best first</option>
              <option value="name">Name A–Z</option>
              <option value="sector">Sector</option>
            </select>
          </div>

          {/* Results count */}
          <p className="text-xs text-[#475569]">
            Showing {filtered.length} of {auditResults.length} brands
          </p>

          {/* Brand rows */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.length === 0 && (
              <p className="text-center text-[#64748b] py-8 text-sm">No brands match the current filters.</p>
            )}
            {filtered.map(({ brand, audit }) => (
              <BrandRow key={brand.id} brand={brand} audit={audit} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}