import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Coffee, Shield, ShoppingBag, Database, Layers } from 'lucide-react';

const ENTITY_GROUPS = [
  {
    domain: 'Ecosystem Core',
    icon: Layers,
    color: 'indigo',
    entities: [
      { name: 'Brand', label: 'Brand Nodes' },
      { name: 'MarketplaceService', label: 'Marketplace SKUs' },
      { name: 'ArtisanProfile', label: 'Artisan Profiles' },
      { name: 'Vault', label: 'Vaults' },
      { name: 'VaultItem', label: 'Vault Items' },
    ],
  },
  {
    domain: 'Fruitful Coffee',
    icon: Coffee,
    color: 'amber',
    entities: [
      { name: 'CoffeeCostInput', label: 'BOM Cost Inputs' },
      { name: 'FoodMenuItem', label: 'Menu Items' },
      { name: 'CoffeeProjection', label: 'Projections' },
      { name: 'KioskShippingEstimate', label: 'Shipping Estimates' },
      { name: 'SupplierProfile', label: 'Suppliers' },
      { name: 'GreenCoffeeReceipt', label: 'Green Coffee Receipts' },
    ],
  },
  {
    domain: 'BlockVault / BlockBox',
    icon: Shield,
    color: 'slate',
    entities: [
      { name: 'BarcodeMapping', label: 'Barcode Mappings' },
      { name: 'PackagingAsset', label: 'Packaging Assets' },
      { name: 'ChangeRequest', label: 'Change Requests' },
      { name: 'DirectoryEntry', label: 'Directory Entries' },
    ],
  },
  {
    domain: 'Commerce & Orders',
    icon: ShoppingBag,
    color: 'green',
    entities: [
      { name: 'Order', label: 'Orders' },
      { name: 'Payment', label: 'Payments' },
      { name: 'PaymentTransaction', label: 'Paystack Transactions' },
      { name: 'Subscription', label: 'Subscriptions' },
      { name: 'LoyaltyAccount', label: 'Loyalty Accounts' },
      { name: 'Review', label: 'Reviews' },
    ],
  },
  {
    domain: 'Operations & Sync',
    icon: Database,
    color: 'teal',
    entities: [
      { name: 'SheetSyncConfig', label: 'Sheet Sync Configs' },
      { name: 'SyncLog', label: 'Sync Logs' },
      { name: 'Metrics', label: 'Metrics' },
    ],
  },
];

const colorMap = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
};

export default function SessionEntityInventory() {
  const { data: counts = {}, isLoading } = useQuery({
    queryKey: ['session-entity-inventory'],
    queryFn: async () => {
      const allEntities = ENTITY_GROUPS.flatMap(g => g.entities.map(e => e.name));
      const results = await Promise.all(
        allEntities.map(async (name) => {
          try {
            const records = await base44.entities[name].list('-created_date', 500);
            return [name, records.length];
          } catch {
            return [name, 0];
          }
        })
      );
      return Object.fromEntries(results);
    },
  });

  const totalCount = Object.values(counts).reduce((sum, c) => sum + (typeof c === 'number' ? c : 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">
          Live Entity Inventory · {totalCount} total records across {ENTITY_GROUPS.length} domains
        </h2>
        {isLoading && <span className="text-xs text-gray-400 animate-pulse">Counting…</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ENTITY_GROUPS.map(group => {
          const Icon = group.icon;
          const c = colorMap[group.color];
          const groupTotal = group.entities.reduce((sum, e) => sum + (counts[e.name] || 0), 0);
          return (
            <div key={group.domain} className={`bg-white border ${c.border} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`${c.bg} ${c.text} p-2 rounded-lg`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">{group.domain}</p>
                  <p className="text-xs text-gray-400">{groupTotal} records</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {group.entities.map(e => (
                  <div key={e.name} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{e.label}</span>
                    <span className={`font-bold ${counts[e.name] > 0 ? c.text : 'text-gray-300'}`}>
                      {counts[e.name] ?? '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}