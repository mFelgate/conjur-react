import { apiRequest } from './apiClient'
import type { ListResourcesRequest, ResourcesResponse } from '../types'
const ACCOUNT = 'conjur.account'

export const resourcesService = {
  list(params: ListResourcesRequest = {}) {
    return apiRequest<ResourcesResponse>('/resources/' + localStorage.getItem(ACCOUNT)?.trim(), {
      query: params,
    })
  },
}