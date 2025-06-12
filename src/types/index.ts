export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SuperAdmin' | 'Admin' | 'User';
  avatar?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  service: string;
  capital: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalCapital: number;
  activeCompanies: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}