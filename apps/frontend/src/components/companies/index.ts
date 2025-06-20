export { CompaniesCard } from "./CompaniesCard";
export { CompanyDetail } from "./CompanyDetail";

// Types
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
  createdAt: string;
}

export interface PaginatedCompanies {
  data: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
