import { useQuery } from "@tanstack/react-query";
import { companyService } from "../services/companyService";

interface UseCompaniesQueryProps {
  page: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  capitalFilter?: { min: string; max: string };
  limit?: number;
  enabled?: boolean;
}

export const useCompaniesQuery = ({
  page,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  capitalFilter = { min: "", max: "" },
  limit = 5,
  enabled = true,
}: UseCompaniesQueryProps) => {
  return useQuery({
    queryKey: ["companies", page, search, sortBy, sortOrder, capitalFilter],
    queryFn: async () => {
      // console.log("Calling companyService.getCompanies...");
      const result = await companyService.getCompanies({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        minCapital: capitalFilter.min || undefined,
        maxCapital: capitalFilter.max || undefined,
      });
      // console.log("companyService.getCompanies result:", result);
      return result;
    },
    enabled,
  });
};
