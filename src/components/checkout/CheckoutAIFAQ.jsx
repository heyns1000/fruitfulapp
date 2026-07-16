import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutAIFAQ({ t }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) { setAnswer(t.faqPlaceholderError || 'Please enter a question.'); return; }
    setLoading(true);
    setAnswer('');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a helpful assistant for FAA.ZONE, an African artisan marketplace powered by the Fruitful™ Treaty System. Answer the following customer question concisely and helpfully. If unrelated to shopping, orders, artisans, shipping, or FAA.ZONE, politely redirect.

Question: "${question}"

Context:
- FAA.ZONE supports African heritage artisans
- Payments via Paystack (card, EFT, mobile money)
- Free shipping on orders
- For every purchase, a portion supports artisan communities (Buy one, we sponsor one)
- Orders can be tracked in Order History
- Support: support@faa.zone`
    });
    setAnswer(result || t.faqError || 'Could not get an answer. Please try again.');
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-6 space-y-4">
      <h3 className="font-black text-foreground flex items-center gap-2 text-lg">
        <HelpCircle className="w-5 h-5 text-purple-400" />
        {t.faqHeading || 'AI Help & FAQ'}
      </h3>
      <p className="text-muted-foreground text-sm">{t.faqSlogan || 'Ask anything about your order, shipping, or FAA.ZONE.'}</p>
      <textarea
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder={t.faqPlaceholder || 'e.g. What payment methods are accepted?'}
        className="w-full bg-muted border border-border text-foreground placeholder:text-muted-foreground rounded-xl p-4 text-sm resize-none h-24 focus:outline-none focus:border-purple-500 transition-colors"
      />
      <Button
        onClick={ask}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-foreground font-bold gap-2"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.faqLoading || 'Generating…'}</> : <><Sparkles className="w-4 h-4" /> {t.faqBtn || 'Get Answer ✨'}</>}
      </Button>
      {answer && (
        <div className="bg-muted border border-purple-800/50 rounded-xl p-4 text-foreground text-sm leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}