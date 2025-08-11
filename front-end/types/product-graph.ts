export interface ProductUsageGraphResponse {
    data: {
        date: string;
        products: Record<string, number>;
        deleted_products: Record<string, number>;
    }[];
    brands: Record<string, string>;
    total_products: number;
    total_users: number;
    date_range: {
        start_date: string;
        end_date: string;
    };
}

export interface BrandUsageGraphResponse {
    data: {
        date: string;
        products: Record<string, number>;
        deleted_products: Record<string, number>;
    }[];
    brands: Record<string, {
        count: number;
        products: number[];
    }>;
    total_products: number;
    total_users: number;
    date_range: {
        start_date: string;
        end_date: string;
    };
}

export interface BrandInfo {
    name: string;
    product_count: number;
    categories: string[];
}

export interface BrandsResponse {
    brands: BrandInfo[];
    total_brands: number;
}
