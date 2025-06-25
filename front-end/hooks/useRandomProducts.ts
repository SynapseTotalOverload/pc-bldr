import { instance } from '@/lib/axios';
import { useState, useEffect } from 'react';
import { ProductRead } from '@/types/prodcuts-base';

interface RandomProductsResponse {
  products: ProductRead[];
}

interface UseRandomProductsResult {
  products: ProductRead[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  handleChangeManualLoading: (loading: boolean) => void;
}

export function useRandomProducts(): UseRandomProductsResult {
  const [products, setProducts] = useState<ProductRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await instance.get('/products/random-per-category');

      const data: RandomProductsResponse = response.data;
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching random products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeManualLoading = (loading: boolean) => {
    setLoading(loading);
  };

  useEffect(() => {
    fetchRandomProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchRandomProducts,
    handleChangeManualLoading,
  };
}
