import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, Trash2, XCircle, Loader2, ListChecks } from 'lucide-react';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-slate-100 text-slate-800 border-slate-200',
};

export default function BulkFinancialManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState(new Set());
  const [acting, setActing] = useState(false);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments-bulk'],
    queryFn: () => base44.entities.Payment.list('-updated_date', 200),
  });

  const allSelected = payments.length > 0 && selected.size === payments.length;

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(payments.map((p) => p.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const selectedCount = selected.size;
  const selectedTotal = useMemo(
    () => payments.filter((p) => selected.has(p.id)).reduce((s, p) => s + (p.amount || 0), 0),
    [payments, selected]
  );

  const runBulk = async (action) => {
    if (selectedCount === 0) return;
    const ids = [...selected];
    setActing(true);
    try {
      if (action === 'complete') {
        await base44.entities.Payment.bulkUpdate(ids.map((id) => ({ id, status: 'completed' })));
        toast({ title: `Marked ${ids.length} payments completed` });
      } else if (action === 'fail') {
        await base44.entities.Payment.bulkUpdate(ids.map((id) => ({ id, status: 'failed' })));
        toast({ title: `Marked ${ids.length} payments failed` });
      } else if (action === 'delete') {
        for (const id of ids) {
          await base44.entities.Payment.delete(id);
        }
        toast({ title: `Deleted ${ids.length} payments` });
      }
      clearSelection();
      queryClient.invalidateQueries({ queryKey: ['payments-bulk'] });
    } catch (err) {
      toast({ title: 'Bulk action failed', description: err?.message, variant: 'destructive' });
    } finally {
      setActing(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListChecks className="w-5 h-5 text-blue-600" />
          Financial Records — Bulk Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bulk action bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-sm font-medium text-slate-700 mr-2">
            {selectedCount > 0 ? `${selectedCount} selected · ${selectedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'Select records below'}
          </span>
          <Button size="sm" variant="outline" disabled={!selectedCount || acting} onClick={() => runBulk('complete')}>
            <CheckCircle2 className="w-4 h-4" /> Mark Completed
          </Button>
          <Button size="sm" variant="outline" disabled={!selectedCount || acting} onClick={() => runBulk('fail')}>
            <XCircle className="w-4 h-4" /> Mark Failed
          </Button>
          <Button size="sm" variant="destructive" disabled={!selectedCount || acting} onClick={() => runBulk('delete')}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
          {selectedCount > 0 && (
            <Button size="sm" variant="ghost" onClick={clearSelection} disabled={acting}>Clear</Button>
          )}
          {acting && <Loader2 className="w-4 h-4 animate-spin text-slate-500" />}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-10 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No financial records yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-slate-200 max-h-[420px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-slate-50 z-10">
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id} data-state={selected.has(p.id) ? 'selected' : ''} className={selected.has(p.id) ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggle(p.id)} />
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-700">{p.brandName || '—'}</TableCell>
                    <TableCell className="text-sm text-slate-600">{p.gateway}</TableCell>
                    <TableCell className="text-sm text-slate-600 capitalize">{p.type}</TableCell>
                    <TableCell className="text-sm font-semibold text-right text-slate-800">
                      {(p.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} {p.currency || ''}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[p.status] || STATUS_STYLES.pending}`}>
                        {p.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}