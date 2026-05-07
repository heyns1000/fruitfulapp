import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentGateway from '../components/payments/PaymentGateway';
import SubscriptionManager from '../components/payments/SubscriptionManager';
import TransactionHistory from '../components/payments/TransactionHistory';
import PaystackSettings from '../components/payments/PaystackSettings';
import ChildNodeIntegration from '../components/payments/ChildNodeIntegration';
import XeroIntegrationGuide from '../components/payments/XeroIntegrationGuide';
import BackButton from '../components/navigation/BackButton';
import { Loader2, CreditCard } from 'lucide-react';

export default function Payments() {
  const [selectedTab, setSelectedTab] = useState('gateway');

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => base44.entities.Payment.list('-created_date', 100)
  });

  const { data: subscriptions = [], isLoading: subsLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date')
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list()
  });

  if (paymentsLoading || subsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 mb-8 shadow-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-extrabold drop-shadow-lg">Payment Gateway</h1>
              <p className="text-lg opacity-90 mt-1">Multi-Brand Payment & Subscription Management</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pb-12">
        <BackButton />
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="gateway" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              💳 Pay Now
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              🔄 Subscriptions
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              📊 Transaction History
            </TabsTrigger>
            <TabsTrigger value="paystack" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              ⚙️ Paystack Setup
            </TabsTrigger>
            <TabsTrigger value="childnode" className="data-[state=active]:bg-teal-700 data-[state=active]:text-white">
              🌐 Child Node Integration
            </TabsTrigger>
            <TabsTrigger value="xero" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
              📒 Xero Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gateway">
            <PaymentGateway brands={brands} />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionManager subscriptions={subscriptions} brands={brands} />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory payments={payments} />
          </TabsContent>

          <TabsContent value="paystack">
            <PaystackSettings />
          </TabsContent>

          <TabsContent value="childnode">
            <ChildNodeIntegration />
          </TabsContent>

          <TabsContent value="xero">
            <XeroIntegrationGuide />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}