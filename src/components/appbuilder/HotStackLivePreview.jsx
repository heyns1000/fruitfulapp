import React, { useState, useEffect } from 'react';
import {
  Lock, Home, LayoutGrid, Activity, Settings, Store, Package,
  BarChart3, Users, Search, Bell, Sparkles,
} from 'lucide-react';
import { SECTOR_META } from '@/lib/hotstackSpec';

const PAGE_ICONS = [Home, LayoutGrid, Activity, Settings, Store, Package, BarChart3, Users, Search, Bell];

/* Renders a realistic, brand-realised app mock straight from the derived spec.
   Pure presentational — re-renders instantly whenever the spec changes. */
export default function HotStackLivePreview({ spec, device = 'desktop' }) {
  const [activePage, setActivePage] = useState(0);
  const accent = spec.accent;

  // Keep the active page valid as pages change with selections
  useEffect(() => {
    if (activePage >= spec.pages.length) setActivePage(0);
  }, [spec.pages.length, activePage]);

  const page = spec.pages[activePage] || spec.pages[0];
  const compact = device === 'mobile';

  return (
    <div className="w-full h-full flex flex-col bg-white text-fruitful-ink overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/60 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-hotstack-amber/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-success/80" />
        <div className="flex-1 mx-2 flex items-center gap-1.5 bg-white border border-border rounded-md px-2 py-1 text-[11px] text-muted-foreground font-mono truncate">
          <Lock className="w-2.5 h-2.5 text-success shrink-0" />
          app.{spec.appName.toLowerCase().replace(/\s+/g, '-') || 'hotstack'}.faa.zone
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: accent }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: accent }} />
          LIVE
        </span>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar (hidden on mobile frame) */}
        {!compact && (
          <aside className="w-44 shrink-0 border-r border-border bg-secondary/40 flex flex-col">
            <div className="px-3 py-3 border-b border-border flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                style={{ background: accent }}
              >
                {spec.appName[0]?.toUpperCase() || 'H'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{spec.appName}</p>
                <p className="text-[9px] text-muted-foreground">v2026.1</p>
              </div>
            </div>
            <nav className="flex-1 overflow-auto p-2 space-y-0.5">
              {spec.pages.map((p, i) => {
                const Icon = PAGE_ICONS[i % PAGE_ICONS.length];
                const active = i === activePage;
                return (
                  <button
                    key={p.route}
                    onClick={() => setActivePage(i)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition-colors"
                    style={
                      active
                        ? { background: `${accent}18`, color: accent }
                        : { color: 'hsl(var(--muted-foreground))' }
                    }
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{p.name}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-2 border-t border-border">
              <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground px-1.5 pb-1">Ecosystem</p>
              {spec.brands.slice(0, 4).map((b) => (
                <div key={b.id} className="flex items-center gap-1.5 px-1.5 py-1">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SECTOR_META[b.sector]?.accent || accent }} />
                  <span className="text-[10px] font-medium truncate">{b.name}</span>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Main */}
        <main className="flex-1 min-w-0 flex flex-col bg-white">
          {/* Topbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
            <div className="min-w-0">
              <h2 className="text-sm font-bold truncate">{page?.name}</h2>
              <p className="text-[10px] text-muted-foreground truncate">{page?.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Bell className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: accent }}>
                {(spec.roles[0] || 'A')[0].toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* Hero */}
            <div
              className="rounded-xl p-4 text-white relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{spec.appType}</p>
              <h3 className="text-lg font-black leading-tight mt-1">{spec.appName}</h3>
              <p className="text-[11px] opacity-90 mt-1 max-w-md leading-snug">{spec.tagline}</p>
            </div>

            {/* KPIs */}
            <div className={compact ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-4 gap-2'}>
              {spec.kpis.map((k) => (
                <div key={k.label} className="rounded-lg border border-border p-2.5 bg-secondary/30">
                  <p className="text-xl font-black leading-none" style={{ color: accent }}>{k.value}</p>
                  <p className="text-[10px] font-bold mt-1">{k.label}</p>
                  <p className="text-[9px] text-muted-foreground">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Page sections */}
            {page?.sections?.length > 0 && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1.5">{page.name} sections</p>
                <div className="grid grid-cols-2 gap-2">
                  {page.sections.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-[11px] font-medium bg-white">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: accent }} />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {spec.features.length > 0 && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Brand features
                </p>
                <div className="space-y-1.5">
                  {spec.features.slice(0, compact ? 3 : 5).map((f, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-2.5 bg-white">
                      <span className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-[10px] font-black text-white" style={{ background: f.accent }}>
                        {f.name[0]}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold truncate">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {spec.brands.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Stack brands on the left to see your app come alive.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
