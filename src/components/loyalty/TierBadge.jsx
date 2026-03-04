import React from 'react';
import { cn } from '@/lib/utils';

const TIER_CONFIG = {
  bronze: { label: 'Bronze', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-300', icon: '🥉', minPoints: 0 },
  silver: { label: 'Silver', color: 'text-gray-600', bg: 'bg-gray-100 border-gray-300', icon: '🥈', minPoints: 500 },
  gold: { label: 'Gold', color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-300', icon: '🥇', minPoints: 1500 },
  platinum: { label: 'Platinum', color: 'text-purple-700', bg: 'bg-purple-100 border-purple-300', icon: '💎', minPoints: 5000 },
};

export { TIER_CONFIG };

export default function TierBadge({ tier, size = 'sm' }) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.bronze;
  return (
    <span className={cn(
      'inline-flex items-center gap-1 border rounded-full font-semibold',
      config.bg, config.color,
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
    )}>
      {config.icon} {config.label}
    </span>
  );
}