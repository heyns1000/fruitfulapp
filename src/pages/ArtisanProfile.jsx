import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, ArrowLeft, Loader2, Package, Hammer, Sparkles, Lightbulb, BookOpen, Quote } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import AIProfileEnricher from '../components/artisan/AIProfileEnricher';
import ArtisanGallery from '../components/artisan/ArtisanGallery';
import ArtisanSocialLinks from '../components/artisan/ArtisanSocialLinks';
import ArtisanMaterialsCerts from '../components/artisan/ArtisanMaterialsCerts';
import FollowArtisan from '../components/artisan/FollowArtisan';

const FRUITFUL_ORANGE = '#E85D26';
const FRUITFUL_DARK = '#1A1208';

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
      <div className="flex items-center justify-center min-h-screen bg-stone-950">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-stone-950 text-stone-400">
        <Package className="w-12 h-12 opacity-30" />
        <p>Artisan profile not found.</p>
        <Link to={createPageUrl('Marketplace')}>
          <Button variant="outline" className="border-orange-500 text-orange-400">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const avgRating = artisan.testimonials?.length
    ? (artisan.testimonials.reduce((s, t) => s + (t.rating || 0), 0) / artisan.testimonials.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-stone-950 text-white">

      {/* FULL-BLEED HERO */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={artisan.workshopImageUrl || 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=90'}
          alt="Workshop"
          className="w-full h-full object-cover object-top"
        />
        {/* Multi-layer dramatic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-transparent" />

        {/* Back button */}
        <Link to={createPageUrl('Marketplace')} className="absolute top-6 left-6 z-10">
          <Button size="sm" className="bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-orange-600 hover:border-orange-600 transition-all">
            <ArrowLeft className="w-4 h-4 mr-1" /> Marketplace
          </Button>
        </Link>

        {/* Hero text — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-orange-400 text-sm font-bold tracking-widest uppercase">
                ✦ {artisan.initiation || 'Master Artisan'}
              </span>
              {artisan.featured && (
                <Badge className="bg-orange-600 text-white text-xs px-3 py-1 border-0">Featured</Badge>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              {artisan.artisanName}
            </h1>
            <p className="text-xl md:text-2xl text-stone-300 font-light mb-5">{artisan.title}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400 mb-6">
              {artisan.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {artisan.location}
                </span>
              )}
              {avgRating && (
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                  <span className="text-white font-semibold">{avgRating}</span>
                  <span>({artisan.testimonials.length} reviews)</span>
                </span>
              )}
              <Badge className="bg-stone-800 text-stone-200 border border-stone-600 text-xs">{artisan.brandName}</Badge>
            </div>
            <FollowArtisan artisanId={artisan.id} artisanName={artisan.artisanName} />
          </div>
        </div>
      </div>

      {/* SOUL MESSAGE — full width orange band */}
      {artisan.soulMessage && (
        <div className="bg-orange-600 px-8 md:px-14 py-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-2xl md:text-3xl font-bold italic text-white leading-relaxed">
              "{artisan.soulMessage}"
            </p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 space-y-20">

        {/* ABOUT + PORTRAIT */}
        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Portrait */}
          {artisan.profileImageUrl && (
            <div className="md:col-span-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
                <img
                  src={artisan.profileImageUrl}
                  alt={artisan.artisanName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                  <div className="space-y-1 text-sm text-stone-300">
                    {artisan.origin && <p>🌍 {artisan.origin}</p>}
                    {artisan.dateOfBirth && (
                      <p>🎂 Born {new Date(artisan.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Story + Bio Stats */}
          <div className="md:col-span-3 space-y-8">
            {artisan.biography && (
              <div>
                <h2 className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-3">About Us — The Story</h2>
                <p className="text-stone-300 leading-relaxed text-lg whitespace-pre-line">{artisan.biography}</p>
              </div>
            )}

            {/* Quick bio stats */}
            <div className="grid grid-cols-2 gap-4">
              {artisan.dateOfBirth && (
                <div className="bg-stone-900 border border-stone-700 rounded-xl p-4">
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Born</p>
                  <p className="text-stone-200 text-sm">{new Date(artisan.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              )}
              {artisan.location && (
                <div className="bg-stone-900 border border-stone-700 rounded-xl p-4">
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Based In</p>
                  <p className="text-stone-200 text-sm">{artisan.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INSPIRATION + BACKGROUND narrative */}
        {(artisan.origin || artisan.craftsmanship) && (
          <div className="grid md:grid-cols-2 gap-6">
            {artisan.origin && (
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 border border-stone-700 rounded-2xl p-7">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-orange-500" />
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">Inspiration & Origin</p>
                </div>
                <p className="text-stone-300 leading-relaxed">{artisan.origin}</p>
              </div>
            )}
            {artisan.craftsmanship && (
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 border border-stone-700 rounded-2xl p-7">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">The Craft</p>
                </div>
                <p className="text-stone-300 leading-relaxed">{artisan.craftsmanship}</p>
              </div>
            )}
          </div>
        )}

        {/* SYMBOLISM PULL QUOTE */}
        {artisan.symbolism && (
          <div className="border-l-4 border-orange-500 pl-8 py-2">
            <Quote className="w-8 h-8 text-orange-600 mb-3 opacity-60" />
            <p className="text-2xl text-stone-200 italic font-light leading-relaxed">{artisan.symbolism}</p>
          </div>
        )}

        {/* PRODUCTS */}
        {services.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-stone-700 pb-4">
              <h2 className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-1">Shop</h2>
              <h3 className="text-3xl font-black text-white">Products by {artisan.artisanName.split(' ')[0]}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => {
                const price = service.pricing?.USD || service.pricing?.ZAR || 0;
                const currency = service.pricing?.USD ? '$' : 'R';
                return (
                  <div key={service.id} className="group bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden hover:border-orange-500 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/30">
                    <div className="aspect-square overflow-hidden bg-stone-800">
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.serviceName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-stone-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-white text-lg leading-tight">{service.serviceName}</h3>
                      <p className="text-stone-400 text-sm line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-black text-orange-400">{currency}{price}</span>
                        <Link to={createPageUrl('Marketplace')}>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4">
                            Buy Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Enrichment */}
        {(!artisan.tools?.length || !artisan.signatureTechniques?.length) && (
          <AIProfileEnricher artisan={artisan} onSave={() => window.location.reload()} />
        )}

        {/* CULTURAL SIGNIFICANCE */}
        {artisan.culturalSignificance && (
          <div className="space-y-5">
            <div className="border-b border-stone-700 pb-4">
              <h2 className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-1">Heritage</h2>
              <h3 className="text-3xl font-black text-white">Cultural Significance</h3>
            </div>
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 border border-stone-700 rounded-2xl p-8">
              <p className="text-stone-300 leading-relaxed text-lg whitespace-pre-line">{artisan.culturalSignificance}</p>
            </div>
          </div>
        )}

        {/* TOOLS */}
        {artisan.tools?.length > 0 && (
          <div className="space-y-5">
            <div className="border-b border-stone-700 pb-4">
              <h2 className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-1">Craft</h2>
              <h3 className="text-3xl font-black text-white flex items-center gap-2"><Hammer className="w-7 h-7 text-orange-500" /> Artisan's Tools</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {artisan.tools.map((tool, i) => (
                <span key={i} className="bg-stone-800 border border-stone-600 text-stone-200 rounded-full px-5 py-2 text-sm font-medium hover:border-orange-500 hover:text-orange-300 transition-colors">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SIGNATURE TECHNIQUES */}
        {artisan.signatureTechniques?.length > 0 && (
          <div className="space-y-5">
            <div className="border-b border-stone-700 pb-4">
              <h2 className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-1">Mastery</h2>
              <h3 className="text-3xl font-black text-white flex items-center gap-2"><Sparkles className="w-7 h-7 text-orange-500" /> Signature Techniques</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {artisan.signatureTechniques.map((tech, i) => (
                <div key={i} className="bg-stone-900 border border-stone-700 rounded-xl px-5 py-4 flex items-start gap-4 hover:border-orange-600 transition-colors">
                  <span className="text-orange-500 font-black text-xl mt-0.5 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-stone-300 text-sm leading-relaxed">{tech}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {(artisan.galleryImages?.length > 0) && (
          <div className="space-y-5">
            <div className="border-b border-stone-700 pb-4">
              <h2 className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-1">Portfolio</h2>
              <h3 className="text-3xl font-black text-white">Gallery of Featured Work</h3>
            </div>
            <ArtisanGallery images={artisan.galleryImages} />
          </div>
        )}

        {/* MATERIALS & CERTS */}
        <ArtisanMaterialsCerts materials={artisan.materials || []} certifications={artisan.certifications || []} />

        {/* SOCIAL */}
        <ArtisanSocialLinks socialMedia={artisan.socialMedia || {}} />

        {/* TESTIMONIALS */}
        {artisan.testimonials?.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-stone-700 pb-4">
              <h2 className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-1">Community</h2>
              <h3 className="text-3xl font-black text-white">Customer Testimonials</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {artisan.testimonials.map((t, i) => (
                <div key={i} className="bg-stone-900 border border-stone-700 rounded-2xl p-6 space-y-3 hover:border-orange-600 transition-colors">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={`w-4 h-4 ${s < t.rating ? 'fill-orange-400 text-orange-400' : 'text-stone-700'}`} />
                    ))}
                  </div>
                  <p className="text-stone-300 italic leading-relaxed">"{t.comment}"</p>
                  <div className="pt-2 border-t border-stone-700 flex items-center justify-between text-sm">
                    <span className="font-bold text-white">— {t.customerName}</span>
                    {t.productPurchased && <span className="text-orange-400 text-xs">{t.productPurchased}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}