import { useState, useCallback } from "react"
import { TeamCreate, TeamRead, TeamUpdate, TeamsResponse } from "@/types/team"
import { teamApi } from "@/lib/team-api"

interface GetTeamsParams {
    skip?: number
    limit?: number
    query?: string
}

export const useTeam = () => {
    const [teams, setTeams] = useState<TeamRead[]>([])
    const [pagination, setPagination] = useState<{currentPage:number,totalPages:number,totalItems:number,itemsPerPage:number}|null>(null)
    const [currentTeam, setCurrentTeam] = useState<TeamRead | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTeams = useCallback(async (params?: GetTeamsParams) => {
        setLoading(true)
        setError(null)
        try {
            const response = await teamApi.getTeams(params) as unknown
            if (Array.isArray(response)) {
                setTeams(response as TeamRead[])
                setPagination(null)
            } else {
                const resp = response as TeamsResponse
                setTeams(resp.items)
                setPagination(resp.pagination)
                console.log(resp.pagination)
                console.log(resp.items)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchTeamById = useCallback(async (id: number) => {
        setLoading(true)
        setError(null)
        try {
            const data = await teamApi.getTeamById(id)
            setCurrentTeam(data)
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [])

    const createTeam = useCallback(async (payload: TeamCreate) => {
        setLoading(true)
        setError(null)
        try {
            await teamApi.postTeam(payload)
            await fetchTeams()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [fetchTeams])

    const updateTeam = useCallback(async (id: number, payload: TeamUpdate) => {
        setLoading(true)
        setError(null)
        try {
            await teamApi.putTeam(id, payload)
            await fetchTeams()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [fetchTeams])

    const deleteTeam = useCallback(async (id: number) => {
        setLoading(true)
        setError(null)
        try {
            await teamApi.deleteTeam(id)
            setTeams(prev => prev.filter(team => team.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        teams,
        pagination,
        currentTeam,
        loading,
        error,
        fetchTeams,
        fetchTeamById,
        createTeam,
        updateTeam,
        deleteTeam,
    }
}