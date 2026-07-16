import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SECTOR_CATALOG } from '@/lib/ecosystemCatalog';

const TIERS = ['A+', 'A', 'B+', 'B'];
const INTEGRATIONS = ['Paystack', 'PayFast', 'PayPal', 'PulseTrade', 'TreatyMesh', 'ScrollGrid'];

function Section({ title, children }) {
  return (
    <div className="py-4 border-b border-border last:border-0">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{title}</h4>
      {children}
    </div>
  );
}

/**
 * MarketplaceFilters — sector / tier / price / integration filtering.
 * Controlled via `filters` + `onChange`.
 */
export default function MarketplaceFilters({ filters, onChange, onClear, maxPrice = 500 }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <aside className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-black text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground h-7 px-2">
          <X className="w-3.5 h-3.5 mr-1" />Clear
        </Button>
      </div>

      <Section title="Billing">
        <div className="flex rounded-lg border border-border p-1 gap-1">
          {['monthly', 'annual'].map((b) => (
            <button
              key={b}
              onClick={() => set({ billing: b })}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-md capitalize transition-colors ${
                filters.billing === b ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {b}{b === 'annual' ? ' (2mo free)' : ''}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Sector">
        <div className="max-h-64 overflow-y-auto pr-1 space-y-0.5">
          <button
            onClick={() => set({ sector: '' })}
            className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
              !filters.sector ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            All sectors
          </button>
          {SECTOR_CATALOG.map((s) => (
            <button
              key={s.slug}
              onClick={() => set({ sector: s.slug })}
              className={`w-full flex items-center justify-between text-sm px-2 py-1.5 rounded-md transition-colors ${
                filters.sector === s.slug ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="truncate">{s.glyph} {s.label}</span>
              <span className="text-[10px] tabular-nums opacity-70">{s.brandCount}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Payout tier">
        <div className="flex flex-wrap gap-1.5">
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => set({ tier: filters.tier === t ? '' : t })}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                filters.tier === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>

      <Section title={`Max price · $${filters.maxPrice}`}>
        <input
          type="range"
          min={10}
          max={maxPrice}
          step={10}
          value={filters.maxPrice}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          className="w-full accent-primary"
          aria-label="Maximum price"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>$10</span><span>${maxPrice}+</span>
        </div>
      </Section>

      <Section title="Integration">
        <div className="space-y-1">
          {INTEGRATIONS.map((intg) => (
            <label key={intg} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              <input
                type="checkbox"
                checked={filters.integration === intg}
                onChange={() => set({ integration: filters.integration === intg ? '' : intg })}
                className="accent-primary w-4 h-4 rounded"
              />
              {intg}
            </label>
          ))}
        </div>
      </Section>
    </aside>
  );
}
