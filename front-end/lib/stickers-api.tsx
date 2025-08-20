import { instance } from "./axios"
import { StickersBase } from "@/types/stickers-base"

interface GetStickersParams {
    skip?: number
    limit?: number
    query?: string
    s_type?: string
}

export const stickersApi = {
    postStickers: async (stickers: StickersBase) => {
        const response = await instance.post("/stickers", stickers)
        return response.data
    },
    putStickers: async (id: number, stickers: StickersBase) => {
        const response = await instance.put(`/stickers/${id}`, stickers)
        return response.data
    },
    deleteStickers: async (id: number) => {
        const response = await instance.delete(`/stickers/${id}`)
        return response.data
    },  
    getStickers: async (params?: GetStickersParams) => {
        console.log("Stickers API request params:", params)
        const response = await instance.get("/stickers", { params })
        return response.data
    },
    getStickersByTeamId: async (teamId: number) => {
        const response = await instance.get(`/stickers/team/${teamId}`)
        return response.data
    },
}