import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles, Lock } from 'lucide-react';
import TierBadge from './TierBadge';
import { toast } from 'sonner';

const TIERS_ORDER = ['bronze', 'silver', 'gold', 'platinum'];

export default function RewardOffers({ account }) {
  const queryClient = useQueryClient();

  const { data: offers = [] } = useQuery({
    queryKey: ['reward-offers'],
    queryFn: () => base44.entities.RewardOffer.filter({ status: 'active' })
  });

  const redeemMutation = useMutation({
    mutationFn: async (offer) => {
      const newPoints = (account.availablePoints || 0) - offer.pointsCost;
      const newRedeemed = [...(account.redeemedOffers || []), offer.id];
      await base44.entities.LoyaltyAccount.update(account.id, {
        availablePoints: newPoints,
        redeemedOffers: newRedeemed,
        pointsHistory: [...(account.pointsHistory || []), {
          date: new Date().toISOString(),
          action: 'redeem',
          points: -offer.pointsCost,
          description: `Redeemed: ${offer.title}`
        }]
      });
      await base44.entities.RewardOffer.update(offer.id, { timesRedeemed: (offer.timesRedeemed || 0) + 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-loyalty-account'] });
      queryClient.invalidateQueries({ queryKey: ['reward-offers'] });
      toast.success('Offer redeemed successfully! 🎉');
    }
  });

  const canAccess = (offer) => TIERS_ORDER.indexOf(account?.tier || 'bronze') >= TIERS_ORDER.indexOf(offer.minimumTier);
  const hasRedeemed = (offer) => (account?.redeemedOffers || []).includes(offer.id);
  const canAfford = (offer) => (account?.availablePoints || 0) >= offer.pointsCost;

  const OFFER_TYPE_ICONS = {
    discount: '🏷️', free_item: '🎁', bonus_points: '⭐', early_access: '🚀', exclusive_product: '💎'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-bold text-gray-800">Personalized Reward Offers</h2>
      </div>

      {offers.length === 0 && (
        <Card className="text-center py-10 text-gray-500">
          <Gift className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No active offers right now. Check back soon!</p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map(offer => {
          const accessible = canAccess(offer);
          const redeemed = hasRedeemed(offer);
          const affordable = canAfford(offer);

          return (
            <Card key={offer.id} className={`border-2 transition-all ${
              redeemed ? 'border-green-300 bg-green-50' : accessible ? 'border-purple-200 hover:shadow-md' : 'border-gray-200 opacity-70'
            }`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <span className="text-2xl">{OFFER_TYPE_ICONS[offer.offerType] || '🎁'}</span>
                  <TierBadge tier={offer.minimumTier} />
                </div>
                <CardTitle className="text-base mt-2">{offer.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-700">{offer.pointsCost} pts</span>
                  {offer.expiryDate && (
                    <span className="text-xs text-gray-400">Expires {offer.expiryDate}</span>
                  )}
                </div>
                {!accessible ? (
                  <Button disabled size="sm" className="w-full" variant="outline">
                    <Lock className="w-3 h-3 mr-1" /> Requires {offer.minimumTier} tier
                  </Button>
                ) : redeemed ? (
                  <Button disabled size="sm" className="w-full bg-green-100 text-green-700 border-green-300" variant="outline">
                    ✓ Redeemed
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!affordable || redeemMutation.isPending}
                    onClick={() => redeemMutation.mutate(offer)}
                  >
                    {affordable ? 'Redeem Offer' : `Need ${offer.pointsCost - (account?.availablePoints || 0)} more pts`}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}