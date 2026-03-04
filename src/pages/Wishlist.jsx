import React, { useState } from 'react';
import { useWishlist } from '../components/wishlist/WishlistContext';
import { useCart } from '../components/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2, Share2, Package, Copy, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [copied, setCopied] = useState(false);

  const shareWishlist = () => {
    const items = wishlist.map(i => `• ${i.serviceName || i.name} — $${i.price || i.pricing?.USD || 0}`).join('\n');
    const text = `My FAA.ZONE Wishlist 🛒\n\n${items}\n\nShop at: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({ title: 'My FAA.ZONE Wishlist', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        toast.success('Wishlist copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const shareLink = () => {
    const ids = wishlist.map(i => i.id).join(',');
    const url = `${window.location.origin}${createPageUrl('Wishlist')}?shared=${ids}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Wishlist link copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 border-b border-stone-700 px-6 md:px-10 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">My Account</p>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Heart className="w-9 h-9 text-orange-500 fill-orange-500" /> Wishlist
            </h1>
            <p className="text-stone-400 mt-1">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
          </div>
          {wishlist.length > 0 && (
            <div className="flex gap-3">
              <Button onClick={shareWishlist} variant="outline"
                className="border-stone-600 text-stone-300 hover:border-orange-500 hover:text-white gap-2">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy List'}
              </Button>
              <Button onClick={shareLink}
                className="bg-orange-600 hover:bg-orange-500 text-white gap-2">
                <Share2 className="w-4 h-4" /> Share Wishlist
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-10">
        {wishlist.length === 0 ? (
          <div className="text-center py-28">
            <Heart className="w-20 h-20 text-stone-700 mx-auto mb-5" />
            <h2 className="text-2xl font-black text-stone-400 mb-2">Your wishlist is empty</h2>
            <p className="text-stone-500 mb-8">Save items you love while browsing the marketplace</p>
            <Link to={createPageUrl('Marketplace')}>
              <Button className="bg-orange-600 hover:bg-orange-500 text-white px-8 text-base">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Share info banner */}
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-4 flex items-center gap-3 mb-8 text-sm text-stone-400">
              <ExternalLink className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span>Share your wishlist with friends using the <strong className="text-white">Share Wishlist</strong> button above — they'll see everything you've saved.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlist.map(item => {
                const price = item.price || item.pricing?.USD || 0;
                return (
                  <div key={item.id} className="bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden hover:border-orange-600 transition-all group">
                    <div className="aspect-square bg-stone-800 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.serviceName || item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-14 h-14 text-stone-600" />
                        </div>
                      )}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 w-9 h-9 bg-stone-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-400 hover:bg-red-900 hover:text-red-200 transition-all border border-stone-700"
                      >
                        <Heart className="w-4 h-4 fill-red-400" />
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-white leading-tight">{item.serviceName || item.name}</h3>
                        {item.brandName && (
                          <Link to={createPageUrl(`ArtisanProfile?brandName=${encodeURIComponent(item.brandName)}`)}>
                            <p className="text-orange-400 text-sm hover:underline">{item.brandName}™</p>
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-orange-400">${price}</span>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => removeFromWishlist(item.id)}
                            variant="outline" className="border-stone-600 text-stone-400 hover:border-red-600 hover:text-red-400 px-2">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" onClick={() => { addToCart({ id: item.id, name: item.serviceName || item.name, price, productCode: item.productCode, imageUrl: item.imageUrl, brandName: item.brandName }); }}
                            className="bg-orange-600 hover:bg-orange-500 text-white gap-1.5">
                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add all to cart */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => {
                  wishlist.forEach(item => addToCart({ id: item.id, name: item.serviceName || item.name, price: item.price || item.pricing?.USD || 0, productCode: item.productCode, imageUrl: item.imageUrl, brandName: item.brandName }));
                  toast.success('All wishlist items added to cart!');
                }}
                className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-3 text-base font-bold gap-2"
              >
                <ShoppingCart className="w-5 h-5" /> Add All to Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}