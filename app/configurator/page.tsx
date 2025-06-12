'use client';

import { useState } from 'react';
import { BudgetSelector, UseCaseSelector, PartsList, ExtrasPanel } from '@/models/configurator/components';
import { PCPart, UseCase } from '@/models/configurator/types';

const pcParts: PCPart[] = [
  { type: 'CPU', name: 'Intel Core i5-12600K', price: 279 },
  { type: 'GPU', name: 'RTX 3070', price: 499 },
  { type: 'Motherboard', name: 'B550 Gaming Plus', price: 129 },
  { type: 'RAM', name: '16GB DDR4-3600', price: 79 },
  { type: 'Storage', name: '1TB NVMe + 2TB HDD', price: 129 },
  { type: 'PSU', name: '850W 80+ Gold', price: 139 },
];

export default function Configurator() {
  const [budget, setBudget] = useState(1400);
  const [useCase, setUseCase] = useState<UseCase['key']>('gaming');
  const [showExtras, setShowExtras] = useState(false);

  return (
    <div className="depth-bg flex h-screen flex-col items-center justify-center gap-4">
      <div className="grid h-screen grid-cols-2 gap-4 px-4 py-12">
        <div className="flex h-full flex-col gap-4">
          <BudgetSelector budget={budget} onBudgetChange={setBudget} />
          <UseCaseSelector selectedUseCase={useCase} onUseCaseChange={setUseCase} />
          <ExtrasPanel isOpen={showExtras} onToggle={() => setShowExtras((v) => !v)} />
        </div>
        <PartsList parts={pcParts} />
      </div>
    </div>
  );
}
