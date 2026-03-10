import React from 'react';
import { CheckCircle2, Circle, Clock, Hammer, Package, Truck, Star, XCircle } from 'lucide-react';

const STEPS = [
  { status: 'pending',    label: 'Order Placed',  desc: 'Your order has been received',         icon: Clock },
  { status: 'confirmed',  label: 'Confirmed',      desc: 'Payment confirmed by the seller',      icon: CheckCircle2 },
  { status: 'processing', label: 'Processing',     desc: 'Artisan is preparing your order',      icon: Package },
  { status: 'crafted',    label: 'Crafted',        desc: 'Your piece has been handcrafted',      icon: Hammer },
  { status: 'shipped',    label: 'Shipped',        desc: 'Your order is on its way',             icon: Truck },
  { status: 'delivered',  label: 'Delivered',      desc: 'Enjoy your @Fruitful@ piece!',         icon: Star },
];

const STATUS_ORDER = STEPS.map(s => s.status);

export default function OrderTimeline({ order }) {
  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-stone-800" />

      <div className="space-y-0">
        {STEPS.map((step, i) => {
          const isDone = !isCancelled && currentIdx >= i;
          const isCurrent = !isCancelled && currentIdx === i;
          const Icon = step.icon;

          // Find matching history entry
          const historyEntry = order.statusHistory?.find(h => h.status === step.status);
          const timestamp = historyEntry?.timestamp || (isDone && i === 0 ? order.created_date : null);

          return (
            <div key={step.status} className="relative flex items-start gap-4 pb-7 last:pb-0">
              {/* Node */}
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                isCurrent
                  ? 'bg-orange-600 border-orange-500 shadow-lg shadow-orange-500/40'
                  : isDone
                  ? 'bg-orange-600/20 border-orange-600'
                  : 'bg-stone-900 border-stone-700'
              }`}>
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : isDone ? 'text-orange-400' : 'text-stone-600'}`} />
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`font-bold text-sm ${isDone ? 'text-white' : 'text-stone-600'}`}>
                    {step.label}
                    {isCurrent && <span className="ml-2 text-orange-400 text-xs">← Current</span>}
                  </p>
                  {timestamp && (
                    <span className="text-xs text-stone-600 shrink-0">
                      {new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${isDone ? 'text-stone-400' : 'text-stone-700'}`}>{step.desc}</p>
                {historyEntry?.note && (
                  <p className="text-xs text-orange-300 mt-1 italic">"{historyEntry.note}"</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Cancelled state */}
        {isCancelled && (
          <div className="relative flex items-start gap-4 pt-2">
            <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 bg-red-900/30 border-red-700">
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <div className="pt-1.5">
              <p className="font-bold text-sm text-red-400">{order.status === 'refunded' ? 'Refunded' : 'Cancelled'}</p>
              <p className="text-xs text-stone-500 mt-0.5">{order.notes || 'Order was cancelled'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}