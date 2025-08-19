import { apiService } from './api'
import { GetGameParams } from './types'

export class GameService {
  async getGames(params: GetGameParams) {
    return apiService.getGames(params)
  }

  async getGame(id: number) {
    return apiService.getGame(id)
  }
}

export const gameService = new GameService()