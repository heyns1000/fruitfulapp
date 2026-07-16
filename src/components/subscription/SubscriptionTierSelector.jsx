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
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-primary'
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
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              {/* Header */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                <Zap className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <p className="font-black text-foreground text-lg">{plan.label}</p>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>
              <p className="text-primary font-bold text-2xl mb-1">
                R{price.toLocaleString()}
                <span className="text-sm text-muted-foreground font-normal">/{cycle === 'monthly' ? 'mo' : cycle === 'quarterly' ? 'qtr' : 'yr'}</span>
              </p>
              <p className="text-muted-foreground text-xs mb-4">{plan.discountPct}% subscriber discount · {plan.freeShipping ? 'Free shipping' : 'Std shipping'}</p>

              {/* Features */}
              <ul className="space-y-1.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
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