import { useState, useEffect, ButtonHTMLAttributes } from 'react';

import { FrontendToBackendCategoryMap, PaginatedInterface, ProductConstantMapIds, ProductRead, ProductTypeMapIds } from '@/types/prodcuts-base';
import { getCompatibleProducts, getProducts } from '@/lib/products-api';

interface UseProductsOptions {
  category: string;
  page: number;
  search?: string;
  price_min?: number;
  price_max?: number;
}

interface UseProductsResult<T extends ProductRead> {
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

export function useProducts<T extends ProductRead>({
  category,
  page,
  search = '',
  price_min,
  price_max,
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
      const normalizedCategory = category.toLowerCase();
      const backendKey = FrontendToBackendCategoryMap[normalizedCategory];
      if (!backendKey || !(backendKey in ProductConstantMapIds)) throw new Error(`Invalid category: ${category}`);

      // Use getCompatibleProducts API which supports search via query parameter
      const data = await getProducts({
        category_id: ProductConstantMapIds[backendKey],
        page: page,
        page_size: 20,
        query: search.trim() || undefined,
        price_min: price_min || undefined,
        price_max: price_max || undefined,
      });

      setProducts(data.items as unknown as T[]);
      setPagination({
        total: data.pagination.totalItems,
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
