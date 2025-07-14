import { useState, useEffect } from 'react';
import { BuildRead } from '@/types/prodcuts-base';
import { instance } from '@/lib/axios';

interface UseBuildNearestOptions {
  budget: number;
  buildType?: string;
  limit?: number;
}

interface UseBuildNearestResult {
  builds: BuildRead[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refetchWithOptions: (overrides?: Partial<UseBuildNearestOptions>) => Promise<void>;
}

export function useBuildNearest({
  budget,
  buildType,
  limit = 1,
}: UseBuildNearestOptions): UseBuildNearestResult {
  const [builds, setBuilds] = useState<BuildRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearestBuilds = async (overrides?: Partial<UseBuildNearestOptions>) => {
    const currentBudget = overrides?.budget ?? budget;
    const currentBuildType = overrides?.buildType ?? buildType;
    const currentLimit = overrides?.limit ?? limit;

    // Budget is required
    if (!currentBudget || currentBudget <= 0) {
      setError('Budget must be provided and greater than 0');
      setBuilds([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      
      if (currentBuildType && currentBuildType !== 'all') {
        searchParams.append('build_type', currentBuildType);
      }
      
      if (currentLimit) {
        searchParams.append('limit', currentLimit.toString());
      }

      const queryString = searchParams.toString();
      const url = `/builds/nearest/${currentBudget}${queryString ? `?${queryString}` : ''}`;
      
      const response = await instance.get(url);
      const data = response.data;

      // API returns array of BuildRead objects
      if (Array.isArray(data)) {
        setBuilds(data);
      } else {
        setBuilds([]);
        setError('Unexpected response format');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while fetching nearest builds');
      }
      setBuilds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (budget > 0) {
      fetchNearestBuilds();
    }
  }, [budget, buildType, limit]);

  return {
    builds,
    loading,
    error,
    refetch: () => fetchNearestBuilds(),
    refetchWithOptions: fetchNearestBuilds,
  };
}

// Hook for getting nearest builds without automatic fetching (manual control)
export function useBuildNearestManual(): {
  builds: BuildRead[];
  loading: boolean;
  error: string | null;
  fetchNearestBuilds: (options: UseBuildNearestOptions) => Promise<void>;
} {
  const [builds, setBuilds] = useState<BuildRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearestBuilds = async ({
    budget,
    buildType,
    limit = 5,
  }: UseBuildNearestOptions) => {
    if (!budget || budget <= 0) {
      setError('Budget must be provided and greater than 0');
      setBuilds([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      
      if (buildType && buildType !== 'all') {
        searchParams.append('build_type', buildType);
      }
      
      searchParams.append('limit', limit.toString());

      const queryString = searchParams.toString();
      const url = `/builds/nearest/${budget}?${queryString}`;
      
      const response = await instance.get(url);
      const data = response.data;

      if (Array.isArray(data)) {
        setBuilds(data);
      } else {
        setBuilds([]);
        setError('Unexpected response format');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while fetching nearest builds');
      }
      setBuilds([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    builds,
    loading,
    error,
    fetchNearestBuilds,
  };
}
