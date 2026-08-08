import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const apiKey = Deno.env.get('BLOCKVAULT_API_KEY');
    return Response.json({ ok: true, user: user.email, hasKey: !!apiKey });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});