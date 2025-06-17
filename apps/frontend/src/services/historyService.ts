import { api } from "./api";

export interface HistoryAction {
  id: string;
  action: string;
  type: "company" | "profile" | "user";
  details: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  target?: string;
  createdAt: string;
}

export interface PaginatedHistoryResponse {
  data: HistoryAction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const historyService = {
  getHistory: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    action?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedHistoryResponse> => {
    const response = await api.get("/history", { params });
    return response.data;
  },

  getHistoryEntry: async (id: string): Promise<HistoryAction> => {
    const response = await api.get(`/history/${id}`);
    return response.data;
  },
};
