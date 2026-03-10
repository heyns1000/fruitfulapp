import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Smartphone, Banknote, QrCode, Shield, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

// Paystack supported currencies only
const PAYSTACK_CURRENCIES = {
  NGN: { symbol: '₦', name: 'Nigerian Naira', subunit: 'kobo' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi', subunit: 'pesewa' },
  ZAR: { symbol: 'R', name: 'South African Rand', subunit: 'cent' },
  USD: { symbol: '$', name: 'US Dollar', subunit: 'cent' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', subunit: 'cent' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound', subunit: 'piastre' },
};

// Paystack channels — matches Paystack's `channels` parameter exactly
const PAYSTACK_CHANNELS = [
  { key: 'card',          label: '💳 Card',              desc: 'Visa, Mastercard, Verve' },
  { key: 'bank',          label: '🏦 Bank',              desc: 'Select your bank' },
  { key: 'ussd',          label: '📱 USSD',              desc: 'Dial *737# (NGN only)' },
  { key: 'qr',            label: '📷 QR Code',           desc: 'Scan to pay' },
  { key: 'mobile_money',  label: '📲 Mobile Money',      desc: 'MTN, Vodafone (GHS/KES)' },
  { key: 'bank_transfer', label: '🔁 Bank Transfer',     desc: 'Real-time bank transfer' },
];

export default function PaymentGateway({ brands }) {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [selectedChannels, setSelectedChannels] = useState(['card']);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const queryClient = useQueryClient();
  const currencyMeta = PAYSTACK_CURRENCIES[selectedCurrency];

  const toggleChannel = (key) => {
    setSelectedChannels(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  };

  const createPaymentRecord = useMutation({
    mutationFn: (data) => base44.entities.Payment.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });

  const processPayment = async () => {
    if (!amount || !email || !selectedBrand) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (selectedChannels.length === 0) {
      toast.error('Select at least one payment channel');
      return;
    }

    const brand = brands.find(b => b.id === selectedBrand);
    const amountFloat = parseFloat(amount);
    // Paystack requires amount in smallest currency unit (kobo, pesewa, cent)
    const amountInSubunit = Math.round(amountFloat * 100);
    const ref = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    setIsProcessing(true);

    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (paystackKey && paystackKey !== 'undefined' && typeof window.PaystackPop !== 'undefined') {
      window.PaystackPop.setup({
        key: paystackKey,
        email,
        amount: amountInSubunit,
        currency: selectedCurrency,
        ref,
        channels: selectedChannels,
        metadata: {
          custom_fields: [
            { display_name: 'Brand', variable_name: 'brand_id', value: brand?.id || '' },
            { display_name: 'Brand Name', variable_name: 'brand_name', value: brand?.name || '' },
          ]
        },
        callback: async (response) => {
          // response.status === 'success' on Paystack
          await createPaymentRecord.mutateAsync({
            transactionId: response.reference,
            brandId: brand?.id,
            brandName: brand?.name,
            amount: amountFloat,
            currency: selectedCurrency,
            gateway: 'Paystack',
            paymentMethod: response.channel || selectedChannels[0],
            status: response.status === 'success' ? 'completed' : 'failed',
            type: 'one_time',
            customerEmail: email,
            metadata: { pciCompliant: true, tokenized: true, gatewayResponse: response },
          });
          toast.success(`Payment of ${currencyMeta.symbol}${amount} successful!`);
          setAmount(''); setEmail(''); setSelectedBrand('');
          setIsProcessing(false);
        },
        onClose: () => {
          toast.info('Payment window closed');
          setIsProcessing(false);
        },
      }).openIframe();
    } else {
      // Demo / sandbox fallback
      toast.info('Demo mode — Paystack key not configured. Simulating payment…');
      await new Promise(r => setTimeout(r, 1500));
      await createPaymentRecord.mutateAsync({
        transactionId: ref,
        brandId: brand?.id,
        brandName: brand?.name,
        amount: amountFloat,
        currency: selectedCurrency,
        gateway: 'Paystack',
        paymentMethod: selectedChannels[0],
        status: 'completed',
        type: 'one_time',
        customerEmail: email,
        metadata: { pciCompliant: true, tokenized: true, gatewayResponse: { reference: ref, status: 'success', demo: true } },
      });
      toast.success(`Demo payment of ${currencyMeta.symbol}${amount} recorded`);
      setAmount(''); setEmail(''); setSelectedBrand('');
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — payment form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            Paystack Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div>
            <label className="text-sm font-medium mb-2 block">Select Brand</label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger><SelectValue placeholder="Choose brand" /></SelectTrigger>
              <SelectContent>
                {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}™ — {b.sector}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Currency</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYSTACK_CURRENCIES).map(([code, meta]) => (
                    <SelectItem key={code} value={code}>{meta.symbol} {code} — {meta.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Amount ({currencyMeta.symbol})
              </label>
              <Input type="number" placeholder="0.00" value={amount}
                onChange={e => setAmount(e.target.value)} min="1" step="0.01" />
              {amount && (
                <p className="text-xs text-gray-400 mt-1">
                  = {Math.round(parseFloat(amount) * 100).toLocaleString()} {currencyMeta.subunit}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Customer Email</label>
            <Input type="email" placeholder="customer@example.com" value={email}
              onChange={e => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Payment Channels <span className="text-gray-400 text-xs">(select allowed methods)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYSTACK_CHANNELS.map(ch => (
                <button key={ch.key} type="button" onClick={() => toggleChannel(ch.key)}
                  className={`flex items-start gap-2 p-3 rounded-lg border text-left text-sm transition-all ${
                    selectedChannels.includes(ch.key)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <span className="leading-tight">{ch.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={processPayment} disabled={isProcessing} size="lg"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            {isProcessing
              ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing…</>
              : <><CreditCard className="w-5 h-5 mr-2" /> Pay {currencyMeta.symbol}{amount || '0.00'}</>
            }
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-green-600" />
            PCI-DSS Compliant · 3D Secure · End-to-end encrypted
          </div>
        </CardContent>
      </Card>

      {/* Right — Paystack info */}
      <Card className="bg-gradient-to-br from-teal-50 to-green-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-700">
            <img src="https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png"
              alt="Paystack" className="w-6 h-6 rounded bg-teal-600 p-0.5 object-contain"
              onError={e => e.currentTarget.style.display = 'none'} />
            Paystack Gateway
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="p-4 bg-white rounded-lg border border-teal-200">
            <h3 className="font-semibold text-sm mb-2 text-teal-800">Supported Channels</h3>
            <div className="space-y-1.5">
              {PAYSTACK_CHANNELS.map(ch => (
                <div key={ch.key} className="flex items-center justify-between text-sm">
                  <span>{ch.label}</span>
                  <span className="text-gray-400 text-xs">{ch.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-teal-200">
            <h3 className="font-semibold text-sm mb-2 text-teal-800">Supported Currencies</h3>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PAYSTACK_CURRENCIES).map(([code, meta]) => (
                <Badge key={code} variant="outline" className="border-teal-300 text-teal-700">
                  {meta.symbol} {code}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-teal-200 space-y-2 text-sm">
            <h3 className="font-semibold text-teal-800">Security</h3>
            {['PCI-DSS Level 1 compliant','3D Secure card authentication','Tokenized — no card data stored','Real-time fraud detection','HTTPS enforced'].map(s => (
              <div key={s} className="flex items-center gap-2 text-gray-600">
                <Shield className="w-3.5 h-3.5 text-green-600 shrink-0" /> {s}
              </div>
            ))}
          </div>

          <a href="https://dashboard.paystack.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full border-teal-300 text-teal-700 hover:bg-teal-50 gap-2">
              <ExternalLink className="w-4 h-4" /> Open Paystack Dashboard
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}