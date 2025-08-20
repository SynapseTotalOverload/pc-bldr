export interface StickersBase {
    id?: number
    name: string
    class_name?: string
    tournire?: string
    image_url?: string
    s_type?: string
}

export interface GetStickersParams  extends StickersBase {
    skip?: number
    limit?: number
    query?: string
    s_type?: string
}