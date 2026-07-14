import { apiRequest, apiRequestText } from "./apiClient";
import type {
  ApiListResponse,
  ListSecretsRequest,
  SecretRecord,
} from "../types";
const ACCOUNT = localStorage.getItem("conjur.account")?.trim();

export const secretsService = {
  get(kind, identifier) {
    const path = `/secrets/${encodeURIComponent(ACCOUNT)}/${encodeURIComponent(kind)}/${encodeURIComponent(identifier)}`;
    return apiRequestText<ApiListResponse<SecretRecord>>(path);
  },
  async set(kind, identifier, value) {
    const path = `/secrets/${encodeURIComponent(ACCOUNT)}/${encodeURIComponent(kind)}/${encodeURIComponent(identifier)}`;
    return apiRequestText<ApiListResponse<SecretRecord>>(path, {
      method: "POST",
      body: value
    });
  }
};
