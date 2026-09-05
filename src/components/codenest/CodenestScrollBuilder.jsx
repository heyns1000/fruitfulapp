import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Upload, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CodenestScrollBuilder() {
  const [scrollName, setScrollName] = useState('');
  const [scrollType, setScrollType] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [topic, setTopic] = useState('');
  const [aiBusy, setAiBusy] = useState(null);
  const [aiOutput, setAiOutput] = useState('');

  const callAI = async (prompt, field) => {
    setAiBusy(field);
    setAiOutput('');
    try {
      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      if (field === 'html') setHtmlCode(res);
      else if (field === 'css') setCssCode(res);
      else if (field === 'js') setJsCode(res);
      else setAiOutput(res);
      toast.success('AI generation complete');
    } catch { toast.error('AI call failed'); }
    setAiBusy(null);
  };

  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
      <h3 className="text-xl font-bold text-[#B8860B] mb-4">Scroll Builder — Deploy Your CodeNest™ Scroll</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300 mb-1.5 block">Scroll Name</Label>
            <input value={scrollName} onChange={(e) => setScrollName(e.target.value)} placeholder="e.g. VaultIntro Scroll" className="w-full bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2" />
          </div>
          <div>
            <Label className="text-gray-300 mb-1.5 block">Scroll Type</Label>
            <select value={scrollType} onChange={(e) => setScrollType(e.target.value)} className="w-full bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2">
              <option value="">Select type...</option>
              <option value="html">Basic HTML Page</option>
              <option value="component">FAA Component</option>
              <option value="checkout">Single Item Checkout</option>
              <option value="marketing">Marketing Scroll</option>
            </select>
          </div>
        </div>

        <div>
          <Label className="text-gray-300 mb-1.5 block">HTML Code</Label>
          <Textarea value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} rows={5} placeholder="Paste or write HTML code..." className="bg-[#3a3a3e] border-[#3a3a3e] text-white font-mono text-sm" />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => callAI(`Refine this HTML for better accessibility and semantics. Provide only code:\n\n${htmlCode}`, 'html')} disabled={aiBusy === 'html'} className="bg-[#30d158] hover:bg-[#28a745] text-white text-xs">
              {aiBusy === 'html' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Refine
            </Button>
            <Button size="sm" variant="outline" onClick={() => callAI(`Explain this HTML code:\n\n${htmlCode}`, 'explain-html')} className="border-[#0071e3] text-[#0071e3] text-xs">Explain</Button>
          </div>
        </div>

        <div>
          <Label className="text-gray-300 mb-1.5 block">CSS Styling</Label>
          <Textarea value={cssCode} onChange={(e) => setCssCode(e.target.value)} rows={4} placeholder="Add scroll styling here..." className="bg-[#3a3a3e] border-[#3a3a3e] text-white font-mono text-sm" />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => callAI(`Optimize this CSS for efficiency and modern practices. Provide only code:\n\n${cssCode}`, 'css')} disabled={aiBusy === 'css'} className="bg-[#30d158] hover:bg-[#28a745] text-white text-xs">
              {aiBusy === 'css' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Refine
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-gray-300 mb-1.5 block">JavaScript (Optional)</Label>
          <Textarea value={jsCode} onChange={(e) => setJsCode(e.target.value)} rows={4} placeholder="Optional scripts, claim triggers..." className="bg-[#3a3a3e] border-[#3a3a3e] text-white font-mono text-sm" />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => callAI(`Refactor this JS for best practices. Provide only code:\n\n${jsCode}`, 'js')} disabled={aiBusy === 'js'} className="bg-[#30d158] hover:bg-[#28a745] text-white text-xs">
              {aiBusy === 'js' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Refine
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-gray-300 mb-1.5 block">Scroll Topic (for AI Content Ideas)</Label>
          <div className="flex gap-2">
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Sustainable Urban Farming" className="flex-1 bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2" />
            <Button size="sm" onClick={() => callAI(`Generate 5 creative section ideas for a web scroll about "${topic}". Format as a markdown list.`, 'ideas')} disabled={aiBusy === 'ideas'} className="bg-[#30d158] hover:bg-[#28a745] text-white text-xs">
              {aiBusy === 'ideas' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Generate Ideas
            </Button>
          </div>
          {aiOutput && <Textarea readonly value={aiOutput} rows={6} className="mt-2 bg-[#3a3a3e] border-[#3a3a3e] text-white text-sm" />}
        </div>

        <Button onClick={() => toast.success('Scroll compiled & saved!')} className="bg-[#30d158] hover:bg-[#28a745] text-white">
          <Download className="w-4 h-4 mr-2" /> Compile Scroll & Save
        </Button>
      </div>
    </div>
  );
}