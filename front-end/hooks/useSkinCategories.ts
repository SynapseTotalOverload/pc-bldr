import { useState, useEffect } from 'react';
import { getSkinCategories, SkinCategoryRead, GetSkinCategoriesParams } from '@/lib/skins-api';

interface UseSkinCategoriesOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  include_skins?: boolean;
}

interface UseSkinCategoriesResult {
  categories: SkinCategoryRead[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSkinCategories({
  page = 1,
  pageSize = 20,
  search = '',
  include_skins = false,
}: UseSkinCategoriesOptions = {}): UseSkinCategoriesResult {
  const [categories, setCategories] = useState<SkinCategoryRead[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate skip based on page and pageSize
      const skip = (page - 1) * pageSize;
      
      // Prepare API parameters
      const params: GetSkinCategoriesParams = {
        skip,
        limit: pageSize,
        include_skins,
        ...(search && search.trim() && { query: search.trim() }),
      };

      const data = await getSkinCategories(params);

      setCategories(data.items);
      setPagination({
        total: data.total,
        totalPages: Math.ceil(data.total / pageSize),
        currentPage: page,
        hasMore: data.has_more,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching skin categories');
      setCategories([]);
      setPagination({ total: 0, totalPages: 0, currentPage: 1, hasMore: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, pageSize, search, include_skins]);

  return {
    categories,
    pagination,
    loading,
    error,
    refetch: fetchCategories,
  };
} 