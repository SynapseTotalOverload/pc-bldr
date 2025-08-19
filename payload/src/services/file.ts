import { apiService } from './api'

export class FileService {
  async getFile(params: { key?: string; url?: string }) {
    return apiService.getFile(params)
  }
}