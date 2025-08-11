import { useState } from "react";
import { BrandUsageGraphResponse, ProductUsageGraphByIdParams, ProductUsageGraphResponse } from "@/services/types";
import { apiService } from "@/services/api";

export function useGraphById<T extends ProductUsageGraphResponse>({
    start_date,
    end_date,
    product_id
}: ProductUsageGraphByIdParams) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.postProductUsageGraphByProductId({
                start_date,
                end_date,
                product_id
            });
            console.log("response", response)
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