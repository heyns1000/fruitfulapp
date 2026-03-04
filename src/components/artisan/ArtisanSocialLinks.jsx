import React from 'react';
import { Globe, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-500', prefix: 'https://instagram.com/' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600', prefix: 'https://facebook.com/' },
  { key: 'tiktok', label: 'TikTok', icon: null, color: 'bg-black', prefix: 'https://tiktok.com/@' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-600', prefix: 'https://youtube.com/' },
  { key: 'twitter', label: 'X / Twitter', icon: Twitter, color: 'bg-sky-500', prefix: 'https://twitter.com/' },
  { key: 'website', label: 'Website', icon: Globe, color: 'bg-teal-600', prefix: '' },
];

export default function ArtisanSocialLinks({ socialMedia = {} }) {
  const links = SOCIALS.filter(s => socialMedia[s.key]);
  if (!links.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2">🔗 Connect with This Artisan</h2>
      <div className="flex flex-wrap gap-3">
        {links.map(({ key, label, icon: Icon, color, prefix }) => {
          const handle = socialMedia[key];
          const href = handle.startsWith('http') ? handle : `${prefix}${handle}`;
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 ${color} text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-md`}
            >
              {Icon ? <Icon className="w-4 h-4" /> : <span className="text-base">♪</span>}
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
}