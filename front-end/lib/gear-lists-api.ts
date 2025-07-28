import { instancePr as axiosInstance } from './axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1/';

export interface GearListBase {
  monitor_id?: number;
  mouse_id?: number;
  keyboard_id?: number;
  headset_id?: number;
  mousepad_id?: number;
  earphones_id?: number;
}

export interface GearListCreate extends GearListBase {}

export interface GearListUpdate extends Partial<GearListBase> {}

export interface GearListRead extends GearListBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface GearListsResponse {
  items: GearListRead[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export const gearListsApi = {
  // Get all gear lists with pagination
  getGearLists: async (params?: {
    skip?: number;
    limit?: number;
  }): Promise<GearListsResponse> => {
    const response = await axiosInstance.get(`${API_BASE_URL}gear-lists/`, { params });
    return response.data;
  },

  // Get gear list by ID
  getGearList: async (id: number): Promise<GearListRead> => {
    const response = await axiosInstance.get(`${API_BASE_URL}gear-lists/${id}`);
    return response.data;
  },

  // Create new gear list
  createGearList: async (gearListData: GearListCreate): Promise<GearListRead> => {
    const response = await axiosInstance.post(`${API_BASE_URL}gear-lists/`, gearListData);
    return response.data;
  },

  // Update gear list
  updateGearList: async (id: number, gearListData: GearListUpdate): Promise<GearListRead> => {
    const response = await axiosInstance.put(`${API_BASE_URL}gear-lists/${id}`, gearListData);
    return response.data;
  },

  // Delete gear list
  deleteGearList: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`${API_BASE_URL}gear-lists/${id}`);
    return response.data;
  }
};

// Export individual functions for convenience
export const {
  getGearLists,
  getGearList,
  createGearList,
  updateGearList,
  deleteGearList
} = gearListsApi; 