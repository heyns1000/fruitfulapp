import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, ShoppingBag } from 'lucide-react';
import TierBadge, { TIER_CONFIG } from './TierBadge';

export default function PointsOverview({ account }) {
  const tiers = ['bronze', 'silver', 'gold', 'platinum'];
  const currentTierIndex = tiers.indexOf(account.tier || 'bronze');
  const nextTier = tiers[currentTierIndex + 1];
  const nextTierConfig = nextTier ? TIER_CONFIG[nextTier] : null;
  const currentPoints = account.totalPoints || 0;
  const progress = nextTierConfig
    ? Math.min(100, ((currentPoints - TIER_CONFIG[account.tier].minPoints) /
        (nextTierConfig.minPoints - TIER_CONFIG[account.tier].minPoints)) * 100)
    : 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2 bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">My Loyalty Status</span>
            <TierBadge tier={account.tier || 'bronze'} size="md" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="text-5xl font-extrabold">{(account.availablePoints || 0).toLocaleString()}</span>
            <span className="text-lg opacity-80 mb-1">available pts</span>
          </div>
          <p className="text-sm opacity-80">{(currentPoints).toLocaleString()} total earned lifetime</p>

          {nextTierConfig && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextTierConfig.icon} {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}</span>
                <span>{nextTierConfig.minPoints - currentPoints} pts needed</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/30" />
            </div>
          )}
          {!nextTierConfig && (
            <p className="text-sm font-semibold opacity-90">💎 You've reached the highest tier!</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-medium">Total Purchases</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{account.purchaseCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Total Spend</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">${(account.totalSpend || 0).toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}