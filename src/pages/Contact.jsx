import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Globe, FileText } from 'lucide-react';

const EMAILS = [
  { address: 'vault@faa.zone', label: 'General & licensing enquiries' },
  { address: 'support@faa.zone', label: 'Platform support' },
];

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-black text-teal-900 mb-3">Contact Us</h1>
      <p className="text-teal-700 text-lg mb-10">
        Questions about the platform, licensing or a partnership — we would like to hear from you.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-teal-900 mb-3">Email</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {EMAILS.map(({ address, label }) => (
            <a
              key={address}
              href={`mailto:${address}`}
              className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5 hover:border-teal-300 transition-colors block"
            >
              <Mail className="w-5 h-5 text-teal-600 mb-2" />
              <p className="font-semibold text-teal-900 text-sm break-all">{address}</p>
              <p className="text-slate-600 text-xs mt-1">{label}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-teal-900 mb-3">Company</h2>
        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-teal-900 text-sm">Fruitful Holdings (Pty) Ltd</p>
              <p className="text-slate-600 text-sm">Willow Acres Estate, Gauteng, South Africa</p>
              <p className="text-slate-500 text-sm">Director: Heyns Schoeman</p>
            </div>
          </div>
          <a
            href="https://faa.zone"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 pt-3 border-t border-teal-50 hover:opacity-80 transition-opacity"
          >
            <Globe className="w-5 h-5 text-teal-600 shrink-0" />
            <span className="font-semibold text-teal-800 text-sm">faa.zone</span>
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-teal-900 mb-3">Legal</h2>
        <Link
          to="/LegalDocuments"
          className="flex items-center gap-3 bg-white rounded-2xl border border-teal-100 shadow-sm p-5 hover:border-teal-300 transition-colors"
        >
          <FileText className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <p className="font-semibold text-teal-900 text-sm">Legal Documents</p>
            <p className="text-slate-600 text-xs mt-1">NDA, licensing terms and the official legal repository</p>
          </div>
        </Link>
      </section>
    </div>
  );
}