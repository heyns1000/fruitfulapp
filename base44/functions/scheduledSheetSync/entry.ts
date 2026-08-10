import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const toNum = (v) => {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? null : n;
};

const findCol = (headers, ...names) => {
  const lower = headers.map(h => String(h || '').trim().toLowerCase());
  for (const n of names) {
    const idx = lower.indexOf(n.toLowerCase());
    if (idx !== -1) return idx;
  }
  return -1;
};

// Generic upsert: match existing records by keyField, create new + update changed
async function upsert(base44, entityName, records, keyField) {
  if (!records || records.length === 0) return { created: 0, updated: 0 };
  const existing = await base44.asServiceRole.entities[entityName].list('-updated_date', 500);
  const existingMap = new Map();
  for (const r of existing) {
    const k = String(r[keyField] || '').toLowerCase();
    if (k) existingMap.set(k, r);
  }
  const toCreate = [];
  const toUpdate = [];
  for (const rec of records) {
    const k = String(rec[keyField] || '').toLowerCase();
    if (!k) continue;
    if (existingMap.has(k)) {
      toUpdate.push({ id: existingMap.get(k).id, ...rec });
    } else {
      toCreate.push(rec);
    }
  }
  if (toCreate.length > 0) await base44.asServiceRole.entities[entityName].bulkCreate(toCreate);
  if (toUpdate.length > 0) await base44.asServiceRole.entities[entityName].bulkUpdate(toUpdate);
  return { created: toCreate.length, updated: toUpdate.length };
}

// Map sheet rows → CoffeeCostInput records
function mapCoffeeCostRows(headers, dataRows, tabName) {
  const labelIdx = findCol(headers, 'label', 'variable', 'item', 'name', 'description');
  const valueIdx = findCol(headers, 'value', 'amount', 'cost', 'price');
  const unitIdx = findCol(headers, 'unit', 'units');
  const categoryIdx = findCol(headers, 'category', 'type');
  const notesIdx = findCol(headers, 'notes', 'comment');
  if (labelIdx === -1) return [];
  const records = [];
  for (const row of dataRows) {
    const label = String(row[labelIdx] || '').trim();
    if (!label) continue;
    records.push({
      label,
      value: valueIdx !== -1 ? toNum(row[valueIdx]) : null,
      unit: unitIdx !== -1 ? String(row[unitIdx] || '').trim() : '',
      category: categoryIdx !== -1 ? String(row[categoryIdx] || '').trim() : '',
      sheet: tabName,
      notes: notesIdx !== -1 ? String(row[notesIdx] || '').trim() : '',
    });
  }
  return records;
}

// Map sheet rows → FoodMenuItem records
function mapFoodMenuRows(headers, dataRows) {
  const nameIdx = findCol(headers, 'name', 'item', 'menu item', 'product');
  const priceExIdx = findCol(headers, 'price_ex_vat', 'price excl', 'ex vat', 'price exclusive');
  const vatIdx = findCol(headers, 'vat', 'vat amount');
  const priceInclIdx = findCol(headers, 'price_incl_vat', 'price incl', 'incl vat', 'price inclusive');
  const finalPriceIdx = findCol(headers, 'final_price', 'final price', 'final');
  const categoryIdx = findCol(headers, 'category', 'type');
  if (nameIdx === -1) return [];
  const records = [];
  for (const row of dataRows) {
    const name = String(row[nameIdx] || '').trim();
    if (!name) continue;
    const finalPrice = finalPriceIdx !== -1 ? toNum(row[finalPriceIdx]) : (priceInclIdx !== -1 ? toNum(row[priceInclIdx]) : null);
    if (finalPrice === null) continue;
    records.push({
      name,
      price_ex_vat: priceExIdx !== -1 ? toNum(row[priceExIdx]) : null,
      vat: vatIdx !== -1 ? toNum(row[vatIdx]) : null,
      price_incl_vat: priceInclIdx !== -1 ? toNum(row[priceInclIdx]) : null,
      final_price: finalPrice,
      category: categoryIdx !== -1 ? String(row[categoryIdx] || '').trim().toLowerCase() : 'food',
    });
  }
  return records;
}

