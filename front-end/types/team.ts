import { PlayerBase } from './players-base'

export interface TeamCreate {
    name: string
    description: string
    logo: string
    jerseys_img: string
    socila_media_links: string
}

export interface TeamUpdate {
    name: string
    description: string
    logo: string
    jerseys_img: string
    socila_media_links: string
}

export interface TeamRead {
    id: number
    name: string
    description: string
    logo: string
    jerseys_img: string
    socila_media_links: string[]
    players: PlayerBase[]
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


