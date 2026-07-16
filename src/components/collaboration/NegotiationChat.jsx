import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Scale, Send, Sparkles, Copy, CheckCircle, FileText, ChevronDown, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const QUICK_ACTIONS = [
  { label: 'Draft terms', prompt: 'Draft fair partnership terms for this joint venture including revenue split, IP ownership, and exit clauses.' },
  { label: 'Counter-offer', prompt: 'Generate a professional counter-offer that protects my brand\'s interests while keeping the deal attractive to the partner.' },
  { label: 'Legal clauses', prompt: 'Suggest the most important legal clauses and protections I should include in this agreement, optimised for the FAA.ZONE ecosystem.' },
  { label: 'Revenue split', prompt: 'Propose an equitable revenue sharing model for this collaboration based on each brand\'s contribution and risk profile.' },
  { label: 'IP protection', prompt: 'What IP ownership and licensing terms should be included to protect both brands\' assets in this venture?' },
  { label: 'Exit strategy', prompt: 'Draft exit clauses and dissolution terms that protect both parties if the collaboration doesn\'t work out.' },
  { label: 'Milestone plan', prompt: 'Create a milestone-based payment and performance framework for this joint venture agreement.' },
  { label: 'Dispute resolution', prompt: 'Suggest a fair dispute resolution process and governing law clause suitable for a cross-border African ecosystem collaboration.' },
];

