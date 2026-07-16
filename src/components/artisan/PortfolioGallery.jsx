import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import {
  X, ChevronLeft, ChevronRight, Grid3X3, LayoutList, Sparkles,
  Clock, Calendar, MessageSquarePlus, Star, Trophy, Layers,
  Package, ExternalLink, Tag, Hammer
} from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All Work' },
  { key: 'pottery', label: '🏺 Pottery' },
  { key: 'weaving', label: '🧵 Weaving' },
  { key: 'jewellery', label: '💍 Jewellery' },
  { key: 'sculpture', label: '🗿 Sculpture' },
  { key: 'painting', label: '🎨 Painting' },
  { key: 'textiles', label: '🪡 Textiles' },
  { key: 'woodwork', label: '🪵 Woodwork' },
  { key: 'leatherwork', label: '👜 Leather' },
  { key: 'metalwork', label: '⚒️ Metal' },
  { key: 'mixed_media', label: '✨ Mixed' },
  { key: 'commissioned', label: '🤝 Commissions', isTypeFilter: true },
  { key: 'exhibition', label: '🏆 Exhibition', isTypeFilter: true },
];

const PRICE_LABELS = {
  under_500: 'Under $500',
  '500_2000': '$500 – $2,000',
  '2000_5000': '$2,000 – $5,000',
  '5000_plus': '$5,000+',
  on_request: 'On request',
};

const TYPE_COLORS = {
  original: 'bg-muted text-muted-foreground',
  commissioned: 'bg-teal-900 text-teal-300',
  collaboration: 'bg-purple-900 text-purple-300',
  exhibition: 'bg-amber-900 text-amber-300',
};

