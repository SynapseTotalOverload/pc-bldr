import { useState, useEffect } from 'react';
import { BuildRead } from '@/types/prodcuts-base';
import { instance } from '@/lib/axios';

interface UseBuildsOptions {
  page?: number;
  limit?: number;
  buildType?: string;
  search?: string;
  autoFetchOnSearchChange?: boolean;
  price_min?: number;
  price_max?: number;
  show_in_site_only?: boolean;
}

interface UseBuildsResult {
  builds: BuildRead[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refetchWithOptions: (overrides?: Partial<UseBuildsOptions>) => Promise<void>;
}

export function useBuilds({
  page = 1,
  limit = 10,
  buildType,
  search = '',
  autoFetchOnSearchChange = true,
  price_min,
  price_max,
  show_in_site_only,
}: UseBuildsOptions): UseBuildsResult {
  const [builds, setBuilds] = useState<BuildRead[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuilds = async (overrides?: Partial<UseBuildsOptions>) => {
    setLoading(true);
    setError(null);

    const currentPage = overrides?.page ?? page;
    const currentLimit = overrides?.limit ?? limit;
    const currentSearch = overrides?.search ?? search;
    const currentBuildType = overrides?.buildType ?? buildType;
    const currentPriceMin = overrides?.price_min ?? price_min;
    const currentPriceMax = overrides?.price_max ?? price_max;
    const currentShowInSite = overrides?.show_in_site_only ?? show_in_site_only;
    
    try {
      const searchParams = new URLSearchParams({
        skip: ((currentPage - 1) * currentLimit).toString(),
        limit: currentLimit.toString(),
        return_models: 'true',
        ...(overrides?.search !== undefined && overrides?.search !== '' && { query: overrides?.search }),
        ...(currentBuildType && currentBuildType !== 'all' && { build_type: currentBuildType }),
        ...(currentPriceMin && { price_min: currentPriceMin.toString() }),
        ...(currentPriceMax && { price_max: currentPriceMax.toString() }),
        ...(currentShowInSite && { show_in_site_only: currentShowInSite.toString() }),
      });

      const response = await instance.get(`/builds/?${searchParams.toString()}`);
      const data = response.data;

      // Backend now returns paginated response with items and pagination
      if (data.items && data.pagination) {
        setBuilds(data.items);
        setPagination({
          total: data.pagination.totalItems,
          totalPages: data.pagination.totalPages,
          currentPage: data.pagination.currentPage,
        });
      } else if (Array.isArray(data)) {
        // Fallback for simple array response
        setBuilds(data);
        setPagination({
          total: data.length,
          totalPages: Math.ceil(data.length / limit),
          currentPage: page,
        });
      } else {
        // Other fallback
        setBuilds(data.items || data || []);
        setPagination({
          total: data.total || data.length || 0,
          totalPages: data.totalPages || Math.ceil((data.total || data.length || 0) / limit),
          currentPage: page,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching builds');
      setBuilds([]);
      setPagination({ total: 0, totalPages: 0, currentPage: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilds();
  }, [page, limit, buildType, ...(autoFetchOnSearchChange ? [search] : [])]);

  return {
    builds,
    pagination,
    loading,
    error,
    refetch: () => fetchBuilds(),
    refetchWithOptions: fetchBuilds,
  };
}

// Hook for single build operations
export function useBuild() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBuild = async (buildData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.post('builds/', buildData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create build';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateBuild = async (id: number, buildData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.put(`builds/${id}`, buildData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update build';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteBuild = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.delete(`/builds/${id}`);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete build';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getBuild = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(`/builds/${id}`);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch build';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBuild,
    updateBuild,
    deleteBuild,
    getBuild,
  };
} 
