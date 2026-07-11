export interface PolicyRecord {
  id: string
  body: string
}

export interface ListPolicyRequest {
  branch?: string
}

export type PolicyRequest = string

export interface PolicyAnnotationResponse {
  name: string
  policy: string
  value: string
}

export interface PolicyVersionResponse {
  client_ip: string | null
  created_at: string
  finished_at: string
  id: string
  policy_sha256: string
  policy_text: string
  role: string
  version: number
}

export interface LoadedPolicyResponse {
  created_roles: Record<string, { id: string; api_key: string }>
  version: number
}