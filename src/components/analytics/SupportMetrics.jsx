import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones, Clock, CheckCircle, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SupportMetrics() {
  const ticketTrends = [
    { date: 'Feb 15', created: 45, resolved: 42, avgTime: 2.8 },
    { date: 'Feb 16', created: 52, resolved: 48, avgTime: 2.6 },
    { date: 'Feb 17', created: 38, resolved: 40, avgTime: 2.4 },
    { date: 'Feb 18', created: 41, resolved: 39, avgTime: 2.5 },
    { date: 'Feb 19', created: 47, resolved: 45, avgTime: 2.3 },
    { date: 'Feb 20', created: 35, resolved: 38, avgTime: 2.2 },
    { date: 'Feb 21', created: 42, resolved: 44, avgTime: 2.1 }
  ];

  const brandTickets = [
    { brand: 'Brand A', open: 12, inProgress: 8, resolved: 145, avgTime: '2.1h' },
    { brand: 'Brand B', open: 8, inProgress: 5, resolved: 123, avgTime: '2.4h' },
    { brand: 'Brand C', open: 6, inProgress: 4, resolved: 98, avgTime: '2.7h' },
    { brand: 'Brand D', open: 4, inProgress: 3, resolved: 87, avgTime: '2.3h' }
  ];

  const categoryBreakdown = [
    { category: 'Billing', count: 78 },
    { category: 'Technical', count: 124 },
    { category: 'Product Info', count: 95 },
    { category: 'Cross-Brand', count: 34 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">34</div>
            <p className="text-xs text-blue-700 mt-1">Across all brands</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">2.3h</div>
            <p className="text-xs text-green-700 mt-1">↓ 35% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">94%</div>
            <p className="text-xs text-purple-700 mt-1">First contact resolution</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              CSAT Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">4.8/5</div>
            <p className="text-xs text-primary mt-1">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Trends (7 Days)</CardTitle>
          <CardDescription>Created vs resolved tickets and response times</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ticketTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="created" stroke="#ef4444" name="Created" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke="#8b5cf6" name="Avg Time (hrs)" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Brand-Specific Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets by Brand</CardTitle>
          <CardDescription>Current status and resolution metrics per brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brandTickets.map((brand, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">{brand.brand}</h3>
                  <span className="text-sm text-gray-600">Avg: {brand.avgTime}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="text-red-900 font-bold">{brand.open}</p>
                    <p className="text-xs text-red-700">Open</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-blue-900 font-bold">{brand.inProgress}</p>
                    <p className="text-xs text-blue-700">In Progress</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-green-900 font-bold">{brand.resolved}</p>
                    <p className="text-xs text-green-700">Resolved</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-purple-900 font-bold">{((brand.resolved / (brand.open + brand.inProgress + brand.resolved)) * 100).toFixed(0)}%</p>
                    <p className="text-xs text-purple-700">Success</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Categories</CardTitle>
          <CardDescription>Support requests by type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}