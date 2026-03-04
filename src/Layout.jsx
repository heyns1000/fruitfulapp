import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CartProvider } from './components/cart/CartContext';
import CartIcon from './components/cart/CartIcon';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Dashboard', page: 'Dashboard' },
  { label: 'Marketplace', page: 'Marketplace' },
  { label: 'Gallery', page: 'Gallery' },
  { label: 'Collaboration', page: 'CollaborationSuite' },
  { label: 'Analytics', page: 'Analytics' },
  { label: 'AI Content', page: 'ContentGenerator' },
  { label: 'Onboard Brand', page: 'BrandOnboarding' },
  { label: '🏆 Loyalty', page: 'LoyaltyProgram' },
  { label: '💳 My Plans', page: 'MySubscriptions' },
  { label: '🎨 My Shop', page: 'ArtisanDashboard' },
  { label: '📦 Orders', page: 'OrderHistory' },
];

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50">
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-md border-b-2 border-teal-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 shrink-0">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
                  alt="FAA.ZONE"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold text-teal-900 hidden sm:block">FAA.ZONE™</span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-1 flex-wrap justify-end">
                {NAV_LINKS.map(({ label, page }) => (
                  <Link key={page} to={createPageUrl(page)}>
                    <button className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      currentPageName === page
                        ? 'bg-teal-600 text-white'
                        : 'text-teal-700 hover:bg-teal-50'
                    }`}>
                      {label}
                    </button>
                  </Link>
                ))}
                <CartIcon />
              </div>

              {/* Mobile: Cart + Hamburger */}
              <div className="flex items-center gap-2 lg:hidden">
                <CartIcon />
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
              <div className="lg:hidden mt-3 pb-2 border-t border-teal-100 pt-3 flex flex-col gap-1">
                {NAV_LINKS.map(({ label, page }) => (
                  <Link key={page} to={createPageUrl(page)} onClick={() => setMenuOpen(false)}>
                    <button className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPageName === page
                        ? 'bg-teal-600 text-white'
                        : 'text-teal-700 hover:bg-teal-50'
                    }`}>
                      {label}
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">© 2025 FAA.ZONE™ · Financial Allocation Architecture</p>
            <p className="text-xs text-gray-500 mt-2">Powered by Paystack · Secure Payments</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}