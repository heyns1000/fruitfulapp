import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CartProvider } from './components/cart/CartContext';
import CartIcon from './components/cart/CartIcon';

export default function Layout({ children, currentPageName }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50">
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-md border-b-2 border-teal-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
                  alt="FAA.ZONE"
                  className="w-12 h-12 object-contain"
                />
                <span className="text-2xl font-bold text-teal-900">FAA.ZONE™</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <Link to={createPageUrl('Dashboard')}>
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPageName === 'Dashboard' 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-700 hover:bg-teal-50'
                  }`}>
                    Dashboard
                  </button>
                </Link>
                <Link to={createPageUrl('Marketplace')}>
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPageName === 'Marketplace' 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-700 hover:bg-teal-50'
                  }`}>
                    Marketplace
                  </button>
                </Link>
                <Link to={createPageUrl('Gallery')}>
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPageName === 'Gallery' 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-700 hover:bg-teal-50'
                  }`}>
                    Gallery
                  </button>
                </Link>
                <Link to={createPageUrl('CollaborationSuite')}>
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPageName === 'CollaborationSuite' 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-700 hover:bg-teal-50'
                  }`}>
                    Collaboration
                  </button>
                </Link>
                <Link to={createPageUrl('Analytics')}>
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPageName === 'Analytics' 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-700 hover:bg-teal-50'
                  }`}>
                    Analytics
                  </button>
                </Link>
                <CartIcon />
              </div>
            </div>
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