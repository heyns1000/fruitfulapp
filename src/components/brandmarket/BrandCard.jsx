import React from 'react';
import { Star, Check, Boxes, ArrowUpRight, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatUSD } from '@/lib/ecosystemCatalog';

const tierAccent = {
  'A+': 'bg-hotstack-amber/15 text-foreground border-hotstack-amber/40',
  A: 'bg-primary/10 text-primary border-primary/30',
  'B+': 'bg-fruitful-mint/50 text-foreground border-primary/20',
  B: 'bg-muted text-muted-foreground border-border',
};

/**
 * BrandCard — GitHub-Marketplace-style product card for an ecosystem brand.
 * Supports "grid" and "list" layouts and adds a subscription to the cart.
 */
export default function BrandCard({ brand, billing = 'monthly', onAdd, onView, view = 'grid' }) {
  const price = billing === 'annual' ? brand.priceAnnual : brand.priceMonthly;
  const suffix = billing === 'annual' ? '/yr' : '/mo';
  const accent = tierAccent[brand.payoutTier] || tierAccent.B;

  const glyphTile = (
    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-lg" aria-hidden="true">
      <span>{brand.glyph || '◆'}</span>
    </div>
  );

  const ratingRow = (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="w-3.5 h-3.5 fill-hotstack-amber text-hotstack-amber" />
      {brand.rating} · {brand.installs.toLocaleString()} installs
    </span>
  );

  if (view === 'list') {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
        {glyphTile}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <button onClick={() => onView?.(brand)} className="font-bold text-foreground truncate hover:text-primary transition-colors">
              {brand.name}
            </button>
            {brand.featured && <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">Featured</Badge>}
          </div>
          <p className="text-xs text-muted-foreground truncate">{brand.sectorLabel} · {brand.description}</p>
          <div className="mt-1">{ratingRow}</div>
        </div>
        <div className="hidden sm:flex flex-col items-end shrink-0">
          <span className="font-black text-foreground">{formatUSD(price)}<span className="text-xs font-medium text-muted-foreground">{suffix}</span></span>
          <Badge variant="outline" className={`mt-1 text-[10px] ${accent}`}>{brand.tierName}</Badge>
        </div>
        <Button size="sm" onClick={() => onAdd?.(brand, billing)} className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
          <ShoppingCart className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Add</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3">
        {glyphTile}
        <div className="flex items-center gap-1.5">
          {brand.featured && <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">Featured</Badge>}
          <Badge variant="outline" className={`text-[10px] ${accent}`}>{brand.tierName}</Badge>
        </div>
      </div>

      <button onClick={() => onView?.(brand)} className="mt-3 text-left">
        <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors inline-flex items-center gap-1">
          {brand.name}
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
      </button>
      <p className="text-xs text-muted-foreground mt-0.5">{brand.sectorLabel}</p>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2 flex-1">{brand.description}</p>

      {brand.integrations?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {brand.integrations.slice(0, 2).map((intg) => (
            <span key={intg} className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              <Check className="w-3 h-3 text-primary" />{intg}
            </span>
          ))}
          {brand.subnodes?.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              <Boxes className="w-3 h-3 text-primary" />{brand.subnodes.length} nodes
            </span>
          )}
        </div>
      )}

      <div className="mt-3">{ratingRow}</div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div>
          <span className="font-black text-lg text-foreground">{formatUSD(price)}</span>
          <span className="text-xs font-medium text-muted-foreground">{suffix}</span>
        </div>
        <Button size="sm" onClick={() => onAdd?.(brand, billing)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <ShoppingCart className="w-4 h-4 mr-1.5" />Add
        </Button>
      </div>
    </div>
  );
}
