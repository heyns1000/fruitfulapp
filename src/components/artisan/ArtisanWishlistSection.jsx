import React from 'react';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '../wishlist/WishlistContext';
import { useCart } from '../cart/CartContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ArtisanWishlistSection({ artisanName, brandId }) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  // Filter wishlist to only items from this artisan's brand
  const artisanWishlistItems = wishlist.filter(item =>
    item.brandId === brandId || item.brandName === artisanName
  );

  if (artisanWishlistItems.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-pink-500 mb-1">Your Saves</p>
          <h2 className="text-3xl font-black text-foreground flex items-center gap-2">
            <Heart className="w-6 h-6 fill-pink-500 text-pink-500" />
            Wishlisted from {artisanName.split(' ')[0]}
          </h2>
        </div>
        <Badge className="bg-pink-900/50 border border-pink-700 text-pink-300 text-sm px-3 py-1">
          {artisanWishlistItems.length} item{artisanWishlistItems.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {artisanWishlistItems.map(item => {
          const price = item.pricing?.USD || item.pricing?.ZAR || 0;
          const currencySymbol = item.pricing?.USD ? '$' : 'R';
          return (
            <div key={item.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-pink-600 transition-all duration-300 hover:-translate-y-0.5">
              <div className="relative aspect-square bg-muted overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.serviceName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-pink-400 hover:bg-red-900/80 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-foreground text-sm leading-snug">{item.serviceName}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-primary">{currencySymbol}{price}</span>
                  <Button
                    size="sm"
                    onClick={() => { addItem({ ...item, quantity: 1 }); }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold gap-1.5 px-3"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Link to={createPageUrl('Wishlist')}>
          <Button variant="outline" className="border-pink-700 text-pink-400 hover:bg-pink-950/30 gap-2">
            <Heart className="w-4 h-4 fill-pink-400" /> View Full Wishlist
          </Button>
        </Link>
      </div>
    </div>
  );
}