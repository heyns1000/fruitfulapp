import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This function is invoked by a scheduled workflow (no user session).
    // Use the service role to read config, fetch the sheet, and update brands.
    const configs = await base44.asServiceRole.entities.SheetSyncConfig.filter({ enabled: true });
    if (!configs || configs.length === 0) {
      return Response.json({ status: 'skipped', message: 'No enabled SheetSyncConfig found.' });
    }

    const config = configs[0];
    const spreadsheetId = config.spreadsheetId;
    const range = config.range || 'A1:Z1000';

    if (!spreadsheetId) {
      return Response.json({ status: 'skipped', message: 'Config has no spreadsheetId.' });
    }

    // Fetch the sheet via the authorized googlesheets connector (service role)
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

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errText = await response.text();
      await base44.asServiceRole.entities.SheetSyncConfig.update(config.id, {
        lastSyncedAt: new Date().toISOString(),
        lastSyncStatus: 'failed',
        lastSyncSummary: `Sheets API ${response.status}: ${errText.slice(0, 200)}`,
      });
      return Response.json({ status: 'error', message: `Sheets API ${response.status}` });
    }

    const data = await response.json();
    const rows = data.values || [];
    if (rows.length < 2) {
      await base44.asServiceRole.entities.SheetSyncConfig.update(config.id, {
        lastSyncedAt: new Date().toISOString(),
        lastSyncStatus: 'success',
        lastSyncSummary: 'No data rows found in sheet.',
        brandsUpdated: 0,
      });
      return Response.json({ status: 'success', brandsUpdated: 0, message: 'No data rows.' });
    }

    const headers = rows[0].map((h) => String(h || '').trim().toLowerCase());
    const dataRows = rows.slice(1);

    // Resolve column indexes by common header names (case-insensitive)
    const findCol = (...names) => {
      for (const n of names) {
        const idx = headers.indexOf(n.toLowerCase());
        if (idx !== -1) return idx;
      }
      return -1;
    };

    const nameIdx = findCol('brand', 'brandname', 'name', 'brand name');
    const allocIdx = findCol('financialallocation', 'allocation', 'financial allocation');
    const perfIdx = findCol('performancescore', 'performance', 'performance score', 'score');
    const revIdx = findCol('revenue');
    const budgetIdx = findCol('budget');

    if (nameIdx === -1) {
      await base44.asServiceRole.entities.SheetSyncConfig.update(config.id, {
        lastSyncedAt: new Date().toISOString(),
        lastSyncStatus: 'failed',
        lastSyncSummary: 'No "brand" / "brandname" column found in sheet headers.',
      });
      return Response.json({ status: 'error', message: 'No brand name column found.' });
    }

    const toNum = (v) => {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
      return isNaN(n) ? null : n;
    };

    // Build a map of brandName (lowercased) -> updates
    const updates = {};
    for (const row of dataRows) {
      const brandName = String(row[nameIdx] || '').trim();
      if (!brandName) continue;
      const patch = {};
      if (allocIdx !== -1) {
        const v = toNum(row[allocIdx]);
        if (v !== null) patch.financialAllocation = v;
      }
      if (perfIdx !== -1) {
        const v = toNum(row[perfIdx]);
        if (v !== null) patch.performanceScore = v;
      }
      if (revIdx !== -1) {
        const v = toNum(row[revIdx]);
        if (v !== null) patch.revenue = v;
      }
      if (budgetIdx !== -1) {
        const v = toNum(row[budgetIdx]);
        if (v !== null) patch.budget = v;
      }
      if (Object.keys(patch).length > 0) updates[brandName.toLowerCase()] = patch;
    }

    // Load all brands and match by name (case-insensitive)
    const brands = await base44.asServiceRole.entities.Brand.list('-updated_date', 500);
    const toUpdate = [];
    for (const b of brands) {
      const patch = updates[String(b.name || '').toLowerCase()];
      if (patch) toUpdate.push({ id: b.id, ...patch });
    }

    let updatedCount = 0;
    if (toUpdate.length > 0) {
      // bulkUpdate supports up to 500 records with per-record changes
      const result = await base44.asServiceRole.entities.Brand.bulkUpdate(toUpdate);
      updatedCount = toUpdate.length;
    }

    const summary = `Synced ${dataRows.length} rows · updated ${updatedCount} brand(s).`;
    await base44.asServiceRole.entities.SheetSyncConfig.update(config.id, {
      lastSyncedAt: new Date().toISOString(),
      lastSyncStatus: 'success',
      lastSyncSummary: summary,
      brandsUpdated: updatedCount,
    });

    return Response.json({
      status: 'success',
      rowsRead: dataRows.length,
      brandsUpdated: updatedCount,
      summary,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});