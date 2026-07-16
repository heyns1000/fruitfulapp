import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, GitBranch, Webhook, Code2, ArrowRight, Info, AlertCircle, ExternalLink, Shield } from 'lucide-react';
import { toast } from 'sonner';

const MASTER_NODE = "https://fruitfulapp.base44.app";
const CHILD_NODE = "bushcoding.onhercules.app";
const ENTITY_ID = "2021/121654/07";

function CopyBlock({ label, value, mono = true }) {
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
        <pre className={`flex-1 text-sm bg-gray-900 text-green-400 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre-wrap break-all ${!mono ? 'font-sans' : 'font-mono'}`}>{value}</pre>
        <Button variant="outline" size="sm" onClick={copy} className="shrink-0 gap-1.5 mt-0.5">
          {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}

const childCode = `import React from 'react';

/**
 * Child Node Payment Logic
 * Location: ${CHILD_NODE}
 * Direction: Signals the Motherload (fruitfulapp.base44.app) via Paystack Metadata
 */

const ChildPaymentWrapper = ({ cartItems, totalAmount, userEmail }) => {
  const MASTER_NODE = "${MASTER_NODE}";
  const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY; // Set via App Secrets

  const handlePayment = () => {
    const metadata = {
      site_origin: window.location.hostname, // "bushcoding.onhercules.app"
      order_id: \`FAA-\${Date.now()}\`,
      entity_id: "${ENTITY_ID}",
      cart_items: cartItems.map(item => ({
        code: \`FAA-\${item.name.toUpperCase()}\`,
        name: item.name,
        price: item.price
      })),
      custom_fields: [
        {
          display_name: "Entity Registration",
          variable_name: "entity_reg",
          value: "${ENTITY_ID}"
        }
      ]
    };

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: userEmail,
      amount: totalAmount * 100, // ZAR in cents
      currency: "ZAR",
      metadata: metadata,
      callback: (response) => {
        // Redirect to Motherload for final reconciliation
        const callbackUrl = \`\${MASTER_NODE}/checkout?paystack_callback=true&reference=\${response.reference}&origin=\${metadata.site_origin}\`;
        window.location.href = callbackUrl;
      },
      onClose: () => {
        console.log("Sovereign Node: Payment session closed by user.");
      }
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-[#e63946] text-foreground px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
    >
      Initialize Vibe Payment
    </button>
  );
};

export default ChildPaymentWrapper;`;

const metadataSpec = `{
  "site_origin": "bushcoding.onhercules.app",
  "order_id":    "FAA-1234567890",
  "entity_id":   "${ENTITY_ID}",
  "cart_items": [
    { "code": "FAA-PRODUCTNAME", "name": "Product Name", "price": 99.99 }
  ],
  "custom_fields": [
    {
      "display_name": "Entity Registration",
      "variable_name": "entity_reg",
      "value": "${ENTITY_ID}"
    }
  ]
}`;

const steps = [
  { icon: '🧒', label: 'Child site', desc: `Client pays on ${CHILD_NODE} using the shared Paystack public key.` },
  { icon: '💳', label: 'Paystack', desc: 'Paystack processes the transaction and receives the metadata signal.' },
  { icon: '🔔', label: 'Webhook', desc: `Paystack pings the Motherload webhook at ${MASTER_NODE}/api/paystack/webhook.` },
  { icon: '🧠', label: 'Motherload reads', desc: 'Motherload reads site_origin, updates master database, tags the order FAA-prefix.' },
  { icon: '📊', label: 'Xero Sync', desc: 'Xero Inventory Sync fires with the reconciled transaction under entity 2021/121654/07.' },
];

export default function ChildNodeIntegration() {
  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-teal-700 to-green-700 rounded-2xl text-foreground">
        <div className="flex items-center gap-3 mb-2">
          <GitBranch className="w-6 h-6" />
          <h2 className="text-xl font-extrabold tracking-tight">Fruitful Shops™ — Motherload Routing Protocol</h2>
        </div>
        <p className="text-sm text-teal-100">
          All payment events across all child URLs resolve to this Master Node for Xero reconciliation and inventory mineralization. Entity Reg: <strong>{ENTITY_ID}</strong>
        </p>
      </div>

      {/* Node Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitBranch className="w-4 h-4 text-teal-600" /> Node Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 p-4 rounded-xl border-2 border-teal-400 bg-teal-50 text-center">
              <Badge className="bg-teal-700 text-foreground mb-2">MASTER NODE — The Brain</Badge>
              <p className="font-mono text-sm font-bold text-teal-800">fruitfulapp.base44.app</p>
              <p className="text-xs text-teal-600 mt-1">Central DB · Xero · Webhook Handler</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 shrink-0 rotate-90 sm:rotate-0" />
            <div className="flex-1 p-4 rounded-xl border-2 border-primary bg-primary/5 text-center">
              <Badge className="bg-primary text-primary-foreground mb-2">CHILD NODE — The Forager</Badge>
              <p className="font-mono text-sm font-bold text-primary">bushcoding.onhercules.app</p>
              <p className="text-xs text-primary mt-1">Initiates payment · passes metadata</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paystack Dashboard Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Webhook className="w-4 h-4 text-purple-600" /> Paystack Dashboard Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
            <span>Paste these URLs in your <a href="https://dashboard.paystack.com/#/settings/developer" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Paystack Dashboard → Settings → API Keys &amp; Webhooks <ExternalLink className="w-3 h-3 inline" /></a></span>
          </div>
          <CopyBlock
            label="🔔 Webhook URL — Source of Truth (even if browser closes)"
            value={`${MASTER_NODE}/api/paystack/webhook`}
          />
          <CopyBlock
            label="✅ Callback URL — Post-payment redirect to Motherload"
            value={`${MASTER_NODE}/checkout?paystack_callback=true`}
          />
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <span>The <strong>Webhook URL</strong> is the Source of Truth. Even if a buyer closes their browser before callback, Paystack's server will ping the Motherload directly to confirm payment receipt.</span>
          </div>
        </CardContent>
      </Card>

      {/* Metadata Spec */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-4 h-4 text-indigo-600" /> Metadata Signal — Required on Every Child Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">Every transaction initiated from <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{CHILD_NODE}</code> must include these fields in the Paystack <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">metadata</code> object so the Motherload can reconcile correctly.</p>
          <CopyBlock label="Metadata JSON Spec" value={metadataSpec} />
        </CardContent>
      </Card>

      {/* Operational Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">⚡ Operational Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{i + 1}. {s.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Snippet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Code2 className="w-4 h-4 text-green-600" /> Child Node — Drop-in React Component
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">Copy this component into <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{CHILD_NODE}</code>. Replace the public key placeholder with your shared <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">pk_test_</code> or <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">pk_live_</code> key.</p>
          <CopyBlock label="ChildPaymentWrapper.jsx" value={childCode} />
        </CardContent>
      </Card>

    </div>
  );
}