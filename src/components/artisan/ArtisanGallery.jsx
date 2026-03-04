import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ArtisanGallery({ images = [] }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  if (!images.length) return null;

  const prev = () => setLightboxIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setLightboxIdx(i => (i + 1) % images.length);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2">🖼️ Gallery of Featured Work</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <button
            key={idx}
            onClick={() => setLightboxIdx(idx)}
            className="aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-stone-700 hover:border-orange-500"
          >
            <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 text-white hover:text-amber-400">
            <X className="w-8 h-8" />
          </button>
          <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white hover:text-amber-400">
            <ChevronLeft className="w-10 h-10" />
          </button>
          <img
            src={images[lightboxIdx]}
            alt="Gallery"
            className="max-h-[85vh] max-w-full rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 text-white hover:text-amber-400">
            <ChevronRight className="w-10 h-10" />
          </button>
          <p className="absolute bottom-4 text-white/60 text-sm">{lightboxIdx + 1} / {images.length}</p>
        </div>
      )}
    </div>
  );
}