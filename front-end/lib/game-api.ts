import { instance } from "./axios"
import { GameBase } from "@/types/game-base"

export const gameApi = {
    getGames: async (params?: Record<string,any>) => {
        const response = await instance.get("/games", { params })
        return response.data
    },
    getGame: async (id: number) => {
        const response = await instance.get(`/games/${id}`)
        return response.data
    },
    createGame: async (game: GameBase) => {
        const response = await instance.post("/games", game)
        return response.data
    },
    updateGame: async (id: number, game: GameBase) => {
        const response = await instance.put(`/games/${id}`, game)
        return response.data
    },
    deleteGame: async (id: number) => {
        const response = await instance.delete(`/games/${id}`)
        return response.data
    }
}

export const { getGames, getGame, createGame, updateGame, deleteGame } = gameApi