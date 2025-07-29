import axios from 'axios'
import { ApiResponse, ApiParams } from './types'

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
})


// Error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiService {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000/api/v1'
  }

  /**
   * POST-запит з body
   */
  async postData<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return this.normalizeResponse(result);
  }

  /**
   * Fetch data from API endpoint (GET)
   */
  async fetchData<T = any>(
    endpoint: string, 
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    try {
      let url: string
      if (endpoint.startsWith('http')) {
        url = endpoint
      } else {
        url = `${this.baseUrl}${endpoint}`
      }

      if (params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      return this.normalizeResponse(result)
    } catch (error) {
      console.error('API fetch error:', error)
      throw error
    }
  }

  

  /**
   * Normalize different API response formats
   */
  private normalizeResponse<T = any>(result: any): ApiResponse<T> {
    if (result.data && Array.isArray(result.data)) {
      return { data: result.data, ...result }
    } else if (result.products && Array.isArray(result.products)) {
      return { data: result.products, ...result }
    } else if (result.builds && Array.isArray(result.builds)) {
      return { data: result.builds, ...result }
    } else if (result.results && Array.isArray(result.results)) {
      return { data: result.results, ...result }
    } else if (result.items && Array.isArray(result.items)) {
      return { data: result.items, ...result }
    } else if (Array.isArray(result)) {
      return { data: result }
    } else {
      return result
    }
  }

  /**
   * Get products with optional filtering (POST)
   */
  // async getProducts(params?: ApiParams) {
  //   const body: any = {
  //     selected_components: params?.selected_components || {},
  //     page: params?.page || 1,
  //     page_size: params?.page_size || 20,
  //     category_id: params?.category_id,
  //   };
  //   if (params?.query) body.query = params.query;
  //   if (params?.budget) body.budget = params.budget;
  //   return this.postData('products/compatible', body);
  // }

  async getProducts(params: string) {
    return this.fetchData(`products?${params}`);
  }

  /**
   * Get builds with optional filtering (GET)
   */
  async getBuilds(params: string) {
    return this.fetchData(`builds?${params}`)
  }

  async getBuild(id: number) {
    return this.fetchData(`builds/${id}`)
  }

  async getProduct(id: number) {
    return this.fetchData(`products/${id}`)
  } 

  async getBuildsByParams(params: string, budget: number, limit: number) {
    return this.fetchData(`builds/nearest/${budget}?build_type=${params}&limit=${limit}`)
  }

  async getPlayers(params: string) {
    return this.fetchData(`players?${params}`)
  }

  async getPlayer(id: number) {
    return this.fetchData(`players/${id}`)
  }

  /**
   * Generic method for any endpoint
   */
  async getData(endpoint: string, params?: ApiParams) {
    return this.fetchData(endpoint, params)
  }
}

export const apiService = new ApiService() 