import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

export default function TransactionHistory({ payments }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGateway, setFilterGateway] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesGateway = filterGateway === 'all' || payment.gateway === filterGateway;
    return matchesSearch && matchesStatus && matchesGateway;
  });

  const stats = {
    total: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">R{stats.total.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{stats.completed}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700">{stats.failed}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGateway} onValueChange={setFilterGateway}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gateways</SelectItem>
                <SelectItem value="PayFast">PayFast</SelectItem>
                <SelectItem value="Ozow">Ozow</SelectItem>
                <SelectItem value="Yoco">Yoco</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions found</p>
            ) : (
              filteredPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{payment.brandName || 'Unknown Brand'}</p>
                      <Badge variant="outline" className="text-xs">
                        {payment.gateway}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{payment.transactionId}</p>
                    <p className="text-xs text-gray-400">
                      {payment.customerEmail} • {new Date(payment.created_date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">R{payment.amount?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{payment.paymentMethod}</p>
                    </div>
                    <Badge className={STATUS_COLORS[payment.status]}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}