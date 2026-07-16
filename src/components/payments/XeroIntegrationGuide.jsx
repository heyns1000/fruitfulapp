import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, ExternalLink, AlertCircle, Info, Key, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

function CopyBlock({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <div className="flex gap-2 items-start">
        <pre className="flex-1 text-sm bg-gray-900 text-green-400 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre-wrap break-all font-mono">{value}</pre>
        <Button variant="outline" size="sm" onClick={copy} className="shrink-0 gap-1.5 mt-0.5">
          {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}

const xeroFields = [
  { secret: 'XERO_CLIENT_ID', desc: 'From Xero Developer App → OAuth2 → Client ID', required: true },
  { secret: 'XERO_CLIENT_SECRET', desc: 'From Xero Developer App → OAuth2 → Client Secret', required: true },
  { secret: 'XERO_TENANT_ID', desc: 'Your Xero Organisation Tenant ID (GUID format)', required: true },
  { secret: 'XERO_REFRESH_TOKEN', desc: 'Long-lived refresh token from initial OAuth2 consent flow', required: true },
  { secret: 'PAYSTACK_SECRET_KEY', desc: 'sk_live_ key — used to verify webhook HMAC signature', required: true },
  { secret: 'XERO_ACCOUNT_CODE', desc: 'Chart of Accounts code for sales (e.g. 200). Default: 200', required: false },
  { secret: 'XERO_BRANDING_THEME_ID', desc: 'Optional branding theme GUID for invoice templates', required: false },
];

const xeroSteps = [
  {
    step: 1,
    title: 'Create a Xero Developer App',
    detail: 'Go to developer.xero.com → My Apps → New App. Choose "Web App" (OAuth2). Set Redirect URI to: https://fruitfulapp.base44.app/xero/callback',
    link: 'https://developer.xero.com/app/manage',
    linkLabel: 'Open Xero Developer Portal',
  },
  {
    step: 2,
    title: 'Grant Required Scopes',
    detail: 'When authorising, enable these scopes: accounting.transactions, accounting.contacts, accounting.settings, offline_access (for refresh token).',
  },
  {
    step: 3,
    title: 'Run the OAuth2 Consent Flow Once',
    detail: 'Use Xero\'s OAuth2 Playground or Postman to complete the initial consent. This generates your first refresh_token. Copy it — it is long-lived and automatically rotated by the backend.',
    link: 'https://developer.xero.com/documentation/guides/oauth2/auth-flow/',
    linkLabel: 'Xero OAuth2 Flow Guide',
  },
  {
    step: 4,
    title: 'Find Your Tenant ID',
    detail: 'After authorisation, call GET https://api.xero.com/connections with your access token. The tenantId field in the response is what you need.',
  },
  {
    step: 5,
    title: 'Add All Secrets to This App',
    detail: 'Go to Dashboard → Secrets and add each value from the table below. The backend webhook handler reads these at runtime — never hardcoded.',
  },
  {
    step: 6,
    title: 'Set Paystack Webhook URL',
    detail: 'In Paystack Dashboard → Settings → API Keys & Webhooks, set Webhook URL to the backend function endpoint below. The handler verifies the HMAC signature automatically.',
  },
  {
    step: 7,
    title: 'Test with a ZAR 1.00 Transaction',
    detail: 'Use Paystack test card 4084 0840 8408 4081 on the child node. Watch the Xero Sales Invoices tab — a draft invoice tagged FAA-{order_id} should appear within seconds.',
  },
];

const webhookEndpoint = `https://fruitfulapp.base44.app/functions/paystackWebhookHandler`;

const xeroSchemaSnippet = `// Xero Invoice schema produced by the webhook handler:
{
  "Type": "ACCREC",
  "Contact": { "Name": "{buyer_email}" },
  "InvoiceNumber": "FAA-{order_id}",
  "Reference": "{paystack_reference}",
  "DueDateString": "{today + 30 days}",
  "CurrencyCode": "ZAR",
  "Status": "DRAFT",
  "LineItems": [
    {
      "Description": "{item.name} [{site_origin}]",
      "AccountCode": "{XERO_ACCOUNT_CODE}",
      "UnitAmount": {item.price},
      "Quantity": 1,
      "Tracking": [
        { "Name": "Site", "Option": "{site_origin}" },
        { "Name": "Entity", "Option": "2021/121654/07" }
      ]
    }
  ]
}`;

export default function XeroIntegrationGuide() {
  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl text-foreground">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-xl font-extrabold tracking-tight">Xero Integration — Developer Setup Guide</h2>
        </div>
        <p className="text-sm text-indigo-100">
          What your Xero developer / accountant needs to provide so the Paystack → Xero sync goes live for Fruitful Shops (Pty) Ltd — Entity <strong>2021/121654/07</strong>.
        </p>
      </div>

      {/* Requires Builder+ plan notice */}
      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-300 rounded-xl text-sm text-amber-900">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-bold">Builder+ Plan Required</p>
          <p>Backend functions (the webhook handler) require a <strong>Builder+ subscription</strong> on Base44. Upgrade first, then the function will be live at the endpoint below.</p>
        </div>
      </div>

      {/* Webhook Endpoint */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            🔔 Live Webhook Endpoint (copy into Paystack)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CopyBlock label="Paystack Webhook URL → paste in Paystack Dashboard → Settings → Webhooks" value={webhookEndpoint} />
          <p className="text-xs text-gray-500 mt-2">The handler verifies the <code>x-paystack-signature</code> HMAC header using your <code>PAYSTACK_SECRET_KEY</code> secret before processing any event.</p>
        </CardContent>
      </Card>

      {/* Required Secrets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-600" /> Required App Secrets — What Your Developer Must Provide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 mb-4">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
            <span>Add these in: <strong>Base44 Dashboard → Your App → Secrets</strong>. Never commit them to code.</span>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Secret Name</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Where to Find It</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {xeroFields.map((f) => (
                  <tr key={f.secret} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold">{f.secret}</code>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{f.desc}</td>
                    <td className="px-4 py-3">
                      <Badge variant={f.required ? 'default' : 'secondary'} className={f.required ? 'bg-red-600 text-foreground text-xs' : 'text-xs'}>
                        {f.required ? 'Required' : 'Optional'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Step by step */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📋 Step-by-Step Setup Checklist for Your Developer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {xeroSteps.map((s) => (
              <div key={s.step} className="flex gap-4 p-3 rounded-lg bg-gray-50 border">
                <span className="w-7 h-7 shrink-0 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">{s.step}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.detail}</p>
                  {s.link && (
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1.5 text-xs text-indigo-600 font-medium hover:underline">
                      {s.linkLabel} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Xero Schema Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📄 Xero Invoice Schema — Auto-Generated Per Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">Each Paystack webhook event produces this Xero invoice structure. Tracking categories tag every line by <code className="bg-gray-100 px-1 rounded text-xs">site_origin</code> and entity registration for Xero reporting.</p>
          <CopyBlock label="Xero ACCREC Invoice payload" value={xeroSchemaSnippet} />
        </CardContent>
      </Card>

    </div>
  );
}