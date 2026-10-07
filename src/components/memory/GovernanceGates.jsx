import React from 'react';
import { ShieldAlert, Lock, CircleSlash } from 'lucide-react';

const RULES = [
  'The root prompt is immutable. Nothing overwrites prior truth.',
  'Corrections are appended as child records pointing at the record they correct.',
  'Detached chat text is not automatically fact, policy or deployment truth.',
  'External writes, public claims and production deployments require explicit approval scope.',
  'Approval is a separate, named event — never inferred.',
  'Raw credentials are never evidence payloads.',
];

const BLOCKED = [
  {
    title: 'Canonical durable ledger',
    need: 'memory_events, memory_edges, memory_approvals and memory_release_receipts in an approved durable environment with row-level security.',
  },
  {
    title: 'Backend functions',
    need: 'Server-side secret handling and the connector proxies are not available on the current plan.',
  },
  {
    title: 'External write path',
    need: 'No external write is performed from this app. Release receipts are recorded, not dispatched.',
  },
];

export default function GovernanceGates() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-teal-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Control rules</p>
        </div>
        <ul className="space-y-2">
          {RULES.map((rule) => (
            <li key={rule} className="flex gap-2 text-sm text-slate-600 leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
              {rule}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Not yet activated</p>
        </div>
        <ul className="space-y-3">
          {BLOCKED.map((item) => (
            <li key={item.title}>
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <CircleSlash className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {item.title}
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-snug pl-5">{item.need}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}