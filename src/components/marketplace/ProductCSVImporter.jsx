import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Expected CSV columns
const REQUIRED_COLS = ['serviceName', 'brandName', 'brandId', 'category', 'productCode'];
const OPTIONAL_COLS = ['description', 'priceUSD', 'priceZAR', 'priceNGN', 'currency', 'status', 'inventoryAvailable', 'inventoryUnlimited', 'deliveryType', 'imageUrl', 'tags'];

const VALID_CATEGORIES = ['digital_service', 'physical_product', 'subscription', 'consulting', 'license', 'data_access'];
const VALID_STATUSES = ['draft', 'active', 'paused', 'archived'];
const VALID_DELIVERY = ['instant', 'digital', 'physical', 'scheduled'];

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line => {
    // Handle quoted commas
    const values = [];
    let inQuote = false, current = '';
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { values.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    values.push(current.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
  return { headers, rows };
}

function rowToProduct(row) {
  return {
    serviceName: row.serviceName,
    brandName: row.brandName,
    brandId: row.brandId,
    category: row.category,
    productCode: row.productCode,
    description: row.description || '',
    pricing: {
      USD: row.priceUSD ? parseFloat(row.priceUSD) : undefined,
      ZAR: row.priceZAR ? parseFloat(row.priceZAR) : undefined,
      NGN: row.priceNGN ? parseFloat(row.priceNGN) : undefined,
    },
    currency: row.currency || 'USD',
    status: VALID_STATUSES.includes(row.status) ? row.status : 'draft',
    inventory: {
      available: row.inventoryAvailable ? parseInt(row.inventoryAvailable) : 0,
      unlimited: row.inventoryUnlimited?.toLowerCase() === 'true',
    },
    delivery: {
      type: VALID_DELIVERY.includes(row.deliveryType) ? row.deliveryType : 'physical',
    },
    imageUrl: row.imageUrl || '',
    tags: row.tags ? row.tags.split(';').map(t => t.trim()).filter(Boolean) : [],
  };
}

function validateRow(row, index) {
  const errors = [];
  if (!row.serviceName) errors.push('serviceName is required');
  if (!row.brandName) errors.push('brandName is required');
  if (!row.brandId) errors.push('brandId is required');
  if (!row.productCode) errors.push('productCode is required');
  if (!VALID_CATEGORIES.includes(row.category)) errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  return errors;
}

const TEMPLATE_CSV = [
  'serviceName,brandName,brandId,category,productCode,description,priceUSD,priceZAR,priceNGN,currency,status,inventoryAvailable,inventoryUnlimited,deliveryType,imageUrl,tags',
  'Handwoven Basket,Ubuntu Craft,YOUR-BRAND-ID,physical_product,PROD-UBT-001,Traditional hand-woven basket,25,450,,USD,active,50,false,physical,,craft;handmade;basket',
  'Digital Pattern Pack,Ubuntu Craft,YOUR-BRAND-ID,digital_service,PROD-UBT-002,10 weaving pattern downloads,12,220,,USD,active,0,true,instant,,digital;patterns',
].join('\n');

export default function ProductCSVImporter() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // { headers, rows, validation }
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null); // { success, failed }
  const [mode, setMode] = useState('append'); // 'append' | 'replace'
  const fileInputRef = useRef();

  const handleFile = (f) => {
    setFile(f);
    setResults(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const { headers, rows } = parseCSV(e.target.result);
      const missingRequired = REQUIRED_COLS.filter(c => !headers.includes(c));
      const validation = rows.map((row, i) => ({ row, errors: validateRow(row, i) }));
      setPreview({ headers, rows, validation, missingRequired });
    };
    reader.readAsText(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith('.csv')) handleFile(f);
    else toast.error('Please drop a .csv file');
  };

  const handleImport = async () => {
    if (!preview) return;
    const validRows = preview.validation.filter(v => v.errors.length === 0).map(v => v.row);
    if (validRows.length === 0) { toast.error('No valid rows to import'); return; }

    setImporting(true);
    const success = [], failed = [];

    for (const row of validRows) {
      try {
        await base44.entities.MarketplaceService.create(rowToProduct(row));
        success.push(row.serviceName);
      } catch (err) {
        failed.push({ name: row.serviceName, error: err?.message || 'Unknown error' });
      }
    }

    setImporting(false);
    setResults({ success, failed });
    toast.success(`Imported ${success.length} products${failed.length ? `, ${failed.length} failed` : ''}`);
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'artisan_products_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const invalidCount = preview ? preview.validation.filter(v => v.errors.length > 0).length : 0;
  const validCount = preview ? preview.validation.length - invalidCount : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" /> Bulk Product Import via CSV
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Upload a CSV to add multiple artisan products at once — no manual entry needed.</p>
          </div>
          <Button variant="outline" onClick={downloadTemplate} className="border-border text-muted-foreground hover:bg-muted gap-2">
            <Download className="w-4 h-4" /> Download Template
          </Button>
        </div>

        {/* Required columns */}
        <div className="mt-4 p-3 bg-muted/60 rounded-lg">
          <p className="text-xs text-muted-foreground font-semibold mb-2">REQUIRED COLUMNS</p>
          <div className="flex flex-wrap gap-1.5">
            {REQUIRED_COLS.map(c => <Badge key={c} className="bg-primary/10 text-primary text-xs">{c}</Badge>)}
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-semibold mb-1">OPTIONAL</p>
          <div className="flex flex-wrap gap-1.5">
            {OPTIONAL_COLS.map(c => <Badge key={c} variant="outline" className="border-border text-muted-foreground text-xs">{c}</Badge>)}
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border hover:border-primary rounded-xl p-10 text-center cursor-pointer transition-colors bg-card/50 group"
      >
        <FileText className="w-10 h-10 text-muted-foreground group-hover:text-primary mx-auto mb-3 transition-colors" />
        <p className="text-muted-foreground font-semibold">{file ? file.name : 'Drop your CSV here or click to browse'}</p>
        <p className="text-muted-foreground text-sm mt-1">Only .csv files are supported</p>
        <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
          onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
      </div>

      {/* Preview */}
      {preview && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h3 className="font-bold text-foreground">Preview</h3>
            <span className="flex items-center gap-1 text-sm text-green-400"><CheckCircle className="w-4 h-4" /> {validCount} valid</span>
            {invalidCount > 0 && <span className="flex items-center gap-1 text-sm text-red-400"><XCircle className="w-4 h-4" /> {invalidCount} invalid</span>}
            {preview.missingRequired?.length > 0 && (
              <span className="flex items-center gap-1 text-sm text-amber-400">
                <AlertCircle className="w-4 h-4" /> Missing columns: {preview.missingRequired.join(', ')}
              </span>
            )}
          </div>

          {/* Row validation list */}
          <div className="max-h-64 overflow-y-auto rounded-lg border border-border divide-y divide-stone-800">
            {preview.validation.map((v, i) => (
              <div key={i} className={`px-4 py-2.5 flex items-start gap-3 text-sm ${v.errors.length ? 'bg-red-950/20' : 'bg-muted/30'}`}>
                {v.errors.length === 0
                  ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                <div>
                  <span className="text-foreground font-medium">{v.row.serviceName || `Row ${i + 1}`}</span>
                  <span className="text-muted-foreground ml-2">{v.row.brandName}</span>
                  {v.errors.length > 0 && (
                    <div className="text-red-400 text-xs mt-0.5">{v.errors.join(' · ')}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleImport}
            disabled={importing || validCount === 0 || preview.missingRequired?.length > 0}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Import {validCount} Product{validCount !== 1 ? 's' : ''}
          </Button>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h3 className="font-bold text-foreground">Import Results</h3>
          {results.success.length > 0 && (
            <div className="p-3 bg-green-950/30 rounded-lg border border-green-900">
              <p className="text-green-400 font-semibold text-sm mb-1">✅ {results.success.length} imported successfully</p>
              <p className="text-green-300/60 text-xs">{results.success.join(', ')}</p>
            </div>
          )}
          {results.failed.length > 0 && (
            <div className="p-3 bg-red-950/30 rounded-lg border border-red-900">
              <p className="text-red-400 font-semibold text-sm mb-1">❌ {results.failed.length} failed</p>
              {results.failed.map((f, i) => (
                <p key={i} className="text-red-300/60 text-xs">{f.name}: {f.error}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}