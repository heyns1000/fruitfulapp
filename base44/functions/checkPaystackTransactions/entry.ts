import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!secret) return Response.json({ error: 'PAYSTACK_SECRET_KEY not set' }, { status: 500 });

    // Paystack transaction list endpoint — most recent first
    const url = 'https://api.paystack.co/transaction?perPage=25';
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Paystack API ${response.status}`, details: errText }, { status: response.status });
    }

    const data = await response.json();
    const txns = (data.data || []).map((t) => ({
      id: t.id,
      reference: t.reference,
      amount: t.amount, // kobo/cents
      currency: t.currency,
      status: t.status,
      channel: t.channel,
      customer: t.customer?.email,
      domain: t.domain, // 'live' or 'test'
      createdAt: t.created_at,
      paid_at: t.paid_at,
      metadata: t.metadata,
    }));

    return Response.json({
      status: data.status,
      total: txns.length,
      liveCount: txns.filter((t) => t.domain === 'live').length,
      testCount: txns.filter((t) => t.domain === 'test').length,
      transactions: txns,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});