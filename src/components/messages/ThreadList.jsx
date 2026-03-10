import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MessageSquare, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ThreadList({ threads, selectedId, onSelect, currentUser }) {
  const qc = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ artisanId: '', subject: '', message: '' });

  const { data: artisans = [] } = useQuery({
    queryKey: ['artisans-for-message'],
    queryFn: () => base44.entities.ArtisanProfile.list(),
    enabled: showNew,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const artisan = artisans.find(a => a.id === form.artisanId);
      const thread = await base44.entities.MessageThread.create({
        subject: form.subject || `Inquiry to ${artisan?.artisanName}`,
        artisanId: artisan?.id,
        artisanName: artisan?.artisanName || 'Artisan',
        artisanEmail: artisan?.created_by || '',
        buyerEmail: currentUser?.email,
        buyerName: currentUser?.full_name || currentUser?.email,
        status: 'active',
        lastMessage: form.message,
        lastMessageAt: new Date().toISOString(),
      });
      await base44.entities.Message.create({
        threadId: thread.id,
        senderEmail: currentUser?.email,
        senderName: currentUser?.full_name || currentUser?.email,
        content: form.message,
        messageType: 'text',
        read: false,
      });
      return thread;
    },
    onSuccess: (thread) => {
      qc.invalidateQueries({ queryKey: ['message-threads'] });
      setShowNew(false);
      setForm({ artisanId: '', subject: '', message: '' });
      onSelect(thread.id);
    },
  });

  return (
    <div className="w-72 shrink-0 bg-stone-900 border-r border-stone-800 flex flex-col h-full">
      <div className="p-4 border-b border-stone-800 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-black text-white text-base">Messages</h2>
          <p className="text-xs text-stone-500">{threads.length} thread{threads.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)} className="bg-orange-600 hover:bg-orange-500 text-white h-8 px-3 gap-1 text-xs">
          <Plus className="w-3 h-3" /> New
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-stone-800/60">
        {threads.length === 0 ? (
          <div className="p-8 text-center text-stone-600">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start by messaging an artisan</p>
          </div>
        ) : threads.map(thread => {
          const isSelected = thread.id === selectedId;
          const isArtisan = currentUser?.email === thread.artisanEmail;
          const otherName = isArtisan ? (thread.buyerName || thread.buyerEmail) : thread.artisanName;
          const unread = isArtisan ? thread.unreadArtisan : thread.unreadBuyer;

          return (
            <button key={thread.id} onClick={() => onSelect(thread.id)}
              className={`w-full text-left p-4 transition-all hover:bg-stone-800/60 ${isSelected ? 'bg-stone-800 border-l-2 border-orange-500' : 'border-l-2 border-transparent'}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-600/30 to-amber-600/20 border border-orange-600/30 flex items-center justify-center shrink-0">
                  <span className="text-orange-300 font-bold text-sm">{otherName?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-white text-sm truncate">{otherName}</span>
                    {unread > 0 && <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shrink-0" />}
                  </div>
                  <p className="text-xs text-stone-400 truncate">{thread.subject}</p>
                  <p className="text-xs text-stone-600 truncate mt-0.5">{thread.lastMessage}</p>
                  {thread.status === 'commission_pending' && (
                    <Badge className="mt-1 text-xs bg-amber-900/40 text-amber-300 border border-amber-700/50">⚡ Commission Pending</Badge>
                  )}
                  {thread.status === 'commission_accepted' && (
                    <Badge className="mt-1 text-xs bg-green-900/40 text-green-300 border border-green-700/50">✓ Accepted</Badge>
                  )}
                  {thread.lastMessageAt && (
                    <p className="text-xs text-stone-700 mt-1">
                      {formatDistanceToNow(new Date(thread.lastMessageAt), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="bg-stone-900 border-stone-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-orange-400 uppercase tracking-wider mb-1.5 block">Select Artisan</label>
              <Select value={form.artisanId} onValueChange={v => setForm(f => ({ ...f, artisanId: v }))}>
                <SelectTrigger className="bg-stone-800 border-stone-600 text-white"><SelectValue placeholder="Choose artisan..." /></SelectTrigger>
                <SelectContent className="bg-stone-800 border-stone-600">
                  {artisans.map(a => <SelectItem key={a.id} value={a.id} className="text-white">{a.artisanName} · {a.brandName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-orange-400 uppercase tracking-wider mb-1.5 block">Subject</label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="e.g. Custom hat commission" className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" />
            </div>
            <div>
              <label className="text-xs text-orange-400 uppercase tracking-wider mb-1.5 block">First Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
                placeholder="Hi, I'm interested in..."
                className="w-full bg-stone-800 border border-stone-600 text-white placeholder:text-stone-500 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-orange-500" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowNew(false)} className="flex-1 border-stone-600 text-stone-300">Cancel</Button>
              <Button onClick={() => createMutation.mutate()} disabled={!form.artisanId || !form.message || createMutation.isPending}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white gap-2">
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Start Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}