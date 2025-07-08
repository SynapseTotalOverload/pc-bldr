export type Category = {
  id: number
  name: string
}

export type Product = {
  asin: string
  title: string
  price: number
  rating: number
  id: number
  created_at: string
  category: Category
  attrs: Record<string, any>
}

export type PaginationData = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface ApiResponse {
  items: Array<CardProduct | CardBuild>
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export type BuildResponse = {
  id: number
  name: string
  build_price: number
}

export interface CardProduct {
  id: number
  title: string
  price: number | string
  asin: string
  rating: number
  created_at: string
  category?: {
    id: number
    name: string
  }
  attrs?: Record<string, any>
}

export interface CardBuild {
  id: number
  name: string
  build_type: string
  build_price: number
  cpu: number
  cpu_cooler: number
  gpu: number
  motherboard: number
  ram: number
  storage: number
  psu: number
  case: number
  created_at: string
  updated_at: string
}

export type CardProps = {
  item: CardProduct | CardBuild
  cardType: 'product' | 'builds'
  styling?: {
    cardStyle?: 'default' | 'elevated' | 'bordered' | 'minimal'
  }
}

export interface ApiCardListBlockProps {
  title?: string
  description?: string
  cardType?: 'product' | 'builds'
  category_id?: string
  build_type?: string
  apiEndpoint?: string
  apiParams?: {
    search?: string
    sort?: string
    order?: 'asc' | 'desc'
    page_size?: number
    page?: number
    build_type?: string
    [key: string]: any
  }
  layout?: 'grid' | 'list' | 'carousel'
  columns?: string
  itemsPerPage?: number
  showPagination?: boolean
  customFields?: Record<string, any>
  styling?: {
    backgroundColor?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted'
    cardStyle?: 'default' | 'elevated' | 'bordered' | 'minimal'
    imageAspectRatio?: '16/9' | '4/3' | '1/1' | '3/2'
  }
} 