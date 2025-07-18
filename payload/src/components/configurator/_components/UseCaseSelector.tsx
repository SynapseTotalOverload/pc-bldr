import { USE_CASES } from '../constants';
import { Card } from '@/components/ui/card';
import { UseCase } from '../types';

interface UseCaseSelectorProps {
  selectedUseCase: UseCase['key'];
  onUseCaseChange: (useCase: UseCase['key']) => void;
}

export function UseCaseSelector({ selectedUseCase, onUseCaseChange }: UseCaseSelectorProps) {
  return (
    <Card className="w-full max-w-xl p-6 rounded-xl">
      <div className="mb-2 text-lg font-semibold">Use Case</div>
      <div className="grid grid-cols-3 gap-4">
        {USE_CASES.map((uc) => (
          <button
            key={uc.key}
            className={`flex flex-1 flex-col items-center rounded border p-4  ${
              selectedUseCase === uc.key ? 'bg-primary/10 border-primary/20' : ''
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