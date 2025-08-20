import { PlayerBase } from './players-base'
import { StickersBase } from './stickers-base'

export interface TeamCreate {
    name: string
    description: string
    logo: string
    jerseys_img: string
    socila_media_links: string
    sticker_ids: number[]
}

export interface TeamUpdate {
    name: string
    description: string
    logo: string
    jerseys_img: string
    socila_media_links: string
    sticker_ids: number[]
}

export interface TeamRead {
    id: number
    name: string
    description: string
    logo: string
    jerseys_img: string
    socila_media_links: string[]
    players: PlayerBase[]
    sticker_ids: number[]
    stickers: StickersBase[] // Make stickers required to match backend schema
}

export interface TeamsResponse {
    items: TeamRead[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    }
}


