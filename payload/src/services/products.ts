import { apiService } from './api'
import { ApiParams, ProductsParams } from './types'

export class ProductsService {
  /**
   * Get products with category filtering
   */
  // async getProducts(params?: ProductsParams) {    
  //   const apiParams: ApiParams = {
  //     ...params,
  //     ...(params?.search && { query: params.search }),
  //   }

  //   return apiService.getProducts(apiParams)
  // }

  async getProducts(params: string) {    
    return apiService.getProducts(params)
  }


  /**
   * Get products by category ID
   */
  async getProduct(product_id: number) {
    return apiService.getProduct(product_id)
  }
}

export const productsService = new ProductsService() 