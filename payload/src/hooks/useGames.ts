import { useState } from "react"
import { GameService } from "@/services/game"
import { Game, GameResponse, GetGameParams, Games } from "@/services/types"

export const useGames = () => {
  const [games, setGames] = useState<Games[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [game, setGame] = useState<Game | null>(null)
  const gameService = new GameService()

  const fetchGames = async (params: GetGameParams) => {
    setLoading(true)
    try {
      const response = await gameService.getGames(params)
      const items = (response as any).items ?? (response.data as Games[] | undefined) ?? []
      setGames(items)
      return items
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGame = async (id: number) => {
    setLoading(true)
    try {
      const response = await gameService.getGame(id)
      setGame(response as Game)
      return response as Game
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

return { games, game, loading, error, fetchGames, fetchGame }
}