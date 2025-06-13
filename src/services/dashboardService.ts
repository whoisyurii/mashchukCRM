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

  getUserCompanies: async () => {
    const response = await api.get("/dashboard/user-companies");
    return response.data;
  },

  createAdmin: async (adminData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    const response = await api.post("/dashboard/admins", adminData);
    return response.data;
  },

  updateAdmin: async (
    id: string,
    adminData: { email: string; firstName: string; lastName: string }
  ) => {
    const response = await api.put(`/dashboard/admins/${id}`, adminData);
    return response.data;
  },

  deleteAdmin: async (id: string) => {
    const response = await api.delete(`/dashboard/admins/${id}`);
    return response.data;
  },
};
