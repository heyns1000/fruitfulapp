import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Mail, Phone, Globe, Copy, Check, ExternalLink, Package, ShieldCheck, Loader2 } from 'lucide-react';

const BRAND_GREEN = '#4ECDC4';
const BRAND_RED = '#E91E63';

export default function SupplierMasterDirectory() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const records = await base44.entities.SupplierProfile.list('name', 50);
        setSuppliers(records);
      } catch (e) {
        console.error('Supplier load failed', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch (e) {
      console.error('Clipboard failed', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: BRAND_GREEN }} />
        <span className="ml-2 text-sm text-gray-500">Loading supplier directory...</span>
      </div>
    );
  }

  if (!suppliers.length) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-md text-center">
        <Package className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500 text-sm">No supplier profiles ingested yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Globe className="w-5 h-5" style={{ color: BRAND_GREEN }} />
            Supplier Master Directory
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{suppliers.length} suppliers ingested · click any field to copy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {suppliers.map((s, idx) => {
          const color = s.color || (idx % 2 === 0 ? BRAND_GREEN : BRAND_RED);
          return (
            <div key={s.id} className="bg-white rounded-2xl shadow-md overflow-hidden border-t-4" style={{ borderColor: color }}>
              {/* Header */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.flag || '🌍'}</span>
                    <div>
                      <h4 className="font-black text-gray-800 text-base leading-tight">{s.name}</h4>
                      <p className="text-xs text-gray-400">{s.type}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: color + '20', color }}>
                    {s.role}
                  </span>
                </div>

                {/* Origin + Location */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                    <div>
                      <p className="font-semibold text-gray-700">{s.origin}</p>
                      <p className="text-xs text-gray-500">{s.location}</p>
                    </div>
                  </div>
                  {s.originRegions && s.originRegions.length > 0 && (
                    <div className="flex flex-wrap gap-1 ml-6">
                      {s.originRegions.map((r, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{r}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact fields */}
              <div className="px-5 pb-3 space-y-2">
                {/* Emails */}
                {s.emails && s.emails.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Emails</p>
                    {s.emails.map((email, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <a href={`mailto:${email}`} className="text-sm text-gray-700 hover:underline flex-1 truncate">{email}</a>
                        <button
                          onClick={() => copyToClipboard(email, `${s.id}-email-${i}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                          title="Copy email"
                        >
                          {copied === `${s.id}-email-${i}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Phones */}
                {s.phones && s.phones.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Phones</p>
                    {s.phones.map((phone, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm text-gray-700 hover:underline flex-1">{phone}</a>
                        <button
                          onClick={() => copyToClipboard(phone, `${s.id}-phone-${i}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                          title="Copy phone"
                        >
                          {copied === `${s.id}-phone-${i}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Websites */}
                {s.websites && s.websites.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Websites</p>
                    {s.websites.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                        <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate flex items-center gap-1">
                          {url.replace(/^https?:\/\//, '')}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(url, `${s.id}-web-${i}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                          title="Copy URL"
                        >
                          {copied === `${s.id}-web-${i}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Capacity + Terms + QC badges */}
              <div className="px-5 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {s.capacity && (
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px]">Capacity</p>
                      <p className="text-gray-700 font-medium">{s.capacity}</p>
                    </div>
                  )}
                  {s.terms && (
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px]">Terms</p>
                      <p className="text-gray-700 font-medium">{s.terms}</p>
                    </div>
                  )}
                  {s.moistureRange && (
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px]">Moisture</p>
                      <p className="font-medium flex items-center gap-1" style={{ color: BRAND_GREEN }}>
                        <ShieldCheck className="w-3 h-3" />{s.moistureRange}
                      </p>
                    </div>
                  )}
                  {s.minCuppingScore && (
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px]">Min Cupping</p>
                      <p className="text-gray-700 font-medium">SCA {s.minCuppingScore}</p>
                    </div>
                  )}
                </div>
                {s.certifications && s.certifications.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {s.certifications.map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: color + '15', color }}>
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}