import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Headphones, Clock, CheckCircle, AlertCircle, Users, Sparkles } from 'lucide-react';

export default function SupportCoordination() {
  const tickets = [
    {
      id: 'TKT-1234',
      title: 'Cross-brand billing inquiry',
      customer: 'John Doe',
      brands: ['Brand A', 'Brand B'],
      status: 'Open',
      priority: 'High',
      assignedTo: 'Support Team A',
      created: '2 hours ago',
      responses: 3
    },
    {
      id: 'TKT-1235',
      title: 'Bundle product compatibility question',
      customer: 'Jane Smith',
      brands: ['Brand C', 'Brand D'],
      status: 'In Progress',
      priority: 'Medium',
      assignedTo: 'Support Team C',
      created: '5 hours ago',
      responses: 5
    },
    {
      id: 'TKT-1236',
      title: 'Loyalty points redemption across brands',
      customer: 'Mike Johnson',
      brands: ['Brand A', 'Brand E'],
      status: 'Resolved',
      priority: 'Low',
      assignedTo: 'Support Team E',
      created: '1 day ago',
      responses: 7
    }
  ];

  const supportMetrics = {
    avgResponseTime: '2.3 hours',
    resolutionRate: '94%',
    customerSatisfaction: '4.8/5',
    crossBrandTickets: 34
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Support Coordination</h2>
        <p className="text-gray-600 text-sm">Unified support across all ecosystem brands</p>
      </div>

      {/* Support Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{supportMetrics.avgResponseTime}</div>
            <p className="text-xs text-blue-700 mt-1">↓ 35% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{supportMetrics.resolutionRate}</div>
            <p className="text-xs text-green-700 mt-1">First contact resolution</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              CSAT Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{supportMetrics.customerSatisfaction}</div>
            <p className="text-xs text-purple-700 mt-1">Customer satisfaction</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Cross-Brand Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{supportMetrics.crossBrandTickets}</div>
            <p className="text-xs text-primary mt-1">Active this week</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Support Assistant */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Sparkles className="w-5 h-5" />
            AI Support Assistant Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-semibold text-gray-900">💬 Auto-suggested response for TKT-1234</p>
            <p className="text-xs text-gray-600 mt-1">"Based on previous similar tickets, the billing issue can be resolved by..."</p>
            <Button size="sm" className="mt-2">Use Suggestion</Button>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-semibold text-gray-900">🔀 Recommend routing TKT-1235 to Brand D specialist</p>
            <p className="text-xs text-gray-600 mt-1">This ticket involves product features specific to Brand D's domain</p>
            <Button size="sm" className="mt-2" variant="outline">Review & Route</Button>
          </div>
        </CardContent>
      </Card>

      {/* Ticket List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            Cross-Brand Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-gray-600">{ticket.id}</span>
                      <Badge className={
                        ticket.status === 'Open' ? 'bg-red-600' :
                        ticket.status === 'In Progress' ? 'bg-blue-600' :
                        'bg-green-600'
                      }>
                        {ticket.status}
                      </Badge>
                      <Badge variant="outline" className={
                        ticket.priority === 'High' ? 'border-red-500 text-red-700' :
                        ticket.priority === 'Medium' ? 'border-primary text-primary' :
                        'border-gray-500 text-gray-700'
                      }>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Customer: {ticket.customer}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3 mb-3">
                  {ticket.brands.map(brand => (
                    <Badge key={brand} className="bg-teal-600 text-foreground">
                      {brand}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Assigned: {ticket.assignedTo}</span>
                  <span>{ticket.responses} responses • {ticket.created}</span>
                </div>

                <Button className="w-full mt-3" variant="outline">View & Respond</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}