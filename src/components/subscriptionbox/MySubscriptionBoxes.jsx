import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, PauseCircle, XCircle, PlayCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_STYLES = {
  active: 'bg-green-700 text-foreground',
  paused: 'bg-yellow-700 text-foreground',
  cancelled: 'bg-red-900 text-red-200',
  pending: 'bg-muted text-foreground',
};

export default function MySubscriptionBoxes({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: subs = [], isLoading } = useQuery({
    queryKey: ['my-box-subscriptions', userEmail],
    queryFn: () => base44.entities.BoxSubscription.filter({ subscriberEmail: userEmail }),
    enabled: !!userEmail,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BoxSubscription.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-box-subscriptions'] }); },
  });

  const handleAction = (sub, action) => {
    const updates = {
      pause: { status: 'paused' },
      resume: { status: 'active' },
      cancel: { status: 'cancelled' },
    };
    updateMutation.mutate({ id: sub.id, data: updates[action] });
    toast.success(action === 'cancel' ? 'Subscription cancelled.' : action === 'pause' ? 'Subscription paused.' : 'Subscription resumed!');
  };

  if (isLoading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!subs.length) return (
    <div className="text-center py-16 text-muted-foreground space-y-2">
      <Package className="w-12 h-12 mx-auto opacity-30" />
      <p className="text-lg font-semibold">No active subscriptions yet.</p>
      <p className="text-sm">Browse the boxes above to get started.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {subs.map(sub => (
        <div key={sub.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h3 className="text-foreground font-bold text-lg">{sub.boxName}</h3>
              <Badge className={`${STATUS_STYLES[sub.status]} border-0 text-xs capitalize`}>{sub.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="capitalize">{sub.billingCycle} · <span className="text-primary font-bold">{sub.currency === 'ZAR' ? 'R' : '$'}{sub.amount}</span></span>
              {sub.nextBillingDate && (
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Next: {sub.nextBillingDate}</span>
              )}
              <span>Boxes shipped: <span className="text-foreground">{sub.boxesShipped || 0}</span></span>
            </div>
            {sub.customizations && Object.keys(sub.customizations).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {Object.entries(sub.customizations).map(([k, v]) => (
                  <span key={k} className="bg-primary/10 border border-primary/30 text-primary text-xs px-2.5 py-0.5 rounded-full">{v}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {sub.status === 'active' && (
              <Button size="sm" variant="outline" onClick={() => handleAction(sub, 'pause')} className="border-yellow-700 text-yellow-400 hover:bg-yellow-900/30 gap-1.5">
                <PauseCircle className="w-3.5 h-3.5" /> Pause
              </Button>
            )}
            {sub.status === 'paused' && (
              <Button size="sm" onClick={() => handleAction(sub, 'resume')} className="bg-green-700 hover:bg-green-600 gap-1.5">
                <PlayCircle className="w-3.5 h-3.5" /> Resume
              </Button>
            )}
            {sub.status !== 'cancelled' && (
              <Button size="sm" variant="outline" onClick={() => handleAction(sub, 'cancel')} className="border-red-800 text-red-400 hover:bg-red-900/30 gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Cancel
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}