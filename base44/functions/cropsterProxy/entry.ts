import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

const CROPSTER_RPC_BASE = 'https://api.cropster.com/rpc/v1';
const CROPSTER_TOKEN_URL = 'https://api.cropster.com/oauth/token';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const method = body.method || 'inventory.roast.listRoastedLots';
    const params = body.params || {};

    const clientId = secrets.get('CROPSTER_CLIENT_ID');
    const clientSecret = secrets.get('CROPSTER_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return Response.json({
        error: 'Cropster OAuth credentials not configured. Set CROPSTER_CLIENT_ID and CROPSTER_CLIENT_SECRET in app secrets.',
      }, { status: 503 });
    }

    // ── OAuth 2.0 Client Credentials Grant ──
    const tokenRes = await fetch(CROPSTER_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      },
      body: new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return Response.json({
        error: 'Cropster OAuth token request failed',
        status: tokenRes.status,
        details: errText,
      }, { status: 502 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return Response.json({ error: 'No access_token in Cropster OAuth response', raw: tokenData }, { status: 502 });
    }

    // ── RPC call — POST-only, application/json ──
    const rpcRes = await fetch(CROPSTER_RPC_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now(),
      }),
    });

    const rpcData = await rpcRes.json().catch(() => ({}));

    if (!rpcRes.ok) {
      return Response.json({
        error: 'Cropster RPC call failed',
        status: rpcRes.status,
        details: rpcData,
      }, { status: 502 });
    }

    // ── Bind roasted lot inventory into BOM drawdown ──
    // If listing roasted lots, persist inventory snapshot for BOM engine consumption
    if (method === 'inventory.roast.listRoastedLots' && rpcData.result) {
      const lots = Array.isArray(rpcData.result) ? rpcData.result : (rpcData.result.lots || []);
      waitUntilSyncGreenReceipts(base44, lots);
    }

    return Response.json({
      ok: true,
      method,
      result: rpcData.result,
      inventoryCount: Array.isArray(rpcData.result) ? rpcData.result.length : 0,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ── Post-response: sync Cropster roasted lots into GreenCoffeeReceipt drawdown ──
async function waitUntilSyncGreenReceipts(base44: any, lots: any[]) {
  try {
    for (const lot of lots.slice(0, 50)) {
      const lotId = lot.id || lot.lotId;
      if (!lotId) continue;
      const existing = await base44.asServiceRole.entities.GreenCoffeeReceipt.filter({ cropsterLotId: lotId });
      const drawdown = {
        cropsterLotId: lotId,
        quantityKg: lot.weight != null ? Number(lot.weight) : (lot.quantityKg || 0),
        status: 'received',
        notes: `Cropster synced: ${lot.name || lot.label || lotId}`,
      };
      if (existing.length > 0) {
        await base44.asServiceRole.entities.GreenCoffeeReceipt.update(existing[0].id, drawdown);
      }
    }
  } catch (e) {
    console.error('Cropster lot sync failed:', e.message);
  }
}