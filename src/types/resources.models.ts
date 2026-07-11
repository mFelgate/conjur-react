import type { PolicyAnnotationResponse, PolicyVersionResponse } from './policies.models'

export interface ResourceRecord {
  id: string
  kind: string
  owner?: string
}

export interface ListResourcesRequest {
  kind?: string
  search?: string
}

export interface ResourcesQueryRequest {
  account?: string
  kind?: string
  search?: string
  offset?: number
  limit?: number
  count?: boolean
  role?: string
  acting_as?: string
}

export interface ShowResourceQueryRequest {
  permitted_roles?: boolean
  privilege?: string
  check?: boolean
  role?: string
}

export interface ResourcePermissionResponse {
  role: string
  privilege: string
  policy: string
}

export interface ResourceSecretVersionResponse {
  expires_at: string
  version: number
}

export interface ResourceResponse {
  annotations: PolicyAnnotationResponse[]
  created_at: string
  id: string
  owner: string
  permissions: ResourcePermissionResponse[]
  policy: string
  policy_versions: PolicyVersionResponse[]
  restricted_to: string[]
  secrets: ResourceSecretVersionResponse[]
}

export interface ResourceCountResponse {
  count: number
}

export type ResourcesResponse = ResourceResponse[] | ResourceCountResponse