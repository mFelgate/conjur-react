import { apiRequestTextFullResponse, apiRequestText } from "./apiClient";
import type {
  ApiListResponse,
  ListPolicyRequest,
  PolicyRecord,
} from "../types";
const ACCOUNT = localStorage.getItem("conjur.account")?.trim();

export const policyService = {
  list(params: ListPolicyRequest = {}) {
    return apiRequest<ApiListResponse<PolicyRecord>>("/policy", {
      query: params,
    });
  },
  getEffectivePolicy(serviceId: string) {
    const account = localStorage.getItem("conjur.account")?.trim();

    const path = `/policies/${encodeURIComponent(account)}/policy/${encodeURIComponent(serviceId)}`;

    console.log("Effective policy path:", path);

    return apiRequestText(path, {
      headers: {
        accept: "text/plain",
      },
    });
  },
  async loadPolicy(
    policyContent: string,
    branch: string,
    method: string,
    dryRun: boolean = true,
  ) {
    const account = localStorage.getItem("conjur.account")?.trim();
    const path = `/policies/${encodeURIComponent(account)}/policy/${encodeURIComponent(branch)}`;

    console.log("Load policy path:", path);

    const response = await apiRequestTextFullResponse(path, {
      method: method,
      query: {
        dryRun: dryRun,
      },
       headers: {
        accept: "text/plain",
      },
      body: policyContent,
    });

    return { status: response.status, data: JSON.parse(response.data) as PolicyLoadResponse };
  },

  
};
