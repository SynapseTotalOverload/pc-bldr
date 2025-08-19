import { apiService } from "./api"
import { GetTeamParams, TeamResponse } from "./types"

export class TeamService {
  async getTeams(params: GetTeamParams) {
    return apiService.getTeams(params)
  }

  async getTeam(id: number) {
    return apiService.getTeam(id)
  }
}

export const teamService = new TeamService()