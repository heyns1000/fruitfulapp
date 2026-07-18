import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Palette, Image, FileText, X, Check } from 'lucide-react';
import FileUploadButton from '@/components/common/FileUploadButton';
import { toast } from 'sonner';

const PRESET_PALETTES = [
  { name: 'Ember',    primary: '#f97316', secondary: '#1c1917', accent: '#f59e0b' },
  { name: 'Forest',   primary: '#22c55e', secondary: '#0f1a14', accent: '#84cc16' },
  { name: 'Ocean',    primary: '#0ea5e9', secondary: '#0c1929', accent: '#06b6d4' },
  { name: 'Royal',    primary: '#8b5cf6', secondary: '#1a1530', accent: '#a78bfa' },
  { name: 'Sunset',   primary: '#ef4444', secondary: '#1a0f0f', accent: '#fb923c' },
  { name: 'Mono',     primary: '#e5e5e5', secondary: '#0a0a0a', accent: '#737373' },
  { name: 'Gold',     primary: '#eab308', secondary: '#1c1917', accent: '#fde047' },
  { name: 'Teal',     primary: '#14b8a6', secondary: '#0c1a1a', accent: '#2dd4bf' },
];

export default function HotStackCustomize({ customization, setCustomization, selectedBrands, onNext, onBack }) {
  const [refFiles, setRefFiles] = useState(customization.referenceFiles || []);

  const update = (patch) => setCustomization({ ...customization, ...patch });

  const updateColor = (key, val) => {
    setCustomization({
      ...customization,
      colors: { ...customization.colors, [key]: val },
    });
  };

  const applyPreset = (p) => {
    setCustomization({
      ...customization,
      colors: { primary: p.primary, secondary: p.secondary, accent: p.accent },
    });
    toast.success(`${p.name} palette applied`);
  };

  const addRefFile = (url) => {
    if (!url) return;
    const updated = [...refFiles, url];
    setRefFiles(updated);
    update({ referenceFiles: updated });
  };

  const removeRefFile = (idx) => {
    const updated = refFiles.filter((_, i) => i !== idx);
    setRefFiles(updated);
    update({ referenceFiles: updated });
  };

  const colors = customization.colors || {};

  return (
    <div className="max-w-5xl mx-auto pt-6 space-y-6">

      {/* Header */}
      <div>
        <p className="text-orange-500 text-xs font-black tracking-widest uppercase mb-1.5">Step 3 — Customize</p>
        <h2 className="text-3xl font-black text-white flex items-center gap-2.5">
          <Palette className="w-7 h-7 text-orange-500" />
          Make it yours
        </h2>
        <p className="text-stone-500 text-sm mt-1.5">
          Upload your logo, pick your brand colors, and attach reference files. HotStack™ uses these to build an app that's truly yours — not a generic template.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Logo Upload ── */}
        <div className="rounded-2xl border border-stone-800 p-5" style={{ background: '#111019' }}>
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-4 h-4 text-orange-400" />
            <h3 className="text-white font-bold text-sm">App Logo</h3>
          </div>
          <p className="text-stone-600 text-xs mb-4 leading-relaxed">
            Upload your brand logo. It appears in the app sidebar, header, and browser tab.
          </p>
          <FileUploadButton
            variant="dropzone"
            accept="image/*"
            label="Upload your logo"
            currentUrl={customization.logoUrl}
            onUploaded={(url) => update({ logoUrl: url })}
          />
          {customization.logoUrl && (
            <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
              <Check className="w-3.5 h-3.5" /> Logo ready — will appear in preview
            </div>
          )}
        </div>

        {/* ── Color Palette ── */}
        <div className="rounded-2xl border border-stone-800 p-5" style={{ background: '#111019' }}>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-orange-400" />
            <h3 className="text-white font-bold text-sm">Brand Colors</h3>
          </div>
          <p className="text-stone-600 text-xs mb-4 leading-relaxed">
            Pick a preset or customize. These override the AI's default color choices.
          </p>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {PRESET_PALETTES.map((p) => {
              const isActive = colors.primary === p.primary;
              return (
                <button key={p.name} onClick={() => applyPreset(p)}
                  className="p-2 rounded-lg border-2 transition-all text-center"
                  style={isActive
                    ? { borderColor: p.primary, background: `${p.primary}10` }
                    : { borderColor: 'rgb(41,37,36)', background: 'transparent' }}>
                  <div className="flex gap-0.5 justify-center mb-1.5">
                    <div className="w-4 h-4 rounded" style={{ background: p.primary }} />
                    <div className="w-4 h-4 rounded" style={{ background: p.secondary }} />
                    <div className="w-4 h-4 rounded" style={{ background: p.accent }} />
                  </div>
                  <span className="text-[10px] font-bold text-stone-400">{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom color pickers */}
          <div className="space-y-2.5">
            {[
              { key: 'primary', label: 'Primary' },
              { key: 'secondary', label: 'Secondary' },
              { key: 'accent', label: 'Accent' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors[key] || '#f97316'}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="w-9 h-9 rounded-lg border border-stone-700 cursor-pointer bg-transparent"
                />
                <span className="text-stone-400 text-xs font-bold w-16">{label}</span>
                <input
                  type="text"
                  value={colors[key] || ''}
                  onChange={(e) => updateColor(key, e.target.value)}
                  placeholder="#f97316"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-900 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reference Files ── */}
      <div className="rounded-2xl border border-stone-800 p-5" style={{ background: '#111019' }}>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-orange-400" />
          <h3 className="text-white font-bold text-sm">Reference Files (Optional)</h3>
        </div>
        <p className="text-stone-600 text-xs mb-4 leading-relaxed">
          Upload screenshots, mockups, brand guidelines, or any files you want the AI to use as context. The AI will analyze these and incorporate them into your app design.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {refFiles.map((url, i) => (
            <div key={i} className="relative group rounded-xl border border-stone-700 overflow-hidden" style={{ background: '#0d0b0f' }}>
              {url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <img src={url} alt={`ref ${i + 1}`} className="w-full h-24 object-cover" />
              ) : (
                <div className="w-full h-24 flex items-center justify-center text-stone-600">
                  <FileText className="w-8 h-8" />
                </div>
              )}
              <button
                onClick={() => removeRefFile(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-red-400 hover:bg-red-900/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {refFiles.length < 6 && (
            <FileUploadButton
              variant="dropzone"
              accept="image/*,.pdf,.doc,.docx,.txt"
              label="Add reference file"
              onUploaded={addRefFile}
              className="sm:col-span-1"
            />
          )}
        </div>

        {refFiles.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
            <Check className="w-3.5 h-3.5" /> {refFiles.length} reference file{refFiles.length !== 1 ? 's' : ''} attached — AI will use these as context
          </div>
        )}
      </div>

      {/* ── Summary ── */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-orange-500/20" style={{ background: 'rgba(249,115,22,0.04)' }}>
        <div className="flex items-center gap-3">
          {customization.logoUrl ? (
            <img src={customization.logoUrl} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-stone-600" style={{ background: '#1c1917' }}>
              <Image className="w-5 h-5" />
            </div>
          )}
          <div>
            <p className="text-white text-sm font-bold">
              {customization.logoUrl ? 'Logo uploaded' : 'No logo'} · {colors.primary ? 'Custom colors' : 'Default colors'} · {refFiles.length} ref file{refFiles.length !== 1 ? 's' : ''}
            </p>
            <p className="text-stone-600 text-xs">{selectedBrands.length} brands stacked · ready to generate</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between pt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-bold transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onNext}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-black transition-all text-black"
          style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}>
          Generate App <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}