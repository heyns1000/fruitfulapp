import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

export default function PerformanceMonitor({ brands }) {
  const [timePeriod, setTimePeriod] = useState('7d');

  const topPerformers = brands
    .sort((a, b) => (b.metadata?.activeNodes || 0) - (a.metadata?.activeNodes || 0))
    .slice(0, 5);

  const performanceData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    nodes: Math.floor(Math.random() * 5000) + 1000,
    syncs: Math.floor(Math.random() * 200) + 50,
    requests: Math.floor(Math.random() * 10000) + 2000
  }));

  const sectorPerformance = brands.reduce((acc, brand) => {
    const sector = brand.sector;
    if (!acc[sector]) {
      acc[sector] = { sector, count: 0, totalNodes: 0 };
    }
    acc[sector].count++;
    acc[sector].totalNodes += brand.metadata?.activeNodes || 0;
    return acc;
  }, {});

  const sectorData = Object.values(sectorPerformance).slice(0, 6);

  const overallMetrics = {
    totalNodes: brands.reduce((sum, b) => sum + (b.metadata?.activeNodes || 0), 0),
    avgPerformance: 87,
    totalSyncs: 1247,
    uptime: 99.8
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-700">Performance Overview</h2>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-700">
              {overallMetrics.totalNodes.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">{overallMetrics.avgPerformance}%</p>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="w-4 h-4" />
              <span>+5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Syncs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-700">
              {overallMetrics.totalSyncs.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <Activity className="w-4 h-4" />
              <span>Active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{overallMetrics.uptime}%</p>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <Zap className="w-4 h-4" />
              <span>Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Node Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="nodes" stroke="#ea580c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sector Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalNodes" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((brand, idx) => (
              <div key={brand.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-600 text-white w-8 h-8 flex items-center justify-center">
                    #{idx + 1}
                  </Badge>
                  <div>
                    <p className="font-semibold">{brand.name}™</p>
                    <p className="text-sm text-gray-500">{brand.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-orange-700">
                    {(brand.metadata?.activeNodes || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Active Nodes</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}