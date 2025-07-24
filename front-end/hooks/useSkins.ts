import { useState, useEffect } from 'react';
import { getSkins, SkinRead, GetSkinsParams } from '@/lib/skins-api';

interface UseSkinsOptions {
  category_id?: number;
  weapon?: string;
  page: number;
  pageSize?: number;
  search?: string;
  include_category?: boolean;
}

interface UseSkinsResult {
  skins: SkinRead[];
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

export function useSkins({
  category_id,
  weapon,
  page,
  pageSize = 40,
  search = '',
  include_category = false,
}: UseSkinsOptions): UseSkinsResult {
  const [skins, setSkins] = useState<SkinRead[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkins = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate skip based on page and pageSize
      const skip = (page - 1) * pageSize;
      
      // Prepare API parameters
      const params: GetSkinsParams = {
        skip,
        limit: pageSize,
        include_category,
        ...(category_id && { category_id }),
        ...(weapon && weapon.trim() && { weapon: weapon.trim() }),
        ...(search && search.trim() && { query: search.trim() }),
      };

      const data = await getSkins(params);

      setSkins(data.items);
      setPagination({
        total: data.total,
        totalPages: Math.ceil(data.total / pageSize),
        currentPage: page,
        hasMore: data.has_more,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching skins');
      setSkins([]);
      setPagination({ total: 0, totalPages: 0, currentPage: 1, hasMore: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkins();
  }, [category_id, weapon, page, pageSize, search, include_category]);

  return {
    skins,
    pagination,
    loading,
    error,
    refetch: fetchSkins,
  };
}
