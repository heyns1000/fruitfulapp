import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Loader2, FileText, Clock, DollarSign, Package, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CURRENCIES = ['USD', 'ZAR', 'EUR', 'GBP', 'NGN'];

export default function CommissionPanel({ open, onClose, thread, currentUser, onMessageSent }) {
  const qc = useQueryClient();
  const commission = thread?.commissionRequest;
  const isProposer = commission?.proposedBy === currentUser?.email;
  const isPending = thread?.status === 'commission_pending';
  const isAccepted = thread?.status === 'commission_accepted';
  const isRejected = thread?.status === 'commission_rejected';

  const [form, setForm] = useState({
    description: '', amount: '', currency: 'USD', timelineDays: '', deliverables: ''
  });

  const proposeMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.MessageThread.update(thread.id, {
        status: 'commission_pending',
        commissionRequest: {
          description: form.description,
          amount: parseFloat(form.amount),
          currency: form.currency,
          timelineDays: parseInt(form.timelineDays),
          deliverables: form.deliverables,
          status: 'pending',
          proposedBy: currentUser?.email,
        },
        lastMessage: '⚡ Commission request sent',
        lastMessageAt: new Date().toISOString(),
      });
      await base44.entities.Message.create({
        threadId: thread.id,
        senderEmail: currentUser?.email,
        senderName: currentUser?.full_name || currentUser?.email,
        content: `Commission Request: ${form.description} — $${form.amount} ${form.currency} · ${form.timelineDays} days`,
        messageType: 'commission_request',
        read: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['message-threads'] });
      qc.invalidateQueries({ queryKey: ['thread-messages', thread.id] });
      onMessageSent?.();
      onClose();
      toast.success('Commission request sent!');
    },
  });

  const respondMutation = useMutation({
    mutationFn: async (accepted) => {
      let orderId = null;
      if (accepted) {
        const order = await base44.entities.Order.create({
          orderNumber: 'COM-' + Date.now().toString(36).toUpperCase(),
          items: [{ serviceName: commission.description, quantity: 1, unitPrice: commission.amount }],
          buyerEmail: thread.buyerEmail,
          totalAmount: commission.amount,
          currency: commission.currency,
          artisanId: thread.artisanId,
          artisanName: thread.artisanName,
          status: 'confirmed',
          paymentStatus: 'pending',
          notes: `Commission: ${commission.deliverables}`,
          estimatedDelivery: new Date(Date.now() + commission.timelineDays * 86400000).toISOString().split('T')[0],
          statusHistory: [{ status: 'confirmed', timestamp: new Date().toISOString(), note: 'Commission accepted' }],
        });
        orderId = order.id;
      }
      await base44.entities.MessageThread.update(thread.id, {
        status: accepted ? 'commission_accepted' : 'commission_rejected',
        orderId: orderId || null,
        commissionRequest: { ...commission, status: accepted ? 'accepted' : 'rejected', respondedAt: new Date().toISOString() },
        lastMessage: accepted ? '✓ Commission accepted — order created!' : '✗ Commission declined',
        lastMessageAt: new Date().toISOString(),
      });
      await base44.entities.Message.create({
        threadId: thread.id,
        senderEmail: currentUser?.email,
        senderName: currentUser?.full_name || currentUser?.email,
        content: accepted ? '✓ Commission accepted! An order has been created.' : '✗ Commission request declined.',
        messageType: accepted ? 'commission_accepted' : 'commission_rejected',
        read: false,
      });
    },
    onSuccess: (_, accepted) => {
      qc.invalidateQueries({ queryKey: ['message-threads'] });
      qc.invalidateQueries({ queryKey: ['thread-messages', thread.id] });
      onMessageSent?.();
      onClose();
      toast.success(accepted ? '🎉 Commission accepted! Order created.' : 'Commission declined.');
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {isAccepted ? 'Commission Agreement' : isRejected ? 'Commission Declined' : isPending ? 'Commission Request' : 'New Commission Request'}
          </DialogTitle>
        </DialogHeader>

        {/* ACCEPTED STATE */}
        {isAccepted && (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="font-bold text-green-300">Agreement Accepted</span>
              </div>
              <CommissionDetails commission={commission} />
            </div>
            {thread.orderId && (
              <Link to={createPageUrl('OrderDashboard')}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <ExternalLink className="w-4 h-4" /> View Order in Dashboard
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* REJECTED STATE */}
        {isRejected && (
          <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-muted-foreground text-sm">This commission request was declined. Feel free to send a new one.</p>
          </div>
        )}

        {/* PENDING — I proposed */}
        {isPending && isProposer && (
          <div className="space-y-4">
            <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4">
              <p className="text-amber-300 text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Waiting for response...
              </p>
              <CommissionDetails commission={commission} />
            </div>
            <Button variant="outline" onClick={onClose} className="w-full border-border text-muted-foreground">Close</Button>
          </div>
        )}

        {/* PENDING — I need to respond */}
        {isPending && !isProposer && (
          <div className="space-y-4">
            <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4">
              <p className="text-amber-300 text-sm font-semibold mb-3">Commission Proposal Received</p>
              <CommissionDetails commission={commission} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => respondMutation.mutate(false)} disabled={respondMutation.isPending}
                className="flex-1 border-red-700 text-red-400 hover:bg-red-900/20 gap-2">
                <XCircle className="w-4 h-4" /> Decline
              </Button>
              <Button onClick={() => respondMutation.mutate(true)} disabled={respondMutation.isPending}
                className="flex-1 bg-green-700 hover:bg-green-600 text-foreground gap-2">
                {respondMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Accept & Create Order
              </Button>
            </div>
          </div>
        )}

        {/* NEW COMMISSION FORM */}
        {!isPending && !isAccepted && !isRejected && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-primary uppercase tracking-wider mb-1.5 block">Project Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                placeholder="Describe what you'd like commissioned..."
                className="w-full bg-muted border border-border text-foreground placeholder:text-muted-foreground rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-primary uppercase tracking-wider mb-1.5 block">Amount *</label>
                <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00" className="bg-muted border-border text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-xs text-primary uppercase tracking-wider mb-1.5 block">Currency</label>
                <Select value={form.currency} onValueChange={v => setForm(f => ({ ...f, currency: v }))}>
                  <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-muted border-border">
                    {CURRENCIES.map(c => <SelectItem key={c} value={c} className="text-foreground">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-primary uppercase tracking-wider mb-1.5 block">Timeline (days) *</label>
              <Input type="number" value={form.timelineDays} onChange={e => setForm(f => ({ ...f, timelineDays: e.target.value }))}
                placeholder="e.g. 14" className="bg-muted border-border text-foreground placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs text-primary uppercase tracking-wider mb-1.5 block">Deliverables</label>
              <textarea value={form.deliverables} onChange={e => setForm(f => ({ ...f, deliverables: e.target.value }))} rows={2}
                placeholder="What will be delivered, materials, finish, size..."
                className="w-full bg-muted border border-border text-foreground placeholder:text-muted-foreground rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1 border-border text-muted-foreground">Cancel</Button>
              <Button onClick={() => proposeMutation.mutate()}
                disabled={!form.description || !form.amount || !form.timelineDays || proposeMutation.isPending}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                {proposeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Send Commission Request
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CommissionDetails({ commission }) {
  if (!commission) return null;
  return (
    <div className="space-y-2 text-sm">
      <p className="text-muted-foreground">{commission.description}</p>
      <div className="flex gap-4 flex-wrap mt-2">
        <span className="flex items-center gap-1 text-primary font-bold">
          <DollarSign className="w-3.5 h-3.5" /> {commission.amount} {commission.currency}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" /> {commission.timelineDays} days
        </span>
      </div>
      {commission.deliverables && (
        <p className="text-muted-foreground text-xs flex items-start gap-1 mt-1">
          <Package className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {commission.deliverables}
        </p>
      )}
    </div>
  );
}