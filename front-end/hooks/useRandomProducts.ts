import { useState, useEffect } from 'react';
import { BaseProduct, ProductTypeMapArray } from '@/types/product';

interface RandomProductsResponse {
  products: ProductTypeMapArray;
}

interface UseRandomProductsResult {
  products: ProductTypeMapArray;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  handleChangeManualLoading: (loading: boolean) => void;
}

export function useRandomProducts(): UseRandomProductsResult {
  const [products, setProducts] = useState<ProductTypeMapArray>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/products/random');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RandomProductsResponse = await response.json();
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
