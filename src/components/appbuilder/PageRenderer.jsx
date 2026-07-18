import React, { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Users, Package, DollarSign, ShoppingCart,
  Eye, Star, Activity, Search, Bell, Plus, Filter, MoreHorizontal,
  ChevronRight, ChevronDown, ChevronUp, X, ArrowRight, ArrowLeft,
  CheckCircle2, Clock, Calendar, MessageSquare, Edit, Trash2,
  Sparkles, Globe, Lock, Zap, Settings, Download, RefreshCw,
  LayoutDashboard, FileText, BarChart3, Mail, Phone, MapPin, User,
  ArrowUpRight, Wallet, Target, ShoppingBag, Truck, CreditCard
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

const KPI_ICONS = [TrendingUp, Users, Package, DollarSign, ShoppingCart, Eye, Star, Activity, Wallet, Target, ShoppingBag, Truck];

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

// Premium glass card style
const glassCard = (primaryRgb) => ({
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.15)',
});

// ═══════════════════════════════════════════════════
// HERO — dramatic, full-bleed, premium
// ═══════════════════════════════════════════════════
function HeroBlock({ block, primary, accent, primaryRgb, accentRgb }) {
  return (
    <div className="relative overflow-hidden rounded-3xl"
      style={{
        background: `linear-gradient(135deg, rgba(${primaryRgb},0.15) 0%, rgba(${accentRgb},0.06) 40%, rgba(255,255,255,0.02) 100%)`,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
      }}>
      {/* Mesh gradient orbs */}
      <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full blur-3xl opacity-25" style={{ backgroundColor: primary }} />
      <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full blur-3xl opacity-15" style={{ backgroundColor: accent }} />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="relative px-8 py-12 sm:px-12 sm:py-16 max-w-3xl">
        {block.badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 backdrop-blur-md"
            style={{ background: `rgba(${primaryRgb},0.15)`, border: `1px solid rgba(${primaryRgb},0.3)` }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: primary }} />
            <span className="text-xs font-bold" style={{ color: primary }}>{block.badge}</span>
          </div>
        )}
        {block.title && <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-[1.05] tracking-tight">{block.title}</h2>}
        {block.body && <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">{block.body}</p>}
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="gap-2 text-black font-bold border-0 hover:opacity-90 transition-opacity"
            style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, boxShadow: `0 8px 24px rgba(${primaryRgb},0.35)` }}
            onClick={() => toast.success(block.ctaLabel || 'Started!')}>
            {block.ctaLabel || 'Get Started'} <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="ghost" className="gap-2 text-stone-300 hover:bg-white/5 hover:text-white backdrop-blur-md"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={() => toast.info('Learn more — live preview')}>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// KPI GRID — premium stat cards with sparklines
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
          // Generate a mini sparkline
          const spark = Array.from({ length: 7 }, (_, k) => 30 + Math.sin(k * 1.2 + i) * 20 + k * 5);
          return (
            <div key={i} className="relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.02] cursor-pointer group"
              style={glassCard(primaryRgb)}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: primary }} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `rgba(${primaryRgb},0.12)`, border: `1px solid rgba(${primaryRgb},0.2)` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: primary }} />
                  </div>
                  {sub && (
                    <span className={`text-xs font-bold flex items-center gap-0.5 px-2 py-1 rounded-full ${
                      isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-stone-500'
                    }`} style={{
                      background: isUp ? 'rgba(52,211,153,0.1)' : isDown ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)'
                    }}>
                      {isUp && <TrendingUp className="w-3 h-3" />}
                      {isDown && <TrendingDown className="w-3 h-3" />}
                      {sub}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-black text-white leading-none tracking-tight">{value}</p>
                <p className="text-sm text-stone-400 mt-2.5">{label}</p>
                {/* Mini sparkline */}
                <div className="flex items-end gap-0.5 mt-4 h-8">
                  {spark.map((v, k) => (
                    <div key={k} className="flex-1 rounded-sm transition-all"
                      style={{ height: `${Math.max(v, 8)}%`, background: k === spark.length - 1 ? primary : `rgba(${primaryRgb},0.3)` }} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CARD GRID — premium product cards
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
              className="pl-9 h-8 w-40 bg-white/[0.03] border-white/[0.06] text-sm" />
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-stone-400 hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            onClick={() => toast.info('Filter panel')}>
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-black font-bold border-0 hover:opacity-90" style={{ background: primary }}
            onClick={() => toast.success('New item form would open')}>
            <Plus className="w-3.5 h-3.5" /> New
          </Button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl py-16 text-center text-stone-600 text-sm" style={glassCard(primaryRgb)}>
          No results for "{search}"
        </div>
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
              <div key={i} onClick={() => onOpenDetail?.(item)}
                className="relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] group"
                style={glassCard(primaryRgb)}>
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: color }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.2)` }}>
                      {sm?.icon || '◆'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {status && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{
                            background: /active|featured|completed/i.test(status) ? 'rgba(52,211,153,0.12)' : /pending|draft/i.test(status) ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.1)',
                            color: /active|featured|completed/i.test(status) ? '#34d399' : /pending|draft/i.test(status) ? '#f59e0b' : '#94a3b8'
                          }}>
                          {status}
                        </span>
                      )}
                      <MoreHorizontal className="w-4 h-4 text-stone-700 group-hover:text-stone-500 transition-colors" />
                    </div>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1.5 leading-tight">{name}</h4>
                  <p className="text-xs leading-relaxed text-stone-500 line-clamp-2 mb-4">{desc}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    {tag ? (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `rgba(${rgb},0.1)`, color, border: `1px solid rgba(${rgb},0.15)` }}>
                        {tag}
                      </span>
                    ) : <span />}
                    {metric && <span className="text-sm font-black" style={{ color }}>{metric}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// DATA TABLE — premium table
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
        <span className="text-[10px] font-bold px-2 py-1 rounded-full"
          style={{
            background: /active|completed|delivered/i.test(val) ? 'rgba(52,211,153,0.12)' : /pending|draft/i.test(val) ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.1)',
            color: /active|completed|delivered/i.test(val) ? '#34d399' : /pending|draft/i.test(val) ? '#f59e0b' : '#94a3b8'
          }}>
          {val}
        </span>
      );
    }
    if (isAmount) return <span className="font-black" style={{ color: primary }}>{val}</span>;
    return <span className="text-stone-400">{val}</span>;
  };

  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <div className="rounded-2xl overflow-hidden" style={glassCard(primaryRgb)}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent" style={{ background: `rgba(${primaryRgb},0.04)` }}>
              {cols.map((col, i) => (
                <TableHead key={i} onClick={() => handleSort(col)}
                  className="cursor-pointer select-none hover:text-white transition-colors text-xs font-bold uppercase tracking-wider h-11"
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
                className={`cursor-pointer border-white/[0.04] transition-colors ${
                  selectedRow === i ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                }`}>
                {cols.map((col, j) => (
                  <TableCell key={j} className="text-sm py-3.5">{renderCell(getField(item, col), col, j)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedRow !== null && (
        <div className="mt-3 p-4 rounded-xl" style={glassCard(primaryRgb)}>
          <p className="text-stone-500 text-xs mb-2">Row details (click row to close):</p>
          <pre className="text-xs text-stone-300 overflow-auto font-mono">{JSON.stringify(sorted[selectedRow], null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CHART — premium gradient chart
// ═══════════════════════════════════════════════════
function ChartBlock({ block, primary, accent, primaryRgb, accentRgb }) {
  const items = block.items?.slice(0, 12) || [];
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...items.map(it => Number(getField(it, 'value', 'count') || 0)), 1);
  return (
    <div>
      {block.title && <p className="text-sm font-semibold text-stone-500 mb-3">{block.title}</p>}
      <div className="rounded-2xl p-6" style={glassCard(primaryRgb)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-base">Performance Overview</h3>
            <p className="text-stone-500 text-xs mt-0.5">Real-time ecosystem metrics</p>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-stone-400">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: primary }} /> Primary
            </span>
            <span className="flex items-center gap-1.5 text-stone-400">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: accent }} /> Secondary
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-64 relative pt-4">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-t border-dashed border-white/[0.04]" />
            ))}
          </div>
          {items.map((item, i) => {
            const val = Number(getField(item, 'value', 'count') || (i + 1) * 12);
            const height = Math.max((val / maxVal) * 100, 3);
            const color = i % 2 === 0 ? primary : accent;
            const rgb = i % 2 === 0 ? primaryRgb : accentRgb;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <div className="w-full rounded-t-lg transition-all hover:opacity-90 relative cursor-pointer"
                  style={{ height: `${height}%`, background: `linear-gradient(180deg, ${color}, rgba(${rgb},0.15))` }}>
                  {hovered === i && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-black whitespace-nowrap px-2.5 py-1.5 rounded-lg text-white"
                      style={{ background: 'rgba(0,0,0,0.9)', border: `1px solid ${color}`, boxShadow: `0 4px 12px rgba(${rgb},0.4)` }}>{val}</span>
                  )}
                </div>
                <span className="text-[10px] text-stone-600 font-mono truncate max-w-full">
                  {getField(item, 'label', 'name')?.slice(0, 8) || `M${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>
        {block.body && <p className="text-sm text-stone-500 leading-relaxed mt-5 pt-4 border-t border-white/[0.06]">{block.body}</p>}
      </div>
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
      <div className="rounded-2xl p-6" style={glassCard(primaryRgb)}>
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
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2"
                  style={{ borderColor: primary, background: 'rgba(10,9,14,0.8)' }}>
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
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CTA
// ═══════════════════════════════════════════════════
function CtaBlock({ block, primary, accent, primaryRgb, accentRgb }) {
  return (
    <div className="relative overflow-hidden rounded-3xl text-center" style={glassCard(primaryRgb)}>
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${primary} 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-15" style={{ backgroundColor: primary }} />
      <div className="relative p-10 sm:p-12">
        {block.title && <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">{block.title}</h3>}
        {block.body && <p className="text-stone-400 text-base mb-6 max-w-lg mx-auto leading-relaxed">{block.body}</p>}
        <Button size="lg" className="gap-2 text-black font-bold border-0 hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, boxShadow: `0 8px 24px rgba(${primaryRgb},0.35)` }}
          onClick={() => toast.success(block.items?.[0]?.label || 'Started!')}>
          {block.items?.[0]?.label || block.items?.[0]?.title || 'Get Started'} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SPLIT PANEL
// ═══════════════════════════════════════════════════
function SplitPanelBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 5) || [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="rounded-2xl p-6" style={glassCard(primaryRgb)}>
        {block.title && <h3 className="text-white font-bold text-lg mb-3">{block.title}</h3>}
        {block.body && <p className="text-stone-500 text-sm leading-relaxed">{block.body}</p>}
      </div>
      <div className="rounded-2xl p-6 space-y-2" style={glassCard(primaryRgb)}>
        {items.map((item, i) => {
          const name = getField(item, 'name', 'title');
          const desc = getField(item, 'description', 'body');
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: primary }} />
              <div>
                <p className="text-white text-sm font-bold">{name}</p>
                {desc && <p className="text-xs text-stone-500 leading-relaxed mt-0.5">{desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
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
      <div className="rounded-2xl overflow-hidden" style={glassCard(primaryRgb)}>
        {items.map((item, i) => {
          const label = getField(item, 'label', 'name', 'title');
          const value = getField(item, 'value', 'count') || '—';
          const sub = getField(item, 'sub', 'trend');
          return (
            <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                <span className="text-white text-sm font-bold">{label}</span>
                {sub && <span className="text-xs text-stone-600 font-mono">{sub}</span>}
              </div>
              <span className="font-black text-lg" style={{ color: primary }}>{value}</span>
            </div>
          );
        })}
      </div>
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
      <div className="rounded-2xl p-4 space-y-1" style={glassCard(primaryRgb)}>
        {items.map((item, i) => {
          const text = getField(item, 'message', 'title', 'description', 'body');
          const time = getField(item, 'time', 'date');
          const user = getField(item, 'user', 'name');
          const avatarColor = avatarColors[i % avatarColors.length];
          const initials = user ? user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '••';
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-black"
                style={{ background: avatarColor, boxShadow: `0 2px 8px ${avatarColor}40` }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-stone-200 text-sm leading-relaxed">{text}</p>
                {time && <p className="text-xs text-stone-600 font-mono mt-1">{time}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// FORM
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
      <div className="rounded-2xl p-6 max-w-lg" style={glassCard(primaryRgb)}>
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
                  className="bg-black/30 border-white/[0.06] focus:border-white/20" />
              </div>
            );
          })}
          <Button type="submit" className="w-full gap-2 text-black font-bold border-0 hover:opacity-90"
            style={{ background: submitted ? '#22c55e' : `linear-gradient(135deg, ${primary}, ${accent})` }}>
            {submitted ? <><CheckCircle2 className="w-4 h-4" /> Submitted!</> : 'Submit'}
          </Button>
        </form>
      </div>
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
              className="aspect-video rounded-xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
              style={{ background: `linear-gradient(135deg, rgba(${rgb},0.15), rgba(${rgb},0.03))`, border: `1px solid rgba(${rgb},0.2)` }}>
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
    <div className="fixed inset-0 z-[10001] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div className="rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto" style={glassCard(hexToRgb(primary))}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-lg font-black text-white">Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-stone-500 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-6 space-y-2">
          {entries.map(([key, val]) => (
            <div key={key} className="flex justify-between gap-4 py-2 border-b border-white/[0.04] last:border-0">
              <span className="text-stone-500 text-sm font-bold uppercase tracking-wider">{key}</span>
              <span className="text-white text-sm text-right">{String(val)}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-white/[0.06] flex gap-2">
          <Button variant="ghost" className="flex-1 gap-2 text-stone-300 hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            onClick={() => toast.info('Edit mode — live preview')}>
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 text-red-400 hover:bg-red-950/30"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}
            onClick={() => { toast.success('Deleted'); onClose(); }}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>
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
        <div className="rounded-2xl p-6" style={glassCard(ctx.primaryRgb)}>
          {block.title && <h3 className="text-white font-bold text-lg mb-2">{block.title}</h3>}
          {block.body && <p className="text-stone-500 text-sm leading-relaxed">{block.body}</p>}
          {block.items?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {block.items.slice(0, 4).map((item, i) => (
                <div key={i} className="px-4 py-3 rounded-lg text-sm text-stone-300 bg-white/[0.03]">
                  {getField(item, 'name', 'title', 'label') || 'Item'}
                </div>
              ))}
            </div>
          )}
        </div>
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
  let rawBlocks = page.contentBlocks?.length > 0
    ? [...page.contentBlocks]
    : fallbackBlocks(page, appData, selectedBrands);
  // Supplement thin pages (< 3 blocks) with fallback blocks so every page feels full
  if (rawBlocks.length < 3) {
    const extras = fallbackBlocks(page, appData, selectedBrands).filter(
      fb => !rawBlocks.some(rb => rb.type === fb.type)
    );
    rawBlocks = [...rawBlocks, ...extras].slice(0, 4);
  }
  // Enrich blocks: ensure every block has enough items, padding from brand data if sparse
  const blocks = rawBlocks.map(block => enrichBlock(block, selectedBrands, appData));

  return (
    <>
      <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">{page.name}</h1>
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

// Enrich sparse blocks with real brand data so nothing looks empty
function enrichBlock(block, selectedBrands, appData) {
  if (!block || !block.type) return block;
  const items = block.items || [];
  const minItems = {
    kpi_grid: 4, card_grid: 6, data_table: 6, chart: 8,
    activity_feed: 6, timeline: 5, stat_list: 6, form: 4,
    split_panel: 4, image_gallery: 6, cta: 1,
  };
  const min = minItems[block.type] || 4;
  if (items.length >= min) return block;

  const padCount = min - items.length;
  const padded = [...items];

  if (block.type === 'kpi_grid') {
    const templates = [
      { label: 'Active Brands', value: String(selectedBrands.length), sub: 'live' },
      { label: 'Total Subnodes', value: String(selectedBrands.reduce((s, b) => s + (b.subnodes?.length || 0), 0)), sub: 'connected' },
      { label: 'Sectors', value: String(new Set(selectedBrands.map(b => b.sector)).size), sub: 'cross-poll' },
      { label: 'Features', value: String(appData.features?.length || 8), sub: 'generated' },
    ];
    for (let i = items.length; i < min && i < templates.length; i++) padded.push(templates[i]);
  } else if (block.type === 'card_grid') {
    const subnodes = selectedBrands.flatMap(b => (b.subnodes || []).map(s => ({ name: s, description: `Part of ${b.name}™ ecosystem`, sector: b.sector, status: 'active', metric: `${b.subnodes?.length || 0} nodes` })));
    for (let i = items.length; i < min && i < subnodes.length; i++) padded.push(subnodes[i]);
  } else if (block.type === 'activity_feed') {
    const templates = selectedBrands.slice(0, padCount).map((b, i) => ({
      message: `${b.name}™ synced · ${b.subnodes?.length || 0} subnodes active · sector: ${b.sector}`,
      time: `${i + 1}h ago`,
      user: 'System',
    }));
    padded.push(...templates.slice(0, padCount));
  } else if (block.type === 'chart') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = items.length; i < min; i++) padded.push({ label: months[i % 12], value: 500 + Math.floor(Math.random() * 1500) });
  } else if (block.type === 'data_table') {
    const templates = selectedBrands.slice(0, padCount).map((b, i) => ({
      name: b.name, email: `admin@${b.name.toLowerCase().replace(/[^a-z]/g, '')}.zone`,
      status: i % 3 === 0 ? 'pending' : 'active', amount: `R${(1000 + i * 750).toLocaleString()}`, date: '2026-07-14',
    }));
    padded.push(...templates.slice(0, padCount));
  } else if (block.type === 'stat_list') {
    const templates = [
      { label: 'Total Revenue', value: 'R2.4M', sub: 'this quarter' },
      { label: 'Active Users', value: '8,421', sub: 'monthly' },
      { label: 'Orders', value: '1,247', sub: 'this month' },
      { label: 'Avg Order', value: 'R1,920', sub: 'per transaction' },
      { label: 'Retention', value: '94.2%', sub: 'year over year' },
      { label: 'NPS Score', value: '72', sub: 'of 100' },
    ];
    for (let i = items.length; i < min && i < templates.length; i++) padded.push(templates[i]);
  } else if (block.type === 'timeline') {
    const templates = [
      { title: 'Ecosystem Launch', description: 'FAA.ZONE platform went live with initial brand cohort', time: 'Jan 2026' },
      { title: 'First Cross-Pollination', description: 'Agriculture and fashion brands collaborated on heritage textiles', time: 'Mar 2026' },
      { title: 'Marketplace Opening', description: 'Artisan marketplace opened to public buyers', time: 'May 2026' },
      { title: 'Loyalty Program', description: 'Cross-brand rewards launched for ecosystem members', time: 'Jun 2026' },
      { title: 'Analytics Dashboard', description: 'Real-time ecosystem metrics went live', time: 'Jul 2026' },
    ];
    for (let i = items.length; i < min && i < templates.length; i++) padded.push(templates[i]);
  }

  return { ...block, items: padded };
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