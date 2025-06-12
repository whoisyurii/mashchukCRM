import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Building2, DollarSign } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { Card } from '../components/ui/Card';

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
        {trend && (
          <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-emerald-500/10 rounded-lg">
        {icon}
      </div>
    </div>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-dark-900 border border-dark-700 rounded-lg p-6 h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers.toLocaleString() || '0'}
          icon={<Users className="w-6 h-6 text-emerald-500" />}
          trend="+12% from last month"
        />
        <StatCard
          title="Total Companies"
          value={stats?.totalCompanies.toLocaleString() || '0'}
          icon={<Building2 className="w-6 h-6 text-emerald-500" />}
          trend="+8% from last month"
        />
        <StatCard
          title="Total Capital"
          value={`$${(stats?.totalCapital || 0).toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
          trend="+23% from last month"
        />
        <StatCard
          title="Active Companies"
          value={stats?.activeCompanies.toLocaleString() || '0'}
          icon={<Building2 className="w-6 h-6 text-emerald-500" />}
          trend="+5% from last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              'New company "Tech Solutions Inc." registered',
              'User John Doe updated profile',
              'Company "Global Innovations Ltd." went active',
              'Capital investment of $2.5M recorded',
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm text-gray-300">{activity}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <span className="text-sm font-medium text-white">Add New Company</span>
              <p className="text-xs text-gray-400 mt-1">Register a new company in the system</p>
            </button>
            <button className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <span className="text-sm font-medium text-white">Invite Users</span>
              <p className="text-xs text-gray-400 mt-1">Send invitations to new team members</p>
            </button>
            <button className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <span className="text-sm font-medium text-white">Generate Report</span>
              <p className="text-xs text-gray-400 mt-1">Create a comprehensive business report</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};