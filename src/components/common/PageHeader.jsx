import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BackButton from '../navigation/BackButton';

export default function PageHeader({ icon: Icon, title, subtitle, gradient = 'from-teal-600 via-emerald-600 to-cyan-600', showBack = true, children }) {
  return (
    <>
      <header className={`bg-gradient-to-r ${gradient} text-white py-8 shadow-xl`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {Icon && <Icon className="w-9 h-9 shrink-0 drop-shadow-lg" />}
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">{title}</h1>
                {subtitle && <p className="opacity-90 mt-1 text-sm sm:text-base">{subtitle}</p>}
              </div>
            </div>
            <Link to={createPageUrl('Dashboard')} className="shrink-0">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
                alt="FAA.ZONE"
                className="w-10 h-10 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
          </div>
        </div>
      </header>
      {showBack && (
        <div className="container mx-auto px-4 sm:px-6 pt-4">
          <BackButton />
        </div>
      )}
      {children}
    </>
  );
}