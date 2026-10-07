import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Store, Coffee, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react';

const CAPABILITIES = [
  { icon: Store, title: 'Marketplace & artisans', text: 'Independent makers list products and portfolio work, customers browse and check out, and orders flow through fulfilment and delivery tracking.' },
  { icon: Coffee, title: 'Fruitful Coffee™', text: 'Green-coffee costing and global procurement — supplier profiles and origin lots, moisture and cupping-quality checks, and landed-cost calculations.' },
  { icon: ShieldCheck, title: 'BlockVault™ & VaultMesh™', text: 'Secure storage, access control and audit trails for records that need a verifiable chain of custody.' },
  { icon: BarChart3, title: 'Analytics & intelligence', text: 'Brand insights, sector analytics and market intelligence, plus a Data Sync Center that tracks integrations and sheet synchronisation.' },
];

const AUDIENCES = ['Brand managers & sector administrators', 'Independent artisans & makers', 'Coffee roasters, cafés & kiosk operators', 'Procurement & finance teams', 'Ecosystem partners & collaborators'];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black text-teal-900 mb-3">About FAA.ZONE™</h1>
      <p className="text-teal-700 text-lg mb-10">
        The operating platform behind the Fruitful™ ecosystem.
      </p>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-teal-900">What this app does</h2>
        </div>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            FAA.ZONE™ is a multi-sector brand network and commerce hub. It gives brand operators one
            place to register and govern brands across more than thirty sectors, allocate budgets,
            and follow performance through dashboards, brand insights and sector analytics. Brands
            can be explored by sector, compared side by side, and tracked from onboarding through
            financial allocation and review.
          </p>
          <p>
            Alongside brand governance the platform runs a working marketplace: independent artisans
            list products and portfolio work, customers browse and check out, and orders move through
            fulfilment and delivery tracking. Subscription boxes, a loyalty programme with reward
            offers, and collaboration tools for co-branded campaigns sit on the same foundation, and
            an Asset Library keeps logos, colour palettes and documents organised.
          </p>
          <p>
            Specialised operations are covered too. Fruitful Coffee™ handles green-coffee costing and
            global procurement, from supplier and origin records through quality checks to landed
            cost. BlockVault™ and VaultMesh™ provide secure storage and audit trails, while CodeNest™
            and the App Builder let teams generate, preview and license digital projects.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <div className="grid sm:grid-cols-2 gap-4">
          {CAPABILITIES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5">
              <Icon className="w-5 h-5 text-teal-600 mb-2" />
              <h3 className="font-bold text-teal-900 text-sm mb-1">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-teal-900">Who it is for</h2>
        </div>
        <p className="text-slate-700 leading-relaxed mb-4">
          FAA.ZONE™ is built for the people who run the ecosystem day to day, and for the partners
          who need a dependable view of what their brands are doing:
        </p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {AUDIENCES.map((audience) => (
            <li key={audience} className="flex items-start gap-2 text-slate-700 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
              {audience}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-teal-900 mb-3">Who builds it</h2>
        <div className="bg-teal-50 rounded-2xl border border-teal-100 p-5">
          <p className="text-slate-700 leading-relaxed">
            This platform is designed and built by <strong className="text-teal-900">Fruitful Holdings
            (Pty) Ltd</strong>, a South African company directed by{' '}
            <strong className="text-teal-900">Heyns Schoeman</strong>. Product, engineering and design
            work are handled in-house, with components published across the Fruitful Global Planet
            repository family and governed by the Fruitful Proprietary Source License.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to="/Contact">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors">
            Get in touch
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
        <Link to="/LegalDocuments">
          <button className="px-5 py-2.5 rounded-xl bg-white border border-teal-200 hover:bg-teal-50 text-teal-800 font-semibold text-sm transition-colors">
            Legal documents
          </button>
        </Link>
      </div>
    </div>
  );
}