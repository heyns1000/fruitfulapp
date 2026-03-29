import { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const LOW_STOCK_THRESHOLD = 5;
const POLL_INTERVAL_MS = 30_000; // 30 seconds

// Simulates reading live stock from the imported spreadsheet data
// In production this would call a backend endpoint / webhook
const getSpreadsheetStockLevels = async () => {
  const services = await base44.entities.MarketplaceService.filter({ brandName: 'Homemart' });
  return services.map(s => ({
    id: s.id,
    sku: s.productCode,
    name: s.serviceName,
    available: s.inventory?.available ?? null,
    unlimited: s.inventory?.unlimited ?? false,
  }));
};

export default function HomemartStockSync() {
  const alerted = useRef(new Set());

  useEffect(() => {
    const checkStock = async () => {
      const items = await getSpreadsheetStockLevels();
      for (const item of items) {
        if (item.unlimited || item.available === null) continue;
        if (item.available < LOW_STOCK_THRESHOLD && !alerted.current.has(item.id)) {
          alerted.current.add(item.id);
          toast.warning(`⚠️ Low Stock: "${item.name}" — only ${item.available} left`, {
            duration: 8000,
            description: `SKU: ${item.sku} · Restock recommended`,
          });
          // Update status on entity
          await base44.entities.MarketplaceService.update(item.id, { status: 'active' });
        }
        // Reset alert once restocked above threshold
        if (item.available >= LOW_STOCK_THRESHOLD) {
          alerted.current.delete(item.id);
        }
      }
    };

    checkStock();
    const interval = setInterval(checkStock, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return null; // background service — no UI
}