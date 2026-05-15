import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Zap } from 'lucide-react';
import { PLAN_CONFIG } from '@/lib/pricingFormula';

const CYCLES = [
  { key: 'monthly',   label: 'Monthly' },
  { key: 'quarterly', label: 'Quarterly', saving: '~8%' },
  { key: 'annual',    label: 'Annual',    saving: '~22%' },
];

export default function SubscriptionTierSelector({ selected, cycle, onSelectPlan, onSelectCycle }) {
  return (
    <div className="space-y-6">
      {/* Billing cycle toggle */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {CYCLES.map(c => (
          <button
            key={c.key}
            onClick={() => onSelectCycle(c.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              cycle === c.key
                ? 'bg-orange-600 border-orange-600 text-white'
                : 'border-stone-600 text-stone-300 hover:border-orange-500'
            }`}
          >
            {c.label} {c.saving && <span className="text-xs opacity-70 ml-1">{c.saving}</span>}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(PLAN_CONFIG).map(([key, plan]) => {
          const price = plan[`${cycle}ZAR`] || plan.monthlyZAR;
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelectPlan(key)}
              className={`text-left rounded-2xl border p-5 transition-all ${
                isSelected
                  ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-900/20'
                  : 'border-stone-700 bg-stone-900 hover:border-stone-500'
              }`}
            >
              {/* Header */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <p className="font-black text-white text-lg">{plan.label}</p>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-orange-400" />}
              </div>
              <p className="text-orange-400 font-bold text-2xl mb-1">
                R{price.toLocaleString()}
                <span className="text-sm text-stone-400 font-normal">/{cycle === 'monthly' ? 'mo' : cycle === 'quarterly' ? 'qtr' : 'yr'}</span>
              </p>
              <p className="text-stone-500 text-xs mb-4">{plan.discountPct}% subscriber discount · {plan.freeShipping ? 'Free shipping' : 'Std shipping'}</p>

              {/* Features */}
              <ul className="space-y-1.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}