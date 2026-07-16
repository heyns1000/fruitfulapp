import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2, Truck, MapPin, RefreshCw, CheckCircle2, AlertTriangle,
  Clock, Package, ChevronDown, ChevronUp, Copy, Mail
} from 'lucide-react';
import { toast } from 'sonner';

const TAG_CONFIG = {
  Pending:        { label: 'Pending',           color: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',   dot: 'bg-yellow-400' },
  InfoReceived:   { label: 'Info Received',     color: 'bg-blue-900/40 text-blue-300 border-blue-700',         dot: 'bg-blue-400' },
  InTransit:      { label: 'In Transit',        color: 'bg-cyan-900/40 text-cyan-300 border-cyan-700',         dot: 'bg-cyan-400', pulse: true },
  OutForDelivery: { label: 'Out for Delivery',  color: 'bg-primary/10 text-primary border-primary',   dot: 'bg-primary', pulse: true },
  AttemptFail:    { label: 'Attempt Failed',    color: 'bg-red-900/40 text-red-300 border-red-700',            dot: 'bg-red-400' },
  Delivered:      { label: 'Delivered',         color: 'bg-green-900/40 text-green-300 border-green-700',      dot: 'bg-green-400' },
  Exception:      { label: 'Exception',         color: 'bg-red-900/40 text-red-300 border-red-700',            dot: 'bg-red-400' },
  Expired:        { label: 'Expired',           color: 'bg-muted text-muted-foreground border-border',         dot: 'bg-muted0' },
};

const ICON_FOR_TAG = {
  Pending: Clock, InfoReceived: Package, InTransit: Truck,
  OutForDelivery: Truck, Delivered: CheckCircle2, Exception: AlertTriangle,
  AttemptFail: AlertTriangle, Expired: Clock,
};

export default function ShipmentTracker({ order }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [liveTag, setLiveTag] = useState(null);

  const events = order.trackingEvents || [];
  const visibleEvents = showAll ? events : events.slice(0, 4);

  const currentTag = liveTag || (events[0]?.tag) || null;
  const tagCfg = TAG_CONFIG[currentTag] || null;

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await base44.functions.trackShipment({ orderId: order.id });
      if (result.demo) {
        toast.info('Demo mode: add AFTERSHIP_API_KEY secret to enable live tracking');
      } else if (result.error) {
        toast.error(result.error);
      } else {
        setLiveTag(result.tag);
        toast.success(
          result.newEventsCount > 0
            ? `${result.newEventsCount} new tracking event${result.newEventsCount !== 1 ? 's' : ''}! Buyer will be emailed.`
            : 'Tracking is up to date'
        );
        // Reload the page data so events show
        window.location.reload();
      }
    } catch (err) {
      toast.error('Could not reach tracking service');
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    toast.success('Tracking number copied!');
  };

  return (
    <div className="space-y-4">
      {/* Header: carrier + tracking number */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted rounded-xl p-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="min-w-0">
            {order.carrier && (
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{order.carrier}</p>
            )}
            <div className="flex items-center gap-2">
              <code className="text-primary font-mono text-sm">{order.trackingNumber}</code>
              <button onClick={copyTracking} className="text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Status badge */}
        {tagCfg && (
          <Badge className={`border flex items-center gap-1.5 shrink-0 ${tagCfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tagCfg.dot} ${tagCfg.pulse ? 'animate-pulse' : ''}`} />
            {tagCfg.label}
          </Badge>
        )}

        {/* Refresh button */}
        <Button onClick={refresh} disabled={isRefreshing} size="sm" variant="outline"
          className="border-border text-muted-foreground hover:border-cyan-500 hover:text-cyan-300 gap-2 shrink-0">
          {isRefreshing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {isRefreshing ? 'Polling…' : 'Refresh Live'}
        </Button>
      </div>

      {/* Last update */}
      {order.lastTrackingUpdate && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 px-1">
          <Clock className="w-3 h-3" />
          Last updated: {new Date(order.lastTrackingUpdate).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          <span className="ml-1 text-foreground">· Email notifications auto-sent to buyer on status change</span>
        </p>
      )}

      {/* Checkpoint timeline */}
      {events.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-xl">
          <Truck className="w-8 h-8 text-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No tracking events yet</p>
          <p className="text-muted-foreground text-xs mt-1">Click "Refresh Live" to fetch from the carrier</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-muted" />
          <div className="space-y-0">
            {visibleEvents.map((evt, i) => {
              const IconComp = ICON_FOR_TAG[evt.tag] || Package;
              const cfg = TAG_CONFIG[evt.tag];
              const isFirst = i === 0;
              return (
                <div key={`${evt.timestamp}-${i}`} className="relative flex items-start gap-4 pb-5 last:pb-0">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isFirst
                      ? 'bg-cyan-900/60 border-cyan-500 shadow-lg shadow-cyan-500/20'
                      : 'bg-card border-border'
                  }`}>
                    <IconComp className={`w-4 h-4 ${isFirst ? 'text-cyan-300' : 'text-muted-foreground'}`} />
                    {isFirst && cfg?.pulse && (
                      <span className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-20" />
                    )}
                  </div>
                  <div className="flex-1 pt-1.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {cfg && (
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1 ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        )}
                        {evt.message && (
                          <p className={`text-sm leading-snug ${isFirst ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {evt.message}
                          </p>
                        )}
                        {evt.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0" /> {evt.location}
                          </p>
                        )}
                      </div>
                      {evt.timestamp && (
                        <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                          {new Date(evt.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          <br />
                          <span className="text-foreground">
                            {new Date(evt.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {events.length > 4 && (
            <button onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-3 pl-14">
              {showAll ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show {events.length - 4} more events</>}
            </button>
          )}
        </div>
      )}

      {/* Email notification notice */}
      <div className="flex items-start gap-2 bg-card border border-border rounded-xl p-3">
        <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <span className="text-muted-foreground font-semibold">Auto email alerts</span> are sent to the buyer for:
          In Transit · Out for Delivery · Delivered · Exceptions.
          Powered by AfterShip — supports 900+ global carriers.
        </p>
      </div>
    </div>
  );
}