export default function PortfolioGallery({ artisan, fallbackImages = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTechnique, setActiveTechnique] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'masonry'
  const [lightbox, setLightbox] = useState(null); // { project, imgIdx }

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['portfolio', artisan.id],
    queryFn: () => base44.entities.PortfolioProject.filter({ artisanId: artisan.id }, '-created_date'),
    enabled: !!artisan?.id,
  });

  // All techniques used across projects for filter chips
  const allTechniques = useMemo(() => {
    const set = new Set();
    projects.forEach(p => p.techniques?.forEach(t => set.add(t)));
    return [...set];
  }, [projects]);

  const filtered = useMemo(() => {
    let list = [...projects];
    const cat = CATEGORIES.find(c => c.key === activeCategory);

    if (activeCategory !== 'all') {
      if (cat?.isTypeFilter) {
        list = list.filter(p => p.projectType === activeCategory);
      } else {
        list = list.filter(p => p.category === activeCategory);
      }
    }
    if (activeTechnique) {
      list = list.filter(p => p.techniques?.includes(activeTechnique));
    }
    // Featured always first
    return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [projects, activeCategory, activeTechnique]);

  // Lightbox nav
  const lightboxProject = lightbox?.project;
  const lightboxImages = lightboxProject?.imageUrls?.length
    ? lightboxProject.imageUrls
    : lightboxProject?.coverImageUrl
      ? [lightboxProject.coverImageUrl]
      : [];
  const prevImg = () => setLightbox(l => ({ ...l, imgIdx: (l.imgIdx - 1 + lightboxImages.length) % lightboxImages.length }));
  const nextImg = () => setLightbox(l => ({ ...l, imgIdx: (l.imgIdx + 1) % lightboxImages.length }));
  const prevProject = () => {
    const idx = filtered.findIndex(p => p.id === lightboxProject?.id);
    if (idx > 0) setLightbox({ project: filtered[idx - 1], imgIdx: 0 });
  };
  const nextProject = () => {
    const idx = filtered.findIndex(p => p.id === lightboxProject?.id);
    if (idx < filtered.length - 1) setLightbox({ project: filtered[idx + 1], imgIdx: 0 });
  };

  // If no rich projects, fall back to simple image gallery
  if (!isLoading && projects.length === 0 && fallbackImages.length > 0) {
    return <FallbackGallery images={fallbackImages} />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-2xl">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No portfolio projects yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stats strip ── */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="bg-card border border-border rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-foreground font-bold">{projects.length}</span>
          <span className="text-muted-foreground">Projects</span>
        </div>
        {projects.filter(p => p.featured).length > 0 && (
          <div className="bg-card border border-border rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-foreground font-bold">{projects.filter(p => p.featured).length}</span>
            <span className="text-muted-foreground">Featured</span>
          </div>
        )}
        {projects.filter(p => p.isCommissionable).length > 0 && (
          <div className="bg-teal-900/40 border border-teal-700/50 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-teal-400" />
            <span className="text-teal-300 font-bold">{projects.filter(p => p.isCommissionable).length}</span>
            <span className="text-teal-400">Open for commissions</span>
          </div>
        )}
        {projects.filter(p => p.projectType === 'exhibition').length > 0 && (
          <div className="bg-amber-900/30 border border-amber-700/40 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-bold">{projects.filter(p => p.projectType === 'exhibition').length}</span>
            <span className="text-amber-400">Exhibition pieces</span>
          </div>
        )}
      </div>

      {/* ── Category tabs ── */}
      <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
        <div className="flex gap-2 min-w-max pb-1">
          {CATEGORIES.filter(c => {
            if (c.key === 'all') return true;
            if (c.isTypeFilter) return projects.some(p => p.projectType === c.key);
            return projects.some(p => p.category === c.key);
          }).map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat.key
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Technique filter chips ── */}
      {allTechniques.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Technique
          </span>
          {allTechniques.map(tech => (
            <button key={tech} onClick={() => setActiveTechnique(activeTechnique === tech ? null : tech)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                activeTechnique === tech
                  ? 'bg-primary/30 border-primary text-primary'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}>
              {tech}
            </button>
          ))}
          {activeTechnique && (
            <button onClick={() => setActiveTechnique(null)} className="text-xs text-muted-foreground hover:text-foreground ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ── View mode + count ── */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</p>
        <div className="flex gap-1">
          {[{ key: 'grid', Icon: Grid3X3 }, { key: 'masonry', Icon: LayoutList }].map(({ key, Icon }) => (
            <button key={key} onClick={() => setViewMode(key)}
              className={`p-2 rounded-lg transition-colors ${viewMode === key ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className={viewMode === 'masonry'
        ? 'columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3'
        : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'}>
        {filtered.map(project => {
          const cover = project.coverImageUrl || project.imageUrls?.[0];
          return (
            <div key={project.id}
              className={`group relative rounded-xl overflow-hidden cursor-pointer border border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${
                viewMode === 'masonry' ? 'break-inside-avoid mb-3' : 'aspect-square'
              } ${project.featured ? 'ring-1 ring-orange-500/50' : ''}`}
              onClick={() => setLightbox({ project, imgIdx: 0 })}>

              {/* Image */}
              {cover ? (
                <img src={cover} alt={project.title}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                    viewMode === 'masonry' ? '' : 'h-full'
                  }`} />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Package className="w-10 h-10 text-muted-foreground" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Badges top */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {project.featured && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-2.5 h-2.5" /> Featured
                  </span>
                )}
                {project.projectType && project.projectType !== 'original' && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[project.projectType]}`}>
                    {project.projectType}
                  </span>
                )}
              </div>

              {/* Commission badge */}
              {project.isCommissionable && (
                <div className="absolute top-2 right-2">
                  <span className="bg-teal-600/90 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Open
                  </span>
                </div>
              )}

              {/* Hover info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-foreground font-bold text-sm truncate">{project.title}</p>
                {project.year && <p className="text-muted-foreground text-xs">{project.year}</p>}
                {project.techniques?.slice(0, 2).map(t => (
                  <span key={t} className="inline-block bg-primary/30 border border-primary/50 text-primary text-[10px] px-2 py-0.5 rounded-full mr-1 mt-1">{t}</span>
                ))}
              </div>

              {/* Multi-image indicator */}
              {project.imageUrls?.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-foreground text-[10px] px-1.5 py-0.5 rounded font-bold">
                  +{project.imageUrls.length - 1}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Lightbox + Project Detail ── */}
      {lightbox && lightboxProject && (
        <div className="fixed inset-0 bg-black/95 z-50 flex" onClick={() => setLightbox(null)}>
          <div className="flex flex-col md:flex-row w-full h-full" onClick={e => e.stopPropagation()}>

            {/* Image pane */}
            <div className="relative flex-1 flex items-center justify-center bg-black/60 min-h-[50vh] md:min-h-0">
              {lightboxImages.length > 0 ? (
                <img src={lightboxImages[lightbox.imgIdx]} alt={lightboxProject.title}
                  className="max-h-full max-w-full object-contain p-4" />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <Package className="w-20 h-20 text-foreground" />
                </div>
              )}

              {/* Image nav */}
              {lightboxImages.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 flex gap-1.5">
                    {lightboxImages.map((_, i) => (
                      <button key={i} onClick={() => setLightbox(l => ({ ...l, imgIdx: i }))}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === lightbox.imgIdx ? 'bg-primary w-4' : 'bg-muted0'}`} />
                    ))}
                  </div>
                </>
              )}

              {/* Project nav */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button onClick={prevProject} disabled={filtered.findIndex(p => p.id === lightboxProject.id) === 0}
                  className="px-3 py-1.5 bg-black/50 rounded-lg text-foreground text-xs hover:bg-muted disabled:opacity-30 flex items-center gap-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev project
                </button>
                <button onClick={nextProject} disabled={filtered.findIndex(p => p.id === lightboxProject.id) === filtered.length - 1}
                  className="px-3 py-1.5 bg-black/50 rounded-lg text-foreground text-xs hover:bg-muted disabled:opacity-30 flex items-center gap-1">
                  Next project <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Detail panel */}
            <div className="w-full md:w-[380px] bg-background border-l border-border overflow-y-auto flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Project Detail</p>
                <button onClick={() => setLightbox(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 px-6 py-6 space-y-6">
                {/* Title + type */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-2xl font-black text-foreground leading-tight">{lightboxProject.title}</h2>
                    {lightboxProject.featured && <Star className="w-5 h-5 text-primary shrink-0 mt-0.5 fill-orange-400" />}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lightboxProject.projectType && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${TYPE_COLORS[lightboxProject.projectType] || TYPE_COLORS.original}`}>
                        {lightboxProject.projectType}
                      </span>
                    )}
                    {lightboxProject.category && (
                      <span className="bg-muted text-muted-foreground text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                        {lightboxProject.category}
                      </span>
                    )}
                    {lightboxProject.sold && (
                      <span className="bg-red-900/50 text-red-400 text-xs font-bold px-2.5 py-1 rounded-full">Sold</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {lightboxProject.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">{lightboxProject.description}</p>
                )}

                {/* Meta row */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {lightboxProject.year && (
                    <div className="bg-card rounded-xl p-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs">Year</p>
                        <p className="text-foreground font-bold">{lightboxProject.year}</p>
                      </div>
                    </div>
                  )}
                  {lightboxProject.completionDays && (
                    <div className="bg-card rounded-xl p-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs">Time</p>
                        <p className="text-foreground font-bold">{lightboxProject.completionDays}d</p>
                      </div>
                    </div>
                  )}
                  {lightboxProject.priceRange && (
                    <div className="bg-card rounded-xl p-3 flex items-center gap-2 col-span-2">
                      <Tag className="w-4 h-4 text-teal-400 shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs">Similar commission from</p>
                        <p className="text-teal-300 font-bold">{PRICE_LABELS[lightboxProject.priceRange]}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Techniques */}
                {lightboxProject.techniques?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">Techniques Used</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lightboxProject.techniques.map(t => (
                        <span key={t} className="bg-primary/10 border border-primary/30 text-primary text-xs px-3 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {lightboxProject.materials?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Hammer className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Materials</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lightboxProject.materials.map(m => (
                        <span key={m} className="bg-muted border border-border text-muted-foreground text-xs px-3 py-1 rounded-full">{m}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exhibition */}
                {lightboxProject.exhibitionName && (
                  <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 flex items-start gap-3">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-0.5">Exhibited at</p>
                      <p className="text-amber-200 text-sm font-semibold">{lightboxProject.exhibitionName}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Commission CTA */}
              <div className="px-6 py-5 border-t border-border shrink-0 space-y-3">
                {lightboxProject.isCommissionable ? (
                  <>
                    <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      {artisan.artisanName.split(' ')[0]} is open for similar commissions
                    </div>
                    <Link to={`${createPageUrl('Messages')}?artisanId=${artisan.id}&artisanName=${encodeURIComponent(artisan.artisanName)}&project=${encodeURIComponent(lightboxProject.title)}`}
                      onClick={() => setLightbox(null)}>
                      <Button className="w-full bg-teal-600 hover:bg-teal-500 text-foreground font-bold gap-2">
                        <MessageSquarePlus className="w-4 h-4" />
                        Request a Similar Commission
                      </Button>
                    </Link>
                    {lightboxProject.priceRange && lightboxProject.priceRange !== 'on_request' && (
                      <p className="text-xs text-muted-foreground text-center">
                        Typically starting {PRICE_LABELS[lightboxProject.priceRange]}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-muted-foreground text-sm text-center py-1">
                    This type of commission is not currently available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple fallback when no PortfolioProject records exist
function FallbackGallery({ images }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const prev = () => setLightboxIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setLightboxIdx(i => (i + 1) % images.length);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <button key={idx} onClick={() => setLightboxIdx(idx)}
            className="aspect-square overflow-hidden rounded-xl border border-border hover:border-primary hover:shadow-xl transition-all duration-300">
            <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </button>
        ))}
      </div>
      {lightboxIdx !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxIdx(null)}>
          <button onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 text-foreground hover:text-primary"><X className="w-8 h-8" /></button>
          <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 text-foreground hover:text-primary"><ChevronLeft className="w-10 h-10" /></button>
          <img src={images[lightboxIdx]} alt="Gallery" className="max-h-[85vh] max-w-full rounded-xl" onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 text-foreground hover:text-primary"><ChevronRight className="w-10 h-10" /></button>
          <p className="absolute bottom-4 text-foreground/60 text-sm">{lightboxIdx + 1} / {images.length}</p>
        </div>
      )}
    </div>
  );
}