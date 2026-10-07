import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import StageFlow from '@/components/memory/StageFlow';
import MemoryComposer from '@/components/memory/MemoryComposer';
import LineageTrail from '@/components/memory/LineageTrail';
import GovernanceGates from '@/components/memory/GovernanceGates';
import { ROOT_ID, describeEntry, buildRecordId, hashContent } from '@/lib/waterfall';

export default function WaterfallMemory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.MemoryEvent.list('-sequence', 200)
      .then((rows) => { if (active) setRecords(rows || []); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleCapture = async ({ text, refs }) => {
    setBusy(true);
    setError(null);
    try {
      const read = describeEntry(text);
      const captured_at = new Date().toISOString();
      const sequence = (records[0]?.sequence || 0) + 1;
      const source_refs = refs.split(',').map((s) => s.trim()).filter(Boolean);
      const content_hash = await hashContent(text.trim());
      const parent = records[0];

      const created = await base44.entities.MemoryEvent.create({
        record_id: buildRecordId(captured_at, sequence),
        root_id: ROOT_ID,
        parent_id: parent ? parent.record_id : ROOT_ID,
        sequence,
        event_type: read.event_type,
        stage: read.stage,
        relation: read.relation,
        title: text.trim().split('\n')[0].slice(0, 90),
        content: text.trim(),
        captured_at,
        captured_by: 'user',
        source_refs,
        content_hash,
        status: source_refs.length > 0 ? 'evidenced' : 'captured',
        placeholders: read.placeholders,
        external_write: false,
      });

      setRecords((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-black text-slate-900 mb-2">Waterfall Memory</h1>
      <p className="text-slate-600 mb-8 max-w-2xl">
        An append-only lineage ledger. Describe an event and the system resolves its stage, event
        type, parent link and content hash automatically — no manual cross-check, nothing overwritten.
      </p>

      <div className="space-y-6">
        <StageFlow />
        <MemoryComposer busy={busy} onCapture={handleCapture} />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">Could not append the droplet: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
            <span className="text-sm text-slate-500">Loading lineage…</span>
          </div>
        ) : (
          <LineageTrail records={records} />
        )}

        <GovernanceGates />
      </div>
    </div>
  );
}