import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductVariations from '../components/marketplace/ProductVariations';
import HomemartStockSync from '../components/marketplace/HomemartStockSync';
import { useCart } from '../components/cart/CartContext';
import { Search, RefreshCw, Package, Store, AlertTriangle } from 'lucide-react';

const CATS = ['All', 'Bibs', 'Bandanna', 'Round'];

export default function HomemartListing({ embedded = false }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [selected, setSelected] = useState(null);
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['homemart-products'],
    queryFn: () => base44.entities.MarketplaceService.filter({ brandName: 'Homemart' }, '-created_date'),
  });

  const filtered = products.filter(p => {
    const matchSearch = !search || p.serviceName?.toLowerCase().includes(search.toLowerCase()) || p.productCode?.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === 'All' || p.tags?.some(t => t.toLowerCase().includes(cat.toLowerCase())) || p.serviceName?.toLowerCase().includes(cat.toLowerCase());
    return matchSearch && matchCat;
  });

  const lowStockCount = products.filter(p => !p.inventory?.unlimited && (p.inventory?.available ?? 99) < 5).length;

  const handleAddToCart = (item) => {
    addToCart({
      id: `${item.id}-${item.selectedSize}-${item.selectedColor}`,
      name: `${item.serviceName} (${item.selectedColor}, ${item.selectedSize})`,
      price: item.pricing?.ZAR || item.pricing?.USD || 0,
      imageUrl: item.imageUrl,
      quantity: item.quantity || 1,
    });
  };

  return (
    <div className={embedded ? 'text-foreground' : 'min-h-screen bg-background text-foreground'}>
      <HomemartStockSync />

      {!embedded && (
      <div className="bg-gradient-to-br from-fruitful-mint/50 via-card to-card border-b border-border px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase">Vendor Store</span>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">Live</Badge>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: 'inherit' }}>
                Homemart<br /><span className="text-primary">Banimal™ Bibs</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">Baby & Toddler · 100% Cotton · Handcrafted Quality</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {lowStockCount > 0 && (
                <div className="flex items-center gap-2 bg-fruitful-green/10 border border-fruitful-green/30 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-4 h-4 text-fruitful-green" />
                  <span className="text-fruitful-green text-sm font-semibold">{lowStockCount} item{lowStockCount > 1 ? 's' : ''} low on stock</span>
                </div>
              )}
              <div className="flex gap-3 text-muted-foreground text-sm">
                <span className="flex items-center gap-1"><Package className="w-4 h-4" />{products.length} products</span>
                <span className="flex items-center gap-1"><Store className="w-4 h-4" />Homemart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search bibs, SKU..." className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${cat === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}>
                {c}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={() => queryClient.invalidateQueries({ queryKey: ['homemart-products'] })}
            className="border-border text-muted-foreground hover:text-foreground shrink-0">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => {
              const price = product.pricing?.ZAR || product.pricing?.USD || 0;
              const currency = product.pricing?.ZAR ? 'ZAR' : 'USD';
              const available = product.inventory?.available ?? null;
              const isLow = available !== null && !product.inventory?.unlimited && available < 5;

              return (
                <div key={product.id}
                  className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer ${selected?.id === product.id ? 'border-primary ring-1 ring-primary/40' : 'border-border hover:border-primary/40'}`}
                  onClick={() => setSelected(selected?.id === product.id ? null : product)}>
                  
                  {/* Product Image */}
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.serviceName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      {isLow && <Badge className="bg-fruitful-green text-primary-foreground text-xs">Low Stock</Badge>}
                      {product.status === 'active' && <Badge className="bg-green-500/90 text-foreground text-xs">Active</Badge>}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/60 text-foreground text-xs font-mono px-2 py-1 rounded">{product.productCode}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground text-base leading-tight mb-1">{product.serviceName}</h3>
                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-black text-primary">{currency} {price.toFixed(2)}</span>
                      {available !== null && (
                        <span className={`text-xs font-semibold ${isLow ? 'text-fruitful-green' : 'text-muted-foreground'}`}>
                          {available} in stock
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1 flex-wrap mb-3">
                      {(product.tags || []).slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>

                    <button className="text-xs text-primary font-semibold hover:text-primary transition-colors">
                      {selected?.id === product.id ? '▲ Hide options' : '▼ Select options'}
                    </button>
                  </div>

                  {/* Expanded Variations */}
                  {selected?.id === product.id && (
                    <div className="px-4 pb-4 border-t border-border pt-4" onClick={e => e.stopPropagation()}>
                      <ProductVariations service={product} onAddToCart={handleAddToCart} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No products match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}