import React from 'react';
import { KeyRound, Ban, ExternalLink, ShieldCheck, UserCheck } from 'lucide-react';
import ServerAccessNotice from './ServerAccessNotice';
import { TAKEALOT_API, INTEGRATOR, RATE_LIMIT_HEADERS, TAKEALOT_RULES } from '@/lib/takealotReference';

const CARD = 'bg-white rounded-2xl border border-slate-200 p-6 shadow-sm';
const LABEL = 'text-[10px] font-bold uppercase tracking-widest text-slate-500';

const Row = ({ label, value, mono = false }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
    <span className={LABEL}>{label}</span>
    <span className={`text-sm font-semibold text-slate-900 text-right ${mono ? 'font-mono text-xs' : ''}`}>
      {value}
    </span>
  </div>
);

export default function TakealotConnection() {
  return (
    <div className="space-y-6">
      <ServerAccessNotice />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-slate-900">Seller account</h2>
          </div>
          <Row label="Seller" value={`${TAKEALOT_API.sellerName} · ${TAKEALOT_API.sellerId}`} />
          <Row label="API version" value={TAKEALOT_API.version} mono />
          <Row label="Base URL" value={TAKEALOT_API.baseUrl} mono />
          <Row label="Auth header" value={TAKEALOT_API.authHeader} mono />
          <Row label="Test environment" value="None — every call is live" />
        </div>

        <div className={CARD}>
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-slate-900">API key</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            The key is held as the server-side secret{' '}
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">TAKEALOT_API_KEY</span>. Only the
            backend reads it when calling Takealot — it never reaches page state, browser requests, records or logs.
          </p>
          <p className="text-sm text-slate-600 mt-3">
            Add or replace it under Secrets in the app dashboard. Takealot presents the key once at generation, so store
            it there as soon as it is issued.
          </p>
          <div className="mt-4 flex items-start gap-2 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <Ban className="w-4 h-4 shrink-0 mt-0.5" />
            <span>There is no sandbox, so verifying the connection and every offer write act on the live seller account.</span>
          </div>
        </div>
      </div>

      <div className={`${CARD} flex flex-wrap items-start justify-between gap-6`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-slate-900">Integrator declaration</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            Takealot asks which integrator operates the account. This integration is built and run in-house, so the app
            itself is declared rather than a third-party integrator — the portal shows &ldquo;You are currently not using
            an integrator&rdquo; until that name is entered.
          </p>
        </div>
        <div className="min-w-[240px] space-y-2">
          <Row label="Integrator name" value={INTEGRATOR.name} />
          <a
            href={TAKEALOT_API.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            Endpoint documentation <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={CARD}>
          <h2 className="font-bold text-slate-900 mb-2">Dynamic rate limits</h2>
          <p className="text-sm text-slate-600 mb-4">
            Limits vary by endpoint and shift with system load, so the current values arrive with each response.
          </p>
          <div className="space-y-2">
            {RATE_LIMIT_HEADERS.map(h => (
              <div
                key={h.header}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-slate-50 rounded-lg px-3 py-2"
              >
                <span className="font-mono text-xs text-teal-700">{h.header}</span>
                <span className="text-xs text-slate-600">{h.meaning}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            HTTP 429 means the window is spent — back off and retry rather than firing again straight away.
          </p>
        </div>

        <div className={CARD}>
          <h2 className="font-bold text-slate-900 mb-4">Integration rules</h2>
          <ul className="space-y-2.5">
            {TAKEALOT_RULES.map(rule => (
              <li key={rule} className="flex gap-2 text-sm text-slate-600">
                <span className="text-teal-600 mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}