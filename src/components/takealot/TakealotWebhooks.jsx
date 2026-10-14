import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Bell, Copy, Check } from 'lucide-react';
import ServerAccessNotice from './ServerAccessNotice';
import { WEBHOOK_ENDPOINT, TAKEALOT_WEBHOOK_TYPES } from '@/lib/takealotReference';

const CARD = 'bg-white rounded-2xl border border-slate-200 p-6 shadow-sm';
const TH = 'text-left text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-200';

export default function TakealotWebhooks() {
  const [copied, setCopied] = useState(false);

  const { data: events = [] } = useQuery({
    queryKey: ['takealot-webhook-events'],
    queryFn: async () => {
      const page = await base44.entities.TakealotWebhookEvent.list({ sort: '-received_at', limit: 20 });
      return page.items;
    },
  });

  const copyEndpoint = async () => {
    await navigator.clipboard.writeText(WEBHOOK_ENDPOINT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <ServerAccessNotice />

      <div className={CARD}>
        <h2 className="font-bold text-slate-900">Webhook endpoint</h2>
        <p className="text-sm text-slate-600 mt-1 mb-4">
          Register this address under Seller API → Webhooks in the Takealot Seller Portal. It receives event payloads
          once server access is active, and each payload is the most current record for that event — no follow-up query
          is needed.
        </p>
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <code className="text-xs font-mono text-slate-800 break-all flex-1">{WEBHOOK_ENDPOINT}</code>
          <button
            type="button"
            onClick={copyEndpoint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white shrink-0"
            style={{ background: copied ? '#0f766e' : '#18241C' }}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className={CARD}>
        <h2 className="font-bold text-slate-900 mb-4">Subscribed events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TAKEALOT_WEBHOOK_TYPES.map(type => (
            <div key={type.key} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-900 text-sm">{type.label}</p>
              <p className="font-mono text-[10px] text-teal-700 mt-0.5">{type.key}</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{type.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={CARD}>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-teal-600" />
          <h2 className="font-bold text-slate-900">Received events</h2>
          <Badge variant="outline" className="border-slate-300 text-slate-700 font-mono ml-auto">
            {events.length}
          </Badge>
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No events received yet. Takealot deliveries appear here as soon as server access is active.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={TH}>
                  <th className="pb-2 pr-4">Event</th>
                  <th className="pb-2 pr-4">Subject</th>
                  <th className="pb-2 pr-4">Received</th>
                  <th className="pb-2">Processed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map(event => (
                  <tr key={event.id}>
                    <td className="py-2.5 pr-4 font-mono text-xs text-teal-700">{event.event_type}</td>
                    <td className="py-2.5 pr-4 text-slate-900">{event.summary || '—'}</td>
                    <td className="py-2.5 pr-4 text-slate-500 text-xs">
                      {event.received_at ? new Date(event.received_at).toLocaleString() : '—'}
                    </td>
                    <td className="py-2.5">
                      <Badge
                        className={
                          event.processed
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }
                      >
                        {event.processed ? 'Yes' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}