import { useState } from "react"
import { TeamService } from "@/services/team"
import { Team, GetTeamParams, TeamResponse } from "@/services/types"

export const useTeam = () => {
  const [teams, setTeams] = useState<TeamResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const teamService = new TeamService()

  const fetchTeams = async (params: GetTeamParams) => {
    setLoading(true)
    try {
      const response = await teamService.getTeams(params)
      setTeams(response.data || [])
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeam = async (id: number) => {
    setLoading(true)
    try {
      const response = await teamService.getTeam(id)
      setTeams(response.data || [])
      return response.data
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  return { teams, loading, error, fetchTeams, fetchTeam }
}