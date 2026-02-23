import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, TrendingUp, DollarSign, Users, Sparkles } from 'lucide-react';

export default function CampaignManager() {
  const campaigns = [
    {
      id: 1,
      name: 'Holiday Bundle Promo',
      brands: ['Brand A', 'Brand B', 'Brand C'],
      status: 'Active',
      budget: 25000,
      spent: 18750,
      reach: 45000,
      conversions: 1250,
      startDate: '2026-02-01',
      endDate: '2026-02-28',
      aiScore: 94
    },
    {
      id: 2,
      name: 'Spring Launch Campaign',
      brands: ['Brand D', 'Brand E'],
      status: 'Planning',
      budget: 15000,
      spent: 0,
      reach: 0,
      conversions: 0,
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      aiScore: 87
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Marketing Campaigns</h2>
          <p className="text-gray-600 text-sm">Manage shared marketing campaigns across brands</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create Campaign
        </Button>
      </div>

      {/* AI Campaign Optimizer */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Sparkles className="w-5 h-5" />
            AI Campaign Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-semibold text-gray-900">💡 Recommended: Increase budget for Brand A by 15%</p>
            <p className="text-xs text-gray-600 mt-1">Expected ROI increase: +$3,200 | Confidence: 89%</p>
            <Button size="sm" className="mt-2">Apply Suggestion</Button>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-semibold text-gray-900">🎯 Target Optimization: Expand to 25-34 age group</p>
            <p className="text-xs text-gray-600 mt-1">Potential reach increase: +12,000 | Cost: $1,500</p>
            <Button size="sm" className="mt-2" variant="outline">Review Details</Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <div className="space-y-4">
        {campaigns.map(campaign => (
          <Card key={campaign.id} className="border-l-4 border-l-blue-600">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{campaign.name}</CardTitle>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {campaign.brands.map(brand => (
                      <Badge key={brand} className="bg-blue-600 text-white">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={campaign.status === 'Active' ? 'bg-green-600' : 'bg-orange-600'}>
                    {campaign.status}
                  </Badge>
                  <div className="flex items-center gap-1 mt-2 text-sm text-purple-700">
                    <Sparkles className="w-4 h-4" />
                    AI Score: {campaign.aiScore}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Budget Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Budget Spent</span>
                    <span className="font-semibold">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                  </div>
                  <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                </div>

                {/* Campaign Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                      <Users className="w-4 h-4" />
                      Reach
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{campaign.reach.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                      <Target className="w-4 h-4" />
                      Conversions
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{campaign.conversions.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                      <TrendingUp className="w-4 h-4" />
                      CVR
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {campaign.reach > 0 ? ((campaign.conversions / campaign.reach) * 100).toFixed(2) : 0}%
                    </div>
                  </div>
                </div>

                {/* Campaign Timeline */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {campaign.startDate} → {campaign.endDate}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline">View Details</Button>
                  <Button className="flex-1">Manage Campaign</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}