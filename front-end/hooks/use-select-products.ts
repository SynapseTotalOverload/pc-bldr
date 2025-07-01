import { useState, useEffect } from 'react';
import { ProductRead } from '@/types/prodcuts-base';
import { 
  getCompatibleProducts, 
  GetCompatibleProductsParams, 
  SelectedComponents 
} from '../lib/products-api';

interface UseSelectProductsOptions {
  selectedComponents?: SelectedComponents;
  categoryId?: number;
  page?: number;
  pageSize?: number;
  budget?: number;
  query?: string;
}

interface UseSelectProductsResult {
  products: ProductRead[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSelectProducts({
  selectedComponents,
  categoryId,
  page = 1,
  pageSize = 20,
  budget,
  query,
}: UseSelectProductsOptions): UseSelectProductsResult {
  const [products, setProducts] = useState<ProductRead[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompatibleProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: GetCompatibleProductsParams = {
        selected_components: selectedComponents,
        category_id: categoryId,
        page,
        page_size: pageSize,
        budget,
        query,
      };

      const data = await getCompatibleProducts(params);

      setProducts(data.items);
      setPagination({
        total: data.pagination.totalItems,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching compatible products');
      setProducts([]);
      setPagination({ total: 0, totalPages: 0, currentPage: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibleProducts();
  }, [selectedComponents, categoryId, page, pageSize, budget, query]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchCompatibleProducts,
  };
}
