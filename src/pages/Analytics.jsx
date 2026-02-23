import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Award, Headphones, Sparkles } from 'lucide-react';
import CrossPollinationMetrics from '../components/analytics/CrossPollinationMetrics';
import CustomerEngagement from '../components/analytics/CustomerEngagement';
import LoyaltyMetrics from '../components/analytics/LoyaltyMetrics';
import SupportMetrics from '../components/analytics/SupportMetrics';
import AIInsights from '../components/analytics/AIInsights';

export default function Analytics() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-teal-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights across all integrated brands with AI-driven trend analysis
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Cross-Pollination Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">87.5%</div>
              <p className="text-xs text-purple-700 mt-1">↑ 12.3% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Customer Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">24.8K</div>
              <p className="text-xs text-blue-700 mt-1">Active users this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Loyalty Redemptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">3,421</div>
              <p className="text-xs text-green-700 mt-1">↑ 18.5% increase</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">2.3h</div>
              <p className="text-xs text-orange-700 mt-1">↓ 35% improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Banner */}
        <AIInsights />

        {/* Analytics Tabs */}
        <Tabs defaultValue="crosspoll" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="crosspoll" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Cross-Pollination
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Customer Engagement
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Loyalty Program
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Support Tickets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crosspoll">
            <CrossPollinationMetrics />
          </TabsContent>

          <TabsContent value="engagement">
            <CustomerEngagement />
          </TabsContent>

          <TabsContent value="loyalty">
            <LoyaltyMetrics />
          </TabsContent>

          <TabsContent value="support">
            <SupportMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}