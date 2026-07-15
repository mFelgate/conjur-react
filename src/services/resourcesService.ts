import { apiRequest } from './apiClient'
import type { ListResourcesRequest, ResourcesResponse } from '../types'
const ACCOUNT = localStorage.getItem('conjur.account')

export const resourcesService = {
  list(params: ListResourcesRequest = {}) {
    return apiRequest<ResourcesResponse>('/resources/' + ACCOUNT.trim(), {
      query: params,
    })
  }, get (kind, identifier) {
    const path = `/resources/${ACCOUNT?.trim()}/${encodeURIComponent(kind)}/${encodeURIComponent(identifier)}`
    return apiRequest<ResourcesResponse>(path, {
      headers: {
        accept: 'application/json',
      },
    })
  }
}