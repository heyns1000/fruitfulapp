import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, CalendarRange } from 'lucide-react';
import ServerAccessNotice from './ServerAccessNotice';
import { TAKEALOT_RESOURCES, MAX_DATE_WINDOW_DAYS } from '@/lib/takealotReference';

const CARD = 'bg-white rounded-2xl border border-slate-200 p-6 shadow-sm';

export default function TakealotDataSync() {
  const { data: counts = {} } = useQuery({
    queryKey: ['takealot-resource-counts'],
    queryFn: async () => {
      const [offers, sales, transactions, returns, shipments] = await Promise.all([
        base44.entities.TakealotOffer.count({}),
        base44.entities.TakealotSale.count({}),
        base44.entities.TakealotTransaction.count({}),
        base44.entities.TakealotReturn.count({}),
        base44.entities.TakealotShipment.count({}),
      ]);
      return { offers, sales, transactions, returns, shipments };
    },
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['takealot-sync-log'],
    queryFn: async () => {
      const page = await base44.entities.SyncLog.filter(
        { client_name: 'Takealot' },
        { sort: '-created_date', limit: 20 }
      );
      return page.items;
    },
  });

  return (
    <div className="space-y-6">
      <ServerAccessNotice />

      <div className={CARD}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">Initial import</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Each date-filtered resource is pulled in {MAX_DATE_WINDOW_DAYS}-day windows, newest last, paging through
              every window until no records remain. This runs once; later changes arrive by webhook.
            </p>
          </div>
          <button
            type="button"
            disabled
            title="Needs server access"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white opacity-50 cursor-not-allowed"
            style={{ background: '#18241C' }}
          >
            <RefreshCw className="w-4 h-4" /> Run import
          </button>
        </div>
        <div className="mt-4">
          <ServerAccessNotice compact />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TAKEALOT_RESOURCES.map(resource => (
          <div key={resource.key} className={CARD}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">{resource.label}</h3>
              </div>
              <Badge variant="outline" className="border-slate-300 text-slate-700 font-mono">
                {counts[resource.key] ?? 0}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{resource.detail}</p>
            {resource.dateWindowed && (
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-3">
                <CalendarRange className="w-3.5 h-3.5" /> Max {MAX_DATE_WINDOW_DAYS} days per request
              </p>
            )}
          </div>
        ))}
      </div>

      <div className={CARD}>
        <h2 className="font-bold text-slate-900 mb-4">Sync history</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No Takealot sync activity recorded yet. Runs appear here as soon as server access is active.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-200">
                  <th className="pb-2 pr-4">Resource</th>
                  <th className="pb-2 pr-4">Direction</th>
                  <th className="pb-2 pr-4">Records</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="py-2.5 pr-4 font-semibold text-slate-900 capitalize">{log.resource}</td>
                    <td className="py-2.5 pr-4 text-slate-600 capitalize">{log.direction}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{log.record_count ?? 0}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{log.status}</td>
                    <td className="py-2.5 text-slate-500 text-xs">{log.details}</td>
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