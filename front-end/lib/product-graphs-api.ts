import { instance as axiosInstance } from './axios';
import { ProductUsageGraphResponse, BrandUsageGraphResponse, BrandInfo, BrandsResponse } from '@/types/product-graph';

export const productGraphsApi = {
    getProductUsageGraph: async (params: {
        start_date: string;
        end_date: string;
        category_ids?: number[];
        brands?: string[];
        product_ids?: number[];
    }): Promise<ProductUsageGraphResponse> => {
        const response = await axiosInstance.get(`product-usage-graphs/`, { params });
        return response.data;
    },

    getProductUsageBrandGraph: async (params: {
        start_date: string;
        end_date: string;
        category_ids?: number[];
        brands?: string[];
    }): Promise<BrandUsageGraphResponse> => {
        const response = await axiosInstance.post(`product-usage-graphs/brand-graph`, params);
        return response.data;
    },

    getProductUsageGraphByProductId: async (params: {
        start_date: string;
        end_date: string;
        product_id: number;
    }): Promise<ProductUsageGraphResponse> => {
        const response = await axiosInstance.post(`product-usage-graphs/product-specific`, params);
        return response.data;
    },

    getBrands: async (params?: {
        category_ids?: number[];
    }): Promise<BrandsResponse> => {
        const queryParams = new URLSearchParams();
        if (params?.category_ids && params.category_ids.length > 0) {
            params.category_ids.forEach(id => {
                queryParams.append('category_ids', id.toString());
            });
        }
        const url = `product-usage-graphs/brands${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await axiosInstance.get(url);
        return response.data;
    }
};