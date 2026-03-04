import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Quote, Package, ArrowLeft, Loader2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import AIProfileEnricher from '../components/artisan/AIProfileEnricher';
import ArtisanGallery from '../components/artisan/ArtisanGallery';
import ArtisanSocialLinks from '../components/artisan/ArtisanSocialLinks';
import ArtisanMaterialsCerts from '../components/artisan/ArtisanMaterialsCerts';

export default function ArtisanProfile() {
  const params = new URLSearchParams(window.location.search);
  const artisanId = params.get('id');

  const { data: artisans = [], isLoading } = useQuery({
    queryKey: ['artisan-profile', artisanId],
    queryFn: () => artisanId
      ? base44.entities.ArtisanProfile.filter({ id: artisanId })
      : base44.entities.ArtisanProfile.list(),
    enabled: true
  });

  const artisan = artisans[0];

  const { data: services = [] } = useQuery({
    queryKey: ['artisan-services', artisan?.brandId],
    queryFn: () => base44.entities.MarketplaceService.filter({ brandId: artisan.brandId, status: 'active' }),
    enabled: !!artisan?.brandId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-gray-500">
        <Package className="w-12 h-12 opacity-30" />
        <p>Artisan profile not found.</p>
        <Link to={createPageUrl('Marketplace')}>
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const avgRating = artisan.testimonials?.length
    ? (artisan.testimonials.reduce((s, t) => s + (t.rating || 0), 0) / artisan.testimonials.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={artisan.workshopImageUrl || 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80'}
          alt="Workshop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-sm font-medium opacity-80 mb-1">✦ {artisan.initiation || 'Master Artisan'}</p>
          <h1 className="text-4xl font-extrabold drop-shadow-lg">{artisan.artisanName}</h1>
          <p className="text-lg opacity-90">{artisan.title}</p>
        </div>
        <Link to={createPageUrl('Marketplace')} className="absolute top-4 left-4">
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Marketplace
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-10">

        {/* Profile + Quick Info */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Portrait & Bio Stats */}
          <div className="space-y-4">
            {artisan.profileImageUrl && (
              <img
                src={artisan.profileImageUrl}
                alt={artisan.artisanName}
                className="w-full rounded-2xl shadow-xl object-cover max-h-72"
              />
            )}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-5 space-y-3 text-sm">
                {artisan.location && (
                  <div className="flex items-center gap-2 text-amber-800">
                    <MapPin className="w-4 h-4" /> <span>{artisan.location}</span>
                  </div>
                )}
                {artisan.dateOfBirth && (
                  <div className="text-amber-700">
                    🎂 Born: {new Date(artisan.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
                {artisan.origin && (
                  <div className="text-amber-700">🌍 Origin: {artisan.origin}</div>
                )}
                {artisan.craftsmanship && (
                  <div className="text-amber-700">🎨 Craft: {artisan.craftsmanship}</div>
                )}
                {artisan.symbolism && (
                  <div className="text-amber-700">🔮 Symbolism: {artisan.symbolism}</div>
                )}
                {avgRating && (
                  <div className="flex items-center gap-1 text-amber-700">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-semibold">{avgRating}</span>
                    <span className="text-amber-600">({artisan.testimonials.length} reviews)</span>
                  </div>
                )}
                <Badge className="bg-amber-200 text-amber-900 border-amber-400">{artisan.brandName}</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Right: Biography + Soul Message */}
          <div className="md:col-span-2 space-y-6">
            {artisan.soulMessage && (
              <div className="bg-gradient-to-r from-amber-700 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
                <Quote className="w-8 h-8 opacity-60 mb-2" />
                <p className="text-xl italic font-medium leading-relaxed">"{artisan.soulMessage}"</p>
              </div>
            )}

            {artisan.biography && (
              <Card className="border-amber-200">
                <CardContent className="pt-5">
                  <h2 className="text-xl font-bold text-amber-900 mb-3">The Story</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{artisan.biography}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Products / Services */}
        {services.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2">
              🛍️ Products by {artisan.artisanName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => {
                const price = service.pricing?.USD || service.pricing?.ZAR || 0;
                const currency = service.pricing?.USD ? 'USD' : 'ZAR';
                return (
                  <Card key={service.id} className="hover:shadow-xl transition-shadow border-amber-200 overflow-hidden">
                    {service.imageUrl && (
                      <img src={service.imageUrl} alt={service.serviceName} className="w-full h-40 object-cover" />
                    )}
                    <CardContent className="pt-4 space-y-2">
                      <h3 className="font-bold text-gray-800">{service.serviceName}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-extrabold text-amber-700">{currency === 'USD' ? '$' : 'R'}{price}</span>
                        <Link to={createPageUrl('Marketplace')}>
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                            Buy Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Enrichment */}
        {(!artisan.tools?.length || !artisan.signatureTechniques?.length) && (
          <AIProfileEnricher artisan={artisan} onSave={() => window.location.reload()} />
        )}

        {/* Artisan's Tools */}
        {artisan.tools?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2">🔨 Artisan's Tools</h2>
            <div className="flex flex-wrap gap-3">
              {artisan.tools.map((tool, i) => (
                <span key={i} className="bg-amber-100 text-amber-900 border border-amber-300 rounded-full px-4 py-1.5 text-sm font-medium">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Signature Techniques */}
        {artisan.signatureTechniques?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2">✦ Signature Techniques</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {artisan.signatureTechniques.map((tech, i) => (
                <div key={i} className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5">0{i + 1}</span>
                  <p className="text-gray-800 text-sm">{tech}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cultural Significance */}
        {artisan.culturalSignificance && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2">🌍 Cultural Significance</h2>
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardContent className="pt-5">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{artisan.culturalSignificance}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gallery */}
        <ArtisanGallery images={artisan.galleryImages || []} />

        {/* Materials & Certifications */}
        <ArtisanMaterialsCerts materials={artisan.materials || []} certifications={artisan.certifications || []} />

        {/* Social Media */}
        <ArtisanSocialLinks socialMedia={artisan.socialMedia || {}} />

        {/* Testimonials */}
        {artisan.testimonials?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2">
              💬 Customer Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artisan.testimonials.map((t, i) => (
                <Card key={i} className="bg-white border-amber-100 shadow-sm">
                  <CardContent className="pt-5 space-y-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className={`w-4 h-4 ${s < t.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{t.comment}"</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-1">
                      <span className="font-semibold text-gray-800">— {t.customerName}</span>
                      <span>{t.productPurchased}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}