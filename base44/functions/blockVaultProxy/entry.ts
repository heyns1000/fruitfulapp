import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

const BASE_URL = 'https://savvy-block-vault-sync.base44.app/api';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { entity, operation, id, query, data, sort_by, limit, skip } = body;
    const apiKey = secrets.get('BLOCKVAULT_API_KEY');

    if (!apiKey) return Response.json({ error: 'BLOCKVAULT_API_KEY secret not set' }, { status: 500 });
    if (!entity) return Response.json({ error: 'entity is required' }, { status: 400 });

    const base = `${BASE_URL}/entities/${entity}`;
    let url, method, payload;

    switch (operation) {
      case 'list': {
        const params = new URLSearchParams();
        if (query) params.set('q', JSON.stringify(query));
        if (limit) params.set('limit', String(limit));
        if (skip) params.set('skip', String(skip));
        if (sort_by) params.set('sort_by', sort_by);
        url = `${base}?${params.toString()}`;
        method = 'GET';
        break;
      }
      case 'get':
        url = `${base}/${id}`;
        method = 'GET';
        break;
      case 'create':
        url = base;
        method = 'POST';
        payload = data;
        break;
      case 'update':
        url = `${base}/${id}`;
        method = 'PUT';
        payload = data;
        break;
      case 'delete':
        url = `${base}/${id}`;
        method = 'DELETE';
        break;
      case 'deleteMany':
        url = base;
        method = 'DELETE';
        payload = query;
        break;
      case 'restore':
        url = `${base}/${id}/restore`;
        method = 'PUT';
        break;
      case 'bulkCreate':
        url = `${base}/bulk`;
        method = 'POST';
        payload = data;
        break;
      case 'bulkUpdate':
        url = `${base}/bulk`;
        method = 'PUT';
        payload = data;
        break;
      case 'updateMany':
        url = `${base}/update-many`;
        method = 'PATCH';
        payload = { query, data };
        break;
      default:
        return Response.json({ error: `Unknown operation: ${operation}` }, { status: 400 });
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'api_key': apiKey,
      },
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const result = await res.json();
      return Response.json(result, { status: res.status });
    }
    const text = await res.text();
    return new Response(text, { status: res.status, headers: { 'Content-Type': 'text/plain' } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}