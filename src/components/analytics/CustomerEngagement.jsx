import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, MousePointer, Eye } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CustomerEngagement() {
  const engagementData = [
    { date: 'Feb 15', activeUsers: 18000, sessions: 24000, pageViews: 120000 },
    { date: 'Feb 16', activeUsers: 19500, sessions: 26000, pageViews: 135000 },
    { date: 'Feb 17', activeUsers: 21000, sessions: 28000, pageViews: 145000 },
    { date: 'Feb 18', activeUsers: 20500, sessions: 27500, pageViews: 140000 },
    { date: 'Feb 19', activeUsers: 22000, sessions: 30000, pageViews: 155000 },
    { date: 'Feb 20', activeUsers: 23500, sessions: 32000, pageViews: 165000 },
    { date: 'Feb 21', activeUsers: 24800, sessions: 34000, pageViews: 175000 }
  ];

  const brandEngagement = [
    { brand: 'Brand A', users: 8500, avgSession: '12m 34s', bounceRate: '32%' },
    { brand: 'Brand B', users: 6200, avgSession: '10m 45s', bounceRate: '38%' },
    { brand: 'Brand C', users: 5800, avgSession: '9m 12s', bounceRate: '41%' },
    { brand: 'Brand D', users: 4300, avgSession: '11m 22s', bounceRate: '35%' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">24.8K</div>
            <p className="text-xs text-blue-700 mt-1">Daily active users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Session Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">11m 24s</div>
            <p className="text-xs text-green-700 mt-1">↑ 8% vs last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">175K</div>
            <p className="text-xs text-purple-700 mt-1">Today's page views</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">36%</div>
            <p className="text-xs text-orange-700 mt-1">↓ 4% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trend */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Engagement Trends</CardTitle>
          <CardDescription>Active users, sessions, and page views over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="activeUsers" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Active Users" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Brand-Specific Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement by Brand</CardTitle>
          <CardDescription>User activity and session metrics per brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brandEngagement.map((brand, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">{brand.brand}</h3>
                  <span className="text-2xl font-bold text-blue-600">{brand.users.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Avg Session Duration</p>
                    <p className="font-semibold text-gray-900">{brand.avgSession}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bounce Rate</p>
                    <p className="font-semibold text-gray-900">{brand.bounceRate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}