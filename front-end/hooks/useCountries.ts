
import { useCallback, useEffect, useState } from "react";
import { Country, CountriesResponse } from "@/types/country";
import { countriesApi, GetCountriesParams } from "@/lib/countries-api";

interface UseCountriesOptions {
  autoFetch?: boolean;
}

interface UseCountriesResult {
  countries: Country[];
  loading: boolean;
  error: string | null;
  pagination: CountriesResponse["pagination"] | null;
  fetchCountries: (params?: GetCountriesParams) => Promise<void>;
  loadMore: () => void;
}

export function useCountries(initialParams: GetCountriesParams = {}, options: UseCountriesOptions = {}): UseCountriesResult {
  const { autoFetch = false } = options;
  const [countries, setCountries] = useState<Country[]>([]);
  const [pagination, setPagination] = useState<CountriesResponse["pagination"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = useCallback(async (params: GetCountriesParams = {}, append: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await countriesApi.getCountries({ ...initialParams, ...params });
      setCountries(prev => append ? [...prev, ...response.items] : response.items);
      setPagination(response.pagination);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch countries";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  const loadMore = useCallback(() => {
    if (!pagination || pagination.currentPage >= pagination.totalPages || loading) return;
    const nextSkip = (pagination.currentPage) * pagination.itemsPerPage;
    fetchCountries({
      skip: nextSkip,
      limit: pagination.itemsPerPage,
      query: initialParams.query,
    }, true);
  }, [pagination, loading, fetchCountries, initialParams.query]);

  // initial load (only if autoFetch)
  useEffect(() => {
    if (autoFetch) {
      fetchCountries();
    }
  }, [fetchCountries, autoFetch]);

  return { countries, loading, error, pagination, fetchCountries, loadMore };
}