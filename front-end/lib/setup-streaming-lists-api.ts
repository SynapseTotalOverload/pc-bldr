import { instancePr as axiosInstance } from './axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1/';

export interface SetupStreamingListBase {
  chair_id?: number;
  microphone_id?: number;
  webcam_id?: number;
}

export interface SetupStreamingListCreate extends SetupStreamingListBase {}

export interface SetupStreamingListUpdate extends Partial<SetupStreamingListBase> {}

export interface SetupStreamingListRead extends SetupStreamingListBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface SetupStreamingListsResponse {
  items: SetupStreamingListRead[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export const setupStreamingListsApi = {
  // Get all setup streaming lists with pagination
  getSetupStreamingLists: async (params?: {
    skip?: number;
    limit?: number;
  }): Promise<SetupStreamingListsResponse> => {
    const response = await axiosInstance.get(`${API_BASE_URL}setup-streaming-lists/`, { params });
    return response.data;
  },

  // Get setup streaming list by ID
  getSetupStreamingList: async (id: number): Promise<SetupStreamingListRead> => {
    const response = await axiosInstance.get(`${API_BASE_URL}setup-streaming-lists/${id}`);
    return response.data;
  },

  // Create new setup streaming list
  createSetupStreamingList: async (setupStreamingListData: SetupStreamingListCreate): Promise<SetupStreamingListRead> => {
    const response = await axiosInstance.post(`${API_BASE_URL}setup-streaming-lists/`, setupStreamingListData);
    return response.data;
  },

  // Update setup streaming list
  updateSetupStreamingList: async (id: number, setupStreamingListData: SetupStreamingListUpdate): Promise<SetupStreamingListRead> => {
    const response = await axiosInstance.put(`${API_BASE_URL}setup-streaming-lists/${id}`, setupStreamingListData);
    return response.data;
  },

  // Delete setup streaming list
  deleteSetupStreamingList: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`${API_BASE_URL}setup-streaming-lists/${id}`);
    return response.data;
  }
};

// Export individual functions for convenience
export const {
  getSetupStreamingLists,
  getSetupStreamingList,
  createSetupStreamingList,
  updateSetupStreamingList,
  deleteSetupStreamingList
} = setupStreamingListsApi; 