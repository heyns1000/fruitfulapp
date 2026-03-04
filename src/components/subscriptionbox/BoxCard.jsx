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
  heritage_craft: 'from-amber-950/60 to-stone-900',
  modern_art: 'from-purple-950/60 to-stone-900',
  pottery_earth: 'from-orange-950/60 to-stone-900',
  textile_weave: 'from-teal-950/60 to-stone-900',
  jewellery: 'from-yellow-950/60 to-stone-900',
  mixed_curated: 'from-rose-950/60 to-stone-900',
  seasonal: 'from-green-950/60 to-stone-900',
};

export default function BoxCard({ box, onSubscribe }) {
  const fromPrice = box.pricing?.monthly || box.pricing?.quarterly || box.pricing?.annual || 0;
  const currency = box.currency === 'ZAR' ? 'R' : '$';

  return (
    <div className={`group relative bg-gradient-to-br ${THEME_COLORS[box.theme] || 'from-stone-900 to-stone-900'} border border-stone-700 rounded-3xl overflow-hidden hover:border-orange-500 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/20 hover:-translate-y-1`}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-800">
        {box.imageUrl ? (
          <img src={box.imageUrl} alt={box.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-stone-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {box.featured && (
          <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">✦ Featured</div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className={`text-xs border-0 ${box.status === 'active' ? 'bg-green-600 text-white' : box.status === 'sold_out' ? 'bg-red-600 text-white' : 'bg-stone-600 text-stone-200'}`}>
            {box.status === 'active' ? 'Available' : box.status === 'sold_out' ? 'Sold Out' : box.status === 'coming_soon' ? 'Coming Soon' : 'Paused'}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/60 backdrop-blur-sm text-orange-300 text-xs font-bold px-3 py-1 rounded-full">
            {THEME_LABELS[box.theme]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-black text-white leading-tight">{box.name}</h3>
          {box.tagline && <p className="text-orange-400 text-sm mt-1 italic">{box.tagline}</p>}
        </div>
        {box.description && (
          <p className="text-stone-400 text-sm line-clamp-2 leading-relaxed">{box.description}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-xs text-stone-400">
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
            <span className="flex items-center gap-1 text-orange-400"><Sparkles className="w-3.5 h-3.5" />Customizable</span>
          )}
        </div>

        {/* Pricing + CTA */}
        <div className="flex items-end justify-between pt-2 border-t border-stone-700">
          <div>
            <p className="text-stone-500 text-xs mb-0.5">from</p>
            <p className="text-3xl font-black text-orange-400">{currency}{fromPrice}</p>
            <p className="text-stone-500 text-xs">/month</p>
          </div>
          <Button
            onClick={() => onSubscribe(box)}
            disabled={box.status !== 'active'}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl px-5"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}