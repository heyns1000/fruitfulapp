import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function PointsHistory({ account }) {
  const history = [...(account?.pointsHistory || [])].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-4 h-4 text-purple-600" />
          Points History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No points activity yet. Make your first purchase to start earning!</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {history.map((entry, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  {entry.points > 0
                    ? <ArrowUpCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    : <ArrowDownCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  }
                  <div>
                    <p className="text-sm font-medium text-gray-800">{entry.description}</p>
                    <p className="text-xs text-gray-400">{entry.date ? format(new Date(entry.date), 'dd MMM yyyy') : ''}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${entry.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {entry.points > 0 ? '+' : ''}{entry.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}