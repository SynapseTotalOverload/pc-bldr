import { BUDGET_TIERS, BUDGET_STEP, MAX_BUDGET, MIN_BUDGET } from '../constants';
import { Card } from '@/components/ui/card';
import { LiquidGlassInput } from './LiquidGlassInput';
import { useRandomProducts } from '@/hooks/useRandomProducts';
import { useEffect } from 'react';
import useDebounce from '@/hooks/useDebounce';

interface BudgetSelectorProps {
  budget: number;
  onBudgetChange: (budget: number) => void;
}

export function BudgetSelector({ budget, onBudgetChange }: BudgetSelectorProps) {
  return (
    <Card className="w-full min-w-xl p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="text-2xl font-bold">Budget</div>
          <div className="neon-text text-2xl font-extrabold text-white">${budget.toLocaleString()}</div>
        </div>

        <LiquidGlassInput
          value={budget}
          min={MIN_BUDGET}
          max={MAX_BUDGET}
          step={BUDGET_STEP}
          onChange={onBudgetChange}
          formatValue={(v) => `$${v.toLocaleString()}`}
          className="mt-4"
        />
        <div className="mt-2 flex w-full gap-2">
          {BUDGET_TIERS.map((tier) => (
            <button
              key={tier.label}
              className="bg-muted/50 hover:bg-muted/70 flex-1 rounded p-2 backdrop-blur-sm transition-colors"
              onClick={() => onBudgetChange(tier.default)}
            >
              {tier.label}
              <br />
              <span className="text-xs">
                ${tier.range[0]}-${tier.range[1]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
