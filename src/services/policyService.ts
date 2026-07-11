import { apiRequest } from './apiClient'
import type { ApiListResponse, ListPolicyRequest, PolicyRecord } from '../types'

export const policyService = {
  list(params: ListPolicyRequest = {}) {
    return apiRequest<ApiListResponse<PolicyRecord>>('/policy', {
      query: params,
    })
  },
}