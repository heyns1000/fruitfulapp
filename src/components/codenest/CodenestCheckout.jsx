import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CodenestCheckout() {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(3);
      toast.success('ClaimRoot™ License Activated!');
    }, 2000);
  };

  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
      <h2 className="text-2xl font-extrabold text-[#B8860B] mb-2 text-center">Global Payment & Checkout</h2>
      <p className="text-gray-400 text-center text-sm mb-6 max-w-xl mx-auto">
        Integrated with VaultPay™ for secure transactions and ClaimRoot™ for automated licensing.
      </p>
      <div className="max-w-md mx-auto bg-[#1a1a1c] rounded-lg p-6 border border-[#3a3a3e]">
        {step === 1 && (
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#0071e3] text-white text-sm flex items-center justify-center">1</span> Item Selection
            </h4>
            <p className="text-gray-300 text-sm mb-2">Fruitful Global Protocol License (Enterprise Tier)</p>
            <p className="text-gray-400 text-sm mb-4">Price: <strong className="text-white">$999.00 USD</strong> (One-time license fee)</p>
            <Button onClick={() => setStep(2)} className="bg-[#30d158] hover:bg-[#28a745] text-white">Proceed to Checkout</Button>
          </div>
        )}
        {step === 2 && (
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#0071e3] text-white text-sm flex items-center justify-center">2</span> Payment Information
            </h4>
            <p className="text-gray-300 text-sm mb-4">Enter secure payment details for VaultPay™ processing.</p>
            <Input placeholder="Card Number" className="bg-[#3a3a3e] border-[#3a3a3e] text-white mb-3" />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Input placeholder="MM/YY" className="bg-[#3a3a3e] border-[#3a3a3e] text-white" />
              <Input placeholder="CVC" className="bg-[#3a3a3e] border-[#3a3a3e] text-white" />
            </div>
            <Button onClick={handlePayment} disabled={processing} className="bg-[#30d158] hover:bg-[#28a745] text-white w-full">
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
              {processing ? 'Processing...' : 'Process Payment via VaultPay™'}
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#0071e3] text-white text-sm flex items-center justify-center">3</span> Order Confirmation
            </h4>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-300 text-sm mb-2">Your order is confirmed!</p>
            <p className="text-green-400 text-sm mb-4">ClaimRoot™ License Activated!</p>
            <Button onClick={() => setStep(1)} className="bg-[#30d158] hover:bg-[#28a745] text-white">Complete & Return</Button>
          </div>
        )}
      </div>
    </div>
  );
}