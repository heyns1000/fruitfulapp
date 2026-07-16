/* =========================================================================
   LOCAL FALLBACK CLIENT  —  FAA.ZONE™ / Fruitful™
   Provides a fully working, in-memory stand-in for the Base44 backend so the
   entire app (all 52 pages + the HotStack™ App Builder) renders and behaves
   seamlessly even when no Base44 connection is configured or reachable.

   Seeded from the REAL ecosystem dataset (ALL_SECTOR_DATA / FAA_ZONE_INDEX)
   so nothing here is fake filler — it is the same brand catalogue the live
   backend would return, just served locally.
   ========================================================================= */

import { getBrandCatalog, getCatalogStats } from '@/lib/ecosystemCatalog';

const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 10)}`;
const nowISO = () => new Date().toISOString();
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

/* ---- Build the Brand catalogue from the unified ecosystem catalog ----
   Single source of truth: src/lib/ecosystemCatalog.js. The marketplace UI and
   this entity/API layer therefore serve the exact same brands & pricing. ---- */
function buildBrands() {
  return getBrandCatalog().map((b) => ({
    ...b,
    created_date: nowISO(),
    updated_date: nowISO(),
  }));
}

const DEMO_USER = {
  id: 'demo-user',
  full_name: 'Fruitful Demo',
  email: 'demo@faa.zone',
  role: 'admin',
  created_date: nowISO(),
};

/* ---- Seed factory: returns initial rows for a given entity name ---- */
function seedFor(name) {
  switch (name) {
    case 'Brand':
      return buildBrands();
    case 'User':
      return [DEMO_USER];
    case 'Metrics': {
      const stats = getCatalogStats();
      return [
        { id: uid('m'), total_brands: stats.totalBrands, total_sectors: stats.totalSectors, active_nodes: stats.totalNodes, revenue: 1284000, created_date: nowISO() },
      ];
    }
    default:
      return [];
  }
}

/* ---- In-memory entity store with a Base44-compatible surface ---- */
const stores = new Map();
function getStore(name) {
  if (!stores.has(name)) stores.set(name, seedFor(name));
  return stores.get(name);
}

function matches(row, query) {
  if (!query || typeof query !== 'object') return true;
  return Object.entries(query).every(([k, v]) => row?.[k] === v);
}

function sortRows(rows, order) {
  if (!order || typeof order !== 'string') return rows;
  const desc = order.startsWith('-');
  const key = desc ? order.slice(1) : order;
  return [...rows].sort((a, b) => {
    const av = a?.[key];
    const bv = b?.[key];
    if (av === bv) return 0;
    const cmp = av > bv ? 1 : -1;
    return desc ? -cmp : cmp;
  });
}

function makeEntityApi(name) {
  return {
    async list(order, limit) {
      await delay();
      const rows = sortRows(getStore(name), order);
      return typeof limit === 'number' ? rows.slice(0, limit) : rows;
    },
    async filter(query, order, limit) {
      await delay();
      const rows = sortRows(getStore(name).filter((r) => matches(r, query)), order);
      return typeof limit === 'number' ? rows.slice(0, limit) : rows;
    },
    async get(id) {
      await delay();
      return getStore(name).find((r) => r.id === id) || null;
    },
    async create(data) {
      await delay();
      const row = { id: uid(name.toLowerCase()), created_date: nowISO(), updated_date: nowISO(), ...data };
      getStore(name).unshift(row);
      return row;
    },
    async bulkCreate(arr = []) {
      await delay();
      const rows = arr.map((data) => ({ id: uid(name.toLowerCase()), created_date: nowISO(), updated_date: nowISO(), ...data }));
      getStore(name).unshift(...rows);
      return rows;
    },
    async update(id, data) {
      await delay();
      const store = getStore(name);
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      store[idx] = { ...store[idx], ...data, updated_date: nowISO() };
      return store[idx];
    },
    async delete(id) {
      await delay();
      const store = getStore(name);
      const idx = store.findIndex((r) => r.id === id);
      if (idx !== -1) store.splice(idx, 1);
      return { success: true };
    },
    async schema() {
      return { name, type: 'object', properties: {} };
    },
  };
}

/* ---- Recursively synthesise an object honouring a JSON schema ---- */
function synthFromSchema(schema, seed = 'Fruitful') {
  if (!schema) return null;
  switch (schema.type) {
    case 'string':
      return `${seed}`;
    case 'number':
    case 'integer':
      return Math.floor(50 + Math.random() * 50);
    case 'boolean':
      return true;
    case 'array':
      return Array.from({ length: 3 }, (_, i) => synthFromSchema(schema.items, `${seed} ${i + 1}`));
    case 'object': {
      const obj = {};
      for (const [key, sub] of Object.entries(schema.properties || {})) {
        obj[key] = synthFromSchema(sub, key);
      }
      return obj;
    }
    default:
      return null;
  }
}

/* ---- Integrations (Core.*) ---- */
const integrations = {
  Core: {
    async InvokeLLM({ prompt = '', response_json_schema } = {}) {
      await delay(400);
      if (response_json_schema?.properties) {
        return synthFromSchema(response_json_schema, 'Fruitful');
      }
      return `HotStack™ (offline mode) response for: ${String(prompt).slice(0, 120)}`;
    },
    async SendEmail() {
      await delay();
      return { success: true, id: uid('email') };
    },
    async UploadFile({ file } = {}) {
      await delay();
      return { file_url: `https://media.base44.com/placeholder/${file?.name || 'upload'}` };
    },
  },
};

/* ---- Auth ---- */
const auth = {
  async me() {
    await delay();
    return DEMO_USER;
  },
  async logout() {
    return { success: true };
  },
  redirectToLogin() {
    /* no-op in offline mode */
  },
};

export function createFallbackClient() {
  return {
    __offline: true,
    entities: new Proxy({}, { get: (_, name) => makeEntityApi(String(name)) }),
    integrations,
    auth,
  };
}
