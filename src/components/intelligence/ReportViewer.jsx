import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileDown, TrendingUp, TrendingDown, Minus, ArrowUpRight, Users, Globe, AlertTriangle, Sparkles, Target, BarChart2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const sentimentColor = {
  Bullish: 'bg-green-100 text-green-800 border-green-300',
  Neutral: 'bg-blue-100 text-blue-800 border-blue-300',
  Cautious: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Bearish: 'bg-red-100 text-red-800 border-red-300',
};

const impactColor = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const priorityColor = {
  Critical: 'bg-red-600',
  High: 'bg-primary',
  Medium: 'bg-blue-500',
};

const threatColor = {
  High: 'text-red-600',
  Medium: 'text-yellow-600',
  Low: 'text-green-600',
};

const TrendIcon = ({ trend }) =>
  trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-500" />
  : trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-500" />
  : <Minus className="w-4 h-4 text-gray-400" />;

export default function ReportViewer({ report }) {
  const reportRef = useRef(null);

  const exportPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let y = 0;
    while (y < imgHeight) {
      if (y > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, -y, imgWidth, imgHeight);
      y += pdfHeight;
    }
    pdf.save(`${report.brand.name}-Intelligence-${report.period.replace(' ', '-')}.pdf`);
  };

  return (
    <div>
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{report.reportTitle}</h2>
          <p className="text-sm text-gray-500">Generated for {report.brand.name} · {report.period}</p>
        </div>
        <Button onClick={exportPDF} className="bg-slate-800 hover:bg-slate-900 text-foreground">
          <FileDown className="w-4 h-4 mr-2" />Export PDF
        </Button>
      </div>

      <div ref={reportRef} className="bg-white space-y-5 p-2">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800 text-foreground rounded-xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">FAA.ZONE Market Intelligence</p>
              <h1 className="text-2xl font-extrabold">{report.reportTitle}</h1>
              <p className="text-gray-300 text-sm mt-1">Brand: {report.brand.name} · Sector: {report.brand.sector}</p>
              <p className="text-gray-400 text-xs mt-1">Report Period: {report.period} · Generated: {new Date(report.generatedAt).toLocaleDateString()}</p>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${sentimentColor[report.overallMarketSentiment]}`}>
                <Sparkles className="w-4 h-4" />{report.overallMarketSentiment}
              </div>
              <p className="text-xs text-gray-400 mt-2">Market Sentiment</p>
              <div className="mt-2 text-4xl font-extrabold text-foreground">{report.overallMarketScore}<span className="text-lg text-gray-400">/100</span></div>
              <p className="text-xs text-gray-400">Intelligence Score</p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-base flex items-center gap-2 text-slate-800"><BarChart2 className="w-4 h-4 text-blue-600" />Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-700 leading-relaxed text-sm">{report.executiveSummary}</p>
          </CardContent>
        </Card>

        {/* Sector Analysis */}
        {report.sectorAnalysis && (
          <Card className="border-slate-200">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800"><TrendingUp className="w-4 h-4 text-green-600" />Sector Analysis: {report.sectorAnalysis.sectorName}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Growth Rate', value: report.sectorAnalysis.growthRate },
                  { label: 'Market Size', value: report.sectorAnalysis.marketSize },
                  { label: 'Outlook', value: report.sectorAnalysis.outlook },
                ].map(m => (
                  <div key={m.label} className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                    <p className="text-xs text-gray-500">{m.label}</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">Key Drivers</p>
                  <ul className="space-y-1">
                    {report.sectorAnalysis.keyDrivers?.map((d, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-green-500 shrink-0">▸</span>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-700 mb-2 uppercase tracking-wide">Headwinds</p>
                  <ul className="space-y-1">
                    {report.sectorAnalysis.headwinds?.map((h, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-red-400 shrink-0">▸</span>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPI Forecast */}
        {report.kpiForecast?.length > 0 && (
          <Card className="border-slate-200">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800"><Target className="w-4 h-4 text-purple-600" />KPI Forecast</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {report.kpiForecast.map((k, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">{k.metric}</p>
                    <div className="flex items-center gap-1">
                      <TrendIcon trend={k.trend} />
                      <span className="text-sm font-bold text-slate-800">{k.forecast}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">from {k.current}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emerging Trends */}
        {report.emergingTrends?.length > 0 && (
          <Card className="border-slate-200">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800"><Sparkles className="w-4 h-4 text-yellow-500" />Emerging Trends</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {report.emergingTrends.map((t, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <Badge className={`shrink-0 text-xs border ${impactColor[t.impact]}`}>{t.impact}</Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800">{t.trend}</p>
                        <span className="text-xs text-gray-400">· {t.timeframe}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Geographic Opportunities */}
        {report.geographicOpportunities?.length > 0 && (
          <Card className="border-slate-200">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800"><Globe className="w-4 h-4 text-cyan-600" />Geographic Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {report.geographicOpportunities.map((g, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="shrink-0 text-center w-12">
                      <div className="text-xl font-extrabold text-cyan-700">{g.opportunityScore}</div>
                      <div className="text-[10px] text-gray-400">/100</div>
                    </div>
                    <div className="w-px bg-gray-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{g.region}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{g.rationale}</p>
                      <p className="text-xs text-cyan-700 mt-1 font-medium italic">Action: {g.recommendedAction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Competitor Movements */}
        {report.competitorMovements?.length > 0 && (
          <Card className="border-slate-200">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800"><AlertTriangle className="w-4 h-4 text-primary" />Competitor Movements</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {report.competitorMovements.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                      <p className="text-sm font-semibold text-slate-800">{c.competitor}</p>
                      <span className={`text-xs font-bold ${threatColor[c.threatLevel]}`}>⚠ {c.threatLevel} Threat</span>
                    </div>
                    <p className="text-xs text-gray-600">{c.movement}</p>
                    <p className="text-xs text-blue-700 mt-1.5 font-medium">Recommended: {c.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collaboration Opportunities */}
        {report.collaborationOpportunities?.length > 0 && (
          <Card className="border-slate-200">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800"><Users className="w-4 h-4 text-indigo-600" />High-Potential Collaboration Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {report.collaborationOpportunities.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg border border-indigo-100 bg-indigo-50">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-semibold text-indigo-900">{c.partnerBrand} <span className="text-indigo-500 font-normal text-xs">({c.partnerSector})</span></p>
                        <p className="text-xs text-indigo-700 mt-1">{c.proposedVenture}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-extrabold text-indigo-700">{c.compatibilityScore}<span className="text-xs text-indigo-400">/100</span></div>
                        <Badge className="text-[10px] bg-white border border-indigo-200 text-indigo-700 mt-0.5">{c.urgency}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-indigo-600 mt-1.5">Est. Value: <span className="font-semibold">{c.estimatedValue}</span></p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strategic Recommendations */}
        {report.strategicRecommendations?.length > 0 && (
          <Card className="border-slate-200">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800"><ArrowUpRight className="w-4 h-4 text-green-600" />Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {report.strategicRecommendations.map((r, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className={`shrink-0 w-2 rounded-full self-stretch ${priorityColor[r.priority]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-[10px] text-foreground border-0 ${priorityColor[r.priority]}`}>{r.priority}</Badge>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{r.recommendation}</p>
                      <p className="text-xs text-gray-600 mt-1">{r.rationale}</p>
                      <p className="text-xs text-green-700 mt-1 font-medium">Expected: {r.expectedOutcome}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Footer */}
        <div className="bg-slate-800 text-foreground rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400">FAA.ZONE™ Market Intelligence Report · {report.period} · Powered by AI Analysis</p>
          <p className="text-xs text-gray-500 mt-1">This report is AI-generated and intended for strategic guidance purposes.</p>
        </div>
      </div>
    </div>
  );
}