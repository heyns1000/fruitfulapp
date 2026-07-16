import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';

function ScoreRing({ score }) {
  const color =
    score >= 80 ? 'text-green-700 border-green-400 bg-green-50'
    : score >= 60 ? 'text-blue-700 border-blue-400 bg-blue-50'
    : score >= 40 ? 'text-yellow-700 border-yellow-400 bg-yellow-50'
    : 'text-red-700 border-red-400 bg-red-50';

  return (
    <div className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center ${color} shrink-0`}>
      <span className="text-lg font-extrabold leading-none">{score}</span>
      <span className="text-[9px] font-medium opacity-70">/ 100</span>
    </div>
  );
}

export default function CompatibilityResults({ results, sourceBrand, onSelectMatch }) {
  return (
    <div>
      {results.overallInsight && (
        <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-indigo-900">AI Overview</p>
                <p className="text-sm text-indigo-800 mt-1">{results.overallInsight}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Top Compatible Brands for <span className="text-indigo-700">{sourceBrand.name}</span>
      </h2>

      <div className="grid gap-4">
        {results.matches.map((match, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow border-gray-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <ScoreRing score={match.compatibilityScore} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{match.brandName}</h3>
                      {match.brandData && (
                        <Badge className="text-xs bg-gray-100 text-gray-700 mt-1">{match.brandData.sector}</Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onSelectMatch(match)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-foreground shrink-0"
                    >
                      Generate Proposal <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{match.synergyReason}</p>
                  <p className="text-sm text-indigo-700 mt-1 font-medium italic">"{match.collaborationAngle}"</p>

                  {match.sharedOpportunities?.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">Opportunities</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {match.sharedOpportunities.map((o, j) => (
                          <Badge key={j} className="bg-green-50 text-green-800 text-xs border border-green-200">{o}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {match.riskFactors?.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-700">Risks</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {match.riskFactors.map((r, j) => (
                          <Badge key={j} className="bg-amber-50 text-amber-800 text-xs border border-amber-200">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}