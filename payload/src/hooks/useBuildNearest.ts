import { buildsService } from '@/services/builds';
import { useState, useEffect } from 'react';

interface BuildRead {
  id: number;
  name: string;
  build_type: string;
  build_price: number;
  cpu?: any;
  gpu?: any;
  motherboard?: any;
  ram?: any;
  storage?: any;
  psu?: any;
  cpu_cooler?: any;
  case?: any;
}

interface UseBuildNearestOptions {
  budget: number;
  buildType: string;
  limit: number;
}

interface UseBuildNearestReturn {
  builds: BuildRead[];
  loading: boolean;
  error: string | null;
  refetchWithOptions: (options: UseBuildNearestOptions) => void;
}

export function useBuildNearest(options: UseBuildNearestOptions): UseBuildNearestReturn {
  const [builds, setBuilds] = useState<BuildRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetchWithOptions = async (newOptions: UseBuildNearestOptions) => {
    setLoading(true);
    setError(null);
    
    try {      
      const response = await buildsService.getBuildsByParams(newOptions.buildType, newOptions.budget, newOptions.limit)
      const data = response.data

      if(Array.isArray(data)) {
        setBuilds(data)
      } else {
        setBuilds([])
        setError('Unexpected response format')
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
    refetchWithOptions(options);
  }, [options.budget, options.buildType]);

  return {
    builds,
    loading,
    error,
    refetchWithOptions
  };
} 