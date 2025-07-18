import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { FrontendToBackendCategoryIdMap, ProductRead } from '@/types/prodcuts-base';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';

export function PartsList({ parts, loading, error }: { parts: ProductRead[]; loading: boolean; error: string | null }) {

  const columns: ColumnDef<ProductRead>[] = [
    {
      header: 'Component',
      accessorKey: 'title',
      cell: ({ row }) => {
        const part = row.original;
        const imageUrl = part?.low_image_url || part?.high_image_url;
        
        return (
          <div className="flex items-center gap-3">
            {imageUrl && (
              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={imageUrl} 
                  alt={part.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div>
              <div className="">
                {part.title.length > 20 ? `${part.title.substring(0, 50)}...` : part.title}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }) => {
        return <span className="text-foreground">{FrontendToBackendCategoryIdMap[row.original.category?.id as unknown as keyof typeof FrontendToBackendCategoryIdMap]}</span>;
      },
    },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: ({ row }) => {
        return <span className="text-foreground font-medium">${row.original.price?.toString() || '0'}</span>;
      },
    },
  ];
 
  if (loading) {
    return (
      <Card className="h-fit w-full max-w-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">PC Parts</div>
        </div>
        <div className="flex flex-col gap-2">
          {[...Array(parts.length || 5)].map((_, index) => (
            <Skeleton key={index} className="h-[72px] w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-fit w-full max-w-xl p-6">
        <div className="text-red-500">Error: {error}</div>
      </Card>
    );
  }
 
  return (
    <Card className="h-fit w-full max-w-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">PC Parts</div>
      </div>
      <DataTable
        columns={columns}
        data={parts}
        pagination={{
          total: parts.length,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: parts.length,
        }}
        onPageChange={() => {}}
        showColumns={false}
      />
    </Card>
  );
}
