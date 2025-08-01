export interface Product {
  id: number
  high_image_url?: string
  low_image_url?: string
  price: number
  rating: number
  title: string
  description?: string
  asin: string
  attrs: ProductAttributes
  architechture: string
  base_speed: number
  brand: string
  core_family: string
  cores: number
  generation: string
  integrated_graphics: string
  memory_speed: number
  memory_type: string
  model: string
  series: string
  socket_type: string
  threads: number
  turbo_speed: number
  category: {
    id: number
    name: string
  }
  created_at: string
  inStock?: boolean
  specifications?: Record<string, string>
  reviews?: Array<{
    id: number
    author: string
    rating: number
    content: string
  }>
  }
  
  export interface ProductsParams extends ApiParams {
    category_id?: number
    query?: string
    page?: number
    page_size?: number
    search?: string
  }

export interface BuildItem {
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
    components?: {
      id: number
      name: string
      price: number
      category: string
    }[]
  }

  export interface Build {
    id: number
    name: string
    build_type: string
    build_price: number
    cpu: BuildProduct
    cpu_cooler: BuildProduct
    gpu: BuildProduct
    motherboard: BuildProduct
    ram: BuildProduct
    storage: BuildProduct
    psu: BuildProduct
    case: BuildProduct
  }

  export interface BuildProduct {
    asin: string
    category: {
        id: number
        name: string
    }
    created_at: string
    id: number
    price: number
    rating: number
    title: string
  }

  
  export interface Builds {
    items: BuildItem[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
    }
  }
  
  export interface BuildsParams extends ApiParams {
    skip?: number
    limit?: number
    build_type?: string
    return_models?: string
    query?: string
    price_min?: number
    price_max?: number
  }

// Base API params
export interface ApiParams {
  page?: number
  page_size?: number
  query?: string
  search?: string
  [key: string]: any
}

export interface ApiResponse<T = any> {
  data?: T[]
  products?: T[]
  builds?: T[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  results?: T[]
  items?: T[]
  total?: number
  page?: number
  limit?: number
  error?: string
}

// Response types
export interface PaginatedResponse<T> {
    items: T[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
    }
  }
export interface ProductAttributes {
  brand: string
  model: string
  
  color?: string
  
  // CPU attributes
  architechture?: string
  base_speed?: number
  core_family?: string
  cores?: number
  generation?: string
  integrated_graphics?: string
  memory_speed?: number
  memory_type?: string
  series?: string
  socket_type?: string
  threads?: number
  turbo_speed?: number
  
  // CPU Cooler attributes
  fan_rpm_base?: number
  fan_rpm_max?: number
  noise_level_base?: number
  noise_level_max?: number
  
  // GPU attributes
  base_clock?: number
  chipset?: string
  clock_speed?: number
  frame_sync?: string
  interface?: string
  length?: number
  mem_interface?: string
  memory?: number
  
  // Motherboard attributes
  form_factor?: string
  max_ram_support?: number
  ram_slots?: number
  
  // RAM attributes
  cas_latency?: string
  one_unit_memory?: number
  quantity?: number
  ram_speed?: number
  ram_type?: string
  total_memory?: number
  
  // Storage attributes
  cache_mem?: number
  capacity?: number
  mem_type?: string
  
  // Power Supply attributes
  efficiency?: string
  power?: number
  
  // Case attributes
  cabinet_type?: string
  side_panel?: string
  
  // Mouse attributes (category 9)
  connectivity_technology?: string
  special_feature?: string
  movement_detection_technology?: string
  number_of_buttons?: number
  
  // Monitor attributes (category 10)
  screen_size?: number
  resolution?: string
  aspect_ratio?: string
  screen_surface_description?: string
  style?: string
  
  // Keyboard attributes (category 11)
  pattern?: string
  compatible_devices?: string
  keyboard_description?: string
  recommended_uses_for_product?: string
  number_of_keys?: number
  keyboard_backlighting_color_support?: string
  size?: string
  
  // Headset attributes (category 12)
  par_placement?: string
  impedance?: number
  
  // Mousepad attributes (category 13)
  material?: string
  
  // Chair attributes (category 14)
  product_dimensions?: string
  back_style?: string
  
  // Microphone attributes (category 15)
  colour?: string
  included_components?: string
  polar_pattern?: string
  supported_audio_format?: string

  // Headphones attributes (category 17)
  ear_placement?: string

  // Camera attributes (category 16)
  photo_sensor_technology?: string
  video_capture_resolution?: number
  maximum_aperture?: number
  flash_memory_type?: number
  video_capture_format?: string
}




