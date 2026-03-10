import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Award } from 'lucide-react';
import BackButton from '../components/navigation/BackButton';
import CrossAppLinks from '../components/common/CrossAppLinks';
import PointsOverview from '../components/loyalty/PointsOverview';
import TierBenefits from '../components/loyalty/TierBenefits';
import RewardOffers from '../components/loyalty/RewardOffers';
import PointsHistory from '../components/loyalty/PointsHistory';

const TIER_THRESHOLDS = { bronze: 0, silver: 500, gold: 1500, platinum: 5000 };

function computeTier(totalPoints) {
  if (totalPoints >= 5000) return 'platinum';
  if (totalPoints >= 1500) return 'gold';
  if (totalPoints >= 500) return 'silver';
  return 'bronze';
}

export default function LoyaltyProgram() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['my-loyalty-account'],
    queryFn: () => base44.entities.LoyaltyAccount.filter({ userEmail: user?.email }),
    enabled: !!user?.email
  });

  const account = accounts[0];

  const createAccountMutation = useMutation({
    mutationFn: () => base44.entities.LoyaltyAccount.create({
      userId: user.id,
      userEmail: user.email,
      userName: user.full_name || user.email,
      totalPoints: 0,
      availablePoints: 0,
      tier: 'bronze',
      totalSpend: 0,
      purchaseCount: 0,
      pointsHistory: [],
      redeemedOffers: [],
      preferences: []
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-loyalty-account'] })
  });

  useEffect(() => {
    if (user && accounts.length === 0 && !isLoading) {
      createAccountMutation.mutate();
    }
  }, [user, accounts, isLoading]);

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-500">Setting up your loyalty account...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 text-white py-8 shadow-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Award className="w-10 h-10 drop-shadow-lg" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">FAA Loyalty Program</h1>
                <p className="text-sm sm:text-lg opacity-90 mt-1">Earn points. Unlock tiers. Get exclusive artisan rewards.</p>
              </div>
            </div>
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png" alt="FAA" className="w-10 h-10 object-contain opacity-90" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <BackButton />
        <CrossAppLinks
          title="🔗 Explore FAA.ZONE"
          pages={['Dashboard', 'MySubscriptions', 'Marketplace', 'OrderHistory', 'SubscriptionBoxes', 'ArtisanDashboard', 'Wishlist']}
        />
        <PointsOverview account={account} />

        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList className="bg-white shadow rounded-lg p-1">
            <TabsTrigger value="offers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              🎁 Reward Offers
            </TabsTrigger>
            <TabsTrigger value="tiers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              🏆 Tier Benefits
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              📋 Points History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offers">
            <RewardOffers account={account} />
          </TabsContent>

          <TabsContent value="tiers">
            <TierBenefits currentTier={account.tier || 'bronze'} />
          </TabsContent>

          <TabsContent value="history">
            <PointsHistory account={account} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}