import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Copy, CheckCircle2, ExternalLink, Key, Webhook, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

const APP_BASE_URL = window.location.origin;
const CALLBACK_URL = `${APP_BASE_URL}/checkout?paystack_callback=true`;
const WEBHOOK_URL = `${APP_BASE_URL}/api/paystack/webhook`;

function CopyField({ label, value, description }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <div className="flex gap-2">
        <Input readOnly value={value} className="font-mono text-sm bg-gray-50 text-gray-800 flex-1" />
        <Button variant="outline" size="sm" onClick={copy} className="shrink-0 gap-1.5">
          {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}

export default function PaystackSettings() {
  return (
    <div className="space-y-6 max-w-3xl">

      {/* Info banner */}
      <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
        <div>
          <p className="font-semibold mb-1">How to configure Paystack</p>
          <p>Copy the URLs below, then paste them into your <strong>Paystack Dashboard → Settings → API Keys &amp; Webhooks</strong>. Use your <strong>Test keys</strong> during development and <strong>Live keys</strong> for production.</p>
          <a
            href="https://dashboard.paystack.com/#/settings/developer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-blue-700 font-medium hover:underline"
          >
            Open Paystack Developer Settings <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Callback & Webhook URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Webhook className="w-5 h-5 text-teal-600" />
            Callback &amp; Webhook URLs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <CopyField
            label="✅ Callback URL (Test &amp; Live)"
            value={CALLBACK_URL}
            description="Paste this in Paystack → Settings → API Keys & Webhooks → 'Callback URL'. Paystack redirects customers here after payment."
          />
          <CopyField
            label="🔔 Webhook URL (Test &amp; Live)"
            value={WEBHOOK_URL}
            description="Paste this in Paystack → Settings → API Keys & Webhooks → 'Webhook URL'. Paystack sends server-to-server payment events here."
          />

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>Paystack requires both URLs to be <strong>publicly accessible HTTPS</strong> endpoints. During local development, use a tunnel like <strong>ngrok</strong> and update the URLs accordingly.</span>
          </div>
        </CardContent>
      </Card>

      {/* API Keys instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="w-5 h-5 text-purple-600" />
            API Keys Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Your Paystack API keys are stored as <strong>app secrets</strong>. They are never exposed to the browser. To update them, go to your app's <strong>Secrets</strong> settings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-500 text-white text-xs">TEST</Badge>
                <span className="font-semibold text-sm">Test Keys</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <code className="bg-white px-1 rounded">PAYSTACK_SECRET_KEY</code> → starts with <code>sk_test_</code></li>
                <li>• <code className="bg-white px-1 rounded">PAYSTACK_PUBLIC_KEY</code> → starts with <code>pk_test_</code></li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-600 text-white text-xs">LIVE</Badge>
                <span className="font-semibold text-sm">Live Keys</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <code className="bg-white px-1 rounded">PAYSTACK_SECRET_KEY</code> → starts with <code>sk_live_</code></li>
                <li>• <code className="bg-white px-1 rounded">PAYSTACK_PUBLIC_KEY</code> → starts with <code>pk_live_</code></li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Keys are encrypted at rest and never logged. Only use Live keys once you've tested with Test keys.</span>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-step */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Step-by-Step Setup Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-gray-700">
            {[
              'Log in to dashboard.paystack.com',
              'Go to Settings → API Keys & Webhooks',
              'Copy and paste the Callback URL from above',
              'Copy and paste the Webhook URL from above',
              'Click "Save Changes" on the Paystack page',
              'Copy your Test Secret Key and Test Public Key',
              'Add them as app secrets (PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY)',
              'Test a payment using Paystack\'s test card: 4084 0840 8408 4081',
              'Once verified, repeat with your Live keys',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}