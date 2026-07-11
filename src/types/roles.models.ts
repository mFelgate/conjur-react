export type MemberRoleKind = 'user' | 'group' | 'host' | 'layer'

export interface RoleMemberResponse {
  member: string
  role?: string
  admin_option: boolean
}

export type RoleMembersResponse = RoleMemberResponse[]

export interface ShowRoleQueryRequest {
  all?: string
  memberships?: string
  members?: string
  offset?: number
  limit?: number
  count?: boolean
  search?: string
  graph?: string
}

export interface RoleMembershipMutationQueryRequest {
  members: string
  member: string
}

export interface RoleGraphQueryRequest {
  roles: string | string[]
  ancestors?: boolean
  descendants?: boolean
}

export interface RoleResponse {
  created_at: string
  id: string
  members: unknown[]
  [key: string]: unknown
}

export interface RoleGraphResponse {
  nodes: string[]
  edges: Array<[string, string]>
}