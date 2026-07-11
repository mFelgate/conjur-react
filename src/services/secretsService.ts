import { apiRequest } from './apiClient'
import type { ApiListResponse, ListSecretsRequest, SecretRecord } from '../types'

export const secretsService = {
  list(params: ListSecretsRequest = {}) {
    return apiRequest<ApiListResponse<SecretRecord>>('/secrets', {
      query: params,
    })
  },
}