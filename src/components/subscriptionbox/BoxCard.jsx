import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Package, Users, Calendar, Sparkles } from 'lucide-react';

const THEME_LABELS = {
  heritage_craft: '🏺 Heritage Craft',
  modern_art: '🎨 Modern Art',
  pottery_earth: '🪴 Pottery & Earth',
  textile_weave: '🧵 Textile & Weave',
  jewellery: '💎 Jewellery',
  mixed_curated: '✨ Mixed Curated',
  seasonal: '🌿 Seasonal',
};

const THEME_COLORS = {
  heritage_craft: 'from-amber-950/60 to-card',
  modern_art: 'from-purple-950/60 to-card',
  pottery_earth: 'from-fruitful-mint/60 to-card',
  textile_weave: 'from-teal-950/60 to-card',
  jewellery: 'from-yellow-950/60 to-card',
  mixed_curated: 'from-rose-950/60 to-card',
  seasonal: 'from-green-950/60 to-card',
};

export default function BoxCard({ box, onSubscribe }) {
  const fromPrice = box.pricing?.monthly || box.pricing?.quarterly || box.pricing?.annual || 0;
  const currency = box.currency === 'ZAR' ? 'R' : '$';

  return (
    <div className={`group relative bg-gradient-to-br ${THEME_COLORS[box.theme] || 'from-card to-card'} border border-border rounded-3xl overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1`}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {box.imageUrl ? (
          <img src={box.imageUrl} alt={box.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {box.featured && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Featured</div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className={`text-xs border-0 ${box.status === 'active' ? 'bg-green-600 text-foreground' : box.status === 'sold_out' ? 'bg-red-600 text-foreground' : 'bg-muted text-foreground'}`}>
            {box.status === 'active' ? 'Available' : box.status === 'sold_out' ? 'Sold Out' : box.status === 'coming_soon' ? 'Coming Soon' : 'Paused'}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/60 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full">
            {THEME_LABELS[box.theme]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-black text-foreground leading-tight">{box.name}</h3>
          {box.tagline && <p className="text-primary text-sm mt-1 italic">{box.tagline}</p>}
        </div>
        {box.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{box.description}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {box.itemsPerBox && (
            <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" />{box.itemsPerBox} items/box</span>
          )}
          {box.subscriberCount > 0 && (
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{box.subscriberCount} subscribers</span>
          )}
          {box.nextShipDate && (
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Ships {box.nextShipDate}</span>
          )}
          {box.customizationOptions?.length > 0 && (
            <span className="flex items-center gap-1 text-primary"><Sparkles className="w-3.5 h-3.5" />Customizable</span>
          )}
        </div>

        {/* Pricing + CTA */}
        <div className="flex items-end justify-between pt-2 border-t border-border">
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">from</p>
            <p className="text-3xl font-black text-primary">{currency}{fromPrice}</p>
            <p className="text-muted-foreground text-xs">/month</p>
          </div>
          <Button
            onClick={() => onSubscribe(box)}
            disabled={box.status !== 'active'}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-5"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}