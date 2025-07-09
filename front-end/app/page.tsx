'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CategoryButtons } from '@/components/ui/category-buttons';
import { DataTable } from '@/components/data-table';
import { useProducts } from '@/hooks/useProducts';
import {
  ProductTypeMapNames,
  ProductRead,
  ProductTypeMapIds,
  FrontendToBackendCategoryMap,
} from '@/types/prodcuts-base';
import { ColumnDef } from '@tanstack/react-table';
import { categoryColumnExtensions } from '@/models/products-table/columns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, MoreHorizontal,  Plus, Table } from 'lucide-react';
import { HoverEffect } from '@/components/ui/motion-card';
import { AddNewProduct } from '@/models/dialogs/add-new-product';
import { useToast } from '@/hooks/use-toast';
import instance from '@/lib/axios';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useBoolean } from '@/hooks/use-boolean';

interface FormData {
  category: keyof ProductTypeMapNames;
  asin: string;
  title: string;
  price: string;
  rating: string;
  brand: string;
  model: string;
  [key: string]: string | number;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<keyof ProductTypeMapNames>('cpu');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const { toast } = useToast();
  const {isState, changeState, toggleState}= useBoolean();
  const [selectedProduct, setSelectedProduct] = useState<ProductRead | null>(null);
  const { products, pagination, error, refetch } = useProducts<ProductRead>({
    category: selectedCategory,
    page,
    search,
  });


  const handleAddProduct = async (data: FormData) => {
    try {
      // Transform data to match backend ProductCreate schema
      const getCategoryId = (category: keyof ProductTypeMapNames): number => {
        const categoryMap: Record<keyof ProductTypeMapNames, number> = {
          cpu: 1,
          cpu_cooler: 2,
          gpu: 3,
          motherboard: 4,
          ram: 5,
          storage: 6,
          power_supply: 7,
          case: 8,
        };
        return categoryMap[category];
      };

      // Extract base fields (defined in ProductBase schema)
      const baseFields = ['asin', 'title', 'price', 'rating'];
      const categoryId = getCategoryId(data.category);
      
      // Validate category_id
      if (!categoryId || categoryId < 1 || categoryId > 8) {
        throw new Error(`Invalid category: ${data.category}`);
      }
      
      const transformedData: any = {
        category_id: categoryId,
      };

      // Add base fields
      baseFields.forEach(field => {
        if (data[field]) {
          if (field === 'price' || field === 'rating') {
            transformedData[field] = parseFloat(data[field] as string);
          } else {
            transformedData[field] = data[field];
          }
        }
      });

      // Extract attributes (all fields except base fields and category)
      const attrs: any = {};
      Object.keys(data).forEach(key => {
        if (!baseFields.includes(key) && key !== 'category') {
          const value = data[key];
          attrs[key] = value;
        }
      });

      // Only add attrs if there are any attributes
      if (Object.keys(attrs).length > 0) {
        transformedData.attrs = attrs;
      }

      console.log('Transformed data:', transformedData);

      // Send data to API
      if(selectedProduct){
        await instance.put(`/products/${selectedProduct.id}`, transformedData);
      }else{
        await instance.post('/products', transformedData);
      }
      // Refetch products to show the new one
      await refetch();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await instance.delete(`/products/${id}`);
      await refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const baseColumns: ColumnDef<ProductRead>[] = [
    {
      header: 'Name',
      accessorKey: 'title',
    },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: ({ row }) => {
        return <span className="font-bold">{row.original.price?.toString()}</span>;
      },
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      cell: ({ row }) => {
        return <span>{row.original.rating?.toString() || 'N/A'}</span>;
      },
    },
    {
      header: 'Link',
      accessorKey: 'asin',
      cell: ({ row }) => {
        return (
          <Link
            className="text-blue-500"
            href={`/products/${row.original.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </Link>
        );
      },
    },
  ];

  const backendCategoryKey = FrontendToBackendCategoryMap[selectedCategory as string];
  const actualColumns = [
    ...baseColumns,
    ...(categoryColumnExtensions[backendCategoryKey as keyof typeof categoryColumnExtensions] ?? []),
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => {
        return <DropdownMenu>
          <DropdownMenuTrigger asChild> 
            <Button className="rounded-full p-[2px] aspect-square" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={()=>{setSelectedProduct(row.original); toggleState('addNewProduct')}}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>handleDelete(row.original.id)} className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>;
      },  
    } as ColumnDef<ProductRead>
  ];

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
            <Link href="/builds">
                <Button>Builds</Button>
              </Link>
            <Link href="/configurator">
              <Button>Configurator</Button>
            </Link>
          </div>
        </div>

        <CategoryButtons
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category as keyof ProductTypeMapNames);
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
                  searchKey="title"
                  searchPlaceholder="Search products..."
                  searchValue={search}
                  onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                  pagination={pagination} 
                  renderActions={() => (
                   <Button onClick={()=>toggleState('addNewProduct')}> <Plus className="h-4 w-4" /> Add new product</Button>
                  )}
                  onPageChange={(page) => setPage(page)}
                />
              ) : (
                <HoverEffect products={products} />
              )}
            </div>
          </div>
        )}

        {error && <div className="mt-4 text-red-500">Error: {error}</div>}
      </div>
      <AddNewProduct
        data={selectedProduct ? selectedProduct as unknown as Partial<FormData> : undefined}
        activeCategory={selectedCategory}
        onHandleSubmit={handleAddProduct}
        open={isState('addNewProduct')}
        onOpenChange={(value)=>{changeState('addNewProduct', value); setSelectedProduct(null)}}
        productId={selectedProduct?.id}
      />  
    </main>
  );
}
