const viteEnv = (import.meta as { env?: Record<string, string> }).env
export const API_BASE_URL = viteEnv?.VITE_API_BASE_URL ?? ''

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  query?: object
  headers?: Record<string, string>
}

interface JsonRequestOptions extends RequestOptions {
  body?: unknown
}

interface TextRequestOptions extends RequestOptions {
  body?: string
}

const ACCESS_TOKEN_STORAGE_KEY = 'conjur.accessToken'


function buildUrl(path: string, query?: object) {
  const url = new URL(path, API_BASE_URL || window.location.origin)

  if (query) {
    Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`
}

async function request(path: string, options: RequestOptions & { body?: BodyInit }): Promise<Response> {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)?.trim()

  return fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    headers: {
      ...(accessToken ? { Authorization: `Token token="${accessToken}"` } : {}),
      ...options.headers,
    },
    body: options.body,
  })
}

export async function apiRequestJson<T>(path: string, options: JsonRequestOptions = {}): Promise<T> {
  try {
    const response = await request(path, {
      ...options,
      headers: {
        ...(options.body !== undefined && options.body !== null
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...options.headers,
      },
      body:
        options.body === undefined || options.body === null
          ? undefined
          : JSON.stringify(options.body),
    })

    if (response.status === 401) {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || `Request failed: ${response.status}`)
    }

    if (response.status === 204) {
      return undefined as T
    }



    return (await response.json()) as T
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API request failed for ${path}: ${error.message}`)
    }

    throw new Error(`API request failed for ${path}`)
  }
}

export async function apiRequestText(path: string, options: TextRequestOptions = {}): Promise<string> {
  try {
    const response = await request(path, {
      ...options,
      headers: {
        ...(options.body !== undefined ? { 'Content-Type': 'text/plain' } : {}),
        ...options.headers,
      },
      body: options.body,
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || `Request failed: ${response.status}`)
    }

    if (response.status === 204) {
      return ''
    }

    return await response.text()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API request failed for ${path}: ${error.message}`)
    }

    throw new Error(`API request failed for ${path}`)
  }
}

// Backward-compatible alias for existing JSON callers.
export const apiRequest = apiRequestJson