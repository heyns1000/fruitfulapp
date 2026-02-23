import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Link2, Users, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function CrossPollinationMetrics() {
  const synergyData = [
    { pair: 'A ↔ B', score: 94, interactions: 1240, revenue: 45000 },
    { pair: 'C ↔ D', score: 87, interactions: 980, revenue: 38000 },
    { pair: 'A ↔ E', score: 82, interactions: 760, revenue: 29000 },
    { pair: 'B ↔ C', score: 78, interactions: 650, revenue: 24000 }
  ];

  const radarData = [
    { metric: 'User Overlap', value: 85 },
    { metric: 'Revenue Synergy', value: 78 },
    { metric: 'Content Sharing', value: 92 },
    { metric: 'Support Integration', value: 88 },
    { metric: 'Campaign Success', value: 81 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Active Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">28</div>
            <p className="text-xs text-purple-700 mt-1">Brand pair connections</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Cross-Brand Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">8,453</div>
            <p className="text-xs text-blue-700 mt-1">↑ 23% growth this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Synergy Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">87.5</div>
            <p className="text-xs text-green-700 mt-1">Overall ecosystem health</p>
          </CardContent>
        </Card>
      </div>

      {/* Brand Pair Synergy Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Pair Synergy Scores</CardTitle>
          <CardDescription>Interaction volume and synergy strength</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={synergyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pair" />
              <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="score" fill="#8b5cf6" name="Synergy Score" />
              <Bar yAxisId="right" dataKey="interactions" fill="#10b981" name="Interactions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cross-Pollination Health Metrics</CardTitle>
          <CardDescription>Multi-dimensional synergy analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Pairs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Performing Brand Pairs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {synergyData.map((pair, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pair.pair.replace('↔', '×')}</h3>
                    <p className="text-sm text-gray-600">{pair.interactions.toLocaleString()} interactions</p>
                  </div>
                  <Badge className="bg-purple-600 text-white">
                    Score: {pair.score}
                  </Badge>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm font-semibold text-green-700">
                    Revenue Impact: ${pair.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}