import React from 'react';
import {
  Layers, Zap, GitBranch, Database, Activity, Star, TrendingUp,
  Users, Package, ArrowRight, CheckCircle2, Search, Bell, Plus,
  Filter, MoreHorizontal, ChevronRight, Globe, Lock
} from 'lucide-react';

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

// ── Block renderers ──

function HeroBlock({ block, primary, accent, primaryRgb }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-8"
      style={{ background: `linear-gradient(135deg, rgba(${primaryRgb},0.15), rgba(${hexToRgb(accent)},0.08))` }}>
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ backgroundColor: primary }} />
      <div className="relative">
        {block.title && <h2 className="text-2xl font-black text-white mb-2">{block.title}</h2>}
        {block.body && <p className="text-stone-300 text-sm max-w-lg leading-relaxed mb-5">{block.body}</p>}
        <div className="flex gap-2.5">
          <button className="px-5 py-2.5 rounded-xl text-sm font-black text-black transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
            Get Started
          </button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white border transition-all hover:bg-white/5"
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
      {block.title && <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3 text-stone-600">{block.title}</p>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, i) => {
          const color = colors[i % colors.length];
          const rgb = hexToRgb(color);
          const label = getItemField(item, 'label') || getItemField(item, 'title');
          const value = getItemField(item, 'value') || getItemField(item, 'count') || '—';
          const sub = getItemField(item, 'sub') || getItemField(item, 'trend') || '';
          return (
            <div key={i} className="rounded-xl p-4 border relative overflow-hidden"
              style={{ background: `rgba(${rgb},0.05)`, borderColor: `rgba(${rgb},0.18)` }}>
              <div className="absolute top-2 right-2 opacity-10">
                <TrendingUp className="w-8 h-8" style={{ color }} />
              </div>
              <p className="font-black text-3xl leading-none" style={{ color }}>{value}</p>
              <p className="text-white text-xs font-bold mt-2">{label}</p>
              {sub && <p className="text-[9px] mt-1 text-stone-600">{sub}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CardGridBlock({ block, primary, accent, primaryRgb, selectedBrands }) {
  const items = block.items?.slice(0, 6) || [];
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        {block.title && <p className="text-[10px] font-black tracking-[0.18em] uppercase text-stone-600">{block.title}</p>}
        <div className="flex gap-1.5">
          <button className="text-[9px] font-bold px-2 py-1 rounded-lg border border-stone-700 text-stone-500 flex items-center gap-1">
            <Filter className="w-2.5 h-2.5" /> Filter
          </button>
          <button className="text-[9px] font-bold px-2 py-1 rounded-lg text-black flex items-center gap-1"
            style={{ background: primary }}>
            <Plus className="w-2.5 h-2.5" /> New
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {items.map((item, i) => {
          const name = getItemField(item, 'name') || getItemField(item, 'title');
          const desc = getItemField(item, 'description') || getItemField(item, 'body') || '';
          const tag = getItemField(item, 'sector') || getItemField(item, 'category') || getItemField(item, 'status');
          const relatedBrand = selectedBrands?.find(b => name?.includes(b.name) || b.name?.includes(name));
          const sm = SECTOR_META[relatedBrand?.sector] || SECTOR_META[tag?.toLowerCase?.()];
          const color = sm?.accent || primary;
          const rgb = hexToRgb(color);
          return (
            <div key={i} className="rounded-xl p-4 border transition-all hover:border-stone-600"
              style={{ background: `rgba(${rgb},0.04)`, borderColor: `rgba(${rgb},0.14)` }}>
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                  style={{ background: `rgba(${rgb},0.14)` }}>
                  {sm?.icon || '◆'}
                </div>
                <MoreHorizontal className="w-4 h-4 text-stone-700" />
              </div>
              <h4 className="text-white font-black text-xs mb-1 leading-tight">{name}</h4>
              <p className="text-[10px] leading-relaxed text-stone-500 line-clamp-2 mb-2">{desc}</p>
              {tag && (
                <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `rgba(${rgb},0.15)`, color }}>
                  {tag}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DataTableBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 6) || [];
  const cols = items[0] ? Object.keys(items[0]).slice(0, 4) : [];
  return (
    <div>
      {block.title && <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3 text-stone-600">{block.title}</p>}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: `rgba(${primaryRgb},0.12)` }}>
        <div className="flex items-center gap-3 px-4 py-2.5 border-b"
          style={{ background: `rgba(${primaryRgb},0.06)`, borderColor: `rgba(${primaryRgb},0.12)` }}>
          {cols.map((col, i) => (
            <div key={i} className={`text-[9px] font-black uppercase tracking-wider text-stone-500 ${i === 0 ? 'flex-1' : 'w-20'}`}>
              {col}
            </div>
          ))}
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b hover:bg-white/2 transition-colors"
            style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {cols.map((col, j) => {
              const val = getItemField(item, col);
              return (
                <div key={j} className={`text-xs ${j === 0 ? 'flex-1 font-bold text-white' : 'w-20 text-stone-400 font-mono'}`}>
                  {j === 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
                      {val}
                    </div>
                  ) : val}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartBlock({ block, primary, accent, primaryRgb, accentRgb }) {
  const items = block.items?.slice(0, 8) || [];
  const maxVal = Math.max(...items.map(it => Number(getItemField(it, 'value') || getItemField(it, 'count') || 0)), 1);
  return (
    <div>
      {block.title && <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3 text-stone-600">{block.title}</p>}
      <div className="rounded-xl p-5 border" style={{ background: `rgba(${primaryRgb},0.04)`, borderColor: `rgba(${primaryRgb},0.14)` }}>
        <div className="flex items-end justify-between gap-2 h-32 mb-3">
          {items.map((item, i) => {
            const val = Number(getItemField(item, 'value') || getItemField(item, 'count') || (i + 1) * 12);
            const height = Math.max((val / maxVal) * 100, 4);
            const color = i % 2 === 0 ? primary : accent;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full rounded-t-md transition-all hover:opacity-80 relative"
                  style={{ height: `${height}%`, background: `linear-gradient(180deg, ${color}, ${color}80)` }}>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color }}>{val}</span>
                </div>
                <span className="text-[8px] text-stone-600 font-mono truncate max-w-full">
                  {getItemField(item, 'label')?.slice(0, 4) || getItemField(item, 'name')?.slice(0, 4) || `M${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>
        {block.body && <p className="text-[10px] text-stone-500 leading-relaxed">{block.body}</p>}
      </div>
    </div>
  );
}

function TimelineBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 6) || [];
  return (
    <div>
      {block.title && <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3 text-stone-600">{block.title}</p>}
      <div className="space-y-0">
        {items.map((item, i) => {
          const title = getItemField(item, 'title') || getItemField(item, 'name');
          const desc = getItemField(item, 'description') || getItemField(item, 'body') || '';
          const time = getItemField(item, 'time') || getItemField(item, 'date') || '';
          return (
            <div key={i} className="flex gap-3 pb-4 relative">
              {i < items.length - 1 && (
                <div className="absolute left-3 top-7 bottom-0 w-px" style={{ background: `rgba(${primaryRgb},0.15)` }} />
              )}
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border-2"
                style={{ background: '#0d0b0f', borderColor: primary }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-bold text-xs">{title}</h4>
                  {time && <span className="text-[9px] font-mono text-stone-600">{time}</span>}
                </div>
                {desc && <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">{desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CtaBlock({ block, primary, accent, primaryRgb, accentRgb }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 text-center"
      style={{ background: `linear-gradient(135deg, rgba(${primaryRgb},0.12), rgba(${accentRgb},0.08))` }}>
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${primary} 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
      <div className="relative">
        {block.title && <h3 className="text-xl font-black text-white mb-2">{block.title}</h3>}
        {block.body && <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">{block.body}</p>}
        <button className="px-6 py-3 rounded-xl text-sm font-black text-black transition-all hover:opacity-90 inline-flex items-center gap-2"
          style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
          {block.items?.[0]?.label || block.items?.[0]?.title || 'Get Started'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SplitPanelBlock({ block, primary, accent, primaryRgb, selectedBrands }) {
  const items = block.items?.slice(0, 4) || [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-xl p-5 border" style={{ background: `rgba(${primaryRgb},0.04)`, borderColor: `rgba(${primaryRgb},0.14)` }}>
        {block.title && <h3 className="text-white font-black text-sm mb-3">{block.title}</h3>}
        {block.body && <p className="text-stone-500 text-xs leading-relaxed">{block.body}</p>}
      </div>
      <div className="rounded-xl p-5 border space-y-2" style={{ borderColor: `rgba(${primaryRgb},0.12)` }}>
        {items.map((item, i) => {
          const name = getItemField(item, 'name') || getItemField(item, 'title');
          const desc = getItemField(item, 'description') || getItemField(item, 'body') || '';
          return (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: primary }} />
              <div>
                <p className="text-white text-xs font-bold">{name}</p>
                {desc && <p className="text-[10px] text-stone-600 leading-relaxed">{desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatListBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 5) || [];
  return (
    <div>
      {block.title && <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3 text-stone-600">{block.title}</p>}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: `rgba(${primaryRgb},0.12)` }}>
        {items.map((item, i) => {
          const label = getItemField(item, 'label') || getItemField(item, 'name') || getItemField(item, 'title');
          const value = getItemField(item, 'value') || getItemField(item, 'count') || '—';
          const sub = getItemField(item, 'sub') || getItemField(item, 'trend') || '';
          return (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-0 hover:bg-white/2 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
                <span className="text-white text-xs font-bold">{label}</span>
                {sub && <span className="text-[9px] text-stone-600 font-mono">{sub}</span>}
              </div>
              <span className="font-black text-sm" style={{ color: primary }}>{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityFeedBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 6) || [];
  return (
    <div>
      {block.title && <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3 text-stone-600">{block.title}</p>}
      <div className="space-y-2">
        {items.map((item, i) => {
          const text = getItemField(item, 'message') || getItemField(item, 'title') || getItemField(item, 'description') || getItemField(item, 'body');
          const time = getItemField(item, 'time') || getItemField(item, 'date') || '';
          return (
            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `rgba(${primaryRgb},0.12)` }}>
                <Activity className="w-3 h-3" style={{ color: primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-stone-300 text-xs leading-relaxed">{text}</p>
                {time && <p className="text-[9px] text-stone-700 font-mono mt-0.5">{time}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormBlock({ block, primary, accent, primaryRgb }) {
  const items = block.items?.slice(0, 4) || [];
  return (
    <div>
      {block.title && <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3 text-stone-600">{block.title}</p>}
      <div className="rounded-xl p-5 border space-y-3" style={{ borderColor: `rgba(${primaryRgb},0.14)`, background: `rgba(${primaryRgb},0.03)` }}>
        {items.map((item, i) => {
          const label = getItemField(item, 'label') || getItemField(item, 'name') || getItemField(item, 'title');
          return (
            <div key={i}>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1.5 block">{label}</label>
              <div className="px-3 py-2 rounded-lg border bg-stone-950 text-stone-600 text-xs"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                Enter {label?.toLowerCase()}…
              </div>
            </div>
          );
        })}
        <button className="w-full py-2.5 rounded-lg text-sm font-black text-black transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
          Submit
        </button>
      </div>
    </div>
  );
}

function ImageGalleryBlock({ block, primary, accent, primaryRgb, selectedBrands }) {
  const items = block.items?.slice(0, 6) || [];
  return (
    <div>
      {block.title && <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3 text-stone-600">{block.title}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item, i) => {
          const name = getItemField(item, 'name') || getItemField(item, 'title');
          const relatedBrand = selectedBrands?.find(b => name?.includes(b.name));
          const sm = SECTOR_META[relatedBrand?.sector];
          const color = sm?.accent || primary;
          const rgb = hexToRgb(color);
          return (
            <div key={i} className="aspect-video rounded-xl border relative overflow-hidden group cursor-pointer"
              style={{ background: `linear-gradient(135deg, rgba(${rgb},0.15), rgba(${rgb},0.05))`, borderColor: `rgba(${rgb},0.2)` }}>
              <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">{sm?.icon || '🖼️'}</div>
              <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs font-black truncate">{name}</p>
              </div>
            </div>
          );
        })}
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
    case 'hero':          return <HeroBlock {...props} />;
    case 'kpi_grid':     return <KpiGridBlock {...props} />;
    case 'card_grid':    return <CardGridBlock {...props} />;
    case 'data_table':   return <DataTableBlock {...props} />;
    case 'chart':        return <ChartBlock {...props} />;
    case 'timeline':     return <TimelineBlock {...props} />;
    case 'cta':          return <CtaBlock {...props} />;
    case 'split_panel':  return <SplitPanelBlock {...props} />;
    case 'stat_list':    return <StatListBlock {...props} />;
    case 'activity_feed':return <ActivityFeedBlock {...props} />;
    case 'form':         return <FormBlock {...props} />;
    case 'image_gallery':return <ImageGalleryBlock {...props} />;
    default:
      // Fallback: render as a generic content block
      return (
        <div className="rounded-xl p-5 border" style={{ background: `rgba(${ctx.primaryRgb},0.04)`, borderColor: `rgba(${ctx.primaryRgb},0.14)` }}>
          {block.title && <h3 className="text-white font-black text-sm mb-2">{block.title}</h3>}
          {block.body && <p className="text-stone-500 text-xs leading-relaxed">{block.body}</p>}
          {block.items?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {block.items.slice(0, 4).map((item, i) => (
                <div key={i} className="px-3 py-2 rounded-lg text-xs text-stone-300" style={{ background: 'rgba(255,255,255,0.03)' }}>
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
  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-stone-600 text-sm">
        Select a page to preview
      </div>
    );
  }

  const ctx = { primary, secondary, accent, primaryRgb, accentRgb, selectedBrands, appData };
  const blocks = page.contentBlocks?.length > 0
    ? page.contentBlocks
    : fallbackBlocks(page, appData, selectedBrands);

  return (
    <div className="px-5 py-5 space-y-6">
      {blocks.map((block, i) => (
        <div key={i}>{renderBlock(block, ctx)}</div>
      ))}
    </div>
  );
}

// If the LLM didn't return contentBlocks, build them from the page data
function fallbackBlocks(page, appData, selectedBrands) {
  const blocks = [];
  const layout = (page.layout || '').toLowerCase();

  if (layout === 'landing' || layout === 'detail' || !layout) {
    blocks.push({ type: 'hero', title: page.name, body: page.description });
  }
  if (layout === 'dashboard' || layout === 'analytics' || !layout) {
    blocks.push({
      type: 'kpi_grid',
      title: 'Overview',
      items: [
        { label: 'Total Brands', value: selectedBrands.length, sub: 'integrated' },
        { label: 'Pages', value: appData.pages?.length || 0, sub: 'generated' },
        { label: 'Features', value: appData.features?.length || 0, sub: 'active' },
        { label: 'DB Tables', value: appData.databaseSchema?.length || 0, sub: 'schema' },
      ],
    });
  }
  blocks.push({
    type: 'card_grid',
    title: page.sections?.length ? 'Page Sections' : 'Key Features',
    items: (page.sections?.length ? page.sections : appData.features?.slice(0, 6) || []).map((s, i) => ({
      name: typeof s === 'string' ? s : s?.name,
      description: typeof s === 'string' ? '' : s?.description,
    })),
  });
  if (appData.crossPollination?.length > 0) {
    blocks.push({
      type: 'chart',
      title: 'Cross-Pollination Synergy',
      items: appData.crossPollination.slice(0, 8).map(cp => ({
        label: cp.brand1?.slice(0, 4),
        value: cp.synergyScore || 70,
      })),
    });
  }
  blocks.push({
    type: 'activity_feed',
    title: 'Recent Activity',
    items: selectedBrands.slice(0, 5).map(b => ({
      message: `${b.name}™ synced · ${b.subnodes?.length || 0} subnodes active`,
      time: '2h ago',
    })),
  });
  return blocks;
}