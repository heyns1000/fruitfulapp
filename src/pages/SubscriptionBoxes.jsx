import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, Search, Sparkles, Filter, Loader2 } from 'lucide-react';
import BoxCard from '../components/subscriptionbox/BoxCard';
import SubscribeModal from '../components/subscriptionbox/SubscribeModal';
import MySubscriptionBoxes from '../components/subscriptionbox/MySubscriptionBoxes';

const THEMES = [
  { key: 'all', label: 'All Boxes' },
  { key: 'heritage_craft', label: '🏺 Heritage' },
  { key: 'modern_art', label: '🎨 Modern Art' },
  { key: 'pottery_earth', label: '🪴 Pottery' },
  { key: 'textile_weave', label: '🧵 Textiles' },
  { key: 'jewellery', label: '💎 Jewellery' },
  { key: 'mixed_curated', label: '✨ Mixed' },
  { key: 'seasonal', label: '🌿 Seasonal' },
];

export default function SubscriptionBoxes() {
  const [selectedBox, setSelectedBox] = useState(null);
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [userEmail, setUserEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const { data: boxes = [], isLoading } = useQuery({
    queryKey: ['subscription-boxes'],
    queryFn: () => base44.entities.SubscriptionBox.list('-created_date', 50),
  });

  const activeBoxes = boxes.filter(b => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.description?.toLowerCase().includes(search.toLowerCase());
    const matchTheme = themeFilter === 'all' || b.theme === themeFilter;
    return matchSearch && matchTheme;
  });

  const featuredBoxes = activeBoxes.filter(b => b.featured);
  const otherBoxes = activeBoxes.filter(b => !b.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-transparent to-card px-8 md:px-16 py-20 border-b border-border">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0d9488 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-5xl relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase">Curated Monthly Boxes</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4" style={{ fontFamily: 'inherit' }}>
            Artisan<br /><span className="text-primary">Subscription</span> Boxes
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
            Receive hand-curated pieces from Africa's finest craftspeople every month. Each box tells a story — directly from the artisan's hands to yours.
          </p>

          {/* Painting reference / brand image */}
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/b821f4e35_IMG_1264.png"
              alt="Fruitful Street by Grand Machadiela"
              className="w-28 h-20 object-cover rounded-xl border-2 border-primary shadow-xl"
            />
            <div>
              <p className="text-muted-foreground text-sm italic">"A Fruitful Street" — Grand Machadiela</p>
              <p className="text-muted-foreground text-xs">Artwork like this, delivered to your door.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <Tabs defaultValue="browse">
          <TabsList className="bg-card border border-border p-1 rounded-xl mb-10 gap-1">
            <TabsTrigger value="browse" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 font-semibold">
              Browse Boxes
            </TabsTrigger>
            <TabsTrigger value="my" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 font-semibold">
              My Subscriptions
            </TabsTrigger>
          </TabsList>

          {/* ─ BROWSE ─ */}
          <TabsContent value="browse" className="space-y-8">
            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search boxes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>

            {/* Theme chips */}
            <div className="flex flex-wrap gap-2">
              {THEMES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setThemeFilter(t.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${themeFilter === t.key ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : activeBoxes.length === 0 ? (
              <div className="text-center py-20 space-y-3 text-muted-foreground">
                <Package className="w-14 h-14 mx-auto opacity-25" />
                <p className="text-xl font-semibold">No boxes found</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                {featuredBoxes.length > 0 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-bold tracking-widest uppercase text-primary">Featured Boxes</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredBoxes.map(box => (
                        <BoxCard key={box.id} box={box} onSubscribe={setSelectedBox} />
                      ))}
                    </div>
                  </div>
                )}
                {otherBoxes.length > 0 && (
                  <div className="space-y-5">
                    {featuredBoxes.length > 0 && (
                      <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">All Boxes</h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherBoxes.map(box => (
                        <BoxCard key={box.id} box={box} onSubscribe={setSelectedBox} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* ─ MY SUBSCRIPTIONS ─ */}
          <TabsContent value="my" className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex-1">
                <p className="text-foreground font-semibold text-sm mb-1">Enter your email to view your subscriptions</p>
                <p className="text-muted-foreground text-xs">We use email to identify your orders.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  placeholder="your@email.com"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  type="email"
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary sm:w-56"
                />
                <Button onClick={() => setUserEmail(emailInput)} className="bg-primary hover:bg-primary/90 font-bold shrink-0">
                  View
                </Button>
              </div>
            </div>
            {userEmail && <MySubscriptionBoxes userEmail={userEmail} />}
          </TabsContent>
        </Tabs>
      </div>

      <SubscribeModal
        box={selectedBox}
        open={!!selectedBox}
        onClose={() => setSelectedBox(null)}
      />
    </div>
  );
}