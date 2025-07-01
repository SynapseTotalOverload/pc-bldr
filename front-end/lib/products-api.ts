import { instance } from './axios';
import { PaginatedInterface, ProductRead } from '@/types/prodcuts-base';

// Types for API requests
export interface GetProductsParams {
  category_id?: number;
  page?: number;
  page_size?: number;
  search?: string;
}

export interface SelectedComponents {
  [key: string]: number;
}

export interface GetCompatibleProductsParams {
  selected_components?: SelectedComponents;
  category_id?: number;
  page?: number;
  page_size?: number;
  budget?: number;
  query?: string;
}

/**
 * Get products with pagination (existing GET endpoint)
 */
export const getProducts = async (params: GetProductsParams): Promise<PaginatedInterface<ProductRead>> => {
  const searchParams = new URLSearchParams();
  
  if (params.category_id) searchParams.append('category_id', params.category_id.toString());
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.page_size) searchParams.append('page_size', params.page_size.toString());
  if (params.search) searchParams.append('search', params.search);

  const response = await instance.get(`/products?${searchParams.toString()}`);
  return response.data;
};

/**
 * Get compatible products based on selected components (new POST endpoint)
 */
export const getCompatibleProducts = async (params: GetCompatibleProductsParams): Promise<PaginatedInterface<ProductRead>> => {
  const requestBody = {
    selected_components: params.selected_components || {},
    page: params.page || 1,
    page_size: params.page_size || 20,
    ...(params.category_id && { category_id: params.category_id }),
    ...(params.budget && { budget: params.budget }),
    ...(params.query && { query: params.query }),
  };

  const response = await instance.post('/products/compatible', requestBody);
  return response.data;
};

/**
 * Get single product by ID
 */
export const getProductById = async (id: number): Promise<ProductRead> => {
  const response = await instance.get(`/products/${id}`);
  return response.data;
};

/**
 * Create a new product
 */
export const createProduct = async (productData: any): Promise<ProductRead> => {
  const response = await instance.post('/products/', productData);
  return response.data;
};

/**
 * Update existing product
 */
export const updateProduct = async (id: number, productData: any): Promise<ProductRead> => {
  const response = await instance.put(`/products/${id}`, productData);
  return response.data;
};

/**
 * Delete product
 */
export const deleteProduct = async (id: number): Promise<void> => {
  await instance.delete(`/products/${id}`);
};

/**
 * Get random products per category
 */
export const getRandomProductsPerCategory = async (): Promise<ProductRead[]> => {
  const response = await instance.get('/products/random-per-category');
  return response.data;
}; 