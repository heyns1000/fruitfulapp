import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { differenceInDays, isPast, parseISO } from 'date-fns';

export default function DeliveryCountdown({ estimatedDelivery, status }) {
  if (!estimatedDelivery) return null;

  const date = parseISO(estimatedDelivery);
  const days = differenceInDays(date, new Date());
  const delivered = status === 'delivered';
  const overdue = !delivered && isPast(date);

  return (
    <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 border ${
      delivered ? 'bg-green-900/20 border-green-700 text-green-400' :
      overdue   ? 'bg-red-900/20 border-red-700 text-red-400' :
                  'bg-primary/10 border-primary text-primary'
    }`}>
      {delivered ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Calendar className="w-4 h-4 shrink-0" />}
      {delivered
        ? 'Delivered!'
        : overdue
        ? `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`
        : days === 0
        ? 'Expected today!'
        : `Arrives in ${days} day${days !== 1 ? 's' : ''}`
      }
      <span className="text-xs opacity-60 ml-1">
        ({new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})
      </span>
    </div>
  );
}