import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Loader2 } from 'lucide-react';
import { format, parseISO, getYear, getMonth } from 'date-fns';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function StatementExporter({ orders, artisanName }) {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState(String(new Date().getMonth()));
  const [exporting, setExporting] = useState(false);

  const years = [...new Set(orders.map(o => String(getYear(parseISO(o.created_date)))))].sort().reverse();

  const getFiltered = () => orders.filter(o => {
    const d = parseISO(o.created_date);
    return String(getYear(d)) === year && String(getMonth(d)) === month && o.paymentStatus === 'paid';
  });

  const exportCSV = () => {
    const rows = getFiltered();
    if (!rows.length) { toast.error('No paid orders for this period'); return; }
    const header = ['Order Number', 'Paystack Reference', 'Date', 'Buyer', 'Items', 'Amount', 'Currency', 'Status'];
    const lines = rows.map(o => [
      o.orderNumber || o.id.slice(-8),
      o.paystackReference || '',
      format(parseISO(o.created_date), 'yyyy-MM-dd'),
      o.buyerEmail,
      o.items?.map(i => i.serviceName).join('; ') || '',
      o.totalAmount,
      o.currency || 'NGN',
      o.paymentStatus,
    ]);
    const csv = [header, ...lines].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `statement_${year}_${MONTHS[month]}.csv`;
    a.click();
    toast.success('CSV exported!');
  };

  const exportPDF = () => {
    const rows = getFiltered();
    if (!rows.length) { toast.error('No paid orders for this period'); return; }
    setExporting(true);
    const doc = new jsPDF();
    const total = rows.reduce((s, o) => s + (o.totalAmount || 0), 0);

    // Header
    doc.setFillColor(28, 25, 23);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Fruitful™ Artisan Statement', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`${artisanName || 'Artisan'} · ${MONTHS[month]} ${year}`, 14, 28);
    doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy')}`, 14, 35);

    // Summary box
    doc.setFillColor(41, 37, 36);
    doc.roundedRect(14, 48, 182, 22, 3, 3, 'F');
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Earnings: $${total.toFixed(2)}`, 20, 58);
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(10);
    doc.text(`${rows.length} paid transaction${rows.length !== 1 ? 's' : ''}`, 20, 66);

    // Table header
    let y = 82;
    doc.setFillColor(249, 115, 22);
    doc.rect(14, y - 6, 182, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Order #', 16, y);
    doc.text('Paystack Ref', 50, y);
    doc.text('Date', 95, y);
    doc.text('Buyer', 118, y);
    doc.text('Amount', 162, y);
    doc.text('CCY', 184, y);

    y += 8;
    rows.forEach((o, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFillColor(i % 2 === 0 ? 28 : 41, i % 2 === 0 ? 25 : 37, i % 2 === 0 ? 23 : 36);
      doc.rect(14, y - 5, 182, 8, 'F');
      doc.setTextColor(220, 220, 220);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text((o.orderNumber || o.id.slice(-8)).slice(0, 12), 16, y);
      doc.text((o.paystackReference || '—').slice(0, 14), 50, y);
      doc.text(format(parseISO(o.created_date), 'dd MMM yy'), 95, y);
      doc.text((o.buyerEmail || '').slice(0, 16), 118, y);
      doc.setTextColor(249, 115, 22);
      doc.setFont('helvetica', 'bold');
      doc.text(`$${(o.totalAmount || 0).toFixed(2)}`, 162, y);
      doc.setTextColor(180, 180, 180);
      doc.setFont('helvetica', 'normal');
      doc.text(o.currency || 'NGN', 184, y);
      y += 9;
    });

    // Footer total
    doc.setFillColor(249, 115, 22);
    doc.rect(14, y + 3, 182, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL', 16, y + 10);
    doc.text(`${total.toFixed(2)}`, 162, y + 10);

    doc.save(`statement_${year}_${MONTHS[month]}.pdf`);
    setExporting(false);
    toast.success('PDF statement downloaded!');
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" /> Export Monthly Statement
      </h3>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-28">
          <label className="text-xs text-primary uppercase tracking-wider mb-1.5 block">Month</label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-muted border-border">
              {MONTHS.map((m, i) => <SelectItem key={i} value={String(i)} className="text-foreground">{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-24">
          <label className="text-xs text-primary uppercase tracking-wider mb-1.5 block">Year</label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-muted border-border">
              {(years.length ? years : [String(new Date().getFullYear())]).map(y => (
                <SelectItem key={y} value={y} className="text-foreground">{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={exportCSV} variant="outline" className="border-border text-muted-foreground hover:border-primary hover:text-primary gap-2 shrink-0">
          <Download className="w-4 h-4" /> CSV
        </Button>
        <Button onClick={exportPDF} disabled={exporting} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shrink-0">
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} PDF
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Only paid orders are included in statements. Use for tax reporting purposes.</p>
    </div>
  );
}