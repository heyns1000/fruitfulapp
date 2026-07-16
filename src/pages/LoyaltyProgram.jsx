import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Award, Gift, Trophy, ClipboardList } from 'lucide-react';
import CrossAppLinks from '../components/common/CrossAppLinks';
import PointsOverview from '../components/loyalty/PointsOverview';
import TierBenefits from '../components/loyalty/TierBenefits';
import RewardOffers from '../components/loyalty/RewardOffers';
import PointsHistory from '../components/loyalty/PointsHistory';

const TIER_COLORS = {
  bronze: 'from-fruitful-green to-fruitful-green',
  silver: 'from-muted to-muted',
  gold:   'from-yellow-500 to-fruitful-green',
  platinum: 'from-cyan-400 to-teal-400',
};

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-muted-foreground">Setting up your loyalty account…</span>
      </div>
    );
  }

  const tier = account.tier || 'bronze';
  const tierGradient = TIER_COLORS[tier] || TIER_COLORS.bronze;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-fruitful-mint/50 via-card to-card border-b border-border px-8 md:px-16 py-16">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0d9488 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fruitful-green/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4">Fruitful™ Rewards</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-3" style={{ fontFamily: 'inherit' }}>
              FAA Loyalty<br /><span className="text-primary">Program</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Earn points. Unlock tiers. Get exclusive artisan rewards delivered to your door.
            </p>
          </div>

          {/* Tier badge */}
          <div className={`shrink-0 w-36 h-36 rounded-3xl bg-gradient-to-br ${tierGradient} flex flex-col items-center justify-center shadow-2xl`}>
            <Award className="w-10 h-10 text-foreground mb-1 drop-shadow-md" />
            <p className="text-foreground font-black text-lg capitalize drop-shadow-md">{tier}</p>
            <p className="text-foreground/70 text-xs">Tier</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-10 space-y-8">
        <CrossAppLinks
          title="Explore FAA.ZONE"
          pages={['Dashboard', 'MySubscriptions', 'Marketplace', 'OrderHistory', 'SubscriptionBoxes', 'ArtisanDashboard', 'Wishlist']}
        />

        <PointsOverview account={account} />

        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList className="bg-card border border-border p-1 rounded-xl gap-1">
            {[
              { val: 'offers', label: 'Reward Offers', icon: Gift },
              { val: 'tiers', label: 'Tier Benefits', icon: Trophy },
              { val: 'history', label: 'Points History', icon: ClipboardList },
            ].map(t => {
              const Icon = t.icon;
              return (
                <TabsTrigger key={t.val} value={t.val}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all whitespace-nowrap">
                  <Icon className="w-4 h-4" /> {t.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="offers">
            <RewardOffers account={account} />
          </TabsContent>
          <TabsContent value="tiers">
            <TierBenefits currentTier={tier} />
          </TabsContent>
          <TabsContent value="history">
            <PointsHistory account={account} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}