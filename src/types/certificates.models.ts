export interface CsrBodyRequest {
  csr: string
  ttl: string
}

export interface CertificateJsonResponse {
  certificate: string
}

export type CertificateResponse = CertificateJsonResponse | string