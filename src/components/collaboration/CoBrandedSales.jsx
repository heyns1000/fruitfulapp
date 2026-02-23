import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Package, ShoppingCart, Sparkles } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CoBrandedSales() {
  const salesData = [
    { month: 'Jan', brandA: 12000, brandB: 8000, cobranded: 15000 },
    { month: 'Feb', brandA: 15000, brandB: 10000, cobranded: 22000 },
    { month: 'Mar', brandA: 18000, brandB: 12000, cobranded: 28000 },
    { month: 'Apr', brandA: 16000, brandB: 11000, cobranded: 25000 }
  ];

  const topBundles = [
    { name: 'Premium Package', brands: ['Brand A', 'Brand B'], sales: 245, revenue: 24500, growth: 23 },
    { name: 'Starter Bundle', brands: ['Brand C', 'Brand D'], sales: 189, revenue: 18900, growth: 15 },
    { name: 'Enterprise Suite', brands: ['Brand A', 'Brand E'], sales: 87, revenue: 43500, growth: 31 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Co-Branded Sales Tracking</h2>
        <p className="text-gray-600 text-sm">Monitor performance of cross-brand product bundles</p>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Co-Branded Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">$90,000</div>
            <p className="text-xs text-green-700 mt-1">↑ 24.5% vs last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Bundle Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">521</div>
            <p className="text-xs text-blue-700 mt-1">Across 12 active bundles</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Avg Bundle Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">$172</div>
            <p className="text-xs text-purple-700 mt-1">↑ $23 increase</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Sparkles className="w-5 h-5" />
            AI Sales Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-semibold text-gray-900">📈 Brand A + Brand B bundle shows 31% higher conversion when marketed together</p>
            <p className="text-xs text-gray-600 mt-1">Recommendation: Create dedicated landing page for this combo</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-semibold text-gray-900">🎯 Customers buying Brand C are 68% likely to purchase Brand D within 30 days</p>
            <p className="text-xs text-gray-600 mt-1">Recommendation: Trigger automated bundle offer email</p>
          </div>
        </CardContent>
      </Card>

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trends: Individual vs Co-Branded</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="brandA" stroke="#8b5cf6" name="Brand A Solo" />
              <Line type="monotone" dataKey="brandB" stroke="#3b82f6" name="Brand B Solo" />
              <Line type="monotone" dataKey="cobranded" stroke="#10b981" strokeWidth={3} name="Co-Branded" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Bundles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Top Performing Bundles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topBundles.map((bundle, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{bundle.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {bundle.brands.map(brand => (
                        <Badge key={brand} variant="outline" className="text-xs">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    ↑ {bundle.growth}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-600">Total Sales</p>
                    <p className="text-lg font-bold text-gray-900">{bundle.sales}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="text-lg font-bold text-gray-900">${bundle.revenue.toLocaleString()}</p>
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