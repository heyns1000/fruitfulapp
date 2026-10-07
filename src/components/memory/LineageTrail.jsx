import React from 'react';
import MemoryDroplet from './MemoryDroplet';

export default function LineageTrail({ records }) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
        <p className="text-2xl mb-2">🦍</p>
        <p className="font-bold text-slate-800">No droplets recorded yet</p>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          The root authority <span className="font-mono">origin-gorilla</span> is immutable and is
          never written as a row. Every description you append becomes its first droplet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Lineage trail</p>
        <p className="text-xs text-slate-500">
          {records.length} droplet{records.length === 1 ? '' : 's'} · newest first
        </p>
      </div>
      <div>
        {records.map((record) => (
          <MemoryDroplet key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}