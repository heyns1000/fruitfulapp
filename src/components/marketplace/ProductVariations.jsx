import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProductVariations({ service, onAddToCart }) {
  const sizes = service.tags?.includes('size') ? ['0-6m', '6-12m', '12-18m', '18-24m'] : ['One Size'];
  const colors = service.tags?.includes('color') 
    ? ['Black', 'White', 'Grey', 'Pink'] 
    : service.serviceName?.toLowerCase().includes('black') ? ['Black']
    : service.serviceName?.toLowerCase().includes('white') ? ['White']
    : service.serviceName?.toLowerCase().includes('grey') ? ['Grey']
    : ['Natural'];

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [qty, setQty] = useState(1);

  const price = service.pricing?.ZAR || service.pricing?.USD || 0;
  const currency = service.pricing?.ZAR ? 'ZAR' : 'USD';
  const inStock = service.inventory?.unlimited || (service.inventory?.available ?? 99) > 0;
  const lowStock = !service.inventory?.unlimited && (service.inventory?.available ?? 99) < 5 && (service.inventory?.available ?? 99) > 0;

  return (
    <div className="space-y-4">
      {/* Color Selection */}
      {colors.length > 1 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Color — <span className="text-foreground normal-case font-normal">{selectedColor}</span></p>
          <div className="flex gap-2 flex-wrap">
            {colors.map(c => (
              <button key={c} onClick={() => setSelectedColor(c)}
                className={cn('px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                  selectedColor === c
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40')}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Size — <span className="text-foreground normal-case font-normal">{selectedSize}</span></p>
        <div className="flex gap-2 flex-wrap">
          {sizes.map(s => (
            <button key={s} onClick={() => setSelectedSize(s)}
              className={cn('px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                selectedSize === s
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty</p>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors">−</button>
          <span className="px-4 py-1.5 text-foreground font-semibold text-sm border-x border-border">{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors">+</button>
        </div>
        {lowStock && <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">⚠ Low Stock</Badge>}
        {!inStock && <Badge className="bg-red-500/20 text-red-300 border-red-500/40">Out of Stock</Badge>}
      </div>

      {/* Price + CTA */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-2xl font-black text-foreground">{currency} {(price * qty).toFixed(2)}</span>
        <Button disabled={!inStock}
          onClick={() => onAddToCart?.({ ...service, selectedSize, selectedColor, quantity: qty })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}