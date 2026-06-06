import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export default function AdminPaystackSandbox({ brands, sectors }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ email: '', amount: '100', brandId: '', currency: 'ZAR', description: '' });
  const [loading, setLoading] = useState(false);

  const { data: transactions = [] } = useQuery({
    queryKey: ['payment-transactions'],
    queryFn: () => base44.entities.PaymentTransaction.list('-created_date', 50),
  });

  const saveTx = useMutation({
    mutationFn: (data) => base44.entities.PaymentTransaction.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-transactions'] }),
  });

  const handlePay = () => {
    if (!form.email || !form.amount || !form.brandId) {
      toast.error('Please fill in email, amount, and brand');
      return;
    }
    if (!PAYSTACK_KEY) {
      toast.error('VITE_PAYSTACK_PUBLIC_KEY secret is not set');
      return;
    }

    const selectedBrand = brands.find(b => b.id === form.brandId);
    const amountKobo = Math.round(parseFloat(form.amount) * 100);
    const reference = `SEED-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    setLoading(true);

    // Create pending record first
    saveTx.mutate({
      reference,
      brandId: selectedBrand?.id,
      brandName: selectedBrand?.name,
      sectorKey: selectedBrand?.sector,
      email: form.email,
      amount: amountKobo,
      currency: form.currency,
      status: 'pending',
      description: form.description || `Payment for ${selectedBrand?.name}`,
    });

    const handler = window.PaystackPop?.setup({
      key: PAYSTACK_KEY,
      email: form.email,
      amount: amountKobo,
      currency: form.currency,
      ref: reference,
      metadata: {
        brandId: selectedBrand?.id,
        brandName: selectedBrand?.name,
        sectorKey: selectedBrand?.sector,
        custom_fields: [
          { display_name: 'Brand', variable_name: 'brand', value: selectedBrand?.name || '' },
          { display_name: 'Sector', variable_name: 'sector', value: sectors[selectedBrand?.sector] || '' },
        ],
      },
      callback: async (response) => {
        setLoading(false);
        // Update transaction to success
        const existing = await base44.entities.PaymentTransaction.filter({ reference });
        if (existing?.[0]) {
          await base44.entities.PaymentTransaction.update(existing[0].id, {
            status: 'success',
            channel: response.channel,
            paystackData: response,
          });
        }
        queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
        toast.success(`Payment successful! Ref: ${response.reference}`);
      },
      onClose: () => {
        setLoading(false);
        toast.info('Payment popup closed');
      },
    });

    if (handler) {
      handler.openIframe();
    } else {
      setLoading(false);
      toast.error('Paystack SDK not loaded. Ensure the Paystack script is included.');
    }
  };

  const statusColor = (s) => {
    if (s === 'success') return 'bg-green-100 text-green-700';
    if (s === 'failed') return 'bg-red-100 text-red-700';
    if (s === 'abandoned') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6">
      {/* Sandbox Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-green-700 mb-1 flex items-center gap-2">
          <CreditCard className="w-5 h-5" /> Paystack Sandbox Checkout
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Test payments are tagged to a specific brand. Use test card <code className="bg-gray-100 px-1 rounded">4084 0840 8408 4081</code> · CVV <code className="bg-gray-100 px-1 rounded">408</code> · Exp <code className="bg-gray-100 px-1 rounded">any future</code>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Input placeholder="Payer email *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input placeholder="Amount (ZAR) *" type="number" min="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <select
            value={form.brandId}
            onChange={e => setForm(f => ({ ...f, brandId: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm col-span-1"
          >
            <option value="">Select Brand *</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({sectors[b.sector] || b.sector})</option>
            ))}
          </select>
          <select
            value={form.currency}
            onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="ZAR">ZAR</option>
            <option value="NGN">NGN</option>
            <option value="GHS">GHS</option>
            <option value="USD">USD</option>
          </select>
          <Input placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="sm:col-span-2" />
        </div>

        <Button onClick={handlePay} disabled={loading} className="bg-green-600 hover:bg-green-700 gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          Initiate Payment
        </Button>
      </div>

      {/* Transaction Log */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-bold text-gray-800 mb-4">📋 Payment Transaction Log</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Reference</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Brand</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{tx.reference?.slice(-12)}</td>
                    <td className="px-4 py-3 font-medium">{tx.brandName || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{tx.email}</td>
                    <td className="px-4 py-3 font-semibold">{tx.currency} {((tx.amount || 0) / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {tx.created_date ? new Date(tx.created_date).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}