import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { createFallbackClient } from '@/api/localFallback';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

/* A Base44 connection is only usable when we actually have an app id.
   In preview / offline environments this is absent, so we transparently
   serve the app from the local fallback client seeded with real ecosystem
   data. Application code keeps importing { base44 } exactly as before. */
const isConfigured = Boolean(appId);

let client;

if (isConfigured) {
  try {
    client = createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      requiresAuth: false,
      appBaseUrl,
    });
  } catch (err) {
    console.warn('[v0] Base44 client init failed — using local fallback.', err?.message);
    client = createFallbackClient();
  }
} else {
  console.info('[v0] Base44 not configured — running on local ecosystem fallback (offline mode).');
  client = createFallbackClient();
}

export const base44 = client;
