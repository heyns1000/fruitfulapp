import React from 'react';
import { STAGES } from '@/lib/waterfall';

const stageGlyph = (key) => STAGES.find((s) => s.key === key)?.glyph || '💧';

export default function MemoryDroplet({ record }) {
  const placeholders = record.placeholders || [];
  const refs = record.source_refs || [];

  return (
    <div className="border-l-2 border-teal-200 pl-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg leading-none">{stageGlyph(record.stage)}</span>
        <span className="font-mono text-xs text-slate-500">{record.record_id}</span>
        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold border border-teal-100">
          {record.event_type}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
          {record.status}
        </span>
        {record.relation !== 'extends' && (
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-100">
            {record.relation}
          </span>
        )}
      </div>

      <p className="text-sm font-semibold text-slate-800 mt-2">{record.title}</p>
      {record.content && (
        <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">{record.content}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
        <span>↳ from {record.parent_id || 'origin-gorilla'}</span>
        {record.content_hash && <span>sha256 {record.content_hash.slice(0, 12)}…</span>}
        <span>{record.captured_at ? new Date(record.captured_at).toLocaleString() : ''}</span>
      </div>

      {refs.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {refs.map((ref) => (
            <li key={ref} className="text-xs text-slate-500 break-all">source: {ref}</li>
          ))}
        </ul>
      )}

      {placeholders.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {placeholders.map((p) => (
            <span key={p} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-mono border border-amber-100">
              {p}
            </span>
          ))}
        </div>
      )}

      {record.external_write && (
        <p className="text-xs text-red-600 mt-2 font-semibold">External write flagged — review required.</p>
      )}
    </div>
  );
}