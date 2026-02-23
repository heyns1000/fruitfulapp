import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, Gift, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function LoyaltyMetrics() {
  const tierDistribution = [
    { tier: 'Bronze', members: 12450, color: '#cd7f32' },
    { tier: 'Silver', members: 5230, color: '#C0C0C0' },
    { tier: 'Gold', members: 1820, color: '#FFD700' },
    { tier: 'Platinum', members: 580, color: '#E5E4E2' }
  ];

  const redemptionData = [
    { month: 'Jan', redemptions: 2100, value: 21000 },
    { month: 'Feb', redemptions: 2450, value: 24500 },
    { month: 'Mar', redemptions: 2800, value: 28000 },
    { month: 'Apr', redemptions: 3421, value: 34210 }
  ];

  const crossBrandActivity = [
    { activity: 'Points Earned Across Brands', count: 45200 },
    { activity: 'Cross-Brand Redemptions', count: 3421 },
    { activity: 'Referrals Made', count: 892 },
    { activity: 'Tier Upgrades', count: 234 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">20,080</div>
            <p className="text-xs text-yellow-700 mt-1">↑ 15.3% growth</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">3,421</div>
            <p className="text-xs text-green-700 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Points Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">452K</div>
            <p className="text-xs text-purple-700 mt-1">Across all brands</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">78.5%</div>
            <p className="text-xs text-blue-700 mt-1">Active participation</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Membership Tier Distribution</CardTitle>
            <CardDescription>Members across loyalty tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tier, percent }) => `${tier} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="members"
                >
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {tierDistribution.map((tier, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }}></div>
                    <span className="font-medium">{tier.tier}</span>
                  </div>
                  <span className="text-gray-600">{tier.members.toLocaleString()} members</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redemption Trends</CardTitle>
            <CardDescription>Monthly redemption activity and value</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={redemptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="redemptions" fill="#8b5cf6" name="Redemptions" />
                <Bar dataKey="value" fill="#10b981" name="Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cross-Brand Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Cross-Brand Loyalty Activity</CardTitle>
          <CardDescription>Unified loyalty program performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crossBrandActivity.map((item, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700 mb-2">{item.activity}</p>
                <p className="text-3xl font-bold text-purple-900">{item.count.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}