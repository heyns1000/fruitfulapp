import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Package, Truck, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: XCircle
};

export default function OrderManagement({ orders }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const queryClient = useQueryClient();

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order updated');
      setIsDialogOpen(false);
    }
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (order, newStatus) => {
    await updateOrderMutation.mutateAsync({
      id: order.id,
      data: { status: newStatus }
    });
  };

  const addTracking = async () => {
    if (!trackingNumber) return;
    
    await updateOrderMutation.mutateAsync({
      id: selectedOrder.id,
      data: {
        status: 'shipped',
        fulfillment: {
          ...selectedOrder.fulfillment,
          trackingNumber,
          carrier: 'Standard Shipping'
        }
      }
    });
    setTrackingNumber('');
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500 capitalize">{key}</p>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No orders found</p>
            ) : (
              filteredOrders.map(order => {
                const StatusIcon = STATUS_ICONS[order.status];
                return (
                  <div key={order.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-lg">{order.serviceName}</p>
                        <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                        <p className="text-xs text-gray-400">{order.buyerEmail}</p>
                      </div>
                      <Badge className={STATUS_COLORS[order.status]}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-semibold">{order.currency} {order.amount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Quantity</p>
                        <p className="font-semibold">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Seller</p>
                        <p className="font-semibold">{order.sellerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-semibold">{new Date(order.created_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {order.fulfillment?.trackingNumber && (
                      <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                        <p className="text-gray-600">Tracking: <span className="font-mono font-semibold">{order.fulfillment.trackingNumber}</span></p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button size="sm" onClick={() => updateStatus(order, 'confirmed')}>
                          Confirm
                        </Button>
                      )}
                      {order.status === 'confirmed' && (
                        <Button size="sm" onClick={() => updateStatus(order, 'processing')}>
                          Start Processing
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button size="sm" onClick={() => {
                          setSelectedOrder(order);
                          setIsDialogOpen(true);
                        }}>
                          <Truck className="w-4 h-4 mr-1" />
                          Mark as Shipped
                        </Button>
                      )}
                      {order.status === 'shipped' && (
                        <Button size="sm" onClick={() => updateStatus(order, 'delivered')}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tracking Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tracking Number</label>
              <Input
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addTracking}>
              Add Tracking & Ship
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}