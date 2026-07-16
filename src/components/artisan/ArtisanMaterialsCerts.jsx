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
          <div className="border-b border-border pb-3">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Sourcing</p>
            <h3 className="text-2xl font-black text-foreground">🌿 Available Materials</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {materials.map((m, i) => (
              <Badge key={i} className="bg-muted border border-border text-foreground px-4 py-1.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                {m}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-border pb-3">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Recognition</p>
            <h3 className="text-2xl font-black text-foreground">🏅 Certifications</h3>
          </div>
          <div className="grid gap-3">
            {certifications.map((cert, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary transition-colors">
                {cert.badgeUrl ? (
                  <img src={cert.badgeUrl} alt={cert.name} className="w-12 h-12 object-contain rounded-full border border-border" />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-foreground">{cert.name}</p>
                  {cert.issuedBy && <p className="text-xs text-muted-foreground">Issued by {cert.issuedBy}</p>}
                  {cert.year && <p className="text-xs text-primary">Year: {cert.year}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}