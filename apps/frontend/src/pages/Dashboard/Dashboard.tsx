import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Building2, DollarSign } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { StatsCard } from "../../components/ui/StatsCard";
import { DashboardSkeleton } from "../../components/ui/DashboardSkeleton";
import { HistorySkeleton } from "../../components/ui/HistorySkeleton";
import { CompanyModal } from "../Companies/CompanyModal";
import { useAuth } from "../../contexts/AuthContext";
// helpers
import {
  getActionIcon,
  getActionColor,
  formatTimeAgo,
} from "../../utils/action-helpers";
import { useDashboardQueries } from "../../hooks/useDashboardQueries";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  // Fetch dashboard data
  const {
    stats,
    admins,
    userCompanies,
    recentActions,
    isHistoryLoading,
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
          <p className="text-gray-400 mt-1">
            Welcome back, {user?.role} {user?.firstName}.
          </p>
        </div>{" "}
        {/* Stats Section */}
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
            <StatsCard
              title="Total Companies"
              value={stats?.totalCompanies?.toLocaleString() || "0"}
              icon={<Building2 className="w-6 h-6 text-emerald-500" />}
            />
            <StatsCard
              title="Total Capital"
              value={`$${(stats?.totalCapital || 0).toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
            />
          </div>
        )}{" "}
        {user?.role === "User" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="My Companies"
              value={stats?.totalCompanies?.toLocaleString() || "0"}
              icon={<Building2 className="w-6 h-6 text-emerald-500" />}
            />
            <StatsCard
              title="Total Capital"
              value={`$${(stats?.totalCapital || 0).toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
            />
            <StatsCard
              title="Active Companies"
              value={stats?.activeCompanies?.toLocaleString() || "0"}
              icon={<Building2 className="w-6 h-6 text-emerald-500" />}
            />
          </div>
        )}
        {/* SuperAdmin/Admin: Recent Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(user?.role === "SuperAdmin" || user?.role === "Admin") && (
            <Card>
              {" "}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Actions History
                </h3>
                <span
                  className="cursor-pointer hover:text-emerald-300 text-emerald-400  text-xs"
                  onClick={() => navigate("/history")}
                >
                  View all →
                </span>
              </div>{" "}
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
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getActionIcon(action.type, action.action)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-white truncate block max-md:max-w-28">
                            {action.action.charAt(0).toUpperCase() +
                              action.action.slice(1)}{" "}
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

          {/* User: Companies List */}
          {user?.role === "User" && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                My Companies
              </h3>
              <div className="space-y-3">
                {userCompanies?.map(
                  (company: {
                    id: string;
                    name: string;
                    service: string;
                    capital: number;
                    status: string;
                  }) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                    >
                      <div>
                        <span className="text-sm font-medium text-white">
                          {company.name}
                        </span>
                        <p className="text-xs text-gray-400">
                          {company.service}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary-400">
                          ${company.capital.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {company.status}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          )}

          {/* User: Price Chart Placeholder */}
          {user?.role === "User" && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Company Price Chart
              </h3>
              <div className="h-64 flex items-center justify-center bg-dark-800 rounded-lg">
                <p className="text-gray-400">Chart will be implemented here</p>
              </div>
            </Card>
          )}

          {/* Quick Actions for Admin/SuperAdmin */}
          {(user?.role === "SuperAdmin" || user?.role === "Admin") && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                  onClick={() => setShowModal(true)}
                >
                  <span className="text-sm font-medium text-white">
                    Add New Company
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Register a new company in the system
                  </p>
                </button>
                <button className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-white">
                    Invite Users
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Send invitations to new team members
                  </p>
                </button>
                <button className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-white">
                    Generate Report
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Create a comprehensive business report
                  </p>
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* modal is out of overall flow */}
      <CompanyModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
