import { api } from "./api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SuperAdmin" | "Admin" | "User";
  createdAt: string;
}

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (
    userId: string,
    userData: {
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    }
  ): Promise<User> => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
};
