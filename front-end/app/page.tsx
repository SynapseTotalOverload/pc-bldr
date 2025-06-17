'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CategoryButtons } from '@/components/ui/category-buttons';
import { DataTable } from '@/components/data-table';
import { useProducts } from '@/hooks/useProducts';
import { ProductTypeMap, BaseProduct } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { categoryColumnExtensions } from '@/models/products-table/columns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, Table } from 'lucide-react';
import { HoverEffect } from '@/components/ui/motion-card';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<keyof ProductTypeMap>('cpu');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');

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

  const actualColumns = [...baseColumns, ...(categoryColumnExtensions[selectedCategory] ?? [])] as ColumnDef<
    ProductTypeMap[typeof selectedCategory]
  >[];

  return (
    <main className="depth-bg flex min-h-screen flex-col items-center justify-between p-4">
      <div className="z-10 w-full items-center justify-between font-mono text-sm">
        <div className="flex items-center justify-between">
          <h1 className="mb-8 text-4xl font-bold">PC Part Picker Products</h1>
          <div className="flex items-center gap-4">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as 'table' | 'card')}
            >
              <ToggleGroupItem value="table" aria-label="Table view">
                <Table className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="Card view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Link href="/configurator">
              <Button>Configurator</Button>
            </Link>
          </div>
        </div>

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
            <div className="inner-white-glow rounded-2xl p-8 shadow-2xl">
              {viewMode === 'table' ? (
                <DataTable
                  columns={actualColumns}
                  data={products}
                  pagination={pagination}
                  onPageChange={(page) => setPage(page)}
                />
              ) : (
                <HoverEffect products={products as BaseProduct[]} />
              )}
            </div>
          </div>
        )}

        {error && <div className="mt-4 text-red-500">Error: {error}</div>}
      </div>
    </main>
  );
}
