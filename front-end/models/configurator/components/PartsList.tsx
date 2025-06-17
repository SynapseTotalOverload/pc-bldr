import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { ProductTypeMapArray } from '@/types/product';

export function PartsList({
  parts,
  loading,
  error,
}: {
  parts: ProductTypeMapArray;
  loading: boolean;
  error: string | null;
}) {
  const totalCost = parts.reduce((sum, part) => sum + Number(part.price), 0);
  console.log(loading);
  return (
    <Card className="h-fit w-full max-w-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">PC Parts</div>
        <div className="text-main-accent text-xl font-bold">${totalCost.toLocaleString()}</div>
      </div>
      <div className="flex flex-col gap-2">
        {loading
          ? [...Array(parts.length)].map((_, index) => <Skeleton key={index} className="h-16 w-full" />)
          : parts.map((part) => (
              <div key={part.id} className="bg-muted flex items-center justify-between rounded p-3">
                <div>
                  <div className="font-semibold">{part.name}</div>
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
