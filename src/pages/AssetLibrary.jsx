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
import { Upload, Image, Palette, Layers, Plus, Trash2, X, Check, Loader2, FileText, Sheet, File, Download } from 'lucide-react';
import { toast } from 'sonner';

const FOLDERS = [
  { id: 'commerce', label: '🛍️ Commerce', bg: '#7c3aed' },
  { id: 'banimal', label: '🐾 Banimal', bg: '#ea580c' },
  { id: 'artisan', label: '🖌️ Artisan', bg: '#c026d3' },
  { id: 'subscriptions', label: '💎 Subscriptions', bg: '#65a30d' },
  { id: 'brands', label: '🌿 Brands & Ecosystem', bg: '#075985' },
  { id: 'creative', label: '🎬 Creative', bg: '#5b21b6' },
  { id: 'infrastructure', label: '🔐 Infrastructure', bg: '#059669' },
  { id: 'branding', label: '🏷️ Branding & Logos', bg: '#92400e' },
];

const ASSET_TYPE_CONFIG = {
  logo: { label: 'Brand Logos', icon: Layers, color: 'text-purple-400' },
  product_photo: { label: 'Product Photos', icon: Image, color: 'text-amber-400' },
  color_palette: { label: 'Color Palettes', icon: Palette, color: 'text-teal-400' },
  document: { label: 'Documents', icon: FileText, color: 'text-blue-400' },
  spreadsheet: { label: 'Spreadsheets', icon: Sheet, color: 'text-green-400' },
  pdf: { label: 'PDFs', icon: File, color: 'text-red-400' },
  file: { label: 'Other Files', icon: File, color: 'text-gray-400' },
};

function FileIcon({ assetType }) {
  const cfg = ASSET_TYPE_CONFIG[assetType] || ASSET_TYPE_CONFIG.file;
  const Icon = cfg.icon;
  return (
    <div className="w-full h-32 rounded-lg mb-3 bg-black/30 flex flex-col items-center justify-center gap-2">
      <Icon className={`w-12 h-12 ${cfg.color}`} />
      <span className="text-xs text-white/30 uppercase tracking-wider">{cfg.label}</span>
    </div>
  );
}

