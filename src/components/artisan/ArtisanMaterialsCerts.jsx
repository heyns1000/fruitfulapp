import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

export default function ArtisanMaterialsCerts({ materials = [], certifications = [] }) {
  if (!materials.length && !certifications.length) return null;

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {materials.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-stone-700 pb-3">
            <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-1">Sourcing</p>
            <h3 className="text-2xl font-black text-white">🌿 Available Materials</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {materials.map((m, i) => (
              <Badge key={i} className="bg-stone-800 border border-stone-600 text-stone-200 px-4 py-1.5 text-sm font-medium hover:border-orange-500 hover:text-orange-300 transition-colors">
                {m}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-stone-700 pb-3">
            <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-1">Recognition</p>
            <h3 className="text-2xl font-black text-white">🏅 Certifications</h3>
          </div>
          <div className="grid gap-3">
            {certifications.map((cert, i) => (
              <div key={i} className="bg-stone-900 border border-stone-700 rounded-xl p-4 flex items-center gap-4 hover:border-orange-500 transition-colors">
                {cert.badgeUrl ? (
                  <img src={cert.badgeUrl} alt={cert.name} className="w-12 h-12 object-contain rounded-full border border-stone-600" />
                ) : (
                  <div className="w-12 h-12 bg-orange-900/40 rounded-full flex items-center justify-center border border-orange-700">
                    <ShieldCheck className="w-6 h-6 text-orange-400" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-white">{cert.name}</p>
                  {cert.issuedBy && <p className="text-xs text-stone-400">Issued by {cert.issuedBy}</p>}
                  {cert.year && <p className="text-xs text-orange-400">Year: {cert.year}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}