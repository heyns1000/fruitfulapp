/**
 * Dynamically aggregates MarketplaceService products from sector subnodes
 * linked to the selected subscription tier, applies cost-price formula pricing.
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, ShoppingBag, Tag, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { calcPrices, applyTierDiscount, PLAN_CONFIG } from '@/lib/pricingFormula';

export default function SubscriptionProductAggregator({ plan, sector, subnodes = [], onAddToCart }) {
  const tierConfig = PLAN_CONFIG[plan] || PLAN_CONFIG.starter;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['sub-products', plan, sector, subnodes],
    queryFn: async () => {
      // Fetch all active products; filter by sector/subnodes on client
      const all = await base44.entities.MarketplaceService.filter({ status: 'active' });
      if (!sector && subnodes.length === 0) return all;

      return all.filter(p => {
        const matchesSector = sector ? (p.tags || []).includes(sector) || p.brandId?.includes(sector) : true;
        const matchesSubnode = subnodes.length === 0 || subnodes.some(sn =>
          (p.tags || []).map(t => t.toLowerCase()).includes(sn.toLowerCase()) ||
          (p.brandName || '').toLowerCase().includes(sn.toLowerCase())
        );
        return matchesSector || matchesSubnode;
      });
    },
    enabled: !!plan,
  });

  // Limit to tier's maxProducts
  const visible = products.slice(0, tierConfig.maxProducts);

  if (isLoading) return (
    <div className="flex items-center justify-center py-12 gap-3 text-stone-400">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading products for your tier…
    </div>
  );

  if (visible.length === 0) return (
    <div className="text-center py-10 text-stone-500">
      <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
      <p>No products found for this sector/subnodes yet.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-400">
          <span className="text-orange-400 font-bold">{visible.length}</span> products available with your{' '}
          <span className="text-white font-semibold">{tierConfig.label}</span> tier
          {tierConfig.discountPct > 0 && (
            <span className="ml-2 text-green-400">· {tierConfig.discountPct}% discount applied</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visible.map(product => {
          const formula = product.pricingFormula || {};
          // Derive prices: if formula exists use it, else fall back to pricing.ZAR
          const derived = formula.costPriceZAR
            ? calcPrices(formula)
            : { onlineZAR: product.pricing?.ZAR || 0, retailZAR: product.pricing?.ZAR || 0 };

          const subscriberPrice = applyTierDiscount(derived.onlineZAR, tierConfig.discountPct);
          const savings = +(derived.onlineZAR - subscriberPrice).toFixed(2);

          return (
            <div key={product.id} className="bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden hover:border-stone-500 transition-all">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.serviceName} className="w-full h-36 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-bold text-white text-sm">{product.serviceName}</p>
                    <p className="text-stone-500 text-xs">{product.brandName}</p>
                  </div>
                  {product.tags?.slice(0, 1).map(t => (
                    <Badge key={t} className="text-xs bg-stone-800 border-stone-600 text-stone-300 shrink-0">{t}</Badge>
                  ))}
                </div>

                {/* Pricing breakdown */}
                <div className="space-y-0.5 mb-3">
                  {derived.retailZAR > 0 && (
                    <p className="text-xs text-stone-500 line-through">Retail: R{derived.retailZAR.toLocaleString()}</p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <p className="text-orange-400 font-black text-lg">R{subscriberPrice.toLocaleString()}</p>
                    {savings > 0 && (
                      <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Save R{savings}
                      </span>
                    )}
                  </div>
                  {formula.costPriceZAR > 0 && (
                    <p className="text-xs text-stone-600">Cost ex-works: R{formula.costPriceZAR}</p>
                  )}
                </div>

                <Button
                  size="sm"
                  className="w-full bg-orange-700 hover:bg-orange-600 text-white font-bold"
                  onClick={() => onAddToCart({
                    ...product,
                    name: product.serviceName,
                    price: subscriberPrice,
                    quantity: 1,
                  })}
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Add to Cart · R{subscriberPrice}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}