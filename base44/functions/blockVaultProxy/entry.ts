import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const BASE = 'https://savvy-block-vault-sync.base44.app/api/entities';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const apiKey = Deno.env.get('BLOCKVAULT_API_KEY');
    if (!apiKey) return Response.json({ error: 'BLOCKVAULT_API_KEY not set' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const entity = body.entity;
    const operation = body.operation || 'list';
    if (!entity) return Response.json({ error: 'entity is required' }, { status: 400 });

    const headers = { 'Content-Type': 'application/json', 'api_key': apiKey };
    const entityUrl = BASE + '/' + entity;

    // LIST
    if (operation === 'list') {
      const params = new URLSearchParams();
      params.set('limit', String(body.limit ?? 100));
      params.set('skip', String(body.skip ?? 0));
      params.set('sort_by', body.sort_by || '-updated_date');
      if (body.filter) params.set('filter', JSON.stringify(body.filter));
      const response = await fetch(entityUrl + '?' + params.toString(), { headers });
      if (!response.ok) {
        const errText = await response.text();
        return Response.json({ error: `BlockVault API ${response.status}`, details: errText }, { status: response.status });
      }
      const data = await response.json();
      return Response.json(data);
    }

    // GET
    if (operation === 'get') {
      if (!body.id) return Response.json({ error: 'id is required' }, { status: 400 });
      const response = await fetch(entityUrl + '/' + body.id, { headers });
      if (!response.ok) {
        const errText = await response.text();
        return Response.json({ error: `BlockVault API ${response.status}`, details: errText }, { status: response.status });
      }
      const data = await response.json();
      return Response.json(data);
    }

    // CREATE
    if (operation === 'create') {
      const response = await fetch(entityUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body.data || {}),
      });
      if (!response.ok) {
        const errText = await response.text();
        return Response.json({ error: `BlockVault API ${response.status}`, details: errText }, { status: response.status });
      }
      const data = await response.json();
      return Response.json(data);
    }

    // BULK CREATE
    if (operation === 'bulkCreate') {
      const response = await fetch(entityUrl + '/bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify(body.data || []),
      });
      if (!response.ok) {
        const errText = await response.text();
        return Response.json({ error: `BlockVault API ${response.status}`, details: errText }, { status: response.status });
      }
      const data = await response.json();
      return Response.json(data);
    }

    // UPDATE
    if (operation === 'update') {
      if (!body.id) return Response.json({ error: 'id is required' }, { status: 400 });
      const response = await fetch(entityUrl + '/' + body.id, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body.data || {}),
      });
      if (!response.ok) {
        const errText = await response.text();
        return Response.json({ error: `BlockVault API ${response.status}`, details: errText }, { status: response.status });
      }
      const data = await response.json();
      return Response.json(data);
    }

    // DELETE
    if (operation === 'delete') {
      if (!body.id) return Response.json({ error: 'id is required' }, { status: 400 });
      const response = await fetch(entityUrl + '/' + body.id, { method: 'DELETE', headers });
      if (!response.ok) {
        const errText = await response.text();
        return Response.json({ error: `BlockVault API ${response.status}`, details: errText }, { status: response.status });
      }
      const data = await response.json().catch(() => ({}));
      return Response.json(data);
    }

    // RESTORE
    if (operation === 'restore') {
      if (!body.id) return Response.json({ error: 'id is required' }, { status: 400 });
      const response = await fetch(entityUrl + '/' + body.id + '/restore', { method: 'POST', headers });
      if (!response.ok) {
        const errText = await response.text();
        return Response.json({ error: `BlockVault API ${response.status}`, details: errText }, { status: response.status });
      }
      const data = await response.json().catch(() => ({}));
      return Response.json(data);
    }

    // SCHEMA
    if (operation === 'schema') {
      const response = await fetch(entityUrl + '/schema', { headers });
      if (!response.ok) {
        const errText = await response.text();
        return Response.json({ error: `BlockVault API ${response.status}`, details: errText }, { status: response.status });
      }
      const data = await response.json();
      return Response.json(data);
    }

    return Response.json({ error: 'Unknown operation: ' + operation }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});