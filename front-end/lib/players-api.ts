import { instancePr as axiosInstance } from './axios';
import { 
  PlayerCreate, 
  PlayerUpdate, 
  PlayerWithRelations, 
  PlayersResponse,
  PlayerSkinsBatch 
} from '@/types/players-base';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1/';

export const playersApi = {
  // Get all players with pagination and filtering
  getPlayers: async (params?: {
    skip?: number;
    limit?: number;
    team?: string;
    country?: string;
    query?: string;
  }): Promise<PlayersResponse> => {
    const response = await axiosInstance.get(`${API_BASE_URL}players/`, { params });
    return response.data;
  },

  // Get player by ID
  getPlayer: async (id: number): Promise<PlayerWithRelations> => {
    const response = await axiosInstance.get(`${API_BASE_URL}players/${id}`);
    return response.data;
  },

  // Create new player
  createPlayer: async (playerData: PlayerCreate): Promise<PlayerWithRelations> => {
    const response = await axiosInstance.post(`${API_BASE_URL}players/`, playerData);
    return response.data;
  },

  // Update player
  updatePlayer: async (id: number, playerData: PlayerUpdate): Promise<PlayerWithRelations> => {
    const response = await axiosInstance.put(`${API_BASE_URL}players/${id}`, playerData);
    return response.data;
  },

  // Delete player
  deletePlayer: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`${API_BASE_URL}players/${id}`);
    return response.data;
  },

  // Get players by team
  getPlayersByTeam: async (team: string): Promise<PlayerWithRelations[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}players/team/${team}`);
    return response.data;
  },

  // Get players by country
  getPlayersByCountry: async (country: string): Promise<PlayerWithRelations[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}players/country/${country}`);
    return response.data;
  },

  // Set player skins
  setPlayerSkins: async (id: number, skinsData: PlayerSkinsBatch): Promise<PlayerWithRelations> => {
    const response = await axiosInstance.put(`${API_BASE_URL}players/${id}/skins`, skinsData);
    return response.data;
  },

  // Add skin to player
  addSkinToPlayer: async (playerId: number, skinId: number): Promise<PlayerWithRelations> => {
    const response = await axiosInstance.post(`${API_BASE_URL}players/${playerId}/skins/${skinId}`);
    return response.data;
  },

  // Remove skin from player
  removeSkinFromPlayer: async (playerId: number, skinId: number): Promise<PlayerWithRelations> => {
    const response = await axiosInstance.delete(`${API_BASE_URL}players/${playerId}/skins/${skinId}`);
    return response.data;
  },

  // Add skins to player batch
  addSkinsToPlayerBatch: async (playerId: number, skinIds: number[]): Promise<PlayerWithRelations> => {
    const response = await axiosInstance.post(`${API_BASE_URL}players/${playerId}/skins/batch`, { skin_ids: skinIds });
    return response.data;
  },

  // Remove skins from player batch
  removeSkinsFromPlayerBatch: async (playerId: number, skinIds: number[]): Promise<PlayerWithRelations> => {
    const response = await axiosInstance.delete(`${API_BASE_URL}players/${playerId}/skins/batch`, { 
      data: { skin_ids: skinIds } 
    });
    return response.data;
  }
};

// Export individual functions for convenience
export const {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayersByTeam,
  getPlayersByCountry,
  setPlayerSkins,
  addSkinToPlayer,
  removeSkinFromPlayer,
  addSkinsToPlayerBatch,
  removeSkinsFromPlayerBatch
} = playersApi; 