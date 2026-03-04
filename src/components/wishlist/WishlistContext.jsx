import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('faa_wishlist') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('faa_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (item) => {
    setWishlist(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      toast.success(`${item.serviceName || item.name} added to wishlist ❤️`);
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(i => i.id !== id));
    toast.info('Removed from wishlist');
  };

  const isInWishlist = (id) => wishlist.some(i => i.id === id);

  const toggleWishlist = (item) => {
    if (isInWishlist(item.id)) removeFromWishlist(item.id);
    else addToWishlist(item);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}