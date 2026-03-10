import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Image, Palette, Layers, Plus, Trash2, X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TYPE_CONFIG = {
  logo: { label: 'Brand Logos', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  product_photo: { label: 'Product Photos', icon: Image, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  color_palette: { label: 'Color Palettes', icon: Palette, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
};

function ColorPaletteForm({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState([{ hex: '#2D6A4F', name: 'Forest' }, { hex: '#F4A261', name: 'Amber' }]);

  const addColor = () => setColors([...colors, { hex: '#000000', name: '' }]);
  const removeColor = (i) => setColors(colors.filter((_, idx) => idx !== i));
  const updateColor = (i, field, val) => setColors(colors.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const handleSave = () => {
    if (!name) { toast.error('Name required'); return; }
    onSave({ name, brandName, description, assetType: 'color_palette', colorValues: colors, tags: [brandName].filter(Boolean) });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Palette name (e.g. @Fruitful@ Brand Colors)" value={name} onChange={e => setName(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
      <Input placeholder="Brand name (optional)" value={brandName} onChange={e => setBrandName(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
      <Textarea placeholder="Describe this palette's mood/usage for AI context..."
        value={description} onChange={e => setDescription(e.target.value)} rows={2}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none" />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Colors</p>
        {colors.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="color" value={c.hex} onChange={e => updateColor(i, 'hex', e.target.value)}
              className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent" />
            <span className="text-white/60 text-xs font-mono w-20">{c.hex}</span>
            <Input placeholder="Color name" value={c.name} onChange={e => updateColor(i, 'name', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-8 text-sm flex-1" />
            <Button size="icon" variant="ghost" onClick={() => removeColor(i)} className="text-white/30 hover:text-red-400 h-8 w-8">
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={addColor}
          className="border-white/10 text-white/60 hover:bg-white/5 gap-1.5 text-xs">
          <Plus className="w-3 h-3" /> Add Color
        </Button>
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-500 text-white gap-1.5">
          <Check className="w-4 h-4" /> Save Palette
        </Button>
        <Button variant="outline" onClick={onCancel} className="border-white/10 text-white/60 hover:bg-white/5">Cancel</Button>
      </div>
    </div>
  );
}

function UploadForm({ assetType, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cfg = TYPE_CONFIG[assetType];

  const handleSave = async () => {
    if (!name) { toast.error('Name required'); return; }
    if (!file) { toast.error('Please select a file'); return; }
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploading(false);
    onSave({ name, brandName, description, assetType, fileUrl: file_url, tags: [brandName].filter(Boolean) });
  };

  return (
    <div className="space-y-4">
      <Input placeholder={`Asset name (e.g. ${assetType === 'logo' ? 'FAA.ZONE Main Logo' : 'Artisan Pottery Hero Shot'})`}
        value={name} onChange={e => setName(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
      <Input placeholder="Brand name (optional)" value={brandName} onChange={e => setBrandName(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
      <Textarea placeholder="Describe this asset for AI context (e.g. 'Golden logo on dark background, represents ecosystem connectivity')..."
        value={description} onChange={e => setDescription(e.target.value)} rows={2}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none" />
      <label className={`flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${file ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-white/20 bg-white/2'}`}>
        <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
        {file ? (
          <span className="text-green-400 text-sm font-medium flex items-center gap-2"><Check className="w-4 h-4" />{file.name}</span>
        ) : (
          <>
            <Upload className={`w-6 h-6 mb-1 ${cfg.color}`} />
            <span className="text-white/40 text-sm">Click to upload image</span>
          </>
        )}
      </label>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={uploading} className="bg-purple-600 hover:bg-purple-500 text-white gap-1.5">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Save Asset'}
        </Button>
        <Button variant="outline" onClick={onCancel} className="border-white/10 text-white/60 hover:bg-white/5">Cancel</Button>
      </div>
    </div>
  );
}

export default function AssetLibrary() {
  const [activeTab, setActiveTab] = useState('logo');
  const [showAdd, setShowAdd] = useState(false);
  const qc = useQueryClient();

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.AssetLibrary.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AssetLibrary.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assets'] }); setShowAdd(false); toast.success('Asset saved!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AssetLibrary.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets'] }),
  });

  const filtered = assets.filter(a => a.assetType === activeTab);
  const cfg = TYPE_CONFIG[activeTab];
  const Icon = cfg.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black">Asset Library</h1>
              <p className="text-xs text-white/40">Brand logos · Product photos · Color palettes — synced to Video Script AI</p>
            </div>
          </div>
          <Button onClick={() => setShowAdd(true)}
            className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-500 hover:to-teal-500 text-white gap-1.5">
            <Plus className="w-4 h-4" /> Add Asset
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.entries(TYPE_CONFIG).map(([type, c]) => {
            const Ic = c.icon;
            const count = assets.filter(a => a.assetType === type).length;
            return (
              <button key={type} onClick={() => setActiveTab(type)}
                className={`rounded-xl border p-4 text-left transition-all ${activeTab === type ? c.bg + ' scale-[1.02]' : 'bg-white/3 border-white/5 hover:bg-white/5'}`}>
                <Ic className={`w-5 h-5 mb-2 ${c.color}`} />
                <p className="text-2xl font-black">{count}</p>
                <p className="text-xs text-white/50">{c.label}</p>
              </button>
            );
          })}
        </div>

        {/* Asset Grid */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-4">
            {Object.entries(TYPE_CONFIG).map(([type, c]) => (
              <TabsTrigger key={type} value={type} className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(TYPE_CONFIG).map(type => (
            <TabsContent key={type} value={type}>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                  <Icon className={`w-10 h-10 ${cfg.color} opacity-30`} />
                  <p className="text-white/30 text-sm">No {cfg.label.toLowerCase()} yet.</p>
                  <Button size="sm" onClick={() => setShowAdd(true)}
                    variant="outline" className="border-white/10 text-white/50 hover:bg-white/5 gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add First
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-4 ${type === 'color_palette' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
                  {filtered.map(asset => (
                    <Card key={asset.id} className={`bg-white/4 border ${cfg.bg} group relative`}>
                      <CardContent className="p-3">
                        {type !== 'color_palette' && asset.fileUrl && (
                          <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-black/30">
                            <img src={asset.fileUrl} alt={asset.name} className="w-full h-full object-contain" />
                          </div>
                        )}
                        {type === 'color_palette' && asset.colorValues?.length > 0 && (
                          <div className="flex h-10 rounded-lg overflow-hidden mb-3">
                            {asset.colorValues.map((c, i) => (
                              <div key={i} className="flex-1 relative group/swatch" style={{ backgroundColor: c.hex }}
                                title={`${c.name} ${c.hex}`} />
                            ))}
                          </div>
                        )}
                        <p className="font-semibold text-sm text-white truncate">{asset.name}</p>
                        {asset.brandName && <p className="text-xs text-white/40 truncate">{asset.brandName}</p>}
                        {asset.description && <p className="text-xs text-white/30 mt-1 line-clamp-2">{asset.description}</p>}
                        {type === 'color_palette' && asset.colorValues && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {asset.colorValues.map((c, i) => (
                              <span key={i} className="text-xs font-mono px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: c.hex + '33', color: c.hex, border: `1px solid ${c.hex}55` }}>
                                {c.hex}
                              </span>
                            ))}
                          </div>
                        )}
                        <Button size="icon" variant="ghost"
                          onClick={() => deleteMutation.mutate(asset.id)}
                          className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Add Asset Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-gray-900 border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${cfg.color}`} />
              Add {cfg.label.slice(0, -1)}
            </DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 border border-white/10 mb-4 w-full">
              {Object.entries(TYPE_CONFIG).map(([type, c]) => (
                <TabsTrigger key={type} value={type} className="flex-1 data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white text-xs">
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="logo">
              <UploadForm assetType="logo" onSave={d => createMutation.mutate(d)} onCancel={() => setShowAdd(false)} />
            </TabsContent>
            <TabsContent value="product_photo">
              <UploadForm assetType="product_photo" onSave={d => createMutation.mutate(d)} onCancel={() => setShowAdd(false)} />
            </TabsContent>
            <TabsContent value="color_palette">
              <ColorPaletteForm onSave={d => createMutation.mutate(d)} onCancel={() => setShowAdd(false)} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}