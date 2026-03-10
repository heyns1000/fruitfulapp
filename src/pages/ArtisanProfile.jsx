import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star, MapPin, ArrowLeft, Loader2, Package, Hammer, Sparkles,
  Lightbulb, BookOpen, Quote, ChevronDown, Globe, Award, Layers
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import AIProfileEnricher from '../components/artisan/AIProfileEnricher';
import ArtisanGallery from '../components/artisan/ArtisanGallery';
import ArtisanSocialLinks from '../components/artisan/ArtisanSocialLinks';
import ArtisanMaterialsCerts from '../components/artisan/ArtisanMaterialsCerts';
import FollowArtisan from '../components/artisan/FollowArtisan';
import ArtisanWishlistSection from '../components/artisan/ArtisanWishlistSection';
import ReviewsSection from '../components/reviews/ReviewsSection';

const SECTIONS = [
  { id: 'story', label: 'Story' },
  { id: 'craft', label: 'Craft' },
  { id: 'shop', label: 'Shop' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reviews', label: 'Reviews' },
];

export default function ArtisanProfile() {
  const params = new URLSearchParams(window.location.search);
  const artisanId = params.get('id');
  const [activeSection, setActiveSection] = useState('story');
  const sectionRefs = useRef({});

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
    );
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [artisan]);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
  // avgRating used in hero stats pill

  return (
    <div className="min-h-screen bg-stone-950 text-white">

      {/* ── HERO ── */}
      <div className="relative h-screen min-h-[600px] max-h-[850px] overflow-hidden">
        <img
          src={artisan.workshopImageUrl || 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=90'}
          alt="Workshop"
          className="w-full h-full object-cover object-center scale-105"
          style={{ animation: 'subtleZoom 20s ease-in-out infinite alternate' }}
        />
        <style>{`@keyframes subtleZoom { from { transform: scale(1.05); } to { transform: scale(1.12); } }`}</style>

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/30 to-transparent" />

        {/* Back */}
        <Link to={createPageUrl('Marketplace')} className="absolute top-6 left-6 z-10">
          <Button size="sm" className="bg-black/40 backdrop-blur-md border border-white/15 text-white hover:bg-orange-600 hover:border-orange-600 transition-all gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Marketplace
          </Button>
        </Link>

        {/* Stats pills top right */}
        <div className="absolute top-6 right-6 flex gap-2">
          {avgRating && (
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/15 rounded-full px-4 py-1.5 text-sm">
              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span className="font-bold text-white">{avgRating}</span>
              <span className="text-stone-400">({artisan.testimonials?.length})</span>
            </div>
          )}
          {artisan.featured && (
            <div className="bg-orange-600 rounded-full px-4 py-1.5 text-xs font-bold text-white">✦ Featured</div>
          )}
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-16">
          <div className="max-w-5xl">
            <p className="text-orange-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              ✦ {artisan.initiation || 'Master Artisan'} · {artisan.brandName}
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none mb-4" style={{ fontFamily: 'Georgia, serif', textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
              {artisan.artisanName}
            </h1>
            <p className="text-xl md:text-2xl text-stone-300 font-light mb-2">{artisan.title}</p>
            {artisan.location && (
              <p className="flex items-center gap-1.5 text-stone-400 text-sm mb-8">
                <MapPin className="w-4 h-4 text-orange-500" />{artisan.location}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <FollowArtisan artisanId={artisan.id} artisanName={artisan.artisanName} />
              <button
                onClick={() => scrollTo('shop')}
                className="flex items-center gap-2 text-stone-300 hover:text-orange-400 transition-colors text-sm font-medium"
              >
                <ChevronDown className="w-4 h-4" /> View Products
              </button>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 right-8 flex flex-col items-center gap-1 text-stone-500 text-[10px] tracking-widest uppercase">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-orange-500 mx-auto" />
          Scroll
        </div>
      </div>

      {/* ── SOUL MESSAGE BAND ── */}
      {artisan.soulMessage && (
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 px-8 md:px-16 py-10">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <div className="max-w-4xl mx-auto relative">
            <Quote className="w-8 h-8 text-orange-200 mb-3 opacity-60" />
            <p className="text-2xl md:text-3xl font-bold italic text-white leading-relaxed">
              "{artisan.soulMessage}"
            </p>
          </div>
        </div>
      )}

      {/* ── STICKY NAV ── */}
      <div className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 overflow-x-auto scrollbar-none py-0">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeSection === s.id
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 space-y-28">

        {/* ─ STORY ─ */}
        <section id="story" ref={el => sectionRefs.current['story'] = el} className="scroll-mt-16">
          <div className="grid md:grid-cols-5 gap-14 items-start">

            {/* Portrait */}
            {artisan.profileImageUrl && (
              <div className="md:col-span-2">
                <div className="sticky top-24">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] group">
                    <img
                      src={artisan.profileImageUrl}
                      alt={artisan.artisanName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                      {artisan.dateOfBirth && (
                        <div className="flex items-center gap-2 text-stone-300 text-sm">
                          <span className="text-orange-400">Born</span>
                          {new Date(artisan.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      )}
                      {artisan.location && (
                        <div className="flex items-center gap-2 text-stone-300 text-sm">
                          <Globe className="w-3.5 h-3.5 text-orange-400" />
                          {artisan.location}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Quick stats below portrait */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {artisan.materials?.length > 0 && (
                      <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-orange-400">{artisan.materials.length}</p>
                        <p className="text-xs text-stone-400 mt-0.5">Materials</p>
                      </div>
                    )}
                    {artisan.signatureTechniques?.length > 0 && (
                      <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-orange-400">{artisan.signatureTechniques.length}</p>
                        <p className="text-xs text-stone-400 mt-0.5">Techniques</p>
                      </div>
                    )}
                    {services.length > 0 && (
                      <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-orange-400">{services.length}</p>
                        <p className="text-xs text-stone-400 mt-0.5">Products</p>
                      </div>
                    )}
                    {artisan.testimonials?.length > 0 && (
                      <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-orange-400">{avgRating}★</p>
                        <p className="text-xs text-stone-400 mt-0.5">Rating</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Biography + Narrative */}
            <div className="md:col-span-3 space-y-12">
              {artisan.biography && (
                <div>
                  <p className="text-xs font-bold tracking-[0.25em] uppercase text-orange-500 mb-4">The Story</p>
                  <p className="text-stone-200 leading-relaxed text-lg whitespace-pre-line">{artisan.biography}</p>
                </div>
              )}

              {/* Inspiration + Origin cards */}
              {(artisan.origin || artisan.craftsmanship) && (
                <div className="space-y-4">
                  {artisan.origin && (
                    <div className="group relative bg-stone-900 border border-stone-700 hover:border-orange-600 rounded-2xl p-7 transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-orange-400" />
                          </div>
                          <p className="text-xs font-bold tracking-widest uppercase text-orange-400">Inspiration & Origin</p>
                        </div>
                        <p className="text-stone-300 leading-relaxed">{artisan.origin}</p>
                      </div>
                    </div>
                  )}
                  {artisan.craftsmanship && (
                    <div className="group relative bg-stone-900 border border-stone-700 hover:border-orange-600 rounded-2xl p-7 transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-orange-400" />
                          </div>
                          <p className="text-xs font-bold tracking-widest uppercase text-orange-400">The Craft</p>
                        </div>
                        <p className="text-stone-300 leading-relaxed">{artisan.craftsmanship}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Symbolism pull-quote */}
              {artisan.symbolism && (
                <div className="relative py-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-orange-500 to-transparent rounded-full" />
                  <div className="pl-8">
                    <Quote className="w-7 h-7 text-orange-600 mb-3 opacity-70" />
                    <p className="text-2xl text-stone-200 italic font-light leading-relaxed">{artisan.symbolism}</p>
                  </div>
                </div>
              )}

              {/* Cultural Significance */}
              {artisan.culturalSignificance && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-xs font-bold tracking-widest uppercase text-amber-400">Cultural Heritage</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-950/30 to-stone-900 border border-amber-800/30 rounded-2xl p-7">
                    <p className="text-stone-300 leading-relaxed whitespace-pre-line">{artisan.culturalSignificance}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─ CRAFT ─ */}
        <section id="craft" ref={el => sectionRefs.current['craft'] = el} className="scroll-mt-16 space-y-10">
          <div className="border-b border-stone-800 pb-5">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-orange-500 mb-1">Mastery</p>
            <h2 className="text-4xl font-black text-white">The Art of the Craft</h2>
          </div>

          {/* AI Enrichment CTA */}
          {(!artisan.tools?.length || !artisan.signatureTechniques?.length) && (
            <AIProfileEnricher artisan={artisan} onSave={() => window.location.reload()} />
          )}

          <div className="grid md:grid-cols-2 gap-10">
            {/* Tools */}
            {artisan.tools?.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-600 flex items-center justify-center">
                    <Hammer className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Artisan's Tools</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {artisan.tools.map((tool, i) => (
                    <span key={i} className="bg-stone-800 border border-stone-600 text-stone-200 rounded-full px-4 py-1.5 text-sm hover:border-orange-500 hover:text-orange-300 transition-colors cursor-default">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Techniques */}
            {artisan.signatureTechniques?.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Signature Techniques</h3>
                </div>
                <div className="space-y-3">
                  {artisan.signatureTechniques.map((tech, i) => (
                    <div key={i} className="flex items-start gap-4 bg-stone-900 border border-stone-700 rounded-xl px-5 py-4 hover:border-orange-600 transition-colors group">
                      <span className="text-orange-500 font-black text-lg tabular-nums mt-0.5 group-hover:text-orange-300 transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-stone-300 text-sm leading-relaxed">{tech}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Materials & Certs */}
          <ArtisanMaterialsCerts materials={artisan.materials || []} certifications={artisan.certifications || []} />
        </section>

        {/* ─ SHOP ─ */}
        {services.length > 0 && (
          <section id="shop" ref={el => sectionRefs.current['shop'] = el} className="scroll-mt-16 space-y-8">
            <div className="border-b border-stone-800 pb-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] uppercase text-orange-500 mb-1">Shop</p>
                <h2 className="text-4xl font-black text-white">Products by {artisan.artisanName.split(' ')[0]}</h2>
              </div>
              <Badge className="bg-stone-800 border border-stone-600 text-stone-300">{services.length} items</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => {
                const price = service.pricing?.USD || service.pricing?.ZAR || 0;
                const currency = service.pricing?.USD ? '$' : 'R';
                return (
                  <div key={service.id} className="group bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden hover:border-orange-500 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/20 hover:-translate-y-1">
                    <div className="aspect-[4/3] overflow-hidden bg-stone-800 relative">
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.serviceName} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" style={{ transform: 'scale(1)' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-14 h-14 text-stone-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-white text-base leading-snug">{service.serviceName}</h3>
                      {service.description && (
                        <p className="text-stone-400 text-sm line-clamp-2">{service.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-2xl font-black text-orange-400">{currency}{price}</span>
                        <Link to={createPageUrl('Marketplace')}>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white font-bold">
                            Buy Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─ GALLERY ─ */}
        {artisan.galleryImages?.length > 0 && (
          <section id="gallery" ref={el => sectionRefs.current['gallery'] = el} className="scroll-mt-16 space-y-8">
            <div className="border-b border-stone-800 pb-5">
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-orange-500 mb-1">Portfolio</p>
              <h2 className="text-4xl font-black text-white">Gallery of Featured Work</h2>
            </div>
            <ArtisanGallery images={artisan.galleryImages} />
          </section>
        )}

        {/* ─ SOCIAL ─ */}
        {artisan.socialMedia && Object.values(artisan.socialMedia).some(Boolean) && (
          <ArtisanSocialLinks socialMedia={artisan.socialMedia} />
        )}

        {/* ─ REVIEWS ─ */}
        <section id="reviews" ref={el => sectionRefs.current['reviews'] = el} className="scroll-mt-16">
          <ReviewsSection artisan={artisan} services={services} />
        </section>

      </div>

      {/* ─ WISHLIST SECTION ─ */}
      <ArtisanWishlistSection artisanName={artisan.artisanName} brandId={artisan.brandId} />

      {/* ── FOOTER CTA ── */}
      <div className="border-t border-stone-800 bg-stone-900">
        <div className="max-w-6xl mx-auto px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-2xl font-black text-white mb-1">Love {artisan.artisanName.split(' ')[0]}'s work?</p>
            <p className="text-stone-400">Follow to get notified when new pieces drop.</p>
          </div>
          <div className="flex gap-3">
            <FollowArtisan artisanId={artisan.id} artisanName={artisan.artisanName} />
            <Link to={createPageUrl('Marketplace')}>
              <Button variant="outline" className="border-stone-600 text-stone-300 hover:border-orange-500 hover:text-orange-400">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}