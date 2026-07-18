import React, { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Users, Package, DollarSign, ShoppingCart,
  Eye, Star, Activity, Search, Bell, Plus, Filter, MoreHorizontal,
  ChevronRight, ChevronDown, ChevronUp, X, ArrowRight, ArrowLeft,
  CheckCircle2, Clock, Calendar, MessageSquare, Edit, Trash2,
  Sparkles, Globe, Lock, Zap, Settings, Download, RefreshCw,
  LayoutDashboard, FileText, BarChart3, Mail, Phone, MapPin, User
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const SECTOR_META = {
  agriculture: { icon: '🌱', accent: '#22c55e' }, fsf: { icon: '🥦', accent: '#86efac' },
  banking: { icon: '🏦', accent: '#3b82f6' }, creative: { icon: '🖋️', accent: '#8b5cf6' },
  logistics: { icon: '📦', accent: '#f97316' }, 'education-ip': { icon: '📚', accent: '#eab308' },
  fashion: { icon: '✂️', accent: '#ec4899' }, gaming: { icon: '🎮', accent: '#6366f1' },
  health: { icon: '🧠', accent: '#10b981' }, housing: { icon: '🏗️', accent: '#64748b' },
  justice: { icon: '⚖️', accent: '#f59e0b' }, knowledge: { icon: '📖', accent: '#06b6d4' },
  micromesh: { icon: '☰', accent: '#84cc16' }, media: { icon: '🎬', accent: '#ef4444' },
  nutrition: { icon: '✿', accent: '#22c55e' }, 'ai-logic': { icon: '🤖', accent: '#a855f7' },
  packaging: { icon: '📦', accent: '#fb923c' }, quantum: { icon: '✴️', accent: '#0ea5e9' },
  ritual: { icon: '☯️', accent: '#d946ef' }, saas: { icon: '🔑', accent: '#f59e0b' },
  trade: { icon: '🧺', accent: '#d97706' }, utilities: { icon: '🔋', accent: '#4ade80' },
  voice: { icon: '🎙️', accent: '#f472b6' }, webless: { icon: '📡', accent: '#22d3ee' },
  nft: { icon: '🔁', accent: '#a78bfa' }, 'education-youth': { icon: '🎓', accent: '#fde68a' },
  zerowaste: { icon: '♻️', accent: '#6ee7b7' }, professional: { icon: '🧾', accent: '#60a5fa' },
  'payroll-mining': { icon: '🪙', accent: '#fcd34d' }, mining: { icon: '⛏️', accent: '#a16207' },
  wildlife: { icon: '🦁', accent: '#84cc16' },
};

const KPI_ICONS = [TrendingUp, Users, Package, DollarSign, ShoppingCart, Eye, Star, Activity];

function hexToRgb(hex) {
  if (!hex || hex.length < 7) return '249,115,22';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '249,115,22';
  return `${r},${g},${b}`;
}

function getField(item, ...keys) {
  if (!item || typeof item !== 'object') return '';
  for (const k of keys) {
    if (item[k] != null && item[k] !== '') return item[k];
  }
  return '';
}

function findBrand(name, selectedBrands) {
  if (!name || !selectedBrands) return null;
  return selectedBrands.find(b => name.includes(b.name) || b.name.includes(name));
}

// ═══════════════════════════════════════════════════
// HERO — full-bleed, dramatic
// ═══════════════════════════════════════════════════
function HeroBlock({ block, primary, accent, primaryRgb, accentRgb }) {
  return (
    <div className="relative overflow-hidden rounded-3xl"
      style={{ background: `linear-gradient(135deg, rgba(${primaryRgb},0.12), rgba(${accentRgb},0.04) 60%, transparent)` }}>
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ backgroundColor: primary }} />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ backgroundColor: accent }} />
      <div className="relative px-8 py-10 sm:px-12 sm:py-14 max-w-3xl">
        {block.badge && (
          <Badge variant="secondary" className="mb-4 gap-1.5" style={{ background: `rgba(${primaryRgb},0.12)`, color: primary, border: 'none' }}>
            <Sparkles className="w-3 h-3" /> {block.badge}
          </Badge>
        )}
        {block.title && <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-[1.1] tracking-tight">{block.title}</h2>}
        {block.body && <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-7 max-w-2xl">{block.body}</p>}
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="gap-2 text-black font-bold border-0" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
            onClick={() => toast.success(block.ctaLabel || 'Started!')}>
            {block.ctaLabel || 'Get Started'} <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2 border-stone-700 text-stone-300 hover:bg-stone-800"
            onClick={() => toast.info('Learn more — live preview')}>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// KPI GRID — compact, professional
// ═══════════════════════════════════════════════════
function KpiGridBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 4) || [];
  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => {
          const label = getField(item, 'label', 'title');
          const value = getField(item, 'value', 'count') || '—';
          const sub = getField(item, 'sub', 'trend') || '';
          const Icon = KPI_ICONS[i % KPI_ICONS.length];
          const isUp = /↑|up|\+|increase/i.test(sub);
          const isDown = /↓|down|-|decrease/i.test(sub);
          return (
            <Card key={i} className="bg-stone-900/50 border-stone-800 hover:border-stone-700 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `rgba(${primaryRgb},0.1)` }}>
                    <Icon className="w-4 h-4" style={{ color: primary }} />
                  </div>
                  {sub && (
                    <span className={`text-xs font-bold flex items-center gap-0.5 ${isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-stone-500'}`}>
                      {isUp && <TrendingUp className="w-3 h-3" />}
                      {isDown && <TrendingDown className="w-3 h-3" />}
                      {sub}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-white leading-none">{value}</p>
                <p className="text-sm text-stone-500 mt-2">{label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CARD GRID — real product cards with depth
// ═══════════════════════════════════════════════════
function CardGridBlock({ block, primary, accent, primaryRgb, selectedBrands, onOpenDetail }) {
  const [search, setSearch] = useState('');
  const items = block.items?.slice(0, 9) || [];

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(item => {
      const name = getField(item, 'name', 'title');
      const desc = getField(item, 'description', 'body');
      return name.toLowerCase().includes(q) || (desc || '').toLowerCase().includes(q);
    });
  }, [items, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        {block.title && <p className="text-sm font-semibold text-stone-500">{block.title}</p>}
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
              className="pl-9 h-8 w-40 bg-stone-900 border-stone-800 text-sm" />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 border-stone-800 text-stone-400"
            onClick={() => toast.info('Filter panel')}>
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-black font-bold border-0" style={{ background: primary }}
            onClick={() => toast.success('New item form would open')}>
            <Plus className="w-3.5 h-3.5" /> New
          </Button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <Card className="bg-stone-900/30 border-stone-800">
          <CardContent className="py-12 text-center text-stone-600 text-sm">No results for "{search}"</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const name = getField(item, 'name', 'title');
            const desc = getField(item, 'description', 'body');
            const tag = getField(item, 'sector', 'category');
            const metric = getField(item, 'metric', 'value', 'count');
            const status = getField(item, 'status');
            const relatedBrand = findBrand(name, selectedBrands);
            const sm = SECTOR_META[relatedBrand?.sector] || SECTOR_META[tag?.toLowerCase?.()];
            const color = sm?.accent || primary;
            const rgb = hexToRgb(color);
            return (
              <Card key={i} onClick={() => onOpenDetail?.(item)}
                className="bg-stone-900/50 border-stone-800 hover:border-stone-700 cursor-pointer transition-all hover:scale-[1.01] group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: `rgba(${rgb},0.12)` }}>
                      {sm?.icon || '◆'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {status && (
                        <Badge variant="secondary" className="text-[10px] font-bold border-0"
                          style={{
                            background: /active|featured|completed/i.test(status) ? 'rgba(52,211,153,0.12)' : /pending|draft/i.test(status) ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.1)',
                            color: /active|featured|completed/i.test(status) ? '#34d399' : /pending|draft/i.test(status) ? '#f59e0b' : '#94a3b8'
                          }}>
                          {status}
                        </Badge>
                      )}
                      <MoreHorizontal className="w-4 h-4 text-stone-700 group-hover:text-stone-500 transition-colors" />
                    </div>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1.5 leading-tight">{name}</h4>
                  <p className="text-xs leading-relaxed text-stone-500 line-clamp-2 mb-4">{desc}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-800/50">
                    {tag ? (
                      <Badge variant="outline" className="text-[11px] font-semibold border-stone-700 text-stone-400">
                        {tag}
                      </Badge>
                    ) : <span />}
                    {metric && <span className="text-sm font-black" style={{ color }}>{metric}</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// DATA TABLE — real shadcn table
// ═══════════════════════════════════════════════════
function DataTableBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 10) || [];
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [selectedRow, setSelectedRow] = useState(null);

  const cols = items[0] ? Object.keys(items[0]).slice(0, 5) : [];

  const sorted = useMemo(() => {
    if (!sortCol) return items;
    return [...items].sort((a, b) => {
      const av = getField(a, sortCol);
      const bv = getField(b, sortCol);
      if (sortDir === 'asc') return String(av).localeCompare(String(bv));
      return String(bv).localeCompare(String(av));
    });
  }, [items, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const renderCell = (val, col, j) => {
    const isStatus = col === 'status' || /active|pending|completed|featured|paused|shipped|delivered|draft/i.test(val);
    const isAmount = /amount|revenue|price|total/i.test(col) || /\$|R\d|€|£/.test(val);
    if (j === 0) {
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
          <span className="font-bold text-white">{val}</span>
        </div>
      );
    }
    if (isStatus) {
      return (
        <Badge variant="secondary" className="text-[10px] font-bold border-0"
          style={{
            background: /active|completed|delivered/i.test(val) ? 'rgba(52,211,153,0.12)' : /pending|draft/i.test(val) ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.1)',
            color: /active|completed|delivered/i.test(val) ? '#34d399' : /pending|draft/i.test(val) ? '#f59e0b' : '#94a3b8'
          }}>
          {val}
        </Badge>
      );
    }
    if (isAmount) return <span className="font-black" style={{ color: primary }}>{val}</span>;
    return <span className="text-stone-400">{val}</span>;
  };

  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <Card className="bg-stone-900/50 border-stone-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-stone-800 hover:bg-transparent" style={{ background: `rgba(${primaryRgb},0.04)` }}>
              {cols.map((col, i) => (
                <TableHead key={i} onClick={() => handleSort(col)}
                  className="cursor-pointer select-none hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                  style={{ color: '#78716c' }}>
                  <span className="flex items-center gap-1">
                    {col}
                    {sortCol === col && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((item, i) => (
              <TableRow key={i} onClick={() => setSelectedRow(selectedRow === i ? null : i)}
                className={`cursor-pointer border-stone-800/50 transition-colors ${
                  selectedRow === i ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                }`}>
                {cols.map((col, j) => (
                  <TableCell key={j} className="text-sm py-3">{renderCell(getField(item, col), col, j)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {selectedRow !== null && (
        <Card className="mt-3 bg-stone-900 border-stone-800">
          <CardContent className="p-4">
            <p className="text-stone-500 text-xs mb-2">Row details (click row to close):</p>
            <pre className="text-xs text-stone-300 overflow-auto font-mono">{JSON.stringify(sorted[selectedRow], null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CHART — professional bar chart
// ═══════════════════════════════════════════════════
function ChartBlock({ block, primary, accent, primaryRgb, accentRgb }) {
  const items = block.items?.slice(0, 12) || [];
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...items.map(it => Number(getField(it, 'value', 'count') || 0)), 1);
  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <Card className="bg-stone-900/50 border-stone-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-stone-300">Performance Overview</CardTitle>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-stone-500">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: primary }} /> Primary
              </span>
              <span className="flex items-center gap-1.5 text-stone-500">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: accent }} /> Secondary
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-56 relative pt-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="border-t border-dashed border-stone-800/50" />
              ))}
            </div>
            {items.map((item, i) => {
              const val = Number(getField(item, 'value', 'count') || (i + 1) * 12);
              const height = Math.max((val / maxVal) * 100, 3);
              const color = i % 2 === 0 ? primary : accent;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10"
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                  <div className="w-full rounded-t-md transition-all hover:opacity-80 relative cursor-pointer"
                    style={{ height: `${height}%`, background: `linear-gradient(180deg, ${color}, ${color}30)` }}>
                    {hovered === i && (
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-xs font-black whitespace-nowrap px-2.5 py-1.5 rounded-md text-white"
                        style={{ background: 'rgba(0,0,0,0.9)', border: `1px solid ${color}` }}>{val}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-600 font-mono truncate max-w-full">
                    {getField(item, 'label', 'name')?.slice(0, 8) || `M${i + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
          {block.body && <p className="text-sm text-stone-500 leading-relaxed mt-4 pt-4 border-t border-stone-800/50">{block.body}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// TIMELINE
// ═══════════════════════════════════════════════════
function TimelineBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 8) || [];
  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <Card className="bg-stone-900/50 border-stone-800">
        <CardContent className="p-6">
          <div className="space-y-0">
            {items.map((item, i) => {
              const title = getField(item, 'title', 'name');
              const desc = getField(item, 'description', 'body');
              const time = getField(item, 'time', 'date');
              return (
                <div key={i} className="flex gap-4 pb-6 relative last:pb-0">
                  {i < items.length - 1 && (
                    <div className="absolute left-4 top-9 bottom-0 w-px" style={{ background: `rgba(${primaryRgb},0.15)` }} />
                  )}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 bg-stone-950"
                    style={{ borderColor: primary }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primary }} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-white font-bold text-sm">{title}</h4>
                      {time && <span className="text-xs font-mono text-stone-600 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {time}
                      </span>}
                    </div>
                    {desc && <p className="text-sm text-stone-500 mt-1 leading-relaxed">{desc}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CTA
// ═══════════════════════════════════════════════════
function CtaBlock({ block, primary, accent, primaryRgb, accentRgb }) {
  return (
    <Card className="bg-stone-900/50 border-stone-800 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${primary} 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      <CardContent className="p-10 text-center relative">
        {block.title && <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">{block.title}</h3>}
        {block.body && <p className="text-stone-400 text-base mb-6 max-w-lg mx-auto leading-relaxed">{block.body}</p>}
        <Button size="lg" className="gap-2 text-black font-bold border-0" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
          onClick={() => toast.success(block.items?.[0]?.label || 'Started!')}>
          {block.items?.[0]?.label || block.items?.[0]?.title || 'Get Started'} <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════
// SPLIT PANEL
// ═══════════════════════════════════════════════════
function SplitPanelBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 5) || [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card className="bg-stone-900/50 border-stone-800">
        <CardContent className="p-6">
          {block.title && <h3 className="text-white font-bold text-lg mb-3">{block.title}</h3>}
          {block.body && <p className="text-stone-500 text-sm leading-relaxed">{block.body}</p>}
        </CardContent>
      </Card>
      <Card className="bg-stone-900/50 border-stone-800">
        <CardContent className="p-6 space-y-2">
          {items.map((item, i) => {
            const name = getField(item, 'name', 'title');
            const desc = getField(item, 'description', 'body');
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: primary }} />
                <div>
                  <p className="text-white text-sm font-bold">{name}</p>
                  {desc && <p className="text-xs text-stone-500 leading-relaxed mt-0.5">{desc}</p>}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STAT LIST
// ═══════════════════════════════════════════════════
function StatListBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 6) || [];
  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <Card className="bg-stone-900/50 border-stone-800 overflow-hidden">
        <CardContent className="p-0">
          {items.map((item, i) => {
            const label = getField(item, 'label', 'name', 'title');
            const value = getField(item, 'value', 'count') || '—';
            const sub = getField(item, 'sub', 'trend');
            return (
              <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-stone-800/50 last:border-0 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                  <span className="text-white text-sm font-bold">{label}</span>
                  {sub && <span className="text-xs text-stone-600 font-mono">{sub}</span>}
                </div>
                <span className="font-black text-lg" style={{ color: primary }}>{value}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// ACTIVITY FEED
// ═══════════════════════════════════════════════════
function ActivityFeedBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 10) || [];
  const avatarColors = [primary, accent, '#34d399', '#818cf8', '#f472b6', '#fbbf24'];
  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <Card className="bg-stone-900/50 border-stone-800">
        <CardContent className="p-4 space-y-1">
          {items.map((item, i) => {
            const text = getField(item, 'message', 'title', 'description', 'body');
            const time = getField(item, 'time', 'date');
            const user = getField(item, 'user', 'name');
            const avatarColor = avatarColors[i % avatarColors.length];
            const initials = user ? user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '••';
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-black"
                  style={{ background: avatarColor }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-stone-200 text-sm leading-relaxed">{text}</p>
                  {time && <p className="text-xs text-stone-600 font-mono mt-1">{time}</p>}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// FORM — real working form
// ═══════════════════════════════════════════════════
function FormBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 5) || [];
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Form submitted successfully!');
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <Card className="bg-stone-900/50 border-stone-800 max-w-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {items.map((item, i) => {
              const label = getField(item, 'label', 'name', 'title');
              const type = item.type || 'text';
              return (
                <div key={i}>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 block">{label}</label>
                  <Input type={type === 'number' ? 'number' : type === 'email' ? 'email' : 'text'}
                    value={values[label] || ''} onChange={(e) => setValues({ ...values, [label]: e.target.value })}
                    placeholder={`Enter ${label?.toLowerCase()}…`}
                    className="bg-stone-950 border-stone-800" />
                </div>
              );
            })}
            <Button type="submit" className="w-full gap-2 text-black font-bold border-0"
              style={{ background: submitted ? '#22c55e' : `linear-gradient(135deg, ${primary}, ${accent})` }}>
              {submitted ? <><CheckCircle2 className="w-4 h-4" /> Submitted!</> : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// IMAGE GALLERY
// ═══════════════════════════════════════════════════
function ImageGalleryBlock({ block, primary, accent, primaryRgb, selectedBrands, onOpenDetail }) {
  const items = block.items?.slice(0, 6) || [];
  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item, i) => {
          const name = getField(item, 'name', 'title');
          const relatedBrand = findBrand(name, selectedBrands);
          const sm = SECTOR_META[relatedBrand?.sector];
          const color = sm?.accent || primary;
          const rgb = hexToRgb(color);
          return (
            <div key={i} onClick={() => onOpenDetail?.(item)}
              className="aspect-video rounded-xl border relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
              style={{ background: `linear-gradient(135deg, rgba(${rgb},0.15), rgba(${rgb},0.03))`, borderColor: `rgba(${rgb},0.2)` }}>
              <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">{sm?.icon || '🖼️'}</div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm font-bold truncate">{name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// DETAIL MODAL
// ═══════════════════════════════════════════════════
function DetailModal({ item, onClose, primary, accent }) {
  if (!item) return null;
  const entries = Object.entries(item).filter(([, v]) => v != null && v !== '');
  return (
    <div className="fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <Card className="bg-stone-950 border-stone-700 max-w-lg w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between border-b border-stone-800">
          <CardTitle className="text-lg text-white">Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-stone-500 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          {entries.map(([key, val]) => (
            <div key={key} className="flex justify-between gap-4 py-2 border-b border-stone-800/50 last:border-0">
              <span className="text-stone-500 text-sm font-bold uppercase tracking-wider">{key}</span>
              <span className="text-white text-sm text-right">{String(val)}</span>
            </div>
          ))}
        </CardContent>
        <div className="px-6 py-4 border-t border-stone-800 flex gap-2">
          <Button variant="outline" className="flex-1 gap-2 border-stone-700 text-stone-300 hover:bg-stone-800"
            onClick={() => toast.info('Edit mode — live preview')}>
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button variant="outline" className="flex-1 gap-2 border-red-900/50 text-red-400 hover:bg-red-950/30"
            onClick={() => { toast.success('Deleted'); onClose(); }}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// BLOCK ROUTER
// ═══════════════════════════════════════════════════
function renderBlock(block, ctx) {
  if (!block) return null;
  const type = (block.type || '').toLowerCase();
  const props = { block, ...ctx };
  switch (type) {
    case 'hero':          return <HeroBlock {...props} />;
    case 'kpi_grid':      return <KpiGridBlock {...props} />;
    case 'card_grid':     return <CardGridBlock {...props} />;
    case 'data_table':    return <DataTableBlock {...props} />;
    case 'chart':         return <ChartBlock {...props} />;
    case 'timeline':      return <TimelineBlock {...props} />;
    case 'cta':           return <CtaBlock {...props} />;
    case 'split_panel':   return <SplitPanelBlock {...props} />;
    case 'stat_list':     return <StatListBlock {...props} />;
    case 'activity_feed': return <ActivityFeedBlock {...props} />;
    case 'form':          return <FormBlock {...props} />;
    case 'image_gallery': return <ImageGalleryBlock {...props} />;
    default:
      return (
        <Card className="bg-stone-900/50 border-stone-800">
          <CardContent className="p-6">
            {block.title && <h3 className="text-white font-bold text-lg mb-2">{block.title}</h3>}
            {block.body && <p className="text-stone-500 text-sm leading-relaxed">{block.body}</p>}
            {block.items?.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {block.items.slice(0, 4).map((item, i) => (
                  <div key={i} className="px-4 py-3 rounded-lg text-sm text-stone-300 bg-stone-800/50">
                    {getField(item, 'name', 'title', 'label') || 'Item'}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      );
  }
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════
export default function PageRenderer({ page, appData, selectedBrands, primary, secondary, accent, primaryRgb, accentRgb }) {
  const [detailItem, setDetailItem] = useState(null);

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-stone-600 text-sm">
        Select a page to preview
      </div>
    );
  }

  const ctx = { primary, secondary, accent, primaryRgb, accentRgb, selectedBrands, appData, onOpenDetail: setDetailItem };
  const blocks = page.contentBlocks?.length > 0
    ? page.contentBlocks
    : fallbackBlocks(page, appData, selectedBrands);

  return (
    <>
      <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-black text-white">{page.name}</h1>
          {page.description && <p className="text-stone-500 text-sm mt-1.5 max-w-2xl leading-relaxed">{page.description}</p>}
        </div>
        {blocks.map((block, i) => (
          <div key={i}>{renderBlock(block, ctx)}</div>
        ))}
      </div>
      <DetailModal item={detailItem} onClose={() => setDetailItem(null)} primary={primary} accent={accent} />
    </>
  );
}

function fallbackBlocks(page, appData, selectedBrands) {
  const blocks = [];
  const layout = (page.layout || '').toLowerCase();
  const allSubnodes = selectedBrands.flatMap(b => (b.subnodes || []).map(s => ({ name: s, brand: b.name, sector: b.sector })));

  if (layout === 'landing' || layout === 'detail' || !layout) {
    blocks.push({
      type: 'hero',
      badge: 'Powered by FAA.ZONE™',
      title: page.name,
      body: page.description || `A world-class ${page.name} experience built on real ecosystem data from ${selectedBrands.length} brands.`,
      ctaLabel: 'Explore Now',
    });
  }
  if (layout === 'dashboard' || layout === 'analytics' || !layout) {
    blocks.push({
      type: 'kpi_grid',
      title: 'Overview',
      items: [
        { label: 'Active Brands', value: String(selectedBrands.length), sub: 'integrated' },
        { label: 'Total Subnodes', value: String(allSubnodes.length), sub: 'live data' },
        { label: 'Pages', value: String(appData.pages?.length || 0), sub: 'generated' },
        { label: 'Features', value: String(appData.features?.length || 0), sub: 'active' },
      ],
    });
  }
  blocks.push({
    type: 'card_grid',
    title: page.sections?.length ? 'Page Sections' : 'Ecosystem Subnodes',
    items: (page.sections?.length ? page.sections : allSubnodes.slice(0, 6)).map((s, i) => ({
      name: typeof s === 'string' ? s : s?.name,
      description: typeof s === 'string' ? `Part of the ${allSubnodes[i]?.brand || 'ecosystem'} brand` : s?.description,
      sector: typeof s === 'object' ? s?.sector : allSubnodes[i]?.sector,
    })),
  });
  if (appData.crossPollination?.length > 0) {
    blocks.push({
      type: 'chart',
      title: 'Cross-Pollination Synergy Scores',
      items: appData.crossPollination.slice(0, 8).map(cp => ({
        label: `${(cp.brand1 || '').slice(0, 3)}→${(cp.brand2 || '').slice(0, 3)}`,
        value: cp.synergyScore || 70,
      })),
    });
  }
  blocks.push({
    type: 'activity_feed',
    title: 'Live Ecosystem Activity',
    items: selectedBrands.slice(0, 6).map(b => ({
      message: `${b.name}™ synced · ${b.subnodes?.length || 0} subnodes active · ${b.metadata?.activeNodes || 0} nodes online`,
      time: '2h ago',
    })),
  });
  return blocks;
}