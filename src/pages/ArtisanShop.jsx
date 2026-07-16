import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, ShieldCheck, Globe, Package, Star, Plus, Zap, Heart } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { useWishlist } from '@/components/wishlist/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', ZAR: 'R', NGN: '₦', KES: 'KSh' };

export default function ArtisanShop() {
  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('brandName') || '';
  const [currency, setCurrency] = useState('USD');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const { data: artisans = [], isLoading: artisanLoading } = useQuery({
    queryKey: ['artisan-profile', brandName],
    queryFn: () => base44.entities.ArtisanProfile.list(),
  });

  const { data: allServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['artisan-shop-services', brandName],
    queryFn: () => base44.entities.MarketplaceService.list('-created_date'),
  });

  const artisan = artisans.find(a =>
    a.brandName?.toLowerCase() === brandName.toLowerCase() ||
    a.artisanName?.toLowerCase() === brandName.toLowerCase()
  );

  // Strict: only products explicitly linked to this artisan's brandId
  const products = allServices.filter(s =>
    s.status === 'active' &&
    s.brandId &&
    artisan?.brandId &&
    s.brandId === artisan.brandId
  );

  const buyNow = (service) => {
    const price = service.pricing?.[currency] || service.pricing?.USD || 0;
    addToCart({ id: service.id, name: service.serviceName, price, productCode: service.productCode, imageUrl: service.imageUrl, brandName: service.brandName });
    navigate(createPageUrl('Checkout'));
  };

  if (artisanLoading || servicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-fruitful-green" />
      </div>
    );
  }

  if (!artisan && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Artisan not found: <strong>{brandName}</strong></p>
          <Button className="mt-4" onClick={() => navigate(createPageUrl('Marketplace'))}>Back to Marketplace</Button>
        </div>
      </div>
    );
  }

  const sym = CURRENCY_SYMBOLS[currency] || '$';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-transparent to-card">

      {/* Hero */}
      <div className="relative overflow-hidden bg-card border-b border-border">
        {artisan?.workshopImageUrl && (
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `url(${artisan.workshopImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {artisan?.profileImageUrl && (
            <img src={artisan.profileImageUrl} alt={artisan.artisanName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-fruitful-green/30 shadow-xl shrink-0" />
          )}
          <div className="text-center md:text-left">
            <Badge className="bg-fruitful-green text-primary-foreground text-xs tracking-widest px-3 mb-3">ARTISAN SHOP</Badge>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-1">
              {artisan?.artisanName || brandName}
            </h1>
            {artisan?.title && <p className="text-fruitful-green text-base italic mb-2">{artisan.title}</p>}
            {artisan?.location && (
              <p className="text-muted-foreground text-sm flex items-center gap-1 justify-center md:justify-start mb-3">
                <MapPin className="w-3 h-3" />{artisan.location}
              </p>
            )}
            {artisan?.soulMessage && (
              <p className="text-muted-foreground text-sm italic max-w-xl leading-relaxed">"{artisan.soulMessage}"</p>
            )}
            <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
              <Badge className="bg-muted text-muted-foreground border border-border">{products.length} products</Badge>
              {artisan?.featured && <Badge className="bg-fruitful-green text-primary-foreground">⭐ Featured Artisan</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Biography strip */}
      {artisan?.biography && (
        <div className="bg-card/60 border-b border-border px-6 py-5">
          <div className="max-w-5xl mx-auto">
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{artisan.biography}</p>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-foreground">All Products · {products.length} items</h2>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Currency:</span>
            <div className="flex gap-1">
              {Object.keys(CURRENCY_SYMBOLS).map(c => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${currency === c ? 'bg-fruitful-green text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No active products listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => {
              const price = product.pricing?.[currency] || product.pricing?.USD || 0;
              return (
                <motion.div key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-fruitful-green/40 hover:shadow-xl transition-all group">

                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.serviceName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-fruitful-green text-primary-foreground text-[10px] px-2">{product.productCode}</Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Badge className="bg-black/70 text-foreground text-[10px] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {product.category?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <button onClick={() => toggleWishlist(product)}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-2">{product.serviceName}</h3>
                    <p className="text-muted-foreground text-xs line-clamp-2 flex-1">{product.description}</p>

                    {product.delivery && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {product.delivery.type} · ~{product.delivery.estimatedDays} days
                      </p>
                    )}

                    <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xl font-extrabold text-fruitful-green">{sym}{price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{currency}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline"
                          onClick={() => addToCart({ id: product.id, name: product.serviceName, price, productCode: product.productCode, imageUrl: product.imageUrl, brandName: product.brandName })}
                          className="border-fruitful-green/40 text-fruitful-green hover:bg-fruitful-green/10 px-2">
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={() => buyNow(product)}
                          className="bg-fruitful-green hover:bg-fruitful-green text-primary-foreground px-3 gap-1">
                          <Zap className="w-3 h-3" />Buy
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

      {/* Artisan credentials */}
      {artisan?.signatureTechniques?.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-14">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-fruitful-green font-bold text-sm mb-3 tracking-widest uppercase">Signature Techniques</h3>
            <div className="flex flex-wrap gap-2">
              {artisan.signatureTechniques.map((t, i) => (
                <Badge key={i} className="bg-muted text-muted-foreground border border-border">{t}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}