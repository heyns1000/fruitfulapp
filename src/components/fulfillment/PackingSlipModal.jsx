import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export default function PackingSlipModal({ order, onClose }) {
  const slipRef = useRef();

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    let y = margin;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, pageWidth, 80, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FAA.ZONE™ PACKING SLIP', margin, 35);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('marketplace.faa.zone', margin, 52);
    doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy HH:mm')}`, pageWidth - margin, 52, { align: 'right' });

    y = 110;

    // Order info box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 70, 4, 4, 'F');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDER NUMBER', margin + 12, y + 18);
    doc.text('ORDER DATE', margin + 180, y + 18);
    doc.text('BUYER', margin + 320, y + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`#${order.orderNumber || order.id.slice(-8).toUpperCase()}`, margin + 12, y + 38);
    doc.text(order.created_date ? format(new Date(order.created_date), 'dd MMM yyyy') : '—', margin + 180, y + 38);
    doc.text(order.buyerEmail || '—', margin + 320, y + 38);

    // Status
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('STATUS', margin + 12, y + 56);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text((order.status || 'pending').toUpperCase(), margin + 60, y + 56);

    y += 90;

    // Ship to
    if (order.shippingAddress) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text('SHIP TO', margin, y);
      y += 14;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const addr = order.shippingAddress;
      [addr.name, addr.addressLine1, addr.addressLine2, `${addr.city || ''} ${addr.postalCode || ''}`.trim(), addr.state, addr.country]
        .filter(Boolean)
        .forEach(line => { doc.text(line, margin, y); y += 14; });
      y += 6;
    }

    // Tracking
    if (order.trackingNumber) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text('TRACKING NUMBER:', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(order.trackingNumber, margin + 110, y);
      y += 20;
    }

    y += 10;

    // Items table header
    doc.setFillColor(30, 30, 30);
    doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('ITEM', margin + 8, y + 15);
    doc.text('SKU', margin + 260, y + 15);
    doc.text('QTY', margin + 360, y + 15);
    doc.text('UNIT PRICE', margin + 410, y + 15);
    doc.text('TOTAL', pageWidth - margin - 8, y + 15, { align: 'right' });

    y += 22;

    // Items rows
    (order.items || []).forEach((item, i) => {
      const rowBg = i % 2 === 0 ? [255, 255, 255] : [248, 248, 248];
      doc.setFillColor(...rowBg);
      doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(item.serviceName || '—', margin + 8, y + 15);
      doc.text(item.productCode || '—', margin + 260, y + 15);
      doc.text(String(item.quantity || 1), margin + 360, y + 15);
      doc.text(`${order.currency} ${(item.unitPrice || 0).toFixed(2)}`, margin + 410, y + 15);
      doc.text(`${order.currency} ${((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}`, pageWidth - margin - 8, y + 15, { align: 'right' });
      y += 22;
    });

    // Total
    y += 6;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL', margin + 360, y);
    doc.text(`${order.currency} ${(order.totalAmount || 0).toFixed(2)}`, pageWidth - margin - 8, y, { align: 'right' });

    // Notes
    if (order.notes) {
      y += 30;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text('NOTES:', margin, y);
      y += 14;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(order.notes, margin, y, { maxWidth: pageWidth - margin * 2 });
    }

    // Footer
    doc.setFillColor(30, 30, 30);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(0, pageHeight - 40, pageWidth, 40, 'F');
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your order — FAA.ZONE™ Marketplace', pageWidth / 2, pageHeight - 20, { align: 'center' });

    doc.save(`PackingSlip_${order.orderNumber || order.id.slice(-8)}.pdf`);
    toast?.success?.('PDF downloaded');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg">Packing Slip Preview</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleDownloadPDF} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Printer className="w-4 h-4" /> Download PDF
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slip preview */}
        <div ref={slipRef} className="p-8 text-gray-900 font-sans text-sm">
          {/* Header */}
          <div className="bg-gray-900 text-white rounded-xl px-6 py-5 mb-6">
            <div className="text-xl font-black">FAA.ZONE™ PACKING SLIP</div>
            <div className="text-gray-400 text-xs mt-1">marketplace.faa.zone · Generated: {format(new Date(), 'dd MMM yyyy HH:mm')}</div>
          </div>

          {/* Order meta */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Order #</div>
              <div className="font-bold">{order.orderNumber || order.id.slice(-8).toUpperCase()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Date</div>
              <div>{order.created_date ? format(new Date(order.created_date), 'dd MMM yyyy') : '—'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Status</div>
              <div className="capitalize font-semibold">{order.status || 'pending'}</div>
            </div>
          </div>

          {/* Buyer & Shipping */}
          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-2">Buyer</div>
              <div>{order.buyerEmail}</div>
            </div>
            {order.shippingAddress && (
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase mb-2">Ship To</div>
                <div>{order.shippingAddress.name}</div>
                <div className="text-gray-600">{order.shippingAddress.addressLine1}</div>
                <div className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.country}</div>
              </div>
            )}
          </div>

          {order.trackingNumber && (
            <div className="mb-5 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-sm">
              <span className="font-semibold text-orange-700">Tracking:</span> {order.trackingNumber}
            </div>
          )}

          {/* Items table */}
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left px-3 py-2 rounded-tl-lg">Item</th>
                <th className="text-left px-3 py-2">SKU</th>
                <th className="text-center px-3 py-2">Qty</th>
                <th className="text-right px-3 py-2">Unit</th>
                <th className="text-right px-3 py-2 rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2">{item.serviceName || '—'}</td>
                  <td className="px-3 py-2 text-gray-500">{item.productCode || '—'}</td>
                  <td className="px-3 py-2 text-center">{item.quantity}</td>
                  <td className="px-3 py-2 text-right">{order.currency} {(item.unitPrice || 0).toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-medium">{order.currency} {((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300">
                <td colSpan={4} className="px-3 py-2 text-right font-bold">TOTAL</td>
                <td className="px-3 py-2 text-right font-black text-lg">{order.currency} {(order.totalAmount || 0).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {order.notes && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <span className="font-semibold">Notes: </span>{order.notes}
            </div>
          )}

          <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
            Thank you for your order — FAA.ZONE™ Marketplace
          </div>
        </div>
      </div>
    </div>
  );
}