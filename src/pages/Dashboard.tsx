import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Users, Building2, DollarSign } from "lucide-react";
import { dashboardService } from "../services/dashboardService";
import { Card } from "../components/ui/Card";
import { CompanyModal } from "./Companies/CompanyModal";
import { useAuth } from "../contexts/AuthContext";

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  onClick?: () => void;
}> = ({ title, value, icon, onClick }) => (
  <Card
    className={
      onClick ? "cursor-pointer hover:bg-dark-800 transition-colors" : ""
    }
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className="p-3 bg-emerald-500/10 rounded-lg">{icon}</div>
    </div>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Mock data for recent actions
  const recentActions = [
    {
      id: "1",
      action: "User created new company",
      user: "John Doe",
      target: "Tech Solutions Inc.",
      timestamp: "2 hours ago",
      type: "create",
    },
    {
      id: "2",
      action: "Admin updated user profile",
      user: "Jane Smith",
      target: "Bob Johnson",
      timestamp: "4 hours ago",
      type: "update",
    },
    {
      id: "3",
      action: "SuperAdmin added new admin",
      user: "Admin System",
      target: "Alice Wilson",
      timestamp: "1 day ago",
      type: "create",
    },
    {
      id: "4",
      action: "User updated company capital",
      user: "Mike Brown",
      target: "Apex Dynamics Co.",
      timestamp: "2 days ago",
      type: "update",
    },
  ];

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });

  const { data: admins, isLoading: adminsLoading } = useQuery({
    queryKey: ["dashboard-admins"],
    queryFn: dashboardService.getAdmins,
    enabled: user?.role === "SuperAdmin",
  });

  const { data: userCompanies, isLoading: companiesLoading } = useQuery({
    queryKey: ["dashboard-user-companies"],
    queryFn: dashboardService.getUserCompanies,
    enabled: user?.role === "User",
  });

  if (statsLoading || adminsLoading || companiesLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-dark-900 border border-dark-700 rounded-lg p-6 h-24"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>

        {/* Stats Section */}
        {(user?.role === "SuperAdmin" || user?.role === "Admin") && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats?.totalUsers?.toLocaleString() || "0"}
              icon={<Users className="w-6 h-6 text-emerald-500" />}
            />
            <StatCard
              title="Total Companies"
              value={stats?.totalCompanies?.toLocaleString() || "0"}
              icon={<Building2 className="w-6 h-6 text-emerald-500" />}
            />
            <StatCard
              title="Total Capital"
              value={`$${(stats?.totalCapital || 0).toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
            />
            {user?.role === "SuperAdmin" && (
              <StatCard
                title="Administrators"
                value={admins?.length?.toString() || "0"}
                icon={<Users className="w-6 h-6 text-emerald-500" />}
                onClick={() => navigate("/users")}
              />
            )}
          </div>
        )}

        {user?.role === "User" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="My Companies"
              value={stats?.totalCompanies?.toLocaleString() || "0"}
              icon={<Building2 className="w-6 h-6 text-emerald-500" />}
            />
            <StatCard
              title="Total Capital"
              value={`$${(stats?.totalCapital || 0).toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
            />
            <StatCard
              title="Active Companies"
              value={stats?.activeCompanies?.toLocaleString() || "0"}
              icon={<Building2 className="w-6 h-6 text-emerald-500" />}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SuperAdmin/Admin: Recent Actions */}
          {(user?.role === "SuperAdmin" || user?.role === "Admin") && (
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Recent Actions
                </h3>
              </div>
              <div className="space-y-3">
                {recentActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                  >
                    <div>
                      <span className="text-sm font-medium text-white">
                        {action.action}
                      </span>
                      <p className="text-xs text-gray-400">
                        by {action.user} → {action.target}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {action.timestamp}
                      </p>
                      <div
                        className={`inline-block w-2 h-2 rounded-full ${
                          action.type === "create"
                            ? "bg-emerald-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
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
                        <p className="text-sm text-emerald-400">
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
