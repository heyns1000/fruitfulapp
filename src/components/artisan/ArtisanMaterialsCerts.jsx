import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

export default function ArtisanMaterialsCerts({ materials = [], certifications = [] }) {
  if (!materials.length && !certifications.length) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {materials.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2">🌿 Available Materials</h2>
          <div className="flex flex-wrap gap-2">
            {materials.map((m, i) => (
              <Badge key={i} className="bg-green-100 text-green-800 border border-green-300 px-3 py-1 text-sm font-medium">
                {m}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2">🏅 Certifications</h2>
          <div className="grid gap-3">
            {certifications.map((cert, i) => (
              <Card key={i} className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardContent className="pt-4 pb-4 flex items-center gap-3">
                  {cert.badgeUrl ? (
                    <img src={cert.badgeUrl} alt={cert.name} className="w-12 h-12 object-contain rounded-full" />
                  ) : (
                    <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-amber-700" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800">{cert.name}</p>
                    {cert.issuedBy && <p className="text-xs text-gray-500">Issued by {cert.issuedBy}</p>}
                    {cert.year && <p className="text-xs text-amber-600">Year: {cert.year}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}