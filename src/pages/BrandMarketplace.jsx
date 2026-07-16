import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Grid3x3, List, Store, ChevronLeft, ChevronRight, X, Star,
  ShoppingCart, Boxes, Check, Sparkles, Globe,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCart } from '../components/cart/CartContext';
import { createPageUrl } from '@/utils';
import { getBrandCatalog, getCatalogStats, formatUSD } from '@/lib/ecosystemCatalog';
import BrandCard from '../components/brandmarket/BrandCard';
import MarketplaceFilters from '../components/brandmarket/MarketplaceFilters';

const PER_PAGE = 24;
const MAX_PRICE = 500;

const SORTS = [
  { val: 'popular', label: 'Most popular' },
  { val: 'rating', label: 'Highest rated' },
  { val: 'price-asc', label: 'Price: low to high' },
  { val: 'price-desc', label: 'Price: high to low' },
  { val: 'name', label: 'Name: A–Z' },
];

const DEFAULT_FILTERS = { sector: '', tier: '', integration: '', maxPrice: MAX_PRICE, billing: 'monthly' };

export default function BrandMarketplace() {
  const { addToCart } = useCart();
  const catalog = useMemo(() => getBrandCatalog(), []);
  const stats = useMemo(() => getCatalogStats(), []);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('popular');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = catalog.filter((b) => {
      if (q && !b.name.toLowerCase().includes(q) && !b.sectorLabel.toLowerCase().includes(q)) return false;
      if (filters.sector && b.sector !== filters.sector) return false;
      if (filters.tier && b.payoutTier !== filters.tier) return false;
      if (filters.integration && !b.integrations.includes(filters.integration)) return false;
      if (filters.maxPrice < MAX_PRICE && b.priceMonthly > filters.maxPrice) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.priceMonthly - b.priceMonthly;
        case 'price-desc': return b.priceMonthly - a.priceMonthly;
        case 'rating': return b.rating - a.rating;
        case 'name': return a.name.localeCompare(b.name);
        default: return b.popularity - a.popularity;
      }
    });
    return rows;
  }, [catalog, search, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  // Reset to page 1 whenever the result set changes.
  const resetKey = `${search}|${filters.sector}|${filters.tier}|${filters.integration}|${filters.maxPrice}|${sort}`;
  const lastKey = React.useRef(resetKey);
  if (lastKey.current !== resetKey) {
    lastKey.current = resetKey;
    if (page !== 1) setPage(1);
  }

  const handleAdd = (brand, billing) => {
    const price = billing === 'annual' ? brand.priceAnnual : brand.priceMonthly;
    addToCart({
      id: `${brand.id}:${billing}`,
      name: `${brand.name} — ${billing === 'annual' ? 'Annual' : 'Monthly'}`,
      price,
      productCode: brand.metadata.code,
      sector: brand.sectorLabel,
      billing,
      glyph: brand.glyph,
    });
  };

  const clearFilters = () => { setFilters(DEFAULT_FILTERS); setSearch(''); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-fruitful-teal via-fruitful-teal-deep to-fruitful-green border-b border-border px-6 md:px-12 py-14">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="max-w-6xl mx-auto relative">
          <p className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase mb-4">Fruitful&trade; · Global Tech Marketplace</p>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0 mt-1">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-3 text-white text-balance">
                Brand <span className="text-fruitful-mint">Marketplace</span>
              </h1>
              <p className="text-white/85 text-lg max-w-2xl leading-relaxed">
                Subscribe to any of the ecosystem&apos;s live brands — one synced catalog, one cart, one checkout across FAA.ZONE.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 text-sm text-white/75">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-fruitful-mint animate-pulse" />{stats.totalBrands.toLocaleString()} brands</span>
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" />{stats.totalSectors} sectors</span>
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" />{stats.totalNodes.toLocaleString()} active nodes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 2,400+ brands and sectors…"
              className="pl-9 bg-card border-border"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-52 bg-card border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => <SelectItem key={s.val} value={s.val}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex rounded-lg border border-border p-1 bg-card">
            <button onClick={() => setView('grid')} aria-label="Grid view"
              className={`p-2 rounded-md ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} aria-label="List view"
              className={`p-2 rounded-md ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 mt-6">
          <div className="hidden lg:block">
            <MarketplaceFilters filters={filters} onChange={setFilters} onClear={clearFilters} maxPrice={MAX_PRICE} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{filtered.length.toLocaleString()}</span> brands
                {filters.sector && <> in <span className="text-primary font-semibold">{catalog.find((b) => b.sector === filters.sector)?.sectorLabel}</span></>}
              </p>
              <span className="text-xs text-muted-foreground">Page {current} of {totalPages}</span>
            </div>

            {pageItems.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-16 text-center">
                <Store className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="font-bold text-foreground mb-1">No brands match your filters</p>
                <Button variant="outline" onClick={clearFilters} className="mt-3">Clear filters</Button>
              </div>
            ) : (
              <div className={view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'flex flex-col gap-3'}>
                {pageItems.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} billing={filters.billing} view={view} onAdd={handleAdd} onView={setDetail} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-3">{current} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={current === totalPages} onClick={() => setPage(current + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      {detail && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50" onClick={() => setDetail(null)}>
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl">{detail.glyph || '◆'}</div>
                <div>
                  <h2 className="text-xl font-black text-foreground">{detail.name}</h2>
                  <p className="text-xs text-muted-foreground">{detail.sectorLabel} · {detail.region}</p>
                </div>
              </div>
              <button onClick={() => setDetail(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{detail.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="border-primary/30 text-primary">{detail.tierName}</Badge>
              <Badge variant="outline">Payout {detail.payoutTier}</Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Star className="w-3.5 h-3.5 fill-hotstack-amber text-hotstack-amber" />{detail.rating}</span>
              <span className="text-xs text-muted-foreground">{detail.installs.toLocaleString()} installs</span>
            </div>

            {detail.subnodes?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5"><Boxes className="w-3.5 h-3.5" />Sub-nodes</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.subnodes.map((n) => <span key={n} className="text-[11px] bg-muted rounded-md px-2 py-1 text-muted-foreground">{n}</span>)}
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Integrations</p>
              <div className="flex flex-wrap gap-1.5">
                {detail.integrations.map((i) => <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-muted rounded-full px-2 py-1 text-muted-foreground"><Check className="w-3 h-3 text-primary" />{i}</span>)}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <div>
                <span className="font-black text-2xl text-foreground">{formatUSD(filters.billing === 'annual' ? detail.priceAnnual : detail.priceMonthly)}</span>
                <span className="text-sm text-muted-foreground">{filters.billing === 'annual' ? '/yr' : '/mo'}</span>
              </div>
              <Button onClick={() => { handleAdd(detail, filters.billing); setDetail(null); }} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingCart className="w-4 h-4 mr-2" />Add to cart
              </Button>
            </div>
            <Link to={createPageUrl('Checkout')} className="block text-center text-xs text-primary hover:underline mt-3">Go to checkout →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
