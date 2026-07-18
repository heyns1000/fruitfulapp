import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, RefreshCw, Link2, TrendingUp } from 'lucide-react';

const STORAGE_KEY = 'faa_sheet_sync_config';

export default function SheetMetricsSync() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [sheetUrl, setSheetUrl] = useState('');
  const [range, setRange] = useState('A1:Z1000');

  // Load saved config
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const cfg = JSON.parse(saved);
        if (cfg.sheetUrl) setSheetUrl(cfg.sheetUrl);
        if (cfg.range) setRange(cfg.range);
      } catch {}
    }
  }, []);

  // Extract spreadsheet ID from a Google Sheets URL or accept raw ID
  const parseSpreadsheetId = (url) => {
    if (!url) return '';
    const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return m ? m[1] : url.trim();
  };

  const fetchData = useCallback(async () => {
    const spreadsheetId = parseSpreadsheetId(sheetUrl);
    if (!spreadsheetId) {
      setConnected(false);
      setLoading(false);
      return;
    }
    setSyncing(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('syncSheetMetrics', { spreadsheetId, range });
      setData(res.data);
      setConnected(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sheetUrl, range }));
    } catch (err) {
      setError(err?.message || 'Failed to sync sheet');
      setConnected(false);
    } finally {
      setSyncing(false);
      setLoading(false);
    }
  }, [sheetUrl, range]);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        if (sheetUrl) await fetchData();
        else setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur">
        <CardContent className="py-10 text-center text-slate-500">Loading…</CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="bg-white/80 backdrop-blur">
        <CardContent className="py-10 text-center">
          <p className="text-slate-600 mb-4">Sign in to sync live Google Sheet metrics.</p>
          <Button onClick={() => base44.auth.redirectToLogin()}>Sign in</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Config bar */}
      <Card className="bg-white/80 backdrop-blur border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="w-5 h-5 text-blue-600" />
            Live Sheet Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Paste Google Sheet URL or ID"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Range (e.g. A1:Z1000)"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="sm:w-48"
            />
            <Button onClick={fetchData} disabled={syncing || !sheetUrl} className="sm:w-auto">
              {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              {connected ? 'Re-sync' : 'Connect & Sync'}
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {data?.syncedAt && (
            <p className="text-xs text-slate-500">
              Last synced: {new Date(data.syncedAt).toLocaleString()} · {data.rows.length} rows
            </p>
          )}
        </CardContent>
      </Card>

      {/* Metric cards */}
      {data?.metrics?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.metrics.slice(0, 8).map((m, i) => (
            <Card key={i} className="bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-slate-700 truncate">{m.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">
                  {m.latest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Σ {m.sum.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Data table */}
      {data?.rows?.length > 0 && (
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Synced Sheet Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    {data.headers.map((h, i) => (
                      <TableHead key={i} className="font-semibold text-slate-700">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.rows.slice(0, 50).map((row, ri) => (
                    <TableRow key={ri} className="hover:bg-blue-50/50">
                      {data.headers.map((h, ci) => (
                        <TableCell key={ci} className="text-sm text-slate-700">{row[h]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {data.rows.length > 50 && (
              <p className="text-xs text-slate-500 mt-2">Showing first 50 of {data.rows.length} rows.</p>
            )}
          </CardContent>
        </Card>
      )}

      {connected && !data?.rows?.length && (
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="py-8 text-center text-slate-500">
            Connected, but no data rows found in that range.
          </CardContent>
        </Card>
      )}
    </div>
  );
}