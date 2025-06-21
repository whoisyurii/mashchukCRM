import { api } from "./api";
import { DashboardStats } from "../types";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  getAdmins: async () => {
    const response = await api.get("/dashboard/admins");
    return response.data;
  },

  getUserCompanies: async (limit: number = 4) => {
    const response = await api.get(`/dashboard/user-companies?limit=${limit}`);
    return response.data;
  },

  getCompaniesByCapital: async (limit: number = 10) => {
    const response = await api.get(
      `/dashboard/companies-by-capital?limit=${limit}`
    );
    return response.data;
  },

  createUser: async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  updateUser: async (
    id: string,
    userData: {
      email?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
      password?: string;
    }
  ) => {
    // remove password from userData if it's empty (for security)
    const { password, ...dataToUpdate } = userData;
    const finalData = password ? userData : dataToUpdate;

    const response = await api.put(`/users/${id}`, finalData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
