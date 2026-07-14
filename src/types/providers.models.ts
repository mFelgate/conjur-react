export interface ProviderResponse {
  service_id: string
  type: string
  name: string
  nonce: string
  code_verifier: string
  redirect_uri: string
}

export interface PolicyLoadResponse {
  status: string;
  created: PolicyChangeSet;
  updated: PolicyUpdateSet;
  deleted: PolicyChangeSet;
}

export interface PolicyChangeSet {
  items: PolicyResource[];
}

export interface PolicyUpdateSet {
  before: PolicyChangeSet;
  after: PolicyChangeSet;
}

export interface PolicyResource {
  identifier: string;
  id: string;
  type: string;
  owner: string;
  policy: string | null;

  permissions?: Record<string, unknown>;
  permitted?: Record<string, unknown>;
  annotations?: Record<string, string>;

  members?: string[];
  memberships?: string[];
  restricted_to?: string[];
}

export type ProvidersListResponse = ProviderResponse[]
export type PublicKeysResponse = string