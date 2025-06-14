import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import { dashboardService } from "../services/dashboardService";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CompanyModal } from "./Companies/CompanyModal";
import { AddAdminModal } from "./Dashboard/AddAdminModal";
import { useAuth } from "../contexts/AuthContext";

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}> = ({ title, value, icon, trend }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {/* {trend && (
          <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </p>
        )} */}
      </div>
      <div className="p-3 bg-emerald-500/10 rounded-lg">{icon}</div>
    </div>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);

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

  const deleteAdminMutation = useMutation({
    mutationFn: dashboardService.deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-admins"] });
    },
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

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      deleteAdminMutation.mutate(adminId);
    }
  };

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
              // trend="+12% from last month"
            />
            <StatCard
              title="Total Companies"
              value={stats?.totalCompanies?.toLocaleString() || "0"}
              icon={<Building2 className="w-6 h-6 text-emerald-500" />}
              // trend="+8% from last month"
            />
            <StatCard
              title="Total Capital"
              value={`$${(stats?.totalCapital || 0).toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
              // trend="+23% from last month"
            />
            <StatCard
              title="Active Companies"
              value={stats?.activeCompanies?.toLocaleString() || "0"}
              icon={<Building2 className="w-6 h-6 text-emerald-500" />}
              // trend="+5% from last month"
            />
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
          {/* SuperAdmin: Admins Management */}
          {user?.role === "SuperAdmin" && (
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Administrators
                </h3>
                <Button size="sm" onClick={() => setShowAdminModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Button>
              </div>
              <div className="space-y-3">
                {admins?.map((admin: any) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                  >
                    <div>
                      <span className="text-sm font-medium text-white">
                        {admin.firstName} {admin.lastName}
                      </span>
                      <p className="text-xs text-gray-400">{admin.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingAdmin(admin);
                          setShowAdminModal(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAdmin(admin.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
                {userCompanies?.map((company: any) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                  >
                    <div>
                      <span className="text-sm font-medium text-white">
                        {company.name}
                      </span>
                      <p className="text-xs text-gray-400">{company.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-emerald-400">
                        ${company.capital.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">{company.status}</p>
                    </div>
                  </div>
                ))}
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
      <AddAdminModal
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false);
          setEditingAdmin(null);
        }}
        editingAdmin={editingAdmin}
      />
    </>
  );
};
