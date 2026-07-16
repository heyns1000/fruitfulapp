import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const PAGE_META = {
  Dashboard:         { emoji: '🏠', label: 'Dashboard',        color: 'from-emerald-500 to-teal-600' },
  Marketplace:       { emoji: '🛍️', label: 'Marketplace',      color: 'from-purple-500 to-pink-600' },
  LoyaltyProgram:    { emoji: '🏆', label: 'Loyalty',          color: 'from-amber-500 to-primary' },
  MySubscriptions:   { emoji: '💳', label: 'My Plans',         color: 'from-blue-500 to-indigo-600' },
  OrderHistory:      { emoji: '📦', label: 'Orders',           color: 'from-teal-500 to-cyan-600' },
  SubscriptionBoxes: { emoji: '📮', label: 'Sub Boxes',        color: 'from-pink-500 to-rose-600' },
  Analytics:         { emoji: '📊', label: 'Analytics',        color: 'from-sky-500 to-blue-600' },
  CollaborationSuite:{ emoji: '🤝', label: 'Collaboration',    color: 'from-violet-500 to-purple-600' },
  ContentGenerator:  { emoji: '✨', label: 'AI Content',       color: 'from-fuchsia-500 to-purple-600' },
  EcosystemExplorer: { emoji: '🌐', label: 'Ecosystem',        color: 'from-green-500 to-emerald-600' },
  Gallery:           { emoji: '🖼️', label: 'Gallery',          color: 'from-primary to-pink-500' },
  ArtisanDashboard:  { emoji: '🎨', label: 'My Shop',          color: 'from-red-500 to-primary' },
  Wishlist:          { emoji: '❤️', label: 'Wishlist',         color: 'from-rose-500 to-pink-500' },
};

export default function CrossAppLinks({ pages, title = '🔗 Quick Links' }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-sm">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {pages.map(page => {
          const meta = PAGE_META[page];
          if (!meta) return null;
          return (
            <Link key={page} to={createPageUrl(page)}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r ${meta.color} text-foreground text-xs font-semibold shadow hover:scale-105 transition-transform`}>
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}