function MessageBubble({ msg }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-violet-600" />
        </div>
      )}
      <div className={`max-w-[85%] group ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-violet-600 text-foreground rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
        }`}>
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <ReactMarkdown
              className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-strong:text-gray-900 prose-li:my-0.5"
              components={{
                h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1 text-violet-900">{children}</h3>,
                strong: ({ children }) => <strong className="font-semibold text-violet-800">{children}</strong>,
                li: ({ children }) => <li className="text-sm text-gray-700">{children}</li>,
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>
        {!isUser && (
          <button
            onClick={copy}
            className="mt-1 ml-1 text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? <><CheckCircle className="w-3 h-3 text-green-500" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
          </button>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
}

export default function NegotiationChat() {
  const [brandAId, setBrandAId] = useState('');
  const [brandBId, setBrandBId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showClauses, setShowClauses] = useState(false);
  const [suggestedClauses, setSuggestedClauses] = useState(null);
  const [loadingClauses, setLoadingClauses] = useState(false);
  const bottomRef = useRef(null);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands-neg'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const brandA = brands.find(b => b.id === brandAId);
  const brandB = brands.find(b => b.id === brandBId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const buildSystemContext = () => {
    if (!brandA || !brandB) return '';
    return `You are an expert legal and business negotiation advisor for FAA.ZONE, a multi-sector African & global business ecosystem.

You are helping negotiate a joint venture agreement between:
- BRAND A: ${brandA.name} (Sector: ${brandA.sector}, Subnodes: ${(brandA.subnodes || []).join(', ')}, Tags: ${(brandA.tags || []).slice(0, 5).join(', ')})
- BRAND B: ${brandB.name} (Sector: ${brandB.sector}, Subnodes: ${(brandB.subnodes || []).join(', ')}, Tags: ${(brandB.tags || []).slice(0, 5).join(', ')})

Your role:
- Draft clear, professional negotiation terms, counter-offers, and project agreements
- Suggest legal clauses optimised for ecosystem growth and African/international business law
- Balance the interests of both parties fairly
- Format responses with clear headings using markdown, bullet points for clauses, and bold for key terms
- Always flag any high-risk areas or asymmetric terms
- Keep language professional but accessible (not overly legal jargon)`;
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || !brandA || !brandB) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    const history = newMessages.map(m => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`).join('\n\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${buildSystemContext()}

CONVERSATION HISTORY:
${history}

Respond as the negotiation advisor. Be specific, practical and structured.`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const loadSuggestedClauses = async () => {
    if (!brandA || !brandB) return;
    setLoadingClauses(true);
    setShowClauses(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a concise list of 8-10 essential legal clauses for a joint venture agreement between ${brandA.name} (${brandA.sector}) and ${brandB.name} (${brandB.sector}) in the FAA.ZONE ecosystem. For each clause give a short name and a 1-sentence description of what it covers.`,
      response_json_schema: {
        type: 'object',
        properties: {
          clauses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                priority: { type: 'string', enum: ['Essential', 'Recommended', 'Optional'] }
              }
            }
          }
        }
      }
    });
    setSuggestedClauses(response.clauses || []);
    setLoadingClauses(false);
  };

  const priorityColor = {
    Essential: 'bg-red-100 text-red-700 border-red-200',
    Recommended: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Optional: 'bg-green-100 text-green-700 border-green-200',
  };

  const ready = brandA && brandB;

  return (
    <div className="space-y-4">
      {/* Brand Setup */}
      <Card className="border-violet-200">
        <CardHeader className="pb-3 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-t-xl border-b border-violet-100">
          <CardTitle className="text-base flex items-center gap-2 text-violet-900">
            <Scale className="w-4 h-4" />
            Negotiation Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Your Brand (Party A)</label>
              <Select value={brandAId} onValueChange={setBrandAId}>
                <SelectTrigger><SelectValue placeholder="Select your brand..." /></SelectTrigger>
                <SelectContent>
                  {brands.filter(b => b.id !== brandBId).map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name} — {b.sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Partner Brand (Party B)</label>
              <Select value={brandBId} onValueChange={setBrandBId}>
                <SelectTrigger><SelectValue placeholder="Select partner brand..." /></SelectTrigger>
                <SelectContent>
                  {brands.filter(b => b.id !== brandAId).map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name} — {b.sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {ready && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-violet-50 rounded-lg border border-violet-100 flex-wrap">
              <Badge className="bg-violet-200 text-violet-800">{brandA.name}</Badge>
              <span className="text-violet-400 font-bold">×</span>
              <Badge className="bg-indigo-200 text-indigo-800">{brandB.name}</Badge>
              <span className="text-xs text-gray-500 ml-auto">Cross-sector: {brandA.sector} + {brandB.sector}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={loadSuggestedClauses}
                disabled={loadingClauses}
                className="border-violet-300 text-violet-700 hover:bg-violet-50"
              >
                <FileText className="w-3 h-3 mr-1.5" />
                {loadingClauses ? 'Loading...' : 'Suggested Clauses'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested Clauses Panel */}
      {showClauses && (
        <Card className="border-amber-200">
          <CardHeader
            className="pb-2 cursor-pointer bg-amber-50 rounded-t-xl border-b border-amber-100"
            onClick={() => setShowClauses(v => !v)}
          >
            <CardTitle className="text-sm flex items-center justify-between text-amber-900">
              <span className="flex items-center gap-2"><FileText className="w-4 h-4" />Recommended Legal Clauses</span>
              <ChevronDown className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            {loadingClauses ? (
              <p className="text-sm text-amber-600 animate-pulse">Generating clause recommendations...</p>
            ) : suggestedClauses && (
              <div className="grid sm:grid-cols-2 gap-2">
                {suggestedClauses.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(`Explain and draft the "${c.name}" clause for this agreement.`)}
                    className="text-left p-2.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-amber-50 hover:border-amber-200 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-[10px] border ${priorityColor[c.priority]}`}>{c.priority}</Badge>
                      <span className="text-xs font-semibold text-gray-800 group-hover:text-amber-800">{c.name}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-snug">{c.description}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chat Window */}
      <Card className="border-violet-200 overflow-hidden">
        <CardHeader className="py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-700 border-b border-violet-700">
          <CardTitle className="text-sm text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-200" />
            AI Negotiation Advisor
            {ready && <span className="text-violet-300 font-normal ml-1">· {brandA.name} × {brandB.name}</span>}
          </CardTitle>
        </CardHeader>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
                <Scale className="w-7 h-7 text-violet-500" />
              </div>
              <p className="text-sm font-semibold text-gray-700">AI Negotiation Advisor</p>
              <p className="text-xs text-gray-500 max-w-sm">
                {ready
                  ? `Ready to help negotiate the ${brandA.name} × ${brandB.name} joint venture. Use a quick action or type your question below.`
                  : 'Select both brands above to begin the negotiation session.'}
              </p>
            </div>
          )}
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-violet-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Actions */}
        {ready && (
          <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                onClick={() => sendMessage(a.prompt)}
                disabled={loading}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={ready ? "Ask about terms, clauses, counter-offers, or any negotiation question..." : "Select both brands first..."}
              disabled={!ready || loading}
              rows={2}
              className="resize-none text-sm"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!ready || !input.trim() || loading}
              className="bg-violet-600 hover:bg-violet-700 text-foreground self-end px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </Card>
    </div>
  );
}