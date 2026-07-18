import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const spreadsheetId = body.spreadsheetId;
    const range = body.range || 'A1:Z1000';

    if (!spreadsheetId) {
      return Response.json({ error: 'spreadsheetId is required' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Google Sheets API error: ${response.status}`, details: errText }, { status: response.status });
    }

    const data = await response.json();
    const rows = data.values || [];

    if (rows.length === 0) {
      return Response.json({ headers: [], rows: [], metrics: [] });
    }

    // First row = headers
    const headers = rows[0].map((h) => String(h || '').trim());
    const dataRows = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] !== undefined ? String(row[i]) : '';
      });
      return obj;
    });

    // Try to auto-detect numeric metric columns (columns whose values parse as numbers)
    const numericKeys = headers.filter((h) => {
      return dataRows.some((r) => r[h] !== '' && !isNaN(Number(String(r[h]).replace(/[^0-9.\-]/g, ''))));
    });

    // Build metric cards: sum + latest for each numeric column
    const metrics = numericKeys.map((key) => {
      const values = dataRows
        .map((r) => Number(String(r[key]).replace(/[^0-9.\-]/g, '')))
        .filter((v) => !isNaN(v));
      const sum = values.reduce((a, b) => a + b, 0);
      const latest = values.length > 0 ? values[values.length - 1] : 0;
      return {
        label: key,
        sum: Math.round(sum * 100) / 100,
        latest: Math.round(latest * 100) / 100,
        count: values.length,
      };
    });

    return Response.json({
      spreadsheetId,
      range,
      headers,
      rows: dataRows,
      metrics,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});