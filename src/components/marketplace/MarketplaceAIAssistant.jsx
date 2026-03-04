import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Loader2, ShoppingCart, Star, MapPin, X } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';

export default function MarketplaceAIAssistant({ services = [], artisans = [] }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [matchedServices, setMatchedServices] = useState([]);
  const [matchedArtisans, setMatchedArtisans] = useState([]);
  const [open, setOpen] = useState(false);
  const { addItem } = useCart();

  const CURRENCY_SYMBOLS = { USD: '$', ZAR: 'R', EUR: '€', GBP: '£', NGN: '₦' };

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer('');
    setMatchedServices([]);
    setMatchedArtisans([]);

    const serviceList = services.map(s => ({
      id: s.id,
      name: s.serviceName,
      brand: s.brandName,
      description: s.description,
      tags: s.tags?.join(', '),
      priceUSD: s.pricing?.USD,
      priceZAR: s.pricing?.ZAR,
      category: s.category,
      status: s.status
    }));

    const artisanList = artisans.map(a => ({
      id: a.id,
      name: a.artisanName,
      title: a.title,
      location: a.location,
      origin: a.origin,
      biography: a.biography?.slice(0, 300),
      craftsmanship: a.craftsmanship,
      tags: a.signatureTechniques?.join(', ')
    }));

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI shopping assistant for the FAA.ZONE marketplace — a platform featuring African handcrafted goods and artisan products.

A user asked: "${query}"

Here are all available products:
${JSON.stringify(serviceList, null, 2)}

Here are all artisans:
${JSON.stringify(artisanList, null, 2)}

Instructions:
1. Provide a warm, helpful 2-3 sentence response to the user's query.
2. Return the IDs of matching products (up to 6) and matching artisans (up to 3).
3. If the user asks for recommendations or is vague, suggest the most interesting/unique items.
4. Consider tags, descriptions, locations, cultural significance when matching.`,
      response_json_schema: {
        type: 'object',
        properties: {
          answer: { type: 'string' },
          matchedServiceIds: { type: 'array', items: { type: 'string' } },
          matchedArtisanIds: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    setAnswer(result.answer || '');
    const foundServices = services.filter(s => result.matchedServiceIds?.includes(s.id));
    const foundArtisans = artisans.filter(a => result.matchedArtisanIds?.includes(a.id));
    setMatchedServices(foundServices);
    setMatchedArtisans(foundArtisans);
    setLoading(false);
  };

  const suggestions = [
    'Show me handcrafted African hats',
    'Blue pottery from South Africa',
    'What are the most unique items?',
    'Gifts under $300',
  ];

  return (
    <div className="mb-8">
      {/* Collapsed trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 w-full bg-gradient-to-r from-violet-600 to-purple-700 text-white px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-semibold">Ask our AI Shopping Assistant</span>
          <span className="ml-auto text-violet-200 text-sm">Try: "Show me African hats"</span>
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <Card className="border-violet-200 shadow-xl bg-gradient-to-br from-violet-50 to-purple-50">
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <h3 className="font-bold text-violet-900">AI Shopping Assistant</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-xs bg-white border border-violet-200 text-violet-700 px-3 py-1 rounded-full hover:bg-violet-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                placeholder="Ask about products, artisans, or get recommendations..."
                className="flex-1"
              />
              <Button onClick={handleAsk} disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>

            {/* Answer */}
            {answer && (
              <div className="bg-white border border-violet-200 rounded-xl px-4 py-3 text-gray-700 text-sm">
                <Sparkles className="w-4 h-4 text-violet-500 inline mr-1" />
                {answer}
              </div>
            )}

            {/* Matched Artisans */}
            {matchedArtisans.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Artisans</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchedArtisans.map(a => (
                    <div key={a.id} className="bg-white border border-amber-200 rounded-xl p-3 flex items-center gap-3">
                      {a.profileImageUrl && <img src={a.profileImageUrl} alt={a.artisanName} className="w-10 h-10 rounded-full object-cover" />}
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{a.artisanName}</p>
                        <p className="text-xs text-amber-700">{a.title}</p>
                        {a.location && <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Services */}
            {matchedServices.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Products</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {matchedServices.map(s => {
                    const price = s.pricing?.USD || s.pricing?.ZAR || 0;
                    const sym = s.pricing?.USD ? CURRENCY_SYMBOLS.USD : CURRENCY_SYMBOLS.ZAR;
                    return (
                      <div key={s.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        {s.imageUrl && <img src={s.imageUrl} alt={s.serviceName} className="w-full h-28 object-cover" />}
                        <div className="p-3 space-y-1">
                          <p className="font-semibold text-sm text-gray-900 line-clamp-1">{s.serviceName}</p>
                          <p className="text-xs text-gray-500">{s.brandName}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-violet-700">{sym}{price}</span>
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-violet-600 hover:bg-violet-700"
                              onClick={() => addItem({ id: s.id, name: s.serviceName, price, currency: 'USD', imageUrl: s.imageUrl })}
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" /> Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}