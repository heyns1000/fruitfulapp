import React from 'react';
import { STAGES } from '@/lib/waterfall';

export default function StageFlow() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
        Waterfall evidence model · append-only
      </p>
      <div className="grid gap-3 sm:grid-cols-5">
        {STAGES.map((stage) => (
          <div key={stage.key} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
            <div className="text-2xl leading-none mb-2">{stage.glyph}</div>
            <p className="text-sm font-bold text-slate-800">{stage.label}</p>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{stage.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}