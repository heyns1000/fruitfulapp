import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AIInsights() {
  const [loading, setLoading] = useState(false);

  const insights = [
    {
      type: 'opportunity',
      icon: TrendingUp,
      title: 'High-Value Cross-Pollination Detected',
      description: 'Brand A and Brand E users show 73% overlap in purchase behavior',
      recommendation: 'Create a co-branded bundle targeting this segment',
      impact: 'Potential revenue increase: $12,500/month',
      confidence: 91
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Declining Engagement in Brand C',
      description: 'User activity down 18% in the past 2 weeks',
      recommendation: 'Launch re-engagement campaign with loyalty incentives',
      impact: 'Prevent estimated $8,200 revenue loss',
      confidence: 85
    },
    {
      type: 'insight',
      icon: Lightbulb,
      title: 'Optimal Campaign Timing Identified',
      description: 'Customer engagement peaks on Tuesdays at 2-4 PM',
      recommendation: 'Schedule major announcements during this window for 34% higher engagement',
      impact: 'Expected reach increase: +15,000 customers',
      confidence: 88
    }
  ];

  return (
    <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Sparkles className="w-6 h-6 text-purple-600" />
          AI-Driven Insights & Predictions
        </CardTitle>
        <CardDescription>
          Real-time analysis and actionable recommendations based on ecosystem data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-lg border-2 ${
                  insight.type === 'opportunity' ? 'bg-green-50 border-green-300' :
                  insight.type === 'warning' ? 'bg-primary/5 border-primary/40' :
                  'bg-blue-50 border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'opportunity' ? 'bg-green-200' :
                    insight.type === 'warning' ? 'bg-primary/15' :
                    'bg-blue-200'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      insight.type === 'opportunity' ? 'text-green-700' :
                      insight.type === 'warning' ? 'text-primary' :
                      'text-blue-700'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{insight.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                    <div className="p-3 bg-white rounded border border-gray-200 mb-2">
                      <p className="text-sm font-semibold text-gray-900">💡 Recommendation:</p>
                      <p className="text-sm text-gray-700">{insight.recommendation}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-purple-700">{insight.impact}</span>
                      <Button size="sm">Take Action</Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-purple-200">
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Generate More Insights'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}