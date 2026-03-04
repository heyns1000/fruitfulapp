import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useCart } from '../components/cart/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShoppingBag, Trash2, CreditCard, Package } from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria'
  });

  const handlePayWithPaystack = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!shippingInfo.name || !shippingInfo.addressLine1 || !shippingInfo.city) {
      toast.error('Please complete shipping information');
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = getTotal() * 100; // Paystack expects amount in kobo (for NGN)
      const orderNumber = `ORD-${Date.now()}`;

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: totalAmount,
        currency: 'NGN',
        ref: orderNumber,
        metadata: {
          custom_fields: [
            {
              display_name: "Cart Items",
              variable_name: "cart_items",
              value: cartItems.length
            },
            {
              display_name: "Order Number",
              variable_name: "order_number",
              value: orderNumber
            }
          ]
        },
        callback: async (response) => {
          // Payment successful
          try {
            await base44.entities.Order.create({
              orderNumber: orderNumber,
              items: cartItems.map(item => ({
                serviceId: item.id,
                serviceName: item.name,
                productCode: item.productCode || `PROD-${item.id}`,
                quantity: item.quantity,
                unitPrice: item.price,
                imageUrl: item.imageUrl
              })),
              buyerEmail: email,
              totalAmount: getTotal(),
              currency: 'NGN',
              status: 'confirmed',
              paystackReference: response.reference,
              paymentStatus: 'paid',
              shippingAddress: shippingInfo
            });

            await base44.entities.Payment.create({
              transactionId: response.reference,
              amount: getTotal(),
              currency: 'NGN',
              gateway: 'Paystack',
              paymentMethod: 'card',
              status: 'completed',
              type: 'marketplace',
              customerEmail: email
            });

            clearCart();
            toast.success('Order placed successfully!');
            setTimeout(() => {
              window.location.href = createPageUrl('Dashboard');
            }, 2000);
          } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Payment successful but order creation failed. Contact support.');
          }
        },
        onClose: () => {
          toast.info('Payment cancelled');
          setIsProcessing(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initialize payment');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-green-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some items to get started</p>
              <Link to={createPageUrl('Marketplace')}>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8" />
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Cart Items ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.productCode && (
                        <p className="text-xs text-gray-500">Code: {item.productCode}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        ₦{item.price?.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Address Line 1</label>
                  <Input
                    value={shippingInfo.addressLine1}
                    onChange={(e) => setShippingInfo({...shippingInfo, addressLine1: e.target.value})}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Address Line 2 (Optional)</label>
                  <Input
                    value={shippingInfo.addressLine2}
                    onChange={(e) => setShippingInfo({...shippingInfo, addressLine2: e.target.value})}
                    placeholder="Apt 4B"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">City</label>
                    <Input
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">State</label>
                    <Input
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      placeholder="Lagos"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Postal Code</label>
                    <Input
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                      placeholder="100001"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Country</label>
                    <Input
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      placeholder="Nigeria"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₦{getTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₦{getTotal().toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayWithPaystack}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay with Paystack
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Secure payment powered by Paystack. Your card information is never stored.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}