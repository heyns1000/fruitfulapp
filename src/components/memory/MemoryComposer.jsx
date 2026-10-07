import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { describeEntry, gatesFor } from '@/lib/waterfall';

export default function MemoryComposer({ busy, onCapture }) {
  const [text, setText] = useState('');
  const [refs, setRefs] = useState('');

  const read = describeEntry(text);
  const gates = gatesFor(read);

  const submit = () => {
    if (!text.trim() || busy) return;
    onCapture({ text, refs }).then(() => {
      setText('');
      setRefs('');
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Describe</p>
      <p className="text-sm text-slate-600 mb-4">
        Describe what happened. The system resolves the stage, event type, parent link and hash —
        there is nothing to cross-check.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Describe the event, decision, intake, claim or correction…"
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-400 resize-y"
      />

      <input
        value={refs}
        onChange={(e) => setRefs(e.target.value)}
        placeholder="Source references — file path, URL, commit SHA or message id (comma separated)"
        className="w-full mt-3 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-400"
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Resolved as</span>
        <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-100">
          {read.event_type}
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
          {read.stage}
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
          {read.relation}
        </span>
      </div>

      {(read.signals.length > 0 || gates.length > 0) && (
        <ul className="mt-3 space-y-1">
          {[...read.signals, ...gates].map((line) => (
            <li key={line} className="text-xs text-slate-500 leading-snug">• {line}</li>
          ))}
        </ul>
      )}

      <button
        onClick={submit}
        disabled={busy || !text.trim()}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold text-sm transition-colors"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {busy ? 'Appending…' : 'Append droplet'}
      </button>
    </div>
  );
}