// Map sheet rows → BarcodeMapping records (flexible header mapping)
function mapBarcodeRows(headers, dataRows) {
  const skuIdx = findCol(headers, 'sku', 'item code', 'code');
  if (skuIdx === -1) return [];
  const records = [];
  for (const row of dataRows) {
    const sku = String(row[skuIdx] || '').trim();
    if (!sku) continue;
    const rec = { SKU: sku };
    headers.forEach((h, i) => {
      const key = String(h || '').trim();
      if (key && key.toLowerCase() !== 'sku' && row[i] !== undefined && row[i] !== '') {
        rec[key] = String(row[i]);
      }
    });
    records.push(rec);
  }
  return records;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Read enabled SheetSyncConfig (created when user pastes a sheet URL in Analytics)
    const configs = await base44.asServiceRole.entities.SheetSyncConfig.filter({ enabled: true });
    if (!configs || configs.length === 0) {
      return Response.json({ status: 'skipped', message: 'No enabled SheetSyncConfig found. Paste a Google Sheet URL in the Analytics page to configure.' });
    }

    const config = configs[0];
    const spreadsheetId = config.spreadsheetId;
    if (!spreadsheetId) {
      return Response.json({ status: 'skipped', message: 'Config has no spreadsheetId.' });
    }

    // Get Google Sheets access token via authorized connector
    let accessToken;
    try {
      const conn = await base44.asServiceRole.connectors.getConnection('googlesheets');
      accessToken = conn.accessToken;
    } catch (e) {
      await base44.asServiceRole.entities.SheetSyncConfig.update(config.id, {
        lastSyncedAt: new Date().toISOString(),
        lastSyncStatus: 'failed',
        lastSyncSummary: 'Google Sheets connector not authorized.',
      });
      return Response.json({ status: 'error', message: 'Google Sheets connector not authorized.' });
    }

    // Discover all tab names in the spreadsheet
    const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets.properties.title`;
    const metaResponse = await fetch(metaUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!metaResponse.ok) {
      const errText = await metaResponse.text();
      await base44.asServiceRole.entities.SheetSyncConfig.update(config.id, {
        lastSyncedAt: new Date().toISOString(),
        lastSyncStatus: 'failed',
        lastSyncSummary: `Sheets API ${metaResponse.status}: ${errText.slice(0, 200)}`,
      });
      return Response.json({ status: 'error', message: `Sheets API ${metaResponse.status}` });
    }

    const metaData = await metaResponse.json();
    const tabNames = (metaData.sheets || []).map(s => s.properties?.title || '').filter(Boolean);

    // Helper: fetch a single tab's data
    const fetchTab = async (tabName) => {
      const range = `'${tabName}'!A1:ZZ1000`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (!res.ok) return null;
      const data = await res.json();
      const rows = data.values || [];
      if (rows.length < 2) return null;
      return { headers: rows[0], dataRows: rows.slice(1) };
    };

    const summary = { brands: 0, coffeeCosts: 0, foodMenu: 0, barcodes: 0, tabs: tabNames.length };

    // Sync each tab to the matching entity based on tab name
    for (const tabName of tabNames) {
      const lower = tabName.toLowerCase();
      let entityType = null;
      if (lower.includes('brand')) entityType = 'brand';
      else if (lower.includes('coffee') || lower.includes('cost')) entityType = 'coffee';
      else if (lower.includes('menu') || lower.includes('food')) entityType = 'food';
      else if (lower.includes('block') || lower.includes('barcode') || lower.includes('vault')) entityType = 'barcode';

      if (!entityType) continue;

      const tabData = await fetchTab(tabName);
      if (!tabData) continue;

      try {
        if (entityType === 'brand') {
          const headers = tabData.headers.map(h => String(h || '').trim().toLowerCase());
          const dataRows = tabData.dataRows;
          const nameIdx = findCol(headers, 'brand', 'brandname', 'name', 'brand name');
          const allocIdx = findCol(headers, 'financialallocation', 'allocation', 'financial allocation');
          const perfIdx = findCol(headers, 'performancescore', 'performance', 'performance score', 'score');
          const revIdx = findCol(headers, 'revenue');
          const budgetIdx = findCol(headers, 'budget');
          if (nameIdx === -1) continue;

          const updates = {};
          for (const row of dataRows) {
            const brandName = String(row[nameIdx] || '').trim();
            if (!brandName) continue;
            const patch = {};
            if (allocIdx !== -1) { const v = toNum(row[allocIdx]); if (v !== null) patch.financialAllocation = v; }
            if (perfIdx !== -1) { const v = toNum(row[perfIdx]); if (v !== null) patch.performanceScore = v; }
            if (revIdx !== -1) { const v = toNum(row[revIdx]); if (v !== null) patch.revenue = v; }
            if (budgetIdx !== -1) { const v = toNum(row[budgetIdx]); if (v !== null) patch.budget = v; }
            if (Object.keys(patch).length > 0) updates[brandName.toLowerCase()] = patch;
          }

          const brands = await base44.asServiceRole.entities.Brand.list('-updated_date', 500);
          const toUpdate = [];
          for (const b of brands) {
            const patch = updates[String(b.name || '').toLowerCase()];
            if (patch) toUpdate.push({ id: b.id, ...patch });
          }
          if (toUpdate.length > 0) {
            await base44.asServiceRole.entities.Brand.bulkUpdate(toUpdate);
            summary.brands += toUpdate.length;
          }
        } else if (entityType === 'coffee') {
          const records = mapCoffeeCostRows(tabData.headers, tabData.dataRows, tabName);
          const result = await upsert(base44, 'CoffeeCostInput', records, 'label');
          summary.coffeeCosts += result.created + result.updated;
        } else if (entityType === 'food') {
          const records = mapFoodMenuRows(tabData.headers, tabData.dataRows);
          const result = await upsert(base44, 'FoodMenuItem', records, 'name');
          summary.foodMenu += result.created + result.updated;
        } else if (entityType === 'barcode') {
          const records = mapBarcodeRows(tabData.headers, tabData.dataRows);
          const result = await upsert(base44, 'BarcodeMapping', records, 'SKU');
          summary.barcodes += result.created + result.updated;
        }
      } catch (e) {
        // Per-tab error — continue syncing other tabs
      }
    }

    const summaryText = `Synced ${summary.tabs} tabs · Brands: ${summary.brands} · Coffee: ${summary.coffeeCosts} · Menu: ${summary.foodMenu} · Barcodes: ${summary.barcodes}`;
    await base44.asServiceRole.entities.SheetSyncConfig.update(config.id, {
      lastSyncedAt: new Date().toISOString(),
      lastSyncStatus: 'success',
      lastSyncSummary: summaryText,
      brandsUpdated: summary.brands,
    });

    return Response.json({
      status: 'success',
      ...summary,
      summary: summaryText,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});