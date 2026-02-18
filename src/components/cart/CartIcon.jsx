import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from './CartContext';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function CartIcon() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Link to={createPageUrl('Checkout')}>
      <Button variant="outline" className="relative">
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-600 text-white px-2 py-0.5 text-xs">
            {itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}