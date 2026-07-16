import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Upload, Check, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Reusable file upload button.
 * Props:
 *   onUploaded(url)  — called with the public file URL after upload
 *   accept           — file accept string (default "image/*")
 *   label            — button label
 *   currentUrl       — if set, shows a thumbnail preview
 *   className        — extra classes on wrapper
 *   variant          — 'button' (default) | 'dropzone'
 */
export default function FileUploadButton({
  onUploaded,
  accept = 'image/*',
  label = 'Upload Image',
  currentUrl,
  className = '',
  variant = 'button',
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    // local object URL for instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPreview(file_url);
      onUploaded(file_url);
      toast.success('File uploaded!');
    } catch (e) {
      toast.error('Upload failed');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const onChange = (e) => handleFile(e.target.files?.[0]);

  if (variant === 'dropzone') {
    return (
      <div className={`space-y-2 ${className}`}>
        <label
          className={`flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            preview
              ? 'border-green-600/60 bg-green-900/10'
              : 'border-border hover:border-primary bg-muted/40'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={onChange}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-muted-foreground text-xs">Uploading…</span>
            </div>
          ) : preview ? (
            <div className="relative w-full h-full">
              <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                <span className="text-foreground text-xs font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-green-400" /> Click to replace
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Upload className="w-6 h-6 text-primary" />
              <span className="text-sm">{label}</span>
              <span className="text-xs opacity-50">Click to browse</span>
            </div>
          )}
        </label>
      </div>
    );
  }

  // default 'button' variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
        disabled={uploading}
      />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-10 h-10 rounded-lg object-cover border border-border"
        />
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="border-border text-muted-foreground hover:border-primary hover:text-primary gap-1.5"
      >
        {uploading ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
        ) : (
          <><Upload className="w-3.5 h-3.5" /> {label}</>
        )}
      </Button>
      {preview && (
        <button
          type="button"
          onClick={() => { setPreview(null); onUploaded(''); }}
          className="text-muted-foreground hover:text-red-400 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}