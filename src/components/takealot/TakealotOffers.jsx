import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Tag, Layers } from 'lucide-react';
import ServerAccessNotice from './ServerAccessNotice';
import { BATCH_MAX_UPDATES } from '@/lib/takealotReference';

const CARD = 'bg-white rounded-2xl border border-slate-200 p-6 shadow-sm';
const TH = 'text-left text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-200';

const money = value => (value === undefined || value === null ? '—' : `R${Number(value).toFixed(2)}`);

export default function TakealotOffers() {
  const { data: offers = [] } = useQuery({
    queryKey: ['takealot-offers'],
    queryFn: async () => {
      const page = await base44.entities.TakealotOffer.list({ sort: '-synced_at', limit: 50 });
      return page.items;
    },
  });

  const { data: batches = [] } = useQuery({
    queryKey: ['takealot-batches'],
    queryFn: async () => {
      const page = await base44.entities.TakealotBatch.list({ sort: '-created_date', limit: 20 });
      return page.items;
    },
  });

  return (
    <div className="space-y-6">
      <ServerAccessNotice />

      <div className={CARD}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">Offer management</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              A single offer is updated by its offer_id. Bulk changes go through a batch of up to{' '}
              {BATCH_MAX_UPDATES.toLocaleString()} updates, and the Batch Completed webhook confirms the outcome.
              Everything here acts on the live seller account.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled
              title="Needs server access"
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white opacity-50 cursor-not-allowed"
              style={{ background: '#18241C' }}
            >
              Update offer
            </button>
            <button
              type="button"
              disabled
              title="Needs server access"
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 opacity-50 cursor-not-allowed"
            >
              Submit batch
            </button>
          </div>
        </div>
      </div>

      <div className={CARD}>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-teal-600" />
          <h2 className="font-bold text-slate-900">Offers on Takealot</h2>
          <Badge variant="outline" className="border-slate-300 text-slate-700 font-mono ml-auto">
            {offers.length}
          </Badge>
        </div>
        {offers.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No offers stored yet. The first import fills this list.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={TH}>
                  <th className="pb-2 pr-4">Offer ID</th>
                  <th className="pb-2 pr-4">SKU</th>
                  <th className="pb-2 pr-4">Title</th>
                  <th className="pb-2 pr-4">Selling price</th>
                  <th className="pb-2 pr-4">RRP</th>
                  <th className="pb-2 pr-4">Leadtime</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offers.map(offer => (
                  <tr key={offer.id}>
                    <td className="py-2.5 pr-4 font-mono text-xs text-teal-700">{offer.offer_id}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-slate-600">{offer.sku}</td>
                    <td className="py-2.5 pr-4 text-slate-900">{offer.title}</td>
                    <td className="py-2.5 pr-4 font-semibold text-slate-900">{money(offer.selling_price)}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{money(offer.rrp)}</td>
                    <td className="py-2.5 pr-4 text-slate-600">
                      {offer.leadtime_days ?? '—'} days · {offer.leadtime_stock_on_hand ?? '—'} in stock
                    </td>
                    <td className="py-2.5 text-slate-600">{offer.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={CARD}>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-teal-600" />
          <h2 className="font-bold text-slate-900">Batch submissions</h2>
        </div>
        {batches.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No batches submitted yet. Completed batches are confirmed by the Batch Completed webhook.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={TH}>
                  <th className="pb-2 pr-4">Batch ID</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Updates</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map(batch => (
                  <tr key={batch.id}>
                    <td className="py-2.5 pr-4 font-mono text-xs text-teal-700">{batch.batch_id}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{batch.batch_type?.replace('_', ' ')}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{batch.update_count ?? 0}</td>
                    <td className="py-2.5 pr-4 text-slate-600 capitalize">{batch.status}</td>
                    <td className="py-2.5 text-slate-500 text-xs">
                      {batch.completed_at ? new Date(batch.completed_at).toLocaleString() : '—'}
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