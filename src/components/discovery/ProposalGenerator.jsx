import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, FileText, Copy, CheckCircle } from 'lucide-react';

export default function ProposalGenerator({ sourceBrand, match, onBack }) {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateProposal();
  }, []);

  const generateProposal = async () => {
    setLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a professional joint venture collaboration proposal for FAA.ZONE ecosystem.

SOURCE BRAND: ${sourceBrand.name} (Sector: ${sourceBrand.sector}, Tags: ${(sourceBrand.tags || []).join(', ')})
TARGET BRAND: ${match.brandName} (Sector: ${match.brandData?.sector || 'Multi-sector'})
COMPATIBILITY SCORE: ${match.compatibilityScore}/100
COLLABORATION ANGLE: ${match.collaborationAngle}
SYNERGY: ${match.synergyReason}

Generate a compelling, realistic proposal filled with specific content based on these two brands.`,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          proposedVentureName: { type: 'string' },
          executiveSummary: { type: 'string' },
          objectives: { type: 'array', items: { type: 'string' } },
          scope: { type: 'string' },
          deliverables: { type: 'array', items: { type: 'string' } },
          timeline: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                phase: { type: 'string' },
                duration: { type: 'string' },
                activities: { type: 'string' }
              }
            }
          },
          revenueModel: { type: 'string' },
          successMetrics: { type: 'array', items: { type: 'string' } },
          nextSteps: { type: 'array', items: { type: 'string' } }
        }
      }
    });
    setProposal(response);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!proposal) return;
    const text = [
      `# ${proposal.title}`,
      `Proposed Venture: ${proposal.proposedVentureName}`,
      ``,
      `## Executive Summary`,
      proposal.executiveSummary,
      ``,
      `## Objectives`,
      ...(proposal.objectives || []).map(o => `• ${o}`),
      ``,
      `## Scope`,
      proposal.scope,
      ``,
      `## Deliverables`,
      ...(proposal.deliverables || []).map(d => `✓ ${d}`),
      ``,
      `## Timeline`,
      ...(proposal.timeline || []).map(t => `Phase: ${t.phase} (${t.duration})\n${t.activities}`),
      ``,
      `## Revenue Model`,
      proposal.revenueModel,
      ``,
      `## Success Metrics`,
      ...(proposal.successMetrics || []).map(m => `→ ${m}`),
      ``,
      `## Next Steps`,
      ...(proposal.nextSteps || []).map((s, i) => `${i + 1}. ${s}`),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div>
      <Button variant="outline" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />Back to Results
      </Button>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Collaboration Proposal</h2>
          <p className="text-gray-500 text-sm mt-1">{sourceBrand.name} × {match.brandName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1">⚡ {match.compatibilityScore}/100 match</Badge>
          <Button onClick={copyToClipboard} variant="outline" size="sm" disabled={loading}>
            {copied ? <><CheckCircle className="w-4 h-4 mr-2 text-green-600" />Copied!</> : <><Copy className="w-4 h-4 mr-2" />Copy Proposal</>}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
              <FileText className="w-10 h-10 text-indigo-600" />
            </div>
            <p className="text-xl font-semibold text-indigo-900">Generating your proposal...</p>
            <p className="text-sm text-gray-500">Crafting a tailored joint venture template</p>
          </div>
        </div>
      ) : proposal && (
        <div className="space-y-4">
          <Card className="overflow-hidden border-indigo-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white">
              <CardTitle className="text-xl">{proposal.title}</CardTitle>
              <p className="text-indigo-200 text-sm">Proposed Venture: <span className="text-white font-semibold">{proposal.proposedVentureName}</span></p>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 leading-relaxed">{proposal.executiveSummary}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base text-indigo-900">🎯 Objectives</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {proposal.objectives?.map((o, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-indigo-400 shrink-0 mt-0.5">•</span>{o}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base text-indigo-900">📦 Deliverables</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {proposal.deliverables?.map((d, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 shrink-0 mt-0.5">✓</span>{d}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base text-indigo-900">📅 Implementation Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proposal.timeline?.map((t, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="shrink-0 w-28 text-right">
                      <p className="text-xs font-bold text-indigo-700">{t.phase}</p>
                      <p className="text-xs text-gray-500">{t.duration}</p>
                    </div>
                    <div className="w-px bg-indigo-200 shrink-0" />
                    <p className="text-sm text-gray-700">{t.activities}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base text-indigo-900">💰 Revenue Model</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-700">{proposal.revenueModel}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base text-indigo-900">📊 Success Metrics</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {proposal.successMetrics?.map((m, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-400 shrink-0">→</span>{m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-2"><CardTitle className="text-base text-green-900">🚀 Next Steps to Launch</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {proposal.nextSteps?.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}