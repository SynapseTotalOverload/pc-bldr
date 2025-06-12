import { useState, useEffect } from 'react';
import {
  BaseProduct,
  CPUProduct,
  CPUCoolerProduct,
  GPUProduct,
  MemoryProduct,
  MotherboardProduct,
  InternalHardDriveProduct,
  PowerSupplyProduct,
  VideoCardProduct,
} from '@/types/product';

type ProductTypeMap = {
  cpu: CPUProduct;
  cpu_cooler: CPUCoolerProduct;
  gpu: GPUProduct;
  memory: MemoryProduct;
  motherboard: MotherboardProduct;
  internal_hard_drive: InternalHardDriveProduct;
  power_supply: PowerSupplyProduct;
  video_card: VideoCardProduct;
};

type Category = keyof ProductTypeMap;

interface ProductsResponse<T extends BaseProduct> {
  products: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

interface UseProductsOptions {
  category: Category;
  page: number;
  search?: string;
}

interface UseProductsResult<T extends BaseProduct> {
  products: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts<T extends BaseProduct>({
  category,
  page,
  search = '',
}: UseProductsOptions): UseProductsResult<T> {
  const [products, setProducts] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!category) {
      setProducts([]);
      setPagination({ total: 0, totalPages: 0, currentPage: 1 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams({
        category,
        page: page.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/products?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse<T> = await response.json();
      setProducts(data.products);
      setPagination({
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
      setProducts([]);
      setPagination({ total: 0, totalPages: 0, currentPage: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, page, search]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchProducts,
  };
}
