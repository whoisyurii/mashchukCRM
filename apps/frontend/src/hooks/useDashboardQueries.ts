import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { historyService } from "../services/historyService";
import { useAuth } from "../contexts/AuthContext";

export const useDashboardQueries = () => {
  const { user } = useAuth();

  const statsQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });

  const adminsQuery = useQuery({
    queryKey: ["dashboard-admins"],
    queryFn: dashboardService.getAdmins,
    enabled: user?.role === "SuperAdmin",
  });    const userCompaniesQuery = useQuery({
    queryKey: ["dashboard-user-companies"],
    queryFn: () => dashboardService.getUserCompanies(4),
    enabled: user?.role === "User" || user?.role === "Admin",
  });

  const recentHistoryQuery = useQuery({
    queryKey: ["dashboard-recent-actions"],
    queryFn: () =>
      historyService.getHistory({
        page: 1,
        limit: 4,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    enabled: user?.role === "SuperAdmin" || user?.role === "Admin",
  });
  const companiesByCapitalQuery = useQuery({
    queryKey: ["dashboard-companies-by-capital"],
    queryFn: () => dashboardService.getCompaniesByCapital(4), // left 4 to keep dashboard non-scrollable
    enabled: user?.role === "SuperAdmin",
  });
  return {
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    admins: adminsQuery.data,
    isAdminsLoading: adminsQuery.isLoading,
    userCompanies: userCompaniesQuery.data,
    isCompaniesLoading: userCompaniesQuery.isLoading,
    recentActions: recentHistoryQuery.data?.data || [],
    isHistoryLoading: recentHistoryQuery.isLoading,
    companiesByCapital: user?.role === "SuperAdmin" 
      ? (companiesByCapitalQuery.data || [])
      : (userCompaniesQuery.data || []),
    isCompaniesByCapitalLoading: user?.role === "SuperAdmin" 
      ? companiesByCapitalQuery.isLoading
      : userCompaniesQuery.isLoading,
    isLoading:
      statsQuery.isLoading ||
      adminsQuery.isLoading ||
      userCompaniesQuery.isLoading,
  };
};
