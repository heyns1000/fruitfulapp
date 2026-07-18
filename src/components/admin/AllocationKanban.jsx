import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { LayoutGrid, Loader2 } from 'lucide-react';

const COLUMNS = [
  { key: 'unallocated', label: 'Unallocated', accent: 'slate' },
  { key: 'pending', label: 'Pending', accent: 'amber' },
  { key: 'allocated', label: 'Allocated', accent: 'blue' },
  { key: 'review', label: 'In Review', accent: 'purple' },
  { key: 'completed', label: 'Completed', accent: 'emerald' },
];

const accentMap = {
  slate: { bar: 'bg-slate-400', chip: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  amber: { bar: 'bg-amber-400', chip: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  blue: { bar: 'bg-blue-400', chip: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  purple: { bar: 'bg-purple-400', chip: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
  emerald: { bar: 'bg-emerald-400', chip: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
};

export default function AllocationKanban() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date', 500),
  });

  const [busy, setBusy] = useState(new Set());

  const grouped = useMemo(() => {
    const map = {};
    COLUMNS.forEach((c) => (map[c.key] = []));
    brands.forEach((b) => {
      const k = b.allocationStatus || 'unallocated';
      if (!map[k]) map[k] = [];
      map[k].push(b);
    });
    return map;
  }, [brands]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const destStatus = destination.droppableId;
    const srcStatus = source.droppableId;
    if (destStatus === srcStatus) return;

    const brand = brands.find((b) => b.id === draggableId);
    if (!brand) return;

    setBusy((prev) => new Set(prev).add(draggableId));
    try {
      await base44.entities.Brand.update(brand.id, { allocationStatus: destStatus });
      toast({
        title: `${brand.name}™ → ${COLUMNS.find((c) => c.key === destStatus).label}`,
        description: 'Allocation status updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    } catch (err) {
      toast({ title: 'Move failed', description: err?.message, variant: 'destructive' });
    } finally {
      setBusy((prev) => {
        const next = new Set(prev);
        next.delete(draggableId);
        return next;
      });
    }
  };

  const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 }));

  return (
    <Card className="bg-white/80 backdrop-blur border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <LayoutGrid className="w-5 h-5 text-indigo-600" />
          Allocation Kanban
        </CardTitle>
        <p className="text-xs text-slate-500">Drag brands between columns to update their allocation status instantly.</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {COLUMNS.map((col) => {
                const items = grouped[col.key] || [];
                const a = accentMap[col.accent];
                return (
                  <Droppable droppableId={col.key} key={col.key}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`rounded-xl border flex flex-col min-h-[200px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-slate-100 border-slate-300' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
                            <span className="text-sm font-bold text-slate-700">{col.label}</span>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.chip}`}>{items.length}</span>
                        </div>
                        <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[460px]">
                          {items.map((b, idx) => (
                            <Draggable draggableId={b.id} index={idx} key={b.id}>
                              {(p, snap) => (
                                <div
                                  ref={p.innerRef}
                                  {...p.draggableProps}
                                  {...p.dragHandleProps}
                                  className={`rounded-lg bg-white border border-slate-200 p-2.5 shadow-sm cursor-grab active:cursor-grabbing ${
                                    snap.isDragging ? 'shadow-lg ring-2 ring-indigo-300' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-slate-800 truncate">{b.name}™</span>
                                    {busy.has(b.id) && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 shrink-0" />}
                                  </div>
                                  <div className="flex items-center justify-between mt-1.5">
                                    <span className="text-[10px] font-medium text-slate-500 capitalize">{b.sector}</span>
                                    <span className="text-[10px] font-bold text-slate-600">
                                      Alloc {fmt(b.financialAllocation)}
                                    </span>
                                  </div>
                                  {b.performanceScore != null && b.performanceScore !== 0 && (
                                    <div className="mt-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                          <div
                                            className="h-full rounded-full bg-indigo-500"
                                            style={{ width: `${Math.min(100, Math.max(0, b.performanceScore))}%` }}
                                          />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600">{b.performanceScore}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {items.length === 0 && !snapshot.isDraggingOver && (
                            <p className="text-center text-xs text-slate-400 py-4">Drop brands here</p>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
}