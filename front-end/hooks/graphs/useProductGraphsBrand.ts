import { useState, useEffect } from "react";
import { BrandUsageGraphResponse, BrandsResponse } from "@/types/product-graph";
import { productGraphsApi } from "@/lib/product-graphs-api";

export function useProductGraphsBrand<T extends BrandUsageGraphResponse>({
    start_date,
    end_date,
    category_ids,
    brands
}: {
    start_date: string;
    end_date: string;
    category_ids: number[];
    brands: string[];
}) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await productGraphsApi.getProductUsageBrandGraph({
                start_date,
                end_date,
                category_ids,
                brands
            });
            console.log('response', response);
            setData(response as T);
        } catch (error) {
            console.error('API error:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Error response:', axiosError.response?.data);
                console.error('Error status:', axiosError.response?.status);
            }
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch: fetchData };
}

export function useBrands(category_ids?: number[]) {
    const [dataBrands, setDataBrands] = useState<BrandsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('category_ids', category_ids);
            const response = await productGraphsApi.getBrands({ category_ids });
            setDataBrands(response);
            console.log('response brands', response);
        } catch (error) {
            console.error('API error:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Error response:', axiosError.response?.data);
                console.error('Error status:', axiosError.response?.status);
            }
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch when category_ids change
    useEffect(() => {
        fetchData();
    }, [category_ids?.join(',')]);

    return { dataBrands, loading, error, refetch: fetchData };
}