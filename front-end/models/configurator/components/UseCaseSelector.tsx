import { USE_CASES } from '../constants';
import { Card } from '@/components/ui/card';
import { UseCase } from '../types';

interface UseCaseSelectorProps {
  selectedUseCase: UseCase['key'];
  onUseCaseChange: (useCase: UseCase['key']) => void;
}

export function UseCaseSelector({ selectedUseCase, onUseCaseChange }: UseCaseSelectorProps) {
  return (
    <Card className="w-full max-w-xl p-6">
      <div className="mb-2 text-lg font-semibold">Use Case</div>
      <div className="flex gap-4">
        {USE_CASES.map((uc) => (
          <button
            key={uc.key}
            className={`flex flex-1 flex-col items-center rounded border p-4 ${
              selectedUseCase === uc.key ? 'border-white/80 text-white' : ''
            }`}
            onClick={() => onUseCaseChange(uc.key)}
          >
            <span className="font-bold">{uc.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
