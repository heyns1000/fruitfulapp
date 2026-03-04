import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function FollowArtisan({ artisanId, artisanName }) {
  const STORAGE_KEY = 'faa_followed_artisans';

  const getFollowed = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  };

  const [isFollowing, setIsFollowing] = useState(() => getFollowed().includes(artisanId));
  const [justFollowed, setJustFollowed] = useState(false);

  const toggle = () => {
    const followed = getFollowed();
    if (isFollowing) {
      const updated = followed.filter(id => id !== artisanId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setIsFollowing(false);
      toast.info(`Unfollowed ${artisanName}`);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...followed, artisanId]));
      setIsFollowing(true);
      setJustFollowed(true);
      toast.success(`Following ${artisanName}! You'll be notified of new products. 🔔`);
      setTimeout(() => setJustFollowed(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        onClick={toggle}
        className={`gap-2 font-bold px-6 py-2.5 rounded-xl transition-all ${
          isFollowing
            ? 'bg-stone-800 border border-orange-600 text-orange-400 hover:bg-red-900/30 hover:border-red-600 hover:text-red-400'
            : 'bg-orange-600 hover:bg-orange-500 text-white'
        }`}
      >
        {isFollowing ? (
          justFollowed ? <><Check className="w-4 h-4" /> Following!</> : <><BellOff className="w-4 h-4" /> Unfollow</>
        ) : (
          <><Bell className="w-4 h-4" /> Follow Artisan</>
        )}
      </Button>
      {isFollowing && (
        <p className="text-xs text-orange-400 flex items-center gap-1">
          <Bell className="w-3 h-3" /> You follow {artisanName.split(' ')[0]} — new products will notify you
        </p>
      )}
    </div>
  );
}