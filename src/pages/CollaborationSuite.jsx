import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileEdit, Megaphone, DollarSign, Headphones, Scale } from 'lucide-react';
import CrossAppLinks from '../components/common/CrossAppLinks';
import ContentCoCreation from '../components/collaboration/ContentCoCreation';
import CampaignManager from '../components/collaboration/CampaignManager';
import CoBrandedSales from '../components/collaboration/CoBrandedSales';
import SupportCoordination from '../components/collaboration/SupportCoordination';
import AIProposalEngine from '../components/collaboration/AIProposalEngine';
import NegotiationChat from '../components/collaboration/NegotiationChat';

export default function CollaborationSuite() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-8 shadow-xl mb-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-9 h-9 drop-shadow-lg" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">Collaboration Suite</h1>
                <p className="opacity-90 mt-1 text-sm sm:text-base">AI-powered tools for brands to co-create, campaign & coordinate</p>
              </div>
            </div>
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png" alt="FAA" className="w-10 h-10 object-contain opacity-90" />
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">

        <CrossAppLinks
          title="🔗 Navigate FAA.ZONE"
          pages={['Dashboard', 'Analytics', 'ContentGenerator', 'EcosystemExplorer', 'Marketplace', 'MySubscriptions']}
        />

        {/* Collaboration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">12</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Campaigns Running</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">8</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Co-branded Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">$45.2K</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">34</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Proposal Engine */}
        <AIProposalEngine />

        {/* Main Collaboration Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="flex flex-wrap gap-1 h-auto w-full mb-6 bg-white/80 p-2 rounded-xl">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileEdit className="w-4 h-4" />
              Content Co-Creation
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Marketing Campaigns
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Co-Branded Sales
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Support Coordination
            </TabsTrigger>
            <TabsTrigger value="negotiate" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Negotiation Advisor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentCoCreation />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignManager />
          </TabsContent>

          <TabsContent value="sales">
            <CoBrandedSales />
          </TabsContent>

          <TabsContent value="support">
            <SupportCoordination />
          </TabsContent>
          <TabsContent value="negotiate">
            <NegotiationChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}