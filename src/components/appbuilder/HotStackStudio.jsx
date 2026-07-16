import React, { useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  Flame, Search, Check, X, Sparkles, Monitor, Tablet, Smartphone,
  FileJson, FileText, Code2, Wand2, Loader2, Layers,
} from 'lucide-react';
import {
  deriveAppSpec, SECTOR_META, APP_TYPES, VIBE_TEMPLATES,
  downloadBlob, specToReadme, specToReactStarter,
} from '@/lib/hotstackSpec';
import HotStackLivePreview from './HotStackLivePreview';

const DEVICES = [
  { val: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { val: 'tablet',  label: 'Tablet',  icon: Tablet,  width: '780px' },
  { val: 'mobile',  label: 'Mobile',  icon: Smartphone, width: '380px' },
];

export default function HotStackStudio({ brands }) {
  const [prompt, setPrompt] = useState('');
  const [appName, setAppName] = useState('');
  const [appType, setAppType] = useState('webapp');
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [device, setDevice] = useState('desktop');
  const [enhancing, setEnhancing] = useState(false);
  const [enhancement, setEnhancement] = useState(null);

  const sectors = useMemo(
    () => [...new Set(brands.map((b) => b.sector).filter(Boolean))],
    [brands]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return brands.filter((b) => {
      const mSearch = !q || b.name.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q);
      const mSector = sectorFilter === 'all' || b.sector === sectorFilter;
      return mSearch && mSector;
    });
  }, [brands, search, sectorFilter]);

  const baseSpec = useMemo(
    () => deriveAppSpec({ prompt, brands: selected, appName, appType }),
    [prompt, selected, appName, appType]
  );

  // Merge optional AI enhancement into the live spec
  const spec = useMemo(() => {
    if (!enhancement) return baseSpec;
    return {
      ...baseSpec,
      tagline: enhancement.tagline || baseSpec.tagline,
      features: [
        ...baseSpec.features,
        ...(enhancement.extraFeatures || []).map((name) => ({
          name,
          description: 'AI-suggested capability for your stack.',
          sector: baseSpec.primarySector,
          accent: baseSpec.accent,
        })),
      ],
    };
  }, [baseSpec, enhancement]);

  const toggle = (brand) => {
    setEnhancement(null);
    setSelected((prev) => {
      if (prev.find((b) => b.id === brand.id)) return prev.filter((b) => b.id !== brand.id);
      if (prev.length >= 12) {
        toast.error('Max 12 brands per build');
        return prev;
      }
      return [...prev, brand];
    });
  };

  const enhance = async () => {
    setEnhancing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Enhance this HotStack app concept. Prompt: "${prompt}". App: ${spec.appName} (${appType}). Brands: ${selected.map((b) => b.name).join(', ')}. Suggest a punchy tagline and 3 extra feature names.`,
        response_json_schema: {
          type: 'object',
          properties: {
            tagline: { type: 'string' },
            extraFeatures: { type: 'array', items: { type: 'string' } },
          },
        },
      });
      setEnhancement(result);
      toast.success('HotStack enhanced your build');
    } catch (e) {
      toast.error('Enhance failed — try again');
    } finally {
      setEnhancing(false);
    }
  };

  const currentDevice = DEVICES.find((d) => d.val === device);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-6">
      {/* ─── Control column ─── */}
      <div className="space-y-5">
        {/* App identity */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">App name</label>
          <input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. Fruitful Artisan Hub"
            className="w-full px-3 py-2 rounded-lg border border-input bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block pt-1">App type</label>
          <div className="flex flex-wrap gap-1.5">
            {APP_TYPES.map((t) => (
              <button
                key={t.val}
                onClick={() => setAppType(t.val)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors',
                  appType === t.val
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:bg-secondary',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Vibe prompt */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Your vibe
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your app in plain language…"
            className="w-full h-24 px-3 py-2 rounded-lg border border-input bg-white text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex flex-wrap gap-1.5">
            {VIBE_TEMPLATES.map((tpl) => (
              <button
                key={tpl.label}
                onClick={() => { setPrompt(tpl.prompt); setAppType(tpl.type); setEnhancement(null); }}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </section>

        {/* Brand stack */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Stack brands
            </label>
            <span className="text-[11px] font-bold text-primary">{selected.length} / 12</span>
          </div>

          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((b) => (
                <button
                  key={b.id}
                  onClick={() => toggle(b)}
                  className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full border"
                  style={{
                    borderColor: `${SECTOR_META[b.sector]?.accent || '#0d9488'}55`,
                    color: SECTOR_META[b.sector]?.accent || '#0d9488',
                    background: `${SECTOR_META[b.sector]?.accent || '#0d9488'}12`,
                  }}
                >
                  {b.name} <X className="w-2.5 h-2.5" />
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands…"
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-input bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSectorFilter('all')}
              className={[
                'px-2 py-1 rounded-md text-[10px] font-bold border transition-colors',
                sectorFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-secondary',
              ].join(' ')}
            >
              All
            </button>
            {sectors.slice(0, 10).map((s) => (
              <button
                key={s}
                onClick={() => setSectorFilter(s === sectorFilter ? 'all' : s)}
                className="px-2 py-1 rounded-md text-[10px] font-bold border transition-colors"
                style={
                  sectorFilter === s
                    ? { background: SECTOR_META[s]?.accent, borderColor: SECTOR_META[s]?.accent, color: '#fff' }
                    : {}
                }
              >
                {SECTOR_META[s]?.label || s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {filtered.slice(0, 60).map((b) => {
              const isSel = !!selected.find((x) => x.id === b.id);
              const accent = SECTOR_META[b.sector]?.accent || '#0d9488';
              return (
                <button
                  key={b.id}
                  onClick={() => toggle(b)}
                  className="relative p-2.5 rounded-lg border text-left transition-all"
                  style={isSel ? { borderColor: accent, background: `${accent}0d` } : { borderColor: 'hsl(var(--border))' }}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-bold truncate" style={{ color: isSel ? accent : undefined }}>{b.name}</span>
                    <span
                      className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                      style={isSel ? { background: accent, borderColor: accent } : { borderColor: 'hsl(var(--muted-foreground))' }}
                    >
                      {isSel && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{SECTOR_META[b.sector]?.label || b.sector} · {b.subnodes?.length || 0}n</p>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-2 text-center py-6 text-xs text-muted-foreground">No brands match.</p>
            )}
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-wrap gap-2">
          <button
            onClick={enhance}
            disabled={enhancing || selected.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-white transition-opacity disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}
          >
            {enhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Enhance with AI
          </button>
          <button onClick={() => downloadBlob(`${spec.appName}.json`, JSON.stringify(spec, null, 2), 'application/json')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors">
            <FileJson className="w-4 h-4" /> JSON
          </button>
          <button onClick={() => downloadBlob(`${spec.appName}_README.md`, specToReadme(spec), 'text/markdown')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors">
            <FileText className="w-4 h-4" /> README
          </button>
          <button onClick={() => downloadBlob(`${spec.appName}_starter.jsx`, specToReactStarter(spec), 'text/plain')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors">
            <Code2 className="w-4 h-4" /> React
          </button>
        </section>
      </div>

      {/* ─── Live preview column ─── */}
      <div className="lg:sticky lg:top-4 self-start space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider" style={{ color: '#f97316' }}>
              <Flame className="w-4 h-4" /> Live preview
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" /> Real-time
            </span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-card">
            {DEVICES.map((d) => {
              const Icon = d.icon;
              return (
                <button
                  key={d.val}
                  onClick={() => setDevice(d.val)}
                  aria-label={d.label}
                  className={[
                    'p-1.5 rounded-md transition-colors',
                    device === d.val ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary',
                  ].join(' ')}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center rounded-2xl border border-border bg-secondary/40 p-4" style={{ minHeight: '640px' }}>
          <div
            className="transition-all duration-300 rounded-xl overflow-hidden border border-border shadow-xl bg-white w-full"
            style={{ maxWidth: currentDevice.width, height: '600px' }}
          >
            <HotStackLivePreview spec={spec} device={device} />
          </div>
        </div>
      </div>
    </div>
  );
}
