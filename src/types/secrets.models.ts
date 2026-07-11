export interface SecretRecord {
  id: string
  value?: string
}

export interface ListSecretsRequest {
  path?: string
}

export type SecretValueRequest = string

export interface GetSecretQueryRequest {
  version?: number | null
}

export interface CreateSecretQueryRequest {
  expirations?: string
}

export interface GetSecretsQueryRequest {
  variable_ids: string
}

export type SecretValueResponse = string
export type BatchSecretsResponse = Record<string, string>