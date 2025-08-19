import { Pagination } from "./country"
import { PlayerBase } from "./players-base"

export interface GameBase {
    id?: number
    name: string
    description: string
    image: string
    icon: string
    players?: PlayerBase[]
}

export interface GetGame {
    skip?: number
    limit?: number
    query?: string
}

export interface GameRead {
    items: GameBase[]
    pagination: Pagination
}