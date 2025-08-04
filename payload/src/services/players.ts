import { PlayerWithRelations, PlayersResponse } from '../blocks/ApiPlayerList/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000/v1/'

export const playersService = {
  getPlayers: async (params?: {
    skip?: number;
    limit?: number;
    team?: string;
    country?: string;
    query?: string;
  }): Promise<PlayersResponse> => {
    const queryParams = new URLSearchParams()
    
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params?.team) queryParams.append('team', params.team)
    if (params?.country) queryParams.append('country', params.country)
    if (params?.query) queryParams.append('query', params.query)

    const url = `${API_BASE_URL}players/?${queryParams.toString()}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch players: ${response.statusText}`)
    }
    
    return response.json()
  },

  getPlayer: async (id: number): Promise<PlayerWithRelations> => {
    const response = await fetch(`${API_BASE_URL}players/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch player: ${response.statusText}`)
    }
    
    return response.json()
  }
}