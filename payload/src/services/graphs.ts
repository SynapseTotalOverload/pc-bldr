import { apiService } from './api'
import { BrandUsageGraphResponse, ProductUsageBrandGraphParams, ProductUsageGraphByIdParams, ProductUsageGraphResponse } from './types'

export class GraphsService {    
  async postProductUsageBrandGraph(params: ProductUsageGraphByIdParams) {
    return apiService.postProductUsageBrandGraph(params)
  }

  async postProductUsageGraphByProductId(params: ProductUsageGraphByIdParams) {
    return apiService.postProductUsageGraphByProductId(params)
  }

  async getProductUsageBrandGraph(params: ProductUsageBrandGraphParams) {
    return apiService.getProductUsageBrandGraph(params)
  }

  async getBrands(params?: {
    category_ids?: number[];
  }) {
    return apiService.getBrands(params)
  }
}