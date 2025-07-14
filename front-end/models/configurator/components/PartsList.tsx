import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { FrontendToBackendCategoryIdMap, ProductRead } from '@/types/prodcuts-base';

export function PartsList({ parts, loading, error }: { parts: ProductRead[]; loading: boolean; error: string | null }) {
 
  useEffect(() => {
    console.log(parts);
  }, [parts]);
 
  return (
   <Card className="h-fit w-full max-w-xl p-6">
       <div className="mb-4 flex items-center justify-between">
         <div className="text-lg font-semibold">PC Parts</div>
       </div>
         <div className="flex flex-col gap-2">
         {loading
           ? [...Array(parts.length || 5)].map((_, index) => <Skeleton key={index} className="h-[100px] w-full" />)
           : parts.map((part) => (
               <div key={part.id} className="bg-muted flex items-center justify-between rounded p-3">
                 <div>
                   <div className="font-semibold">{part.title}</div>
                    <div className="text-muted-foreground text-xs">
                     {/* brand model */}
                     {FrontendToBackendCategoryIdMap[part.category?.id as unknown as  keyof typeof FrontendToBackendCategoryIdMap]}
                    
                   </div>
                 </div>
                 <div className="text-main-accent font-bold">${part.price?.toString() || '0'}</div>
               </div>
             ))}
       </div>

    </Card>
  );
}
