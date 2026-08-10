import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// ═══════════════════════════════════════════════════════════════════════════
// Alibaba Cloud GPDB (AnalyticDB for PostgreSQL) Async Proxy
// ═══════════════════════════════════════════════════════════════════════════
// Replaces the Java alibabacloud-gpdb20160503 async SDK with a Deno-native
// equivalent. All OpenAPI calls use fetch + async/await — inherently
// non-blocking on Deno's event loop, achieving the same concurrency model
// as Java's CompletableFuture chains without the JVM dependency.
//
// Supports any GPDB RPC action: CheckServiceLinkedRole, DescribeClusters,
// ModifyClusterSpec (scaling), and all other 2016-05-03 API operations.
// ═══════════════════════════════════════════════════════════════════════════

const GPDB_API_VERSION = '2016-05-03';
const DEFAULT_ENDPOINT = 'gpdb.cn-hangzhou.aliyuncs.com';

// RFC 3986 percent-encoding per Alibaba Cloud signature spec
function pctEncode(value) {
  return encodeURIComponent(String(value))
    .replace(/!/g, '%21').replace(/'/g, '%27')
    .replace(/\(/g, '%28').replace(/\)/g, '%29')
    .replace(/\*/g, '%2A').replace(/~/g, '%7E')
    .replace(/%20/g, '%2B');
}

function buildCanonicalQuery(params) {
  return Object.keys(params).sort()
    .map(k => `${pctEncode(k)}=${pctEncode(params[k])}`)
    .join('&');
}

// HMAC-SHA1 → Base64 (Alibaba Cloud RPC signature v1.0)
async function hmacSha1Base64(key, message) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw', enc.encode(key),
    { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// Non-blocking async OpenAPI call — the Deno equivalent of:
//   CompletableFuture<Response> = client.checkServiceLinkedRole(req);
async function callGpdbApi(action, apiParams, regionId, endpoint) {
  const accessKeyId = secrets.get('ALIBABA_CLOUD_ACCESS_KEY_ID');
  const accessKeySecret = secrets.get('ALIBABA_CLOUD_ACCESS_KEY_SECRET');

  if (!accessKeyId || !accessKeySecret) {
    return {
      error: 'Alibaba Cloud credentials not configured. Add ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET in App Settings → Secrets to activate.',
      credentialsConfigured: false,
    };
  }

  const params = {
    Action: action,
    Format: 'JSON',
    Version: GPDB_API_VERSION,
    AccessKeyId: accessKeyId,
    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: crypto.randomUUID(),
    SignatureVersion: '1.0',
    Timestamp: new Date().toISOString().split('.')[0] + 'Z',
    ...apiParams,
  };
  if (regionId) params.RegionId = regionId;

  const canonicalQuery = buildCanonicalQuery(params);
  const stringToSign = `GET&${pctEncode('/')}&${pctEncode(canonicalQuery)}`;
  const signature = await hmacSha1Base64(accessKeySecret + '&', stringToSign);
  params.Signature = signature;

  const url = `https://${endpoint || DEFAULT_ENDPOINT}/?` +
    Object.entries(params).map(([k, v]) => `${pctEncode(k)}=${pctEncode(v)}`).join('&');

  const response = await fetch(url, { method: 'GET' });
  const data = await response.json();
  return { status: response.status, data, credentialsConfigured: true };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin')
      return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { action, params: apiParams, regionId, endpoint } = body;

    if (!action)
      return Response.json({ error: 'Missing required field: action' }, { status: 400 });

    const result = await callGpdbApi(action, apiParams || {}, regionId, endpoint);

    if (result.error) return Response.json(result, { status: 503 });

    return Response.json({ action, ...result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}