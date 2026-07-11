export interface CreateHostFormRequest {
  id: string
  annotations?: Record<string, string>
}

export interface CreateHostTokenFormRequest {
  expiration: string
  host_factory: string
  count?: number
  cidr?: string[]
}

export interface CreateHostResponse {
  annotations: string[]
  api_key: string
  created_at: string
  id: string
  owner: string
  permissions: string[]
}

export interface CreateHostTokenItemResponse {
  expiration: string
  cidr: string[]
  token: string
}

export type CreateHostTokenResponse = CreateHostTokenItemResponse[]