import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FeaturedArtisans({ services = [] }) {
  const { data: artisans = [] } = useQuery({
    queryKey: ['featured-artisans'],
    queryFn: () => base44.entities.ArtisanProfile.filter({ featured: true })
  });

  if (artisans.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">⭐</span>
        <h2 className="text-2xl font-bold text-amber-900">Featured Artisans</h2>
        <Badge className="bg-amber-100 text-amber-800 border-amber-300">Handpicked Masters</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map(artisan => {
          const artisanServices = services.filter(s =>
            s.brandId === artisan.brandId || s.brandName === artisan.brandName
          );
          const avgRating = artisan.testimonials?.length
            ? (artisan.testimonials.reduce((s, t) => s + (t.rating || 0), 0) / artisan.testimonials.length).toFixed(1)
            : null;

          return (
            <Card key={artisan.id} className="overflow-hidden border-amber-200 hover:shadow-xl transition-shadow bg-gradient-to-br from-amber-50 to-orange-50">
              {/* Workshop Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={artisan.workshopImageUrl || 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80'}
                  alt={artisan.artisanName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-2 right-2 bg-amber-500 text-white border-0">⭐ Featured</Badge>
              </div>

              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  {artisan.profileImageUrl && (
                    <img
                      src={artisan.profileImageUrl}
                      alt={artisan.artisanName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-300 shadow-md -mt-8"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{artisan.artisanName}</h3>
                    <p className="text-sm text-amber-700">{artisan.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {artisan.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{artisan.location}</span>
                  )}
                  {avgRating && (
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3 h-3 fill-amber-500" />{avgRating} ({artisan.testimonials.length})
                    </span>
                  )}
                </div>

                {artisan.soulMessage && (
                  <p className="text-xs text-gray-600 italic line-clamp-2">"{artisan.soulMessage}"</p>
                )}

                {/* Their products */}
                {artisanServices.length > 0 && (
                  <div className="border-t border-amber-100 pt-3 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Products</p>
                    {artisanServices.slice(0, 2).map(s => {
                      const price = s.pricing?.USD || s.pricing?.ZAR || 0;
                      const sym = s.pricing?.USD ? '$' : 'R';
                      return (
                        <div key={s.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 truncate mr-2">{s.serviceName}</span>
                          <span className="font-bold text-amber-700 shrink-0">{sym}{price}</span>
                        </div>
                      );
                    })}
                    {artisanServices.length > 2 && (
                      <p className="text-xs text-amber-600">+{artisanServices.length - 2} more items</p>
                    )}
                  </div>
                )}

                <Link
                  to={createPageUrl(`ArtisanProfile?id=${artisan.id}`)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors"
                >
                  View Full Profile <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}