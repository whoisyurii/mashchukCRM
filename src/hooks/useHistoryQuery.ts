import { useQuery } from "@tanstack/react-query";
import { historyService } from "../services/historyService";

interface UseHistoryQueryProps {
  page: number;
  search?: string;
  typeFilter?: string;
  actionFilter?: string;
  limit?: number;
}

export const useHistoryQuery = ({
  page,
  search = "",
  typeFilter = "",
  actionFilter = "",
  limit = 10,
}: UseHistoryQueryProps) => {
  return useQuery({
    queryKey: ["history", page, search, typeFilter, actionFilter],
    queryFn: () =>
      historyService.getHistory({
        page,
        limit,
        search,
        type: typeFilter || undefined,
        action: actionFilter || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });
};
