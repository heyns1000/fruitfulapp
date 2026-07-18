import React, { useState, useMemo } from 'react';
import {
  Layers, Zap, GitBranch, Database, Activity, Star, TrendingUp,
  Users, Package, ArrowRight, CheckCircle2, Search, Bell, Plus,
  Filter, MoreHorizontal, ChevronRight, Globe, Lock, Sparkles,
  Calendar, DollarSign, ShoppingCart, Eye, MessageSquare, Clock,
  ChevronDown, ChevronUp, X, ArrowLeft, Edit, Trash2, Save
} from 'lucide-react';
import { toast } from 'sonner';

const SECTOR_META = {
  agriculture: { icon: '🌱', accent: '#22c55e' }, fsf: { icon: '🥦', accent: '#86efac' },
  banking: { icon: '🏦', accent: '#60a5fa' }, creative: { icon: '🖋️', accent: '#a78bfa' },
  logistics: { icon: '📦', accent: '#fb923c' }, 'education-ip': { icon: '📚', accent: '#facc15' },
  fashion: { icon: '✂️', accent: '#f472b6' }, gaming: { icon: '🎮', accent: '#818cf8' },
  health: { icon: '🧠', accent: '#34d399' }, housing: { icon: '🏗️', accent: '#94a3b8' },
  justice: { icon: '⚖️', accent: '#fbbf24' }, knowledge: { icon: '📖', accent: '#67e8f9' },
  micromesh: { icon: '☰', accent: '#a3e635' }, media: { icon: '🎬', accent: '#f87171' },
  nutrition: { icon: '✿', accent: '#4ade80' }, 'ai-logic': { icon: '🤖', accent: '#c084fc' },
  packaging: { icon: '📦', accent: '#fb923c' }, quantum: { icon: '✴️', accent: '#38bdf8' },
  ritual: { icon: '☯️', accent: '#e879f9' }, saas: { icon: '🔑', accent: '#f59e0b' },
  trade: { icon: '🧺', accent: '#d97706' }, utilities: { icon: '🔋', accent: '#4ade80' },
  voice: { icon: '🎙️', accent: '#f472b6' }, webless: { icon: '📡', accent: '#22d3ee' },
  nft: { icon: '🔁', accent: '#a78bfa' }, 'education-youth': { icon: '🎓', accent: '#fde68a' },
  zerowaste: { icon: '♻️', accent: '#6ee7b7' }, professional: { icon: '🧾', accent: '#93c5fd' },
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

function getItemField(item, field) {
  if (!item || typeof item !== 'object') return '';
  return item[field] || item.title || item.name || item.label || '';
}

function findBrandForName(name, selectedBrands) {
  if (!name || !selectedBrands) return null;
  return selectedBrands.find(b => name.includes(b.name) || b.name.includes(name));
}

// ── Interactive Block Renderers ──

function HeroBlock({ block, primary, accent, primaryRgb, accentRgb, onAction }) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-10"
      style={{ background: `linear-gradient(135deg, rgba(${primaryRgb},0.18), rgba(${accentRgb},0.06))` }}>
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-25" style={{ backgroundColor: primary }} />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-15" style={{ backgroundColor: accent }} />
      <div className="relative max-w-2xl">
        {block.badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{ background: `rgba(${primaryRgb},0.15)`, color: primary }}>
            <Sparkles className="w-3 h-3" /> {block.badge}
          </span>
        )}
        {block.title && <h2 className="text-4xl font-black text-white mb-3 leading-tight">{block.title}</h2>}
        {block.body && <p className="text-stone-300 text-base leading-relaxed mb-6 max-w-xl">{block.body}</p>}
        <div className="flex gap-3">
          <button onClick={() => onAction?.('cta', block.ctaLabel)}
            className="px-6 py-3 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 shadow-lg active:scale-95"
            style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
            {block.ctaLabel || 'Get Started'} <ArrowRight className="w-4 h-4 inline ml-1" />
          </button>
          <button onClick={() => toast.info('Learn More clicked — this is a live preview')}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white border transition-all hover:bg-white/5 active:scale-95"
            style={{ borderColor: `rgba(${primaryRgb},0.4)` }}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiGridBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 4) || [];
  const colors = [primary, accent, '#34d399', '#818cf8'];
  return (
    <div>
      {block.title && <p className="text-xs font-bold tracking-wider uppercase mb-4 text-stone-500">{block.title}</p>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => {
          const color = colors[i % colors.length];
          const rgb = hexToRgb(color);
          const label = getItemField(item, 'label') || getItemField(item, 'title');
          const value = getItemField(item, 'value') || getItemField(item, 'count') || '—';
          const sub = getItemField(item, 'sub') || getItemField(item, 'trend') || '';
          const Icon = KPI_ICONS[i % KPI_ICONS.length];
          const isUp = sub.includes('↑') || sub.includes('up') || sub.includes('+');
          return (
            <div key={i} className="rounded-2xl p-5 border relative overflow-hidden group hover:border-stone-600 transition-all cursor-pointer hover:scale-[1.02]"
              style={{ background: `rgba(${rgb},0.06)`, borderColor: `rgba(${rgb},0.2)` }}
              onClick={() => toast.info(`${label}: ${value}`)}>
              <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-12 h-12" style={{ color }} />
              </div>
              <div className="relative">
                <p className="font-black text-3xl leading-none" style={{ color }}>{value}</p>
                <p className="text-white text-sm font-bold mt-3">{label}</p>
                {sub && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: isUp ? '#34d399' : '#94a3b8' }}>
                    {isUp && <TrendingUp className="w-3 h-3" />}
                    {sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CardGridBlock({ block, primary, accent, primaryRgb, selectedBrands, onOpenDetail }) {
  const [search, setSearch] = useState('');
  const items = block.items?.slice(0, 9) || [];

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(item => {
      const name = getItemField(item, 'name') || getItemField(item, 'title') || '';
      const desc = getItemField(item, 'description') || getItemField(item, 'body') || '';
      return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
    });
  }, [items, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        {block.title && <p className="text-xs font-bold tracking-wider uppercase text-stone-500">{block.title}</p>}
        <div className="flex gap-2 flex-1 max-w-md justify-end">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-700 bg-stone-900 text-stone-200 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
          <button onClick={() => toast.info('Filter panel — live preview')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700 text-stone-400 flex items-center gap-1.5 hover:bg-stone-800 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button onClick={() => toast.success('New item form would open here')}
            className="text-xs font-bold px-3 py-1.5 rounded-lg text-black flex items-center gap-1.5 active:scale-95 transition-all"
            style={{ background: primary }}>
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-stone-600 text-sm">No results for "{search}"</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const name = getItemField(item, 'name') || getItemField(item, 'title');
            const desc = getItemField(item, 'description') || getItemField(item, 'body') || '';
            const tag = getItemField(item, 'sector') || getItemField(item, 'category') || getItemField(item, 'status');
            const metric = getItemField(item, 'metric') || getItemField(item, 'value') || getItemField(item, 'count') || '';
            const status = getItemField(item, 'status');
            const relatedBrand = findBrandForName(name, selectedBrands);
            const sm = SECTOR_META[relatedBrand?.sector] || SECTOR_META[tag?.toLowerCase?.()];
            const color = sm?.accent || primary;
            const rgb = hexToRgb(color);
            return (
              <div key={i} onClick={() => onOpenDetail?.(item)}
                className="rounded-2xl p-5 border transition-all hover:border-stone-600 cursor-pointer group hover:scale-[1.01]"
                style={{ background: `rgba(${rgb},0.05)`, borderColor: `rgba(${rgb},0.15)` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: `rgba(${rgb},0.15)` }}>
                    {sm?.icon || '◆'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {status && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: status === 'active' || status === 'featured' ? 'rgba(52,211,153,0.15)' : 'rgba(148,163,184,0.1)',
                          color: status === 'active' || status === 'featured' ? '#34d399' : '#94a3b8'
                        }}>
                        {status}
                      </span>
                    )}
                    <MoreHorizontal className="w-5 h-5 text-stone-600 group-hover:text-stone-400 transition-colors" />
                  </div>
                </div>
                <h4 className="text-white font-bold text-sm mb-1.5 leading-tight">{name}</h4>
                <p className="text-xs leading-relaxed text-stone-500 line-clamp-2 mb-3">{desc}</p>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {tag && (
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `rgba(${rgb},0.15)`, color }}>
                      {tag}
                    </span>
                  )}
                  {metric && (
                    <span className="text-xs font-black" style={{ color }}>{metric}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DataTableBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 10) || [];
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [selectedRow, setSelectedRow] = useState(null);

  const cols = items[0] ? Object.keys(items[0]).slice(0, 5) : [];
  const colWidths = ['flex-1', 'w-32', 'w-28', 'w-24', 'w-24'];

  const sorted = useMemo(() => {
    if (!sortCol) return items;
    return [...items].sort((a, b) => {
      const av = getItemField(a, sortCol);
      const bv = getItemField(b, sortCol);
      if (sortDir === 'asc') return String(av).localeCompare(String(bv));
      return String(bv).localeCompare(String(av));
    });
  }, [items, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  return (
    <div>
      {block.title && <p className="text-xs font-bold tracking-wider uppercase mb-4 text-stone-500">{block.title}</p>}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `rgba(${primaryRgb},0.15)` }}>
        <div className="flex items-center gap-4 px-5 py-3.5 border-b"
          style={{ background: `rgba(${primaryRgb},0.08)`, borderColor: `rgba(${primaryRgb},0.15)` }}>
          {cols.map((col, i) => (
            <button key={i} onClick={() => handleSort(col)}
              className={`text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-white transition-colors flex items-center gap-1 ${colWidths[i] || 'w-24'}`}>
              {col}
              {sortCol === col && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
            </button>
          ))}
        </div>
        {sorted.map((item, i) => (
          <div key={i} onClick={() => setSelectedRow(selectedRow === i ? null : i)}
            className={`flex items-center gap-4 px-5 py-3.5 border-b last:border-0 transition-colors cursor-pointer ${
              selectedRow === i ? 'bg-white/[0.08]' : 'hover:bg-white/[0.03]'
            }`}
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {cols.map((col, j) => {
              const val = getItemField(item, col);
              const isStatus = col === 'status' || (typeof val === 'string' && ['active','pending','completed','featured','paused','shipped','delivered'].includes(val?.toLowerCase()));
              const isAmount = col === 'amount' || col === 'revenue' || col === 'price' || (typeof val === 'string' && val?.includes('$')) || (typeof val === 'string' && val?.includes('R'));
              return (
                <div key={j} className={`text-sm ${colWidths[j] || 'w-24'} ${j === 0 ? 'font-bold text-white' : 'text-stone-400 font-mono'}`}>
                  {j === 0 ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                      {val}
                    </div>
                  ) : isStatus ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: val?.toLowerCase() === 'active' || val?.toLowerCase() === 'completed' || val?.toLowerCase() === 'delivered' ? 'rgba(52,211,153,0.15)' : val?.toLowerCase() === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(148,163,184,0.1)',
                        color: val?.toLowerCase() === 'active' || val?.toLowerCase() === 'completed' || val?.toLowerCase() === 'delivered' ? '#34d399' : val?.toLowerCase() === 'pending' ? '#f59e0b' : '#94a3b8'
                      }}>
                      {val}
                    </span>
                  ) : isAmount ? (
                    <span className="font-black" style={{ color: primary }}>{val}</span>
                  ) : val}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {selectedRow !== null && (
        <div className="mt-3 p-4 rounded-xl border border-stone-700 bg-stone-900 text-sm">
          <p className="text-stone-400 text-xs mb-2">Row details (click to close):</p>
          <pre className="text-xs text-stone-300 overflow-auto">{JSON.stringify(sorted[selectedRow], null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function ChartBlock({ block, primary, accent, primaryRgb, accentRgb }) {
  const items = block.items?.slice(0, 12) || [];
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...items.map(it => Number(getItemField(it, 'value') || getItemField(it, 'count') || 0)), 1);
  return (
    <div>
      {block.title && <p className="text-xs font-bold tracking-wider uppercase mb-4 text-stone-500">{block.title}</p>}
      <div className="rounded-2xl p-6 border" style={{ background: `rgba(${primaryRgb},0.05)`, borderColor: `rgba(${primaryRgb},0.15)` }}>
        <div className="flex items-end justify-between gap-2 h-52 mb-4 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="border-t border-dashed" style={{ borderColor: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
          {items.map((item, i) => {
            const val = Number(getItemField(item, 'value') || getItemField(item, 'count') || (i + 1) * 12);
            const height = Math.max((val / maxVal) * 100, 4);
            const color = i % 2 === 0 ? primary : accent;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}>
                <div className="w-full rounded-t-lg transition-all hover:opacity-80 relative cursor-pointer"
                  style={{ height: `${height}%`, background: `linear-gradient(180deg, ${color}, ${color}40)` }}>
                  {hovered === i && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-black whitespace-nowrap px-2 py-1 rounded-md"
                      style={{ color, background: 'rgba(0,0,0,0.9)' }}>{val}</span>
                  )}
                </div>
                <span className="text-[10px] text-stone-500 font-mono truncate max-w-full">
                  {getItemField(item, 'label')?.slice(0, 8) || getItemField(item, 'name')?.slice(0, 8) || `M${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>
        {block.body && <p className="text-sm text-stone-500 leading-relaxed mt-3">{block.body}</p>}
      </div>
    </div>
  );
}

function TimelineBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 8) || [];
  return (
    <div>
      {block.title && <p className="text-xs font-bold tracking-wider uppercase mb-4 text-stone-500">{block.title}</p>}
      <div className="space-y-0">
        {items.map((item, i) => {
          const title = getItemField(item, 'title') || getItemField(item, 'name');
          const desc = getItemField(item, 'description') || getItemField(item, 'body') || '';
          const time = getItemField(item, 'time') || getItemField(item, 'date') || '';
          return (
            <div key={i} className="flex gap-4 pb-6 relative">
              {i < items.length - 1 && (
                <div className="absolute left-4 top-9 bottom-0 w-px" style={{ background: `rgba(${primaryRgb},0.2)` }} />
              )}
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2"
                style={{ background: '#0d0b0f', borderColor: primary }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primary }} />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-bold text-sm">{title}</h4>
                  {time && <span className="text-xs font-mono text-stone-500 flex items-center gap-1">
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
  );
}

function CtaBlock({ block, primary, accent, primaryRgb, accentRgb, onAction }) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-10 text-center"
      style={{ background: `linear-gradient(135deg, rgba(${primaryRgb},0.15), rgba(${accentRgb},0.08))` }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${primary} 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      <div className="relative">
        {block.title && <h3 className="text-3xl font-black text-white mb-3">{block.title}</h3>}
        {block.body && <p className="text-stone-400 text-base mb-6 max-w-lg mx-auto leading-relaxed">{block.body}</p>}
        <button onClick={() => onAction?.('cta', block.items?.[0]?.label || 'Get Started')}
          className="px-8 py-3.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 inline-flex items-center gap-2 shadow-lg active:scale-95"
          style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
          {block.items?.[0]?.label || block.items?.[0]?.title || 'Get Started'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SplitPanelBlock({ block, primary, accent, primaryRgb, selectedBrands }) {
  const items = block.items?.slice(0, 5) || [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="rounded-2xl p-6 border" style={{ background: `rgba(${primaryRgb},0.05)`, borderColor: `rgba(${primaryRgb},0.15)` }}>
        {block.title && <h3 className="text-white font-bold text-lg mb-3">{block.title}</h3>}
        {block.body && <p className="text-stone-500 text-sm leading-relaxed">{block.body}</p>}
      </div>
      <div className="rounded-2xl p-6 border space-y-3" style={{ borderColor: `rgba(${primaryRgb},0.15)` }}>
        {items.map((item, i) => {
          const name = getItemField(item, 'name') || getItemField(item, 'title');
          const desc = getItemField(item, 'description') || getItemField(item, 'body') || '';
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)' }}>
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

function StatListBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 6) || [];
  return (
    <div>
      {block.title && <p className="text-xs font-bold tracking-wider uppercase mb-4 text-stone-500">{block.title}</p>}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `rgba(${primaryRgb},0.15)` }}>
        {items.map((item, i) => {
          const label = getItemField(item, 'label') || getItemField(item, 'name') || getItemField(item, 'title');
          const value = getItemField(item, 'value') || getItemField(item, 'count') || '—';
          const sub = getItemField(item, 'sub') || getItemField(item, 'trend') || '';
          return (
            <div key={i} className="flex items-center justify-between px-5 py-4 border-b last:border-0 hover:bg-white/[0.03] transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                <span className="text-white text-sm font-bold">{label}</span>
                {sub && <span className="text-xs text-stone-500 font-mono">{sub}</span>}
              </div>
              <span className="font-black text-lg" style={{ color: primary }}>{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityFeedBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 10) || [];
  const avatarColors = [primary, accent, '#34d399', '#818cf8', '#f472b6', '#fbbf24'];
  return (
    <div>
      {block.title && <p className="text-xs font-bold tracking-wider uppercase mb-4 text-stone-500">{block.title}</p>}
      <div className="space-y-2">
        {items.map((item, i) => {
          const text = getItemField(item, 'message') || getItemField(item, 'title') || getItemField(item, 'description') || getItemField(item, 'body');
          const time = getItemField(item, 'time') || getItemField(item, 'date') || '';
          const user = getItemField(item, 'user') || getItemField(item, 'name') || '';
          const avatarColor = avatarColors[i % avatarColors.length];
          const initials = user ? user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '••';
          return (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)' }}>
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
      </div>
    </div>
  );
}

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
      {block.title && <p className="text-xs font-bold tracking-wider uppercase mb-4 text-stone-500">{block.title}</p>}
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 border space-y-4 max-w-lg" style={{ borderColor: `rgba(${primaryRgb},0.15)`, background: `rgba(${primaryRgb},0.04)` }}>
        {items.map((item, i) => {
          const label = getItemField(item, 'label') || getItemField(item, 'name') || getItemField(item, 'title');
          const type = item.type || 'text';
          return (
            <div key={i}>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 block">{label}</label>
              <input
                type={type === 'number' ? 'number' : type === 'email' ? 'email' : 'text'}
                value={values[label] || ''}
                onChange={(e) => setValues({ ...values, [label]: e.target.value })}
                placeholder={`Enter ${label?.toLowerCase()}…`}
                className="w-full px-4 py-3 rounded-xl border bg-stone-950 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              />
            </div>
          );
        })}
        <button type="submit"
          className="w-full py-3.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
          style={{ background: submitted ? '#22c55e' : `linear-gradient(135deg, ${primary}, ${accent})` }}>
          {submitted ? <><CheckCircle2 className="w-4 h-4" /> Submitted!</> : 'Submit'}
        </button>
      </form>
    </div>
  );
}

function ImageGalleryBlock({ block, primary, accent, primaryRgb, selectedBrands, onOpenDetail }) {
  const items = block.items?.slice(0, 6) || [];
  return (
    <div>
      {block.title && <p className="text-xs font-bold tracking-wider uppercase mb-4 text-stone-500">{block.title}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item, i) => {
          const name = getItemField(item, 'name') || getItemField(item, 'title');
          const relatedBrand = findBrandForName(name, selectedBrands);
          const sm = SECTOR_META[relatedBrand?.sector];
          const color = sm?.accent || primary;
          const rgb = hexToRgb(color);
          return (
            <div key={i} onClick={() => onOpenDetail?.(item)}
              className="aspect-video rounded-2xl border relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
              style={{ background: `linear-gradient(135deg, rgba(${rgb},0.2), rgba(${rgb},0.05))`, borderColor: `rgba(${rgb},0.25)` }}>
              <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-25">{sm?.icon || '🖼️'}</div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-sm font-bold truncate">{name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Detail Modal ──

function DetailModal({ item, onClose, primary, accent }) {
  if (!item) return null;
  const entries = Object.entries(item).filter(([, v]) => v != null && v !== '');
  return (
    <div className="fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-950 border border-stone-700 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <h3 className="text-white font-black text-lg">Details</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-3">
          {entries.map(([key, val]) => (
            <div key={key} className="flex justify-between gap-4 py-2 border-b border-stone-800/50">
              <span className="text-stone-500 text-sm font-bold uppercase tracking-wider">{key}</span>
              <span className="text-white text-sm text-right">{String(val)}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-stone-800 flex gap-2">
          <button onClick={() => toast.info('Edit mode — live preview')} className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-bold flex items-center justify-center gap-2">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button onClick={() => { toast.success('Deleted'); onClose(); }} className="flex-1 py-2.5 rounded-xl border border-red-900/50 text-red-400 hover:bg-red-950/30 text-sm font-bold flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main renderer ──

function renderBlock(block, ctx) {
  if (!block) return null;
  const type = (block.type || '').toLowerCase();
  const props = { block, ...ctx };
  switch (type) {
    case 'hero':           return <HeroBlock {...props} />;
    case 'kpi_grid':       return <KpiGridBlock {...props} />;
    case 'card_grid':      return <CardGridBlock {...props} />;
    case 'data_table':     return <DataTableBlock {...props} />;
    case 'chart':          return <ChartBlock {...props} />;
    case 'timeline':       return <TimelineBlock {...props} />;
    case 'cta':            return <CtaBlock {...props} />;
    case 'split_panel':    return <SplitPanelBlock {...props} />;
    case 'stat_list':      return <StatListBlock {...props} />;
    case 'activity_feed':  return <ActivityFeedBlock {...props} />;
    case 'form':           return <FormBlock {...props} />;
    case 'image_gallery':  return <ImageGalleryBlock {...props} />;
    default:
      return (
        <div className="rounded-2xl p-6 border" style={{ background: `rgba(${ctx.primaryRgb},0.05)`, borderColor: `rgba(${ctx.primaryRgb},0.15)` }}>
          {block.title && <h3 className="text-white font-bold text-lg mb-2">{block.title}</h3>}
          {block.body && <p className="text-stone-500 text-sm leading-relaxed">{block.body}</p>}
          {block.items?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {block.items.slice(0, 4).map((item, i) => (
                <div key={i} className="px-4 py-3 rounded-xl text-sm text-stone-300" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {getItemField(item, 'name') || getItemField(item, 'title') || getItemField(item, 'label') || 'Item'}
                </div>
              ))}
            </div>
          )}
        </div>
      );
  }
}

export default function PageRenderer({ page, appData, selectedBrands, primary, secondary, accent, primaryRgb, accentRgb }) {
  const [detailItem, setDetailItem] = useState(null);

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-stone-600 text-sm">
        Select a page to preview
      </div>
    );
  }

  const ctx = { primary, secondary, accent, primaryRgb, accentRgb, selectedBrands, appData, onOpenDetail: setDetailItem, onAction: (type, label) => toast.info(`${type}: ${label}`) };
  const blocks = page.contentBlocks?.length > 0
    ? page.contentBlocks
    : fallbackBlocks(page, appData, selectedBrands);

  return (
    <>
      <div className="px-8 py-8 space-y-8 max-w-5xl">
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
        { label: 'Active Brands', value: selectedBrands.length, sub: 'integrated' },
        { label: 'Total Subnodes', value: allSubnodes.length, sub: 'live data' },
        { label: 'Pages', value: appData.pages?.length || 0, sub: 'generated' },
        { label: 'Features', value: appData.features?.length || 0, sub: 'active' },
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