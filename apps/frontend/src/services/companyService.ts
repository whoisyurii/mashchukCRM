import { api } from "./api";
import { Company, PaginatedResponse } from "../types";

export const companyService = {
  getCompanies: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    minCapital?: string;
    maxCapital?: string;
    createdAfter?: string;
    createdBefore?: string;
  }): Promise<PaginatedResponse<Company>> => {
    const response = await api.get("/companies", { params });
    return response.data;
  },

  getCompany: async (id: string): Promise<Company> => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (
    data: Omit<Company, "id" | "createdAt"> | FormData
  ): Promise<Company> => {
    const config = data instanceof FormData ? {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    } : {};
    
    const response = await api.post("/companies", data, config);
    return response.data;
  },

  updateCompany: async (
    id: string,
    data: Partial<Company>
  ): Promise<Company> => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },

  deleteCompany: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },

  uploadLogo: async (
    id: string,
    file: File
  ): Promise<{ logoUrl: string; company: Company }> => {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await api.post(`/companies/${id}/logo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteLogo: async (id: string): Promise<{ company: Company }> => {
    const response = await api.delete(`/companies/${id}/logo`);
    return response.data;
  },
};
