import { instance } from "./axios"
import { TeamCreate, TeamUpdate } from "@/types/team"

interface GetTeamsParams {
    skip?: number
    limit?: number
    query?: string
}

export const teamApi = {
    postTeam: async (team: TeamCreate) => {
        const { data } = await instance.post("/teams", team)
        return data
    },
    putTeam: async (id: number, team: TeamUpdate) => {
        const { data } = await instance.put(`/teams/${id}`, team)
        return data
    },
    deleteTeam: async (id: number) => {
        const { data } = await instance.delete(`/teams/${id}`)
        return data
    },
    getTeams: async (params?: GetTeamsParams) => {
        const { data } = await instance.get("/teams", { params })
        return data
    },
    getTeamById: async (id: number) => {
        const { data } = await instance.get(`/teams/${id}`)
        return data
    }
}