import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, Globe, Package, ShieldCheck, Star, Plus, Zap, Heart } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { useWishlist } from '@/components/wishlist/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', ZAR: 'R' };

export default function GrandMashadlelaCollection() {
  const [currency, setCurrency] = useState('ZAR');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const { data: allServices = [], isLoading } = useQuery({
    queryKey: ['grand-mashadlela-products'],
    queryFn: () => base44.entities.MarketplaceService.filter({ brandName: 'Grand Mashadlela' }),
  });

  const products = allServices.filter(s => s.status === 'active');

  const buyNow = (service) => {
    const price = service.pricing?.[currency] || service.pricing?.USD || 0;
    addToCart({ id: service.id, name: service.serviceName, price, productCode: service.productCode, imageUrl: service.imageUrl, brandName: service.brandName });
    navigate(createPageUrl('Checkout'));
  };

  const sym = CURRENCY_SYMBOLS[currency] || 'R';

  return (
    <div className="min-h-screen bg-gradient-to-br from-fruitful-green/5 via-background to-primary/5">

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-card via-transparent to-card text-foreground py-16 px-6 text-center overflow-hidden">
        {products[11]?.imageUrl && (
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `url(${products[11].imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          <Badge className="bg-fruitful-green text-primary-foreground mb-4 text-xs tracking-widest px-3 py-1">SEEDWAVE ORIGINALS · FRUITFUL ECOSYSTEM</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Grand Mashadlela</h1>
          <p className="text-fruitful-green text-lg mb-2 italic">"The Township Chronicler"</p>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            Original oil paintings acquired directly from the artist. Each piece documents the living pulse of South African township life —
            Soweto markets, homeland rondavels, sunset settlements, and the Fruitful™ brand on the hill.
          </p>
        </div>
      </div>

      {/* Subscription unlock notice */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="bg-white border border-fruitful-green/30 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-fruitful-green/10 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-fruitful-green" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">Subscription-Gated Physical Artwork</p>
            <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
              These are one-of-a-kind original paintings. Purchase is only available to active <strong>Professional</strong> (≥ $89/mo) or <strong>Enterprise</strong> subscribers within the Seedwave / FAA.ZONE ecosystem.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Badge className="bg-muted text-muted-foreground text-[10px]">Starter: ✗</Badge>
            <Badge className="bg-fruitful-green text-primary-foreground text-[10px]">Professional: ✓</Badge>
            <Badge className="bg-green-700 text-foreground text-[10px]">Enterprise: ✓</Badge>
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-foreground">
            The Collection · {isLoading ? '…' : products.length} Originals
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Currency:</span>
            {Object.keys(CURRENCY_SYMBOLS).map(c => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${currency === c ? 'bg-fruitful-green text-primary-foreground border-fruitful-green/40' : 'bg-white text-muted-foreground border-border hover:border-fruitful-green'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-fruitful-green" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No products found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => {
              const price = product.pricing?.[currency] || product.pricing?.ZAR || 0;
              return (
                <motion.div key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-border overflow-hidden flex flex-col">

                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img src={product.imageUrl} alt={product.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-fruitful-green text-primary-foreground text-[10px] px-2">{product.productCode}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/70 text-foreground text-[10px] px-2 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Original
                      </Badge>
                    </div>
                    <button onClick={() => toggleWishlist(product)}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:scale-110 transition-all">
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">{product.serviceName}</h3>
                    <p className="text-[11px] text-muted-foreground mb-2">by <span className="italic font-medium text-foreground">Grand Mashadlela</span> · Oil on Board/Canvas · Hand-signed · 1 of 1</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1 mb-3">{product.description}</p>

                    <div className="mt-auto">
                      <p className="text-xl font-extrabold text-fruitful-green">{sym}{price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mb-2">{currency} · excl. ~$30 global shipping</p>
                      <div className="flex items-center gap-1.5 mb-3 text-[10px] text-fruitful-green font-medium">
                        <Lock className="w-3 h-3" />
                        <span>Professional / Enterprise plan required</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"
                          onClick={() => addToCart({ id: product.id, name: product.serviceName, price, productCode: product.productCode, imageUrl: product.imageUrl, brandName: product.brandName })}
                          className="border-fruitful-green/40 text-fruitful-green hover:bg-fruitful-green/10 flex-1 gap-1">
                          <Plus className="w-3 h-3" /> Cart
                        </Button>
                        <Button size="sm" onClick={() => buyNow(product)}
                          className="bg-fruitful-green hover:bg-fruitful-green text-primary-foreground flex-1 gap-1">
                          <Zap className="w-3 h-3" /> Buy
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Artist note */}
      <div className="max-w-3xl mx-auto px-6 pb-14 text-center">
        <div className="bg-card text-muted-foreground rounded-2xl p-8">
          <Star className="w-6 h-6 text-fruitful-green mx-auto mb-3" />
          <p className="italic text-sm leading-relaxed">
            "Grand Mashadlela's work is a living archive of South African township identity — painted with acrylic on board and canvas,
            these small-format originals carry the weight of a people's story."
          </p>
          <p className="text-fruitful-green font-semibold text-xs mt-4 tracking-widest">FAA.ZONE™ SEEDWAVE ORIGINALS PROGRAMME</p>
        </div>
      </div>
    </div>
  );
}