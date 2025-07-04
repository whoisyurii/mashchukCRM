import { useNavigate } from "react-router-dom";
import { Users, Building2, DollarSign } from "lucide-react";
import { Card } from "../components/ui/Card";
import { StatsCard } from "../components/ui/StatsCard";
import { DashboardSkeleton } from "../components/ui/DashboardSkeleton";
import { HistorySkeleton } from "../components/ui/HistorySkeleton";
import { useAuth } from "../contexts/AuthContext";
import { DashboardCompaniesList } from "../components/companies/dashboard/DashboardCompaniesList";
import CompaniesPriceChart from "../components/companies/dashboard/CompaniesPriceChart";
import { useDashboardQueries } from "../hooks/useDashboardQueries";
// helpers
import {
  getActionIcon,
  getActionColor,
  formatTimeAgo,
} from "../utils/action-helpers";
import { shortenNumber } from "../utils/shortener-helpers";
//

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    stats,
    admins,
    recentActions,
    companiesByCapital,
    isHistoryLoading,
    isCompaniesByCapitalLoading,
    isLoading,
  } = useDashboardQueries();
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.firstName}.</p>
        </div>
        {/* Stats Section for admin and superadmin */}
        {(user?.role === "SuperAdmin" || user?.role === "Admin") && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers?.toLocaleString() || "0"}
              icon={<Users className="w-6 h-6 text-emerald-500" />}
              onClick={() => navigate("/users")}
            />
            {user?.role === "SuperAdmin" && (
              <StatsCard
                title="Administrators"
                value={admins?.length?.toString() || "0"}
                icon={<Users className="w-6 h-6 text-emerald-500" />}
                onClick={() => navigate("/users")}
              />
            )}
            {user?.role === "SuperAdmin" && (
              <StatsCard
                title="Total Companies"
                value={stats?.totalCompanies?.toLocaleString() || "0"}
                icon={<Building2 className="w-6 h-6 text-emerald-500" />}
              />
            )}
            {user?.role === "SuperAdmin" && (
              <StatsCard
                title="Total Capital"
                value={`$${shortenNumber(
                  stats?.totalCapital || 0
                ).toLocaleString()}`}
                icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
              />
            )}
          </div>
        )}
        {/* SuperAdmin/Admin: Recent Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(user?.role === "SuperAdmin" || user?.role === "Admin") && (
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Actions History
                </h3>
                <span
                  className="cursor-pointer hover:text-emerald-300 text-emerald-400  text-xs"
                  onClick={() => navigate("/history")}
                >
                  View all &rarr;
                </span>
              </div>
              <div className="space-y-3">
                {isHistoryLoading ? (
                  <HistorySkeleton />
                ) : recentActions.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">No recent actions</p>
                  </div>
                ) : (
                  recentActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                    >
                      <div className="flex items-start gap-3 ">
                        <div className="flex-shrink-0 mt-0.5 ">
                          {getActionIcon(action.type, action.action)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-white truncate block max-md:max-w-28">
                            {action.action.charAt(0).toUpperCase() +
                              action.action.slice(1)}
                            {action.type}
                            {action.target && (
                              <span className="text-primary-400 ml-1">
                                "{action.target}"
                              </span>
                            )}
                          </span>
                          <p className="text-xs text-gray-400">
                            by {action.user.firstName} {action.user.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {formatTimeAgo(action.createdAt)}
                        </p>
                        <div
                          className={`inline-block w-2 h-2 rounded-full ${getActionColor(
                            action.action
                          )}`}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          {/* price chart for user and admin */}
          {(user?.role === "User" || user?.role === "Admin") && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Companies Price Chart
              </h3>
              <CompaniesPriceChart />
            </Card>
          )}
          {/* companies by capital card */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {user?.role === "SuperAdmin" ? "Top Companies" : "My Companies"}
              </h3>
              <span
                className="cursor-pointer hover:text-emerald-300 text-emerald-400  text-xs"
                onClick={() => navigate("/companies")}
              >
                View all &rarr;
              </span>
            </div>
            <DashboardCompaniesList
              companies={companiesByCapital}
              isLoading={isCompaniesByCapitalLoading}
              emptyText={
                user?.role === "SuperAdmin"
                  ? "No companies found"
                  : "You don't have any companies yet"
              }
              showOwner={user?.role === "SuperAdmin"}
              // onCompanyClick={() => navigate("/companies")}
            />
          </Card>
        </div>
      </div>
    </>
  );
};
