import { useState, useCallback } from "react"
import { gameApi } from "@/lib/game-api" 
import { Pagination } from "@/types/country"
import { GetGame, GameBase, GameRead } from "@/types/game-base"
import { useRef } from 'react'

export const useGames = () => {
    const [games, setGames] = useState<GameBase[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [currentGame, setCurrentGame] = useState<GameBase | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const lastParams = useRef<{skip?:number;limit?:number;query?:string}>({})

    const fetchGames = useCallback(async (params?: { skip?: number; limit?: number; query?: string }) => {
        setLoading(true)
        setError(null)
        try {
            const response = await gameApi.getGames(params) as GetGame
            if (Array.isArray(response)) {
                setGames(response as GameBase[])
                setPagination(null)
            } else {
                const resp = response as GameRead
                setGames(resp.items)
                setPagination(resp.pagination)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
        lastParams.current = params ?? {}
    }, [])

    const fetchGameById = useCallback(async (id: number) => {
        setLoading(true)
        setError(null)
        try {
            const data = await gameApi.getGame(id)
            setCurrentGame(data)
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [])

    const createGame = useCallback(async (payload: any) => {
        setLoading(true)
        setError(null)
        try {
            const created = await gameApi.createGame(payload as any)
            await fetchGames(lastParams.current)
            return created
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [fetchGames])

    const updateGame = useCallback(async (id: number, payload: any) => {
        setLoading(true)
        setError(null)
        try {
            await gameApi.updateGame(id, payload as any)
            await fetchGames(lastParams.current)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [fetchGames])

    const deleteGame = useCallback(async (id: number) => {
        setLoading(true)
        setError(null)
        try {
            await gameApi.deleteGame(id)
            setGames(prev => prev.filter(game => game.id !== id))
            await fetchGames(lastParams.current)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [fetchGames])

    return {
        games,
        pagination,
        currentGame,
        loading,
        error,
        fetchGames,
        fetchGameById,
        createGame,
        updateGame,
        deleteGame,
        setPagination,
    }
}
