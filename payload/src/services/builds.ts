import { api, apiService} from './api'
import { BuildsParams, ApiParams } from './types'




export class BuildsService {
  /**
   * Get builds with pagination and filters
   */ 
  async getBuilds(params: string) {
    return apiService.getBuilds(params)
  }

  /**
   * Get single build by ID
   */
  async getBuild(id: number) {
    return apiService.getBuild(id)
  }

  async getBuildsByParams(params: string, budget: number, limit: number) {
    return apiService.getBuildsByParams(params, budget, limit)
  }
}

export const buildsService = new BuildsService()