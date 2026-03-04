import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Package, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const HAT_TAGS = ['hat', 'fedora', 'uNtshontsho', 'uMkhombe', 'isAmpokwe'];

function isHat(service) {
  return service.tags?.some(t => HAT_TAGS.includes(t)) ||
    service.serviceName?.toLowerCase().includes('hat') ||
    service.serviceName?.toLowerCase().includes('fedora');
}

function ProductCard({ service, selectedCurrency, addToCart, onBuy, toggleTag, CURRENCY_SYMBOLS }) {
  const price = service.pricing?.[selectedCurrency] || service.pricing?.USD || 0;
  const sym = CURRENCY_SYMBOLS[selectedCurrency] || '$';

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={service.serviceName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}
        {service.inventory?.available <= 5 && service.inventory?.available > 0 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {service.inventory.available} left
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-gray-700 text-xs capitalize shadow">
            {service.category?.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{service.serviceName}</h3>
          <Link to={createPageUrl(`ArtisanProfile?brandName=${encodeURIComponent(service.brandName)}`)}
            className="text-xs text-purple-600 hover:underline font-medium mt-0.5 block">
            {service.brandName}™
          </Link>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 flex-1">{service.description}</p>

        {service.rating > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-gray-700">{service.rating.toFixed(1)}</span>
            <span>({service.reviewCount} reviews)</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {service.tags?.slice(0, 3).map((tag, idx) => (
            <button key={idx} onClick={() => toggleTag(tag)}
              className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 px-2 py-0.5 rounded-full transition-colors">
              #{tag}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2">
          <div>
            <p className="text-xl font-extrabold text-purple-700">{sym}{price.toLocaleString()}</p>
            <p className="text-xs text-gray-400">{selectedCurrency}</p>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline"
              onClick={() => addToCart({ id: service.id, name: service.serviceName, price, productCode: service.productCode, imageUrl: service.imageUrl, brandName: service.brandName })}
              className="border-purple-300 text-purple-700 hover:bg-purple-50 px-2">
              <Plus className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => onBuy(service)} className="bg-purple-600 hover:bg-purple-700 text-white px-3">
              Buy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeading({ emoji, title, subtitle, count }) {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div>
        <p className="text-2xl leading-none mb-1">{emoji}</p>
        <h2 className="text-xl font-black text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <span className="ml-auto text-sm text-gray-400 pb-1">{count} item{count !== 1 ? 's' : ''}</span>
    </div>
  );
}

export default function ProductSections({ services, selectedCurrency, addToCart, onBuy, toggleTag, CURRENCY_SYMBOLS }) {
  const hats = services.filter(isHat);
  const others = services.filter(s => !isHat(s));

  const cardProps = { selectedCurrency, addToCart, onBuy, toggleTag, CURRENCY_SYMBOLS };

  return (
    <div className="space-y-10">
      {/* Hats section */}
      {hats.length > 0 && (
        <div>
          <SectionHeading emoji="🎩" title="Artisan Hats" subtitle="Handcrafted Xhosa & Zulu beadwork fedoras by Grand Sibangilizwe Maghandela" count={hats.length} />
          <div className="h-0.5 bg-gradient-to-r from-orange-400 via-yellow-400 to-transparent mb-5 rounded-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hats.map(svc => <ProductCard key={svc.id} service={svc} {...cardProps} />)}
          </div>
        </div>
      )}

      {/* Other products section */}
      {others.length > 0 && (
        <div>
          <SectionHeading emoji="🛒" title="Other Artisan Products" subtitle="Handcrafted goods from Fruitful's network of local artisans" count={others.length} />
          <div className="h-0.5 bg-gradient-to-r from-teal-400 via-green-400 to-transparent mb-5 rounded-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {others.map(svc => <ProductCard key={svc.id} service={svc} {...cardProps} />)}
          </div>
        </div>
      )}
    </div>
  );
}