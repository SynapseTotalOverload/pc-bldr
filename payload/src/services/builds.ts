import { api, apiService} from './api'
import { BuildsParams, ApiParams } from './types'




export class BuildsService {
  /**
   * Get builds with pagination and filters
   */ 
  async getBuilds(params: BuildsParams = {}) {
    const apiParams: ApiParams = {
      ...params,
      page_size: params.page_size,
      skip: params.skip,
      limit: params.limit,
      return_models: 'true',
      ...(params?.search && { search: params.search }),
      ...(params?.build_type && params.build_type !== 'all' && { build_type: params.build_type }),
    }
    // console.log("apiParams-----------------", apiParams)
    return apiService.getBuilds(apiParams)
  }

  /**
   * Get single build by ID
   */
  async getBuild(id: number) {
    return apiService.getBuild(id)
  }
}

export const buildsService = new BuildsService()