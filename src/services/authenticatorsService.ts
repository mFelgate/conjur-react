import { apiRequest } from './apiClient'
import type {
  AuthenticatorV2Response,
  AuthenticatorsV2ListResponse,
  ListAuthenticatorsV2QueryRequest,
} from '../types'
const ACCOUNT = 'conjur.account'

function normalizeAuthenticators(response: AuthenticatorsV2ListResponse): AuthenticatorV2Response[] {
  if (Array.isArray(response)) {
    return response
  }

  return response.authenticators
}

export const authenticatorsService = {
  list(params: ListAuthenticatorsV2QueryRequest = {}) {
    return apiRequest<AuthenticatorsV2ListEnvelopeResponse>('/authenticators/' + localStorage.getItem(ACCOUNT)?.trim(), {
      query: params,
      headers: {
        accept: 'application/x.secretsmgr.v2beta+json',
      },
    }).then(normalizeAuthenticators)
  },  
  get(type, service_id) {
    const account = localStorage.getItem(ACCOUNT)?.trim()
    const path = `/authenticators/${account}/${type}/${service_id}`
    return apiRequest<AuthenticatorV2Response>(path, {
      headers: {
        accept: 'application/x.secretsmgr.v2beta+json',
      },
    })
  },
  update(enablement, type, service_id) {
    const account = localStorage.getItem(ACCOUNT)?.trim()
    const path = `/authenticators/${account}/${type}/${service_id}`
    return apiRequest<AuthenticatorV2Response>(path , {
			method: 'PATCH',
      headers: {
        accept: 'application/x.secretsmgr.v2beta+json',
      },
   		body: {
      	enabled: enablement
    	},
    },)
	},  
	delete(type, service_id) {
    const account = localStorage.getItem(ACCOUNT)?.trim()
    const path = `/authenticators/${account}/${type}/${service_id}`
    return apiRequest<void>(path , {
			method: 'DELETE',
      headers: {
        accept: 'application/x.secretsmgr.v2beta+json',
      },
    },)
	}, create(authenticator) {
    const account = localStorage.getItem(ACCOUNT)?.trim()
    const path = `/authenticators/${account}`
    return apiRequest<AuthenticatorV2Response>(path , {
			method: 'POST',
      headers: {
        accept: 'application/x.secretsmgr.v2beta+json',
      }, body: authenticator
    },)
	},
}
