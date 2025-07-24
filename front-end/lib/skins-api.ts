import { instance } from './axios';

// Types for API requests
export interface GetSkinsParams {
  skip?: number;
  limit?: number;
  category_id?: number;
  weapon?: string;
  query?: string;
  include_category?: boolean;
}

export interface SkinRead {
  id: number;
  name: string;
  full_name: string;
  weapon: string;
  skin_name: string;
  image_file?: string;
  link?: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  category?: SkinCategoryRead;
}

export interface SkinCategoryRead {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  skins?: SkinRead[];
}

export interface SkinCreate {
  name: string;
  full_name: string;
  weapon: string;
  skin_name: string;
  image_file?: string;
  link?: string;
  category_id: number;
}

export interface SkinUpdate {
  name?: string;
  full_name?: string;
  weapon?: string;
  skin_name?: string;
  image_file?: string;
  link?: string;
  category_id?: number;
}

export interface PaginatedSkinsResponse {
  items: SkinRead[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

/**
 * Get skins with pagination and filtering
 */
export const getSkins = async (params: GetSkinsParams = {}): Promise<PaginatedSkinsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
  if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params.category_id) searchParams.append('category_id', params.category_id.toString());
  if (params.weapon) searchParams.append('weapon', params.weapon);
  if (params.query) searchParams.append('query', params.query);
  if (params.include_category !== undefined) searchParams.append('include_category', params.include_category.toString());
  
  const response = await instance.get(`/skins?${searchParams.toString()}`);
  return response.data;
};

/**
 * Get single skin by ID
 */
export const getSkinById = async (id: number): Promise<SkinRead> => {
  const response = await instance.get(`/skins/${id}`);
  return response.data;
};

/**
 * Create a new skin
 */
export const createSkin = async (skinData: SkinCreate): Promise<SkinRead> => {
  const response = await instance.post('/skins/', skinData);
  return response.data;
};

/**
 * Update existing skin
 */
export const updateSkin = async (id: number, skinData: SkinUpdate): Promise<SkinRead> => {
  const response = await instance.put(`/skins/${id}`, skinData);
  return response.data;
};

/**
 * Delete skin
 */
export const deleteSkin = async (id: number): Promise<SkinRead> => {
  const response = await instance.delete(`/skins/${id}`);
  return response.data;
};

/**
 * Get skins by weapon type
 */
export const getSkinsByWeapon = async (weapon: string): Promise<SkinRead[]> => {
  const response = await instance.get(`/skins/weapon/${weapon}`);
  return response.data;
};

/**
 * Get skins by category ID
 */
export const getSkinsByCategory = async (categoryId: number): Promise<SkinRead[]> => {
  const response = await instance.get(`/skins/category/${categoryId}`);
  return response.data;
};

// Category API functions
export interface GetSkinCategoriesParams {
  skip?: number;
  limit?: number;
  query?: string;
  include_skins?: boolean;
}

export interface SkinCategoryCreate {
  name: string;
}

export interface SkinCategoryUpdate {
  name?: string;
}

export interface PaginatedSkinCategoriesResponse {
  items: SkinCategoryRead[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

/**
 * Get skin categories with pagination
 */
export const getSkinCategories = async (params: GetSkinCategoriesParams = {}): Promise<PaginatedSkinCategoriesResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
  if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params.query) searchParams.append('query', params.query);
  if (params.include_skins !== undefined) searchParams.append('include_skins', params.include_skins.toString());
  
  const response = await instance.get(`/skins/categories?${searchParams.toString()}`);
  return response.data;
};

/**
 * Get single skin category by ID
 */
export const getSkinCategoryById = async (id: number): Promise<SkinCategoryRead> => {
  const response = await instance.get(`/skins/categories/${id}`);
  return response.data;
};

/**
 * Create a new skin category
 */
export const createSkinCategory = async (categoryData: SkinCategoryCreate): Promise<SkinCategoryRead> => {
  const response = await instance.post('/skins/categories/', categoryData);
  return response.data;
};

/**
 * Update existing skin category
 */
export const updateSkinCategory = async (id: number, categoryData: SkinCategoryUpdate): Promise<SkinCategoryRead> => {
  const response = await instance.put(`/skins/categories/${id}`, categoryData);
  return response.data;
};

/**
 * Delete skin category
 */
export const deleteSkinCategory = async (id: number): Promise<SkinCategoryRead> => {
  const response = await instance.delete(`/skins/categories/${id}`);
  return response.data;
}; 