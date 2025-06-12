import { api } from './api';
import { Company, PaginatedResponse } from '../types';

export const companyService = {
  getCompanies: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
  }): Promise<PaginatedResponse<Company>> => {
    const response = await api.get('/companies', { params });
    return response.data;
  },

  getCompany: async (id: string): Promise<Company> => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (data: Omit<Company, 'id' | 'createdAt'>): Promise<Company> => {
    const response = await api.post('/companies', data);
    return response.data;
  },

  updateCompany: async (id: string, data: Partial<Company>): Promise<Company> => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },

  deleteCompany: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};