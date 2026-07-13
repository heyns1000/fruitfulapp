import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CartProvider } from './components/cart/CartContext';
import ShananaCheckoutPanel from './components/shanana/ShananaCheckoutPanel';
import TreatyMonitor from './components/vaultmesh/TreatyMonitor';
import { WishlistProvider } from './components/wishlist/WishlistContext';
import CartIcon from './components/cart/CartIcon';
import GlobalNavBar from './components/navigation/GlobalNavBar';
import { ArrowLeft } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(createPageUrl('Dashboard'));
  };

  const isDashboard = currentPageName === 'Dashboard';

  return (
    <WishlistProvider>
      <CartProvider>
        <ShananaCheckoutPanel />
        <TreatyMonitor />

        <div className="relative">
          {/* Global banner + nav — fixed top, all pages */}
          <GlobalNavBar />

          {/* Cart icon - persistent top right (below nav) */}
          <div className="fixed top-16 right-4 z-[9999]">
            <CartIcon />
          </div>

          {/* Main content */}
          {children}

          {/* Floating Back Button - all non-dashboard pages */}
          {!isDashboard && (
            <button
              onClick={goBack}
              className="fixed bottom-6 right-6 z-[9998] flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all"
              style={{ background: '#18241C' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}