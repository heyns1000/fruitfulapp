import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';

export default function AIProfileEnricher({ artisan, onSave }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleEnrich = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert in African artisan crafts and cultural heritage.

Based on this artisan profile, generate structured enrichment data:

Artisan Name: ${artisan.artisanName}
Title: ${artisan.title}
Biography: ${artisan.biography || ''}
Craftsmanship: ${artisan.craftsmanship || ''}
Origin: ${artisan.origin || ''}
Symbolism: ${artisan.symbolism || ''}

Generate:
1. tools: An array of 4-8 specific tools this artisan likely uses (e.g. "Hand-forged beading needle", "Natural straw loom")
2. signatureTechniques: An array of 3-6 specific techniques they are known for
3. culturalSignificance: A 2-3 paragraph description of the cultural, historical and spiritual significance of their craft
4. tags: An array of 6-10 relevant searchable tags`,
      response_json_schema: {
        type: 'object',
        properties: {
          tools: { type: 'array', items: { type: 'string' } },
          signatureTechniques: { type: 'array', items: { type: 'string' } },
          culturalSignificance: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    await base44.entities.ArtisanProfile.update(artisan.id, {
      tools: result.tools || [],
      signatureTechniques: result.signatureTechniques || [],
      culturalSignificance: result.culturalSignificance || '',
    });

    setDone(true);
    setLoading(false);
    if (onSave) onSave(result);
  };

  return (
    <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
      <Sparkles className="w-5 h-5 text-violet-600 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-violet-900">AI Profile Enrichment</p>
        <p className="text-xs text-violet-600">Auto-generate Tools, Techniques & Cultural Significance from biography</p>
      </div>
      {done ? (
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> Done!
        </div>
      ) : (
        <Button
          size="sm"
          onClick={handleEnrich}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-1" /> Enrich</>}
        </Button>
      )}
    </div>
  );
}