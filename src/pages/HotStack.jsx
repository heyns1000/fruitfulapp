import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, CloudUpload, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function HotStack() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(180);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const expired = timeLeft <= 0;

  const handleFiles = (files) => {
    if (expired) {
      toast.error('Omnidrop window closed. Refresh to start a new timer.');
      return;
    }
    const file = files?.[0];
    if (!file) return;
    if (file.type !== 'text/html' && file.type !== 'application/pdf') {
      toast.error('Only HTML or PDF files can be omnidropped.');
      return;
    }
    setUploading(true);
    toast.success(`Omnidrop initiated for "${file.name}"!`);
    setTimeout(() => {
      setUploading(false);
      navigate('/CodeNestDashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1c] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particle canvas background */}
      <canvas
        ref={(c) => {
          if (c) {
            const ctx = c.getContext('2d');
            c.width = window.innerWidth;
            c.height = window.innerHeight;
            const particles = Array.from({ length: 80 }, () => ({
              x: Math.random() * c.width,
              y: Math.random() * c.height,
              speed: 2 + Math.random() * 1.5,
              opacity: Math.random() * 0.5 + 0.5,
            }));
            let raf;
            const animate = () => {
              ctx.clearRect(0, 0, c.width, c.height);
              particles.forEach((p) => {
                p.y += p.speed;
                if (p.y > c.height) { p.y = -3; p.x = Math.random() * c.width; }
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 204, 0, ${p.opacity})`;
                ctx.fill();
              });
              raf = requestAnimationFrame(animate);
            };
            animate();
            return () => cancelAnimationFrame(raf);
          }
        }}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 bg-black/85 backdrop-blur-md rounded-xl p-10 max-w-xl w-full text-center border border-yellow-500/30 shadow-2xl">
        <h1 className="text-4xl font-black text-white leading-none">
          Fruitful | <span className="text-[#ffcc00] text-3xl tracking-tight">HotStack™</span>
        </h1>
        <p className="text-lg text-gray-400 mt-2 mb-6">
          Omnidrop Your Digital Presence. Live in Minutes. Branded Forever.
        </p>

        <p className="text-5xl font-extrabold text-[#ffcc00] tracking-wider my-6">
          {minutes}:{seconds}
        </p>

        <div className="text-left max-w-sm mx-auto mb-6">
          <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-gray-300">What Your Omnidrop Activates:</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2"><Zap className="w-4 h-4 text-[#ffcc00] mt-0.5 shrink-0" /> Rapid Deployment: Your Scroll goes Live in under 180 seconds via Omnidrop Signal.</li>
            <li className="flex items-start gap-2"><Zap className="w-4 h-4 text-[#ffcc00] mt-0.5 shrink-0" /> Integrated Ecosystem: Auto DNS Hook + Curated Template Packs.</li>
            <li className="flex items-start gap-2"><Zap className="w-4 h-4 text-[#ffcc00] mt-0.5 shrink-0" /> Intelligent Foundation: Powered by ScrollStack™, VaultDNS™, and MeshNest™.</li>
            <li className="flex items-start gap-2"><Zap className="w-4 h-4 text-[#ffcc00] mt-0.5 shrink-0" /> Treaty-Linked Economy: Includes a Royalty-Linked License from Fruitful Global's Treaty Grid.</li>
            <li className="flex items-start gap-2"><Zap className="w-4 h-4 text-[#ffcc00] mt-0.5 shrink-0" /> ClaimRoot™ Verified: Secure, traceable site ownership for every deployed scroll.</li>
          </ul>
        </div>

        <Button
          onClick={() => navigate('/CodeNestDashboard')}
          disabled={expired || uploading}
          className="bg-[#ffcc00] hover:bg-[#ffe066] text-[#1a1a1c] font-bold text-lg px-8 py-3 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enter Fruitful | CodeNest™ →
        </Button>

        <div
          onClick={() => !expired && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          className={`mt-6 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
            dragOver ? 'border-[#ffcc00] bg-yellow-500/15 scale-[1.02]' : 'border-yellow-500/40 bg-yellow-500/5 hover:border-yellow-500/60'
          } ${expired ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input ref={fileInputRef} type="file" accept=".html,.pdf" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <CloudUpload className="w-6 h-6 text-[#ffcc00] mx-auto mb-1" />
          <p className="text-sm text-gray-400">{uploading ? 'Uploading...' : 'Drag & Drop HTML/PDF here or Click to Upload'}</p>
          <p className="text-xs text-gray-500 mt-1">Adheres to the 3-minute rule for rapid ingestion</p>
        </div>

        <p className="text-xs text-gray-500 mt-6">Powered by Fruitful Global | ScrollSynced | Vault-Verified</p>
      </div>
    </div>
  );
}