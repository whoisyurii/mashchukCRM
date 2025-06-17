export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SuperAdmin" | "Admin" | "User";
  avatar?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  service: string;
  capital: number;
  status: "Active";
  logoUrl?: string;
  userId?: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  actionHistory?: ActionHistory[];
  createdAt: string;
}

export interface ActionHistory {
  id: string;
  action: string;
  type: string;
  details: string;
  target?: string;
  userId: string;
  companyId?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  company?: {
    id: string;
    name: string;
  };
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
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
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
