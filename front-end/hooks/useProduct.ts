import { useState, useEffect } from 'react';
import { ProductRead } from '@/types/prodcuts-base';
import { instance } from '@/lib/axios';

interface UseProductResult {
  product: ProductRead | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProduct(productId: string): UseProductResult {
  const [product, setProduct] = useState<ProductRead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!productId) {
      setProduct(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await instance.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
} 