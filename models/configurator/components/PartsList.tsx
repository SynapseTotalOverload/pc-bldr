import { Card } from '@/components/ui/card';
import { PCPart } from '../types';

interface PartsListProps {
  parts: PCPart[];
}

export function PartsList({ parts }: PartsListProps) {
  const totalCost = parts.reduce((sum, part) => sum + part.price, 0);

  return (
    <Card className="h-fit w-full max-w-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">PC Parts</div>
        <div className="text-main-accent text-xl font-bold">${totalCost.toLocaleString()}</div>
      </div>
      <div className="flex flex-col gap-2">
        {parts.map((part) => (
          <div key={part.type} className="bg-muted flex items-center justify-between rounded p-3">
            <div>
              <div className="font-semibold">{part.type}</div>
              <div className="text-muted-foreground text-xs">{part.name}</div>
            </div>
            <div className="text-main-accent font-bold">${part.price}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <div className="text-lg font-bold">
          Total Cost: <span className="text-main-accent">${totalCost.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}
