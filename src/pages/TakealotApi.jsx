import React, { useState } from 'react';
import { Plug } from 'lucide-react';
import TakealotConnection from '@/components/takealot/TakealotConnection';
import TakealotDataSync from '@/components/takealot/TakealotDataSync';
import TakealotOffers from '@/components/takealot/TakealotOffers';
import TakealotWebhooks from '@/components/takealot/TakealotWebhooks';
import { TAKEALOT_API } from '@/lib/takealotReference';

const TABS = [
  { id: 'connection', label: 'Connection' },
  { id: 'sync', label: 'Data Sync' },
  { id: 'offers', label: 'Offer Management' },
  { id: 'webhooks', label: 'Webhook Activity' },
];

export default function TakealotApi() {
  const [tab, setTab] = useState('connection');

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Plug className="w-5 h-5 text-teal-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600">API Integrations</p>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Takealot Seller API</h1>
        <p className="text-sm text-slate-600 mt-1">
          {TAKEALOT_API.sellerName} · Seller {TAKEALOT_API.sellerId} · version {TAKEALOT_API.version}
        </p>
      </header>

      <div className="flex gap-1 mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-white text-teal-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'connection' && <TakealotConnection />}
      {tab === 'sync' && <TakealotDataSync />}
      {tab === 'offers' && <TakealotOffers />}
      {tab === 'webhooks' && <TakealotWebhooks />}
    </div>
  );
}