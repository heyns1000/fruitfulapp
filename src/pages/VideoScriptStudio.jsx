import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Film, Sparkles, Send, Download, Copy, RefreshCw, Wand2, Play, Clock, Mic, Music, Camera } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const PROMPT_PRESETS = [
  { label: '🚀 Epic Launch', prompt: 'Generate a 60-second Pixar-level epic launch video script for @Fruitful@ FAA.ZONE — bold, cinematic, African futurism. Show the full ecosystem: artisans, brands, marketplace, collaboration, AI. End with a powerful CTA.' },
  { label: '🌍 Artisan Story', prompt: 'Create a 45-second emotional artisan origin story for @Fruitful@. Follow one master artisan from a rural workshop to a global digital marketplace. Show how FAA.ZONE transforms their craft into international trade. Pixar emotional depth.' },
  { label: '⚡ Feature Highlight', prompt: 'Write a 30-second fast-paced kinetic animation script showcasing the top 5 features of @Fruitful@ FAA.ZONE: Marketplace, Collaboration Suite, AI Content, Loyalty Program, and Automation Engine. High energy, vibrant, Gen Z aesthetic.' },
  { label: '🏆 Brand Power', prompt: 'Generate a 1-minute 5-second prestige brand film script for @Fruitful@. Think Apple-meets-Wakanda. Show FAA.ZONE as the infrastructure of the new African digital economy. Majestic, aspirational, goosebump-inducing.' },
  { label: '🎯 Investor Pitch', prompt: 'Create a 50-second investor-facing animated explainer for @Fruitful@ FAA.ZONE. Professional but visually stunning — show the market opportunity, the ecosystem flywheel, and the vision. Pixar clarity meets McKinsey precision.' },
];

const DURATION_OPTIONS = [
  { value: '30', label: '30 seconds' },
  { value: '45', label: '45 seconds' },
  { value: '60', label: '60 seconds' },
  { value: '71', label: '1 min 11 sec (max)' },
];

const STYLE_OPTIONS = [
  { value: 'pixar', label: '🎬 Pixar 3D Animation' },
  { value: 'afrofuturism', label: '🌌 Afrofuturism Motion' },
  { value: 'kinetic', label: '⚡ Kinetic Typography' },
  { value: 'mixed', label: '✨ Mixed Media Epic' },
  { value: 'documentary', label: '🎥 Animated Documentary' },
];

export default function VideoScriptStudio() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [duration, setDuration] = useState('60');
  const [style, setStyle] = useState('pixar');
  const [copiedScript, setCopiedScript] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'video_script_agent',
      metadata: { name: `@Fruitful@ Video Script — ${new Date().toLocaleDateString()}` },
    });
    setConversation(conv);
    const unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !conversation || sending) return;
    setSending(true);
    setInput('');
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
    setSending(false);
    inputRef.current?.focus();
  };

  const handlePreset = (preset) => {
    const enriched = `${preset.prompt}\n\nTarget duration: ${duration} seconds. Animation style: ${STYLE_OPTIONS.find(s => s.value === style)?.label || style}.`;
    sendMessage(enriched);
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleNewScript = async () => {
    setMessages([]);
    setConversation(null);
    await initConversation();
  };

  const getLastScript = () => {
    const assistantMsgs = messages.filter(m => m.role === 'assistant' && m.content);
    return assistantMsgs[assistantMsgs.length - 1]?.content || '';
  };

  const copyScript = () => {
    const script = getLastScript();
    if (!script) return;
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const downloadScript = () => {
    const script = getLastScript();
    if (!script) return;
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fruitful_VideoScript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasScript = getLastScript().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">@Fruitful@ Video Script Studio</h1>
              <p className="text-xs text-white/50">AI Cinematic Director · Pixar-Level Animation Scripts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasScript && (
              <>
                <Button size="sm" variant="outline" onClick={copyScript}
                  className="border-white/20 text-white hover:bg-white/10 gap-1.5">
                  <Copy className="w-3.5 h-3.5" />
                  {copiedScript ? 'Copied!' : 'Copy'}
                </Button>
                <Button size="sm" variant="outline" onClick={downloadScript}
                  className="border-white/20 text-white hover:bg-white/10 gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={handleNewScript}
              className="border-white/20 text-white hover:bg-white/10 gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              New Script
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl flex flex-col gap-6">

        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/50 font-medium uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Target Duration
            </label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map(d => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/50 font-medium uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3 h-3" /> Animation Style
            </label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLE_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preset Prompts */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Wand2 className="w-3 h-3" /> Quick Presets
          </p>
          <div className="flex flex-wrap gap-2">
            {PROMPT_PRESETS.map((p, i) => (
              <button key={i} onClick={() => handlePreset(p)} disabled={sending}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 text-white/80 hover:text-amber-300 transition-all disabled:opacity-40">
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat / Script Area */}
        <div className="flex flex-col gap-4 min-h-[400px]">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-600/20 border border-amber-400/20 flex items-center justify-center">
                <Play className="w-10 h-10 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Ready to Direct</h2>
                <p className="text-white/40 text-sm mt-1 max-w-sm">Choose a preset above or write your own prompt to generate a world-class Pixar-level animation script for @Fruitful@.</p>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-white/30">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />30s–1m11s</span>
                <span className="flex items-center gap-1"><Camera className="w-3 h-3" />Scene-by-scene</span>
                <span className="flex items-center gap-1"><Mic className="w-3 h-3" />Voiceover</span>
                <span className="flex items-center gap-1"><Music className="w-3 h-3" />Sound cues</span>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mr-3 mt-1 shrink-0">
                  <Film className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                msg.role === 'user'
                  ? 'bg-amber-500/20 border border-amber-500/30 text-white'
                  : 'bg-white/5 border border-white/10 text-white/90'
              }`}>
                {msg.role === 'user' ? (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                ) : (
                  <ReactMarkdown
                    className="text-sm prose prose-invert prose-sm max-w-none
                      [&>h1]:text-amber-400 [&>h1]:font-black [&>h1]:text-lg [&>h1]:mt-4 [&>h1]:mb-2
                      [&>h2]:text-amber-300 [&>h2]:font-bold [&>h2]:mt-4 [&>h2]:mb-1
                      [&>h3]:text-orange-300 [&>h3]:font-semibold [&>h3]:mt-3
                      [&>p]:leading-relaxed [&>p]:my-1
                      [&>ul]:my-1 [&>ol]:my-1
                      [&>blockquote]:border-amber-400 [&>blockquote]:text-amber-200
                      [&>hr]:border-white/10
                      [&>strong]:text-amber-300
                    "
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mr-3 mt-1 shrink-0">
                <Film className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-white/40 text-xs">Crafting your cinematic script...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-4 bg-gray-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your vision... e.g. 'Generate a 45-second launch video highlighting artisans and the marketplace...'"
              className="bg-transparent border-none resize-none text-white placeholder:text-white/30 focus:ring-0 focus-visible:ring-0 min-h-[44px] max-h-32 text-sm"
              rows={2}
            />
            <Button onClick={handleSend} disabled={!input.trim() || sending}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl shrink-0 h-10 w-10 p-0 shadow-lg shadow-orange-500/30">
              {sending ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-white/20 mt-1.5 px-1">Press Enter to send · Shift+Enter for new line</p>
        </div>

      </div>
    </div>
  );
}