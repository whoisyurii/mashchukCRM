import { useQuery } from "@tanstack/react-query";
import { companyService } from "../services/companyService";

interface UseCompaniesQueryProps {
  page: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  statusFilter?: string;
  limit?: number;
  enabled?: boolean;
}

export const useCompaniesQuery = ({
  page,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  statusFilter = "",
  limit = 5,
  enabled = true,
}: UseCompaniesQueryProps) => {
  return useQuery({
    queryKey: ["companies", page, search, sortBy, sortOrder, statusFilter],
    queryFn: () =>
      companyService.getCompanies({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        status: statusFilter || undefined,
      }),
    enabled,
  });
};
