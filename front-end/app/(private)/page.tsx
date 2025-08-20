'use client';

import { useState, useEffect, useRef } from 'react';
import { CategoryButtons } from '@/components/ui/category-buttons';
import { DataTable } from '@/components/data-table';
import { useProducts } from '@/hooks/useProductT';
import {
  ProductTypeMapNames,
  ProductRead,
  FrontendToBackendCategoryMap,
} from '@/types/prodcuts-base';
import { ProductTypeMapNamesAccessories } from '@/types/product-accessories-type';
import { ColumnDef } from '@tanstack/react-table';
import { categoryColumnExtensions } from '@/models/products-table/columns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MoreHorizontal,  Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { HoverEffect } from '@/components/ui/motion-card';
import { AddNewProduct } from '@/models/dialogs/add-new-product';
import { useToast } from '@/hooks/use-toast';
import instance from '@/lib/axios';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useBoolean } from '@/hooks/use-boolean';
import { useRouter } from 'next/navigation';
import { ErrorModal } from '@/components/ui/error-modal';
import WarningModal from '@/models/dialogs/warning-modal';
import { useFile } from '@/hooks/useFile';


const ProductImage: React.FC<{ url?: string | null; alt?: string }> = ({ url, alt = '' }) => {
  const { imageUrl, fetch, loading } = useFile();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!url) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '150px' }
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [url]);

  useEffect(() => {
    if (shouldLoad && url) {
      if (!url.includes('https://pcbuilder')) {
        fetchExternal(url);
        return;
      }
      fetch({ url });
    }
  }, [shouldLoad, url]);

  const fetchExternal = (externalUrl: string) => {
    setExternalSrc(externalUrl);
  };

  const [externalSrc, setExternalSrc] = useState<string | null>(null);

  const finalSrc = url && !url.includes('https://pcbuilder') ? externalSrc : imageUrl;

  return (
    <div ref={wrapperRef} className="w-10 h-10">
      {(loading || !finalSrc) && <Skeleton className="w-10 h-10 rounded-md" />}
      {!loading && finalSrc && (
        <LazyLoadImage
          src={finalSrc}
          alt={alt}
          className="w-10 h-10 object-cover rounded-md"
          effect="opacity"
          threshold={100}
          wrapperClassName="w-10 h-10"
        />
      )}
    </div>
  );
};

interface FormData {
  category: keyof ProductTypeMapNames | keyof ProductTypeMapNamesAccessories;
  asin: string;
  title: string;
  price: string;
  rating: string;
  brand: string;
  model: string;
  high_image_url?: string | File;
  low_image_url?: string | File;
  [key: string]: string | number | File | undefined;
}

