export interface DiagramBrandBlockProps {
  title?: string
  description?: string
  defaultCategory?: string
  showDateRange?: boolean
  showBrandSelector?: boolean
  styling?: {
    backgroundColor?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted'
    chartHeight?: string
  }
}

export interface BrandData {
  name: string
  count: number
}

export interface ChartDataPoint {
  date: string
  fullDate: string
  [brandName: string]: any
}

export interface DiagramData {
  data: ChartDataPoint[]
  brands?: Record<string, { count: number }>
  total_users?: number
  date_range?: {
    start_date: string
    end_date: string
  }
} 