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

        <div className="min-h-screen" style={{ background: 'var(--brand-background)' }}>
          {/* Global banner + nav */}
          <GlobalNavBar />

          {/* Cart icon - persistent top right */}
          <div className="fixed top-4 right-4 z-[9999]">
            <CartIcon />
          </div>

          {/* Back Button - top left, all non-dashboard pages */}
          {!isDashboard && (
            <div className="fixed top-4 left-4 z-[9999]">
              <button
                onClick={goBack}
                className="bn-outline"
                style={{ minHeight: '40px', padding: '0 20px' }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>
          )}

          {/* Main content */}
          <main className="pt-6">
          {children}
          </main>
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}