export default function Home() {
  const { upload, remove } = useFile();

  const handleUploadFile = async (file: File) => {
    if (!file) return null;
    try {
      const record = await upload(file);
      return record.url;
    } catch (err) {
      console.error('Image upload failed', err);
      return null;
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<keyof ProductTypeMapNames>('cpu');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(''); 
  const [activeSearch, setActiveSearch] = useState(''); 
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const { toast } = useToast();
  const {isState, changeState, toggleState}= useBoolean();
  const [selectedProduct, setSelectedProduct] = useState<ProductRead | null>(null);
  const router = useRouter()
  const { products, pagination, error, refetch } = useProducts<ProductRead>({
    category: selectedCategory,
    page,
    search: activeSearch,
  });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [productToDeleteUrl, setProductToDeleteUrl] = useState<string | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setActiveSearch(value);
    setPage(1);
  };

  const handleAddProduct = async (data: FormData) => {
    try {
      const getCategoryId = (category: keyof ProductTypeMapNames | keyof ProductTypeMapNamesAccessories): number => {
        const categoryMap: Record<keyof ProductTypeMapNames | keyof ProductTypeMapNamesAccessories, number> = {
          cpu: 1,
          cpu_cooler: 2,
          gpu: 3,
          motherboard: 4,
          ram: 5,
          storage: 6,
          power_supply: 7,
          case: 8,
          mouse: 9,
          monitor: 10,
          keyboard: 11,
          headset: 12,
          mousepad: 13,
          chair: 14,
          microphone: 15,
          camera: 16,
          headphones: 17,
        };
        return categoryMap[category];
      };

      const baseFields = ['asin', 'title', 'price', 'rating'];
      baseFields.push('high_image_url', 'low_image_url');
      
      const categoryId = getCategoryId(data.category);
      
      if (!categoryId || categoryId < 1 || categoryId > 17) {
        throw new Error(`Invalid category: ${data.category}`);
      }
      
      const transformedData: any = {
        category_id: categoryId,
      };

      baseFields.forEach(field => {
        if (data[field]) {
          if (field === 'price' || field === 'rating') {
            transformedData[field] = parseFloat(data[field] as string);
          } else {
            transformedData[field] = data[field];
          }
        }
      });

      const attrs: any = {};
      Object.keys(data).forEach(key => {
        if (!baseFields.includes(key) && key !== 'category') {
          const value = data[key];
          attrs[key] = value;
        }
      });

      if (Object.keys(attrs).length > 0) {
        transformedData.attrs = attrs;
      }

      console.log('Transformed data:', transformedData);
      if (transformedData.high_image_url instanceof File) {
        if (selectedProduct?.high_image_url) {
          try {
            await remove({ url: selectedProduct.high_image_url });
          } catch (err) {
            console.error('Failed to delete old image', err);
          }
        }

        const url: string | null = await handleUploadFile(transformedData.high_image_url);
        if (url) {
          transformedData.high_image_url = url;
          transformedData.low_image_url = url;
        }
      }

      if(selectedProduct){
        await instance.put(`/products/${selectedProduct.id}`, transformedData);
      }else{
        await instance.post('/products', transformedData);
      }
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
    const handleDelete = async (id: number, imageUrl?: string | null) => {
    setProductToDelete(id);
    setProductToDeleteUrl(imageUrl || null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await instance.delete(`/products/${productToDelete}`);
      // delete image from storage if we have its URL
      if (productToDeleteUrl) {
        try {
          await remove({ url: productToDeleteUrl });
        } catch (err) {
          console.error('Failed to delete image file', err);
        }
      }
      await refetch();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      setProductToDeleteUrl(null);
    } catch (error) {
      const errorMessage = "This product is referenced in player list. It cannot be deleted while it is referenced";
      setErrorMessage(errorMessage);
      setIsErrorModalOpen(true);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const baseColumns: ColumnDef<ProductRead>[] = [
    {
      header: 'Name',
      accessorKey: 'title',
    },
    {
      header: 'Image',
      accessorKey: 'image',
      cell: ({ row }) => {
        return <ProductImage url={row.original.high_image_url} />;
      },
    },
    {
      header: 'Asin',
      accessorKey: 'asin',
      cell: ({ row }) => {
        return <span className="font-bold">{row.original.asin?.toString()}</span>;
      },
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
      accessorKey: 'link',
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
            <DropdownMenuItem onClick={()=>handleDelete(row.original.id, row.original.high_image_url)} className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>;
      },  
    } as ColumnDef<ProductRead>
  ];

  return (
    <>

        <CategoryButtons
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category as keyof ProductTypeMapNames);
            setPage(1);
            setSearchInput('');
            setActiveSearch(''); 
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
                  searchValue={searchInput} 
                  onSearchChange={handleSearchChange} 
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

      <AddNewProduct
        data={selectedProduct ? selectedProduct as unknown as Partial<FormData> : undefined}
        activeCategory={selectedCategory}
        onHandleSubmit={handleAddProduct}
        open={isState('addNewProduct')}
        onOpenChange={(value)=>{changeState('addNewProduct', value); setSelectedProduct(null)}}
        productId={selectedProduct?.id}
      />  
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Cannot Delete Product"
        message={errorMessage}
      />
      <WarningModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
