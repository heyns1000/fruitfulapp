import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ExternalLink } from 'lucide-react';

// Paystack returns 'success' — we store 'completed' internally; map both
const STATUS_CONFIG = {
  completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
  success:   { color: 'bg-green-100 text-green-800', label: 'Success' },
  pending:   { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  processing:{ color: 'bg-blue-100 text-blue-800', label: 'Processing' },
  failed:    { color: 'bg-red-100 text-red-800', label: 'Failed' },
  abandoned: { color: 'bg-orange-100 text-orange-800', label: 'Abandoned' },
  refunded:  { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
};

const CURRENCY_SYMBOLS = {
  NGN: '₦', GHS: '₵', ZAR: 'R', USD: '$', KES: 'KSh', EGP: 'E£',
  EUR: '€', GBP: '£',
};

const METHOD_LABELS = {
  card: '💳 Card', bank: '🏦 Bank', ussd: '📱 USSD',
  qr: '📷 QR', mobile_money: '📲 Mobile Money', bank_transfer: '🔁 Bank Transfer',
  eft: '🏦 EFT', instant_eft: '⚡ Instant EFT',
};

const GATEWAYS = ['Paystack', 'Flutterwave', 'PayFast', 'Ozow', 'Yoco', 'PayPal'];

export default function TransactionHistory({ payments }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGateway, setFilterGateway] = useState('all');

  const filtered = payments.filter(p => {
    const matchSearch = !searchTerm ||
      p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchGateway = filterGateway === 'all' || p.gateway === filterGateway;
    return matchSearch && matchStatus && matchGateway;
  });

  const paid = payments.filter(p => p.status === 'completed' || p.status === 'success');
  const totalRevenue = paid.reduce((sum, p) => sum + (p.amount || 0), 0);

  const formatAmount = (payment) => {
    const sym = CURRENCY_SYMBOLS[payment.currency] || payment.currency || '';
    return `${sym}${(payment.amount || 0).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-5">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-700">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{paid.length} successful</p>
          </CardContent>
        </Card>
        {[
          { label: 'Completed', key: ['completed','success'], color: 'text-green-700' },
          { label: 'Pending',   key: ['pending'],             color: 'text-yellow-700' },
          { label: 'Failed',    key: ['failed','abandoned'],  color: 'text-red-700' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <p className="text-sm text-gray-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>
                {payments.filter(p => s.key.includes(p.status)).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by TXN ID, brand, email…" value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterGateway} onValueChange={setFilterGateway}>
              <SelectTrigger><SelectValue placeholder="All gateways" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gateways</SelectItem>
                {GATEWAYS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions found</p>
          ) : (
            <div className="space-y-2">
              {filtered.map(p => {
                const statusCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                return (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="font-semibold text-sm">{p.brandName || 'Unknown Brand'}</p>
                        <Badge variant="outline" className="text-xs border-teal-300 text-teal-700">{p.gateway || 'Paystack'}</Badge>
                        {p.paymentMethod && (
                          <span className="text-xs text-gray-400">{METHOD_LABELS[p.paymentMethod] || p.paymentMethod}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-mono truncate">{p.transactionId}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {p.customerEmail}
                        {p.created_date && ` · ${new Date(p.created_date).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <div className="text-right">
                        <p className="text-base font-bold">{formatAmount(p)}</p>
                        <p className="text-xs text-gray-400">{p.currency || 'NGN'}</p>
                      </div>
                      <Badge className={statusCfg.color}>{statusCfg.label}</Badge>
                      {p.transactionId && p.gateway === 'Paystack' && (
                        <a href={`https://dashboard.paystack.com/#/transactions`} target="_blank" rel="noopener noreferrer"
                          className="text-gray-400 hover:text-teal-600 transition-colors" title="View on Paystack">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}