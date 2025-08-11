import { useState, useEffect } from "react";
import { BrandUsageGraphResponse, BrandsResponse } from "@/services/types";
import { apiService } from "@/services/api";

export function useProductGraphs<T extends BrandUsageGraphResponse>({
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
            const response = await apiService.getProductUsageBrandGraph({
                start_date,
                end_date,
                category_ids,
                brands
            });
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

export function useBrandsGraphs(category_ids?: number[]) {
    const [dataBrands, setDataBrands] = useState<BrandsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.getBrands({ category_ids });
            setDataBrands(response as BrandsResponse);
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