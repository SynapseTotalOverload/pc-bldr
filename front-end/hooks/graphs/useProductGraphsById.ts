import { useState } from "react";
import { BrandUsageGraphResponse, ProductUsageGraphResponse } from "@/types/product-graph";
import { productGraphsApi } from "@/lib/product-graphs-api";

export function useProductGraphsById<T extends ProductUsageGraphResponse>({
    start_date,
    end_date,
    product_id
}: {
    start_date: string;
    end_date: string;
    product_id: number
}) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await productGraphsApi.getProductUsageGraphByProductId({
                start_date,
                end_date,
                product_id,
            });
            console.log('API response:', response);
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