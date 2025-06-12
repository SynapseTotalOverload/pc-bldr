'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CategoryButtons } from '@/components/ui/category-buttons';
import { DataTable } from '@/components/data-table';
import { useProducts } from '@/hooks/useProducts';
import { ProductTypeMap, BaseProduct } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { categoryColumnExtensions } from '@/models/products-table/columns';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<keyof ProductTypeMap>('cpu');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { products, pagination, error } = useProducts<ProductTypeMap[typeof selectedCategory]>({
    category: selectedCategory,
    page,
    search,
  });

  const baseColumns: ColumnDef<BaseProduct>[] = [
    {
      header: 'Image',
      accessorKey: 'image_url',
      cell: ({ row }) => {
        const imageUrl = row.original.image_url;
        if (!imageUrl) return null;
        console.log(imageUrl);
        return (
          <img
            src={imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl}
            alt={row.original.name}
            className="h-10 w-10"
          />
        );
      },
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: ({ row }) => {
        return <span className="font-bold">{row.original.price.replace('Add', '')}</span>;
      },
    },
    {
      header: 'Rating',
      accessorKey: 'rating_count',
    },
    {
      header: 'Link',
      accessorKey: 'link',
      cell: ({ row }) => {
        return (
          <a className="text-blue-500" href={row.original.link} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        );
      },
    },
  ];
  console.log(selectedCategory, categoryColumnExtensions[selectedCategory]);
  const actualColumns = [...baseColumns, ...(categoryColumnExtensions[selectedCategory] ?? [])] as ColumnDef<
    ProductTypeMap[typeof selectedCategory]
  >[];

  return (
    <main className=" flex min-h-screen flex-col items-center justify-between p-4">
      <div className="z-10 w-full items-center justify-between font-mono text-sm">
        <h1 className="mb-8 text-4xl font-bold">PC Part Picker Products</h1>

        <CategoryButtons
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category as keyof ProductTypeMap);
            setPage(1);
            setSearch('');
          }}
        />

        {selectedCategory && (
          <div className="mt-8 w-full">
            <div className="inner-white-glow rounded-2xl bg-[#18181b] p-8 shadow-2xl">
              <DataTable
                columns={actualColumns}
                data={products}
                pagination={pagination}
                onPageChange={(page) => setPage(page)}
              />
            </div>
          </div>
        )}

        {error && <div className="mt-4 text-red-500">Error: {error}</div>}
      </div>
    </main>
  );
}