function ColorPaletteForm({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [folder, setFolder] = useState('brands');
  const [colors, setColors] = useState([{ hex: '#2D6A4F', name: 'Forest' }, { hex: '#F4A261', name: 'Amber' }]);

  const addColor = () => setColors([...colors, { hex: '#000000', name: '' }]);
  const removeColor = (i) => setColors(colors.filter((_, idx) => idx !== i));
  const updateColor = (i, field, val) => setColors(colors.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const handleSave = () => {
    if (!name) { toast.error('Name required'); return; }
    onSave({ name, brandName, description, assetType: 'color_palette', folder, colorValues: colors, tags: [brandName].filter(Boolean) });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Palette name (e.g. Fruitful Brand Colors)" value={name} onChange={e => setName(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
      <Input placeholder="Brand name (optional)" value={brandName} onChange={e => setBrandName(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
      <select value={folder} onChange={e => setFolder(e.target.value)}
        className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm">
        {FOLDERS.map(f => <option key={f.id} value={f.id} className="bg-gray-900">{f.label}</option>)}
      </select>
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
  const [folder, setFolder] = useState('commerce');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    if (!name) { toast.error('Name required'); return; }
    if (!file) { toast.error('Please select a file'); return; }
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploading(false);
    onSave({ name, brandName, description, assetType, folder, fileUrl: file_url, tags: [brandName].filter(Boolean) });
  };

  return (
    <div className="space-y-4">
      <Input placeholder={`Asset name (e.g. ${assetType === 'logo' ? 'FAA.ZONE Main Logo' : 'Artisan Pottery Hero Shot'})`}
        value={name} onChange={e => setName(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
      <Input placeholder="Brand name (optional)" value={brandName} onChange={e => setBrandName(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
      <select value={folder} onChange={e => setFolder(e.target.value)}
        className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm">
        {FOLDERS.map(f => <option key={f.id} value={f.id} className="bg-gray-900">{f.label}</option>)}
      </select>
      <Textarea placeholder="Describe this asset for AI context..."
        value={description} onChange={e => setDescription(e.target.value)} rows={2}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none" />
      <label className={`flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${file ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-white/20 bg-white/2'}`}>
        <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
        {file ? (
          <span className="text-green-400 text-sm font-medium flex items-center gap-2"><Check className="w-4 h-4" />{file.name}</span>
        ) : (
          <>
            <Upload className="w-6 h-6 mb-1 text-amber-400" />
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
  const [activeFolder, setActiveFolder] = useState('commerce');
  const [addType, setAddType] = useState(null);
  const qc = useQueryClient();

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.AssetLibrary.list('-created_date', 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AssetLibrary.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assets'] }); setAddType(null); toast.success('Asset saved!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AssetLibrary.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets'] }),
  });

  const filtered = assets.filter(a => a.folder === activeFolder);
  const folderCfg = FOLDERS.find(f => f.id === activeFolder) || FOLDERS[0];

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
              <p className="text-xs text-white/40">{assets.length} assets across {FOLDERS.length} folders — synced to Video Script AI</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setAddType('product_photo')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white gap-1.5">
              <Plus className="w-4 h-4" /> Photo
            </Button>
            <Button onClick={() => setAddType('logo')}
              className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-500 hover:to-teal-500 text-white gap-1.5">
              <Plus className="w-4 h-4" /> Logo
            </Button>
            <Button onClick={() => setAddType('color_palette')}
              className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-500 hover:to-green-500 text-white gap-1.5">
              <Plus className="w-4 h-4" /> Palette
            </Button>
            <Button onClick={() => setAddType('file')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white gap-1.5">
              <Plus className="w-4 h-4" /> Doc
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Folder Tabs — matching Dashboard navigation style */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FOLDERS.map(f => {
            const count = assets.filter(a => a.folder === f.id).length;
            const isActive = activeFolder === f.id;
            return (
              <button key={f.id} onClick={() => setActiveFolder(f.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive ? 'text-white scale-[1.03] shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                }`}
                style={isActive ? { backgroundColor: f.bg } : {}}>
                <span>{f.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Active Folder Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black" style={{ color: folderCfg.bg }}>
            {folderCfg.label} <span className="text-white/30 text-sm font-normal">· {filtered.length} assets</span>
          </h2>
        </div>

        {/* Asset Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <Image className="w-10 h-10 text-white/20" />
            <p className="text-white/30 text-sm">No assets in this folder yet.</p>
            <Button size="sm" onClick={() => setAddType('product_photo')}
              variant="outline" className="border-white/10 text-white/50 hover:bg-white/5 gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add First Asset
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map(asset => (
              <Card key={asset.id} className="bg-white/4 border border-white/10 group relative">
                <CardContent className="p-3">
                  {asset.assetType === 'color_palette' && asset.colorValues?.length > 0 && (
                    <div className="flex h-10 rounded-lg overflow-hidden mb-3">
                      {asset.colorValues.map((c, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} title={`${c.name} ${c.hex}`} />
                      ))}
                    </div>
                  )}
                  {['logo', 'product_photo'].includes(asset.assetType) && asset.fileUrl && (
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-black/30">
                      <img src={asset.fileUrl} alt={asset.name} className="w-full h-full object-contain" />
                    </div>
                  )}
                  {['document', 'spreadsheet', 'pdf', 'file'].includes(asset.assetType) && asset.fileUrl && (
                    <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <FileIcon assetType={asset.assetType} />
                    </a>
                  )}
                  {asset.assetType === 'color_palette' && asset.colorValues?.length > 0 && (
                    <div className="flex h-10 rounded-lg overflow-hidden mb-3">
                      {asset.colorValues.map((c, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} title={`${c.name} ${c.hex}`} />
                      ))}
                    </div>
                  )}
                  <p className="font-semibold text-sm text-white truncate">{asset.name}</p>
                  {asset.brandName && <p className="text-xs text-white/40 truncate">{asset.brandName}</p>}
                  {asset.description && <p className="text-xs text-white/30 mt-1 line-clamp-2">{asset.description}</p>}
                  {asset.assetType === 'color_palette' && asset.colorValues && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.colorValues.map((c, i) => (
                        <span key={i} className="text-xs font-mono px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: c.hex + '33', color: c.hex, border: `1px solid ${c.hex}55` }}>
                          {c.hex}
                        </span>
                      ))}
                    </div>
                  )}
                  {asset.tags && asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.tags.slice(0, 3).map((t, i) => (
                        <Badge key={i} className="bg-white/5 text-white/40 border-0 text-[10px]">{t}</Badge>
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
      </div>

      {/* Add Asset Dialog */}
      <Dialog open={!!addType} onOpenChange={(open) => !open && setAddType(null)}>
        <DialogContent className="bg-gray-900 border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {addType === 'logo' && <Layers className="w-5 h-5 text-purple-400" />}
              {addType === 'product_photo' && <Image className="w-5 h-5 text-amber-400" />}
              {addType === 'color_palette' && <Palette className="w-5 h-5 text-teal-400" />}
              Add {addType === 'logo' ? 'Logo' : addType === 'product_photo' ? 'Product Photo' : addType === 'color_palette' ? 'Color Palette' : 'Document / File'}
            </DialogTitle>
          </DialogHeader>
          {addType === 'color_palette' ? (
            <ColorPaletteForm onSave={d => createMutation.mutate(d)} onCancel={() => setAddType(null)} />
          ) : addType && (
            <UploadForm assetType={addType === 'file' ? 'file' : addType} onSave={d => createMutation.mutate(d)} onCancel={() => setAddType(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}