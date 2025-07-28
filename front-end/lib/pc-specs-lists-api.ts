import { instancePr as axiosInstance } from './axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1/';

export interface PCSpecsListBase {
  cpu_id?: number | null;
  cpu_cooler_id?: number | null;
  gpu_id?: number | null;
  motherboard_id?: number | null;
  ram_id?: number | null;
  storage_id?: number | null;
  power_supply_id?: number | null;
  case_id?: number | null;
}

export interface PCSpecsListCreate extends PCSpecsListBase {}

export interface PCSpecsListUpdate extends Partial<PCSpecsListBase> {}

export interface PCSpecsListRead extends PCSpecsListBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface PCSpecsListsResponse {
  items: PCSpecsListRead[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export const pcSpecsListsApi = {
  // Get all pc specs lists with pagination
  getPCSpecsLists: async (params?: {
    skip?: number;
    limit?: number;
  }): Promise<PCSpecsListsResponse> => {
    const response = await axiosInstance.get(`${API_BASE_URL}pc-specs-lists/`, { params });
    return response.data;
  },

  // Get pc specs list by ID
  getPCSpecsList: async (id: number): Promise<PCSpecsListRead> => {
    const response = await axiosInstance.get(`${API_BASE_URL}pc-specs-lists/${id}`);
    return response.data;
  },

  // Create new pc specs list
  createPCSpecsList: async (pcSpecsListData: PCSpecsListCreate): Promise<PCSpecsListRead> => {
    const response = await axiosInstance.post(`${API_BASE_URL}pc-specs-lists/`, pcSpecsListData);
    return response.data;
  },

  // Update pc specs list
  updatePCSpecsList: async (id: number, pcSpecsListData: PCSpecsListUpdate): Promise<PCSpecsListRead> => {
    const response = await axiosInstance.put(`${API_BASE_URL}pc-specs-lists/${id}`, pcSpecsListData);
    return response.data;
  },

  // Delete pc specs list
  deletePCSpecsList: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`${API_BASE_URL}pc-specs-lists/${id}`);
    return response.data;
  }
};

// Export individual functions for convenience
export const {
  getPCSpecsLists,
  getPCSpecsList,
  createPCSpecsList,
  updatePCSpecsList,
  deletePCSpecsList
} = pcSpecsListsApi; 