import { useState, useEffect } from 'react';
import { BuildRead } from '@/types/prodcuts-base';
import { instance } from '@/lib/axios';

interface UseBuildsOptions {
  page?: number;
  limit?: number;
  buildType?: string;
  search?: string;
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
}

export function useBuilds({
  page = 1,
  limit = 10,
  buildType,
  search = '',
}: UseBuildsOptions): UseBuildsResult {
  const [builds, setBuilds] = useState<BuildRead[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuilds = async () => {
    setLoading(true);
    setError(null);

    try {
    
      const searchParams = new URLSearchParams({
        skip: ((page - 1) * limit).toString(),
        limit: limit.toString(),
        return_models: 'true',
        ...(search && { search }),
        ...(buildType && buildType !== 'all' && { build_type: buildType }),
      });

      const response = await instance.get(`/builds?${searchParams.toString()}`);
      const data = response.data;

      // Handle both array and paginated response
      if (Array.isArray(data)) {
        setBuilds(data);
        setPagination({
          total: data.length,
          totalPages: Math.ceil(data.length / limit),
          currentPage: page,
        });
      } else {
        // If it's a paginated response
        setBuilds(data.items || data);
        setPagination({
          total: data.total || data.length,
          totalPages: data.totalPages || Math.ceil((data.total || data.length) / limit),
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
  }, [page, limit, buildType, search]);

  return {
    builds,
    pagination,
    loading,
    error,
    refetch: fetchBuilds,
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
      const response = await instance.post('/builds/', buildData);
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
      const response = await instance.put(`/builds/${id}`, buildData);
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