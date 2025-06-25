import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { ProductRead } from '@/types/prodcuts-base';

export function PartsList({ parts, loading, error }: { parts: ProductRead[]; loading: boolean; error: string | null }) {
  const totalCost = parts.reduce((sum, part) => sum + (part.price || 0), 0);

  console.log(parts);
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
                  <div className="font-semibold">{part.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {/* brand model */}
                    {part.title} {part.category}
                    {(part.attrs as any)?.brand || ''} {(part.attrs as any)?.model || ''}
                  </div>
                </div>
                <div className="text-main-accent font-bold">${part.price?.toString() || '0'}</div>
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
