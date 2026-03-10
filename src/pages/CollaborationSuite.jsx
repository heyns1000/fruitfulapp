import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileEdit, Megaphone, DollarSign, Headphones } from 'lucide-react';
import CrossAppLinks from '../components/common/CrossAppLinks';
import ContentCoCreation from '../components/collaboration/ContentCoCreation';
import CampaignManager from '../components/collaboration/CampaignManager';
import CoBrandedSales from '../components/collaboration/CoBrandedSales';
import SupportCoordination from '../components/collaboration/SupportCoordination';
import AIProposalEngine from '../components/collaboration/AIProposalEngine';

export default function CollaborationSuite() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-teal-900 mb-2">
            Collaboration Suite
          </h1>
          <p className="text-gray-600">
            AI-powered tools for brands to co-create, manage campaigns, track sales, and coordinate support
          </p>
        </div>

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
          <TabsList className="grid w-full grid-cols-4 mb-6">
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
        </Tabs>
      </div>
    </div>
  );
}