import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { TIER_CONFIG } from './TierBadge';

const TIER_BENEFITS = {
  bronze: ['1 point per $1 spent', 'Access to standard offers', 'Birthday bonus (50 pts)', 'Monthly newsletter'],
  silver: ['1.5 points per $1 spent', 'All Bronze benefits', 'Early access to new artisan items', '5% discount on next purchase', 'Priority support'],
  gold: ['2 points per $1 spent', 'All Silver benefits', '10% discount on all purchases', 'Free shipping on artisan items', 'Exclusive Gold-only offers', 'Quarterly surprise gift'],
  platinum: ['3 points per $1 spent', 'All Gold benefits', '20% discount on all purchases', 'Personal artisan curator', 'VIP early access to all drops', 'Annual exclusive artisan collection', 'Dedicated account manager'],
};

export default function TierBenefits({ currentTier }) {
  const tiers = ['bronze', 'silver', 'gold', 'platinum'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiers.map(tier => {
        const config = TIER_CONFIG[tier];
        const isCurrentTier = tier === currentTier;
        const isUnlocked = tiers.indexOf(tier) <= tiers.indexOf(currentTier);

        return (
          <Card key={tier} className={`relative border-2 transition-all ${
            isCurrentTier ? 'border-purple-500 shadow-lg scale-105' : isUnlocked ? 'border-green-300' : 'border-gray-200 opacity-60'
          }`}>
            {isCurrentTier && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                Your Tier
              </div>
            )}
            <CardHeader className="pb-2 text-center">
              <div className="text-3xl mb-1">{config.icon}</div>
              <CardTitle className={`text-lg ${config.color}`}>{config.label}</CardTitle>
              <p className="text-xs text-gray-500">{config.minPoints.toLocaleString()}+ points</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {TIER_BENEFITS[tier].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isUnlocked ? 'text-green-500' : 'text-gray-300'}`} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}