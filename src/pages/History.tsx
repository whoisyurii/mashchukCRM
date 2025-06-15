import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Edit3,
  Trash2,
  Plus,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";

interface HistoryAction {
  id: string;
  action: string;
  type: "company" | "profile" | "user";
  details: string;
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
  timestamp: string;
  target?: string;
}

// Mock data for history actions
const mockHistoryData: HistoryAction[] = [
  {
    id: "1",
    action: "created",
    type: "company",
    details: "Created new company 'Tech Solutions Ltd'",
    user: { firstName: "John", lastName: "Doe", role: "Admin" },
    timestamp: "2024-01-15T10:30:00Z",
    target: "Tech Solutions Ltd",
  },
  {
    id: "2",
    action: "updated",
    type: "profile",
    details: "Updated profile information",
    user: { firstName: "Jane", lastName: "Smith", role: "User" },
    timestamp: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    action: "deleted",
    type: "company",
    details: "Deleted company 'Old Corp'",
    user: { firstName: "Admin", lastName: "User", role: "SuperAdmin" },
    timestamp: "2024-01-14T16:45:00Z",
    target: "Old Corp",
  },
  {
    id: "4",
    action: "created",
    type: "user",
    details: "Created new user account",
    user: { firstName: "Admin", lastName: "User", role: "SuperAdmin" },
    timestamp: "2024-01-14T14:20:00Z",
    target: "new.user@example.com",
  },
  {
    id: "5",
    action: "updated",
    type: "company",
    details: "Updated company information for 'Innovate Inc'",
    user: { firstName: "Sarah", lastName: "Johnson", role: "Admin" },
    timestamp: "2024-01-14T11:30:00Z",
    target: "Innovate Inc",
  },
  {
    id: "6",
    action: "updated",
    type: "profile",
    details: "Changed password",
    user: { firstName: "Mike", lastName: "Wilson", role: "User" },
    timestamp: "2024-01-13T15:10:00Z",
  },
  {
    id: "7",
    action: "created",
    type: "company",
    details: "Created new company 'StartupCo'",
    user: { firstName: "Emily", lastName: "Davis", role: "Admin" },
    timestamp: "2024-01-13T13:45:00Z",
    target: "StartupCo",
  },
  {
    id: "8",
    action: "updated",
    type: "user",
    details: "Updated user role permissions",
    user: { firstName: "Admin", lastName: "User", role: "SuperAdmin" },
    timestamp: "2024-01-12T10:15:00Z",
    target: "user@example.com",
  },
];

const getActionIcon = (type: string, action: string) => {
  if (action === "created")
    return <Plus className="w-4 h-4 text-emerald-500" />;
  if (action === "updated") return <Edit3 className="w-4 h-4 text-blue-500" />;
  if (action === "deleted") return <Trash2 className="w-4 h-4 text-red-500" />;

  switch (type) {
    case "company":
      return <Building2 className="w-4 h-4 text-emerald-500" />;
    case "user":
      return <User className="w-4 h-4 text-blue-500" />;
    default:
      return <Edit3 className="w-4 h-4 text-gray-500" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case "created":
      return "text-emerald-400";
    case "updated":
      return "text-blue-400";
    case "deleted":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const History: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Filter and paginate data
  const filteredData = mockHistoryData.filter((item) => {
    const matchesSearch =
      !search ||
      item.details.toLowerCase().includes(search.toLowerCase()) ||
      item.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      item.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      (item.target && item.target.toLowerCase().includes(search.toLowerCase()));

    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesAction = !actionFilter || item.action === actionFilter;

    return matchesSearch && matchesType && matchesAction;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Actions History</h1>
        <p className="text-gray-400 mt-1">
          View all user and admin actions in the system
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search actions, users, or targets..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="company">Company</option>
                <option value="user">User</option>
                <option value="profile">Profile</option>
              </select>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Actions</option>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {paginatedData.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No actions found</p>
              </div>
            ) : (
              paginatedData.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start gap-4 p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(action.type, action.action)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">
                          <span className={getActionColor(action.action)}>
                            {action.action.charAt(0).toUpperCase() +
                              action.action.slice(1)}
                          </span>{" "}
                          {action.type}
                          {action.target && (
                            <span className="text-emerald-400 ml-1">
                              "{action.target}"
                            </span>
                          )}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {action.details}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>
                            by {action.user.firstName} {action.user.lastName}
                          </span>
                          <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                          <span className="capitalize">{action.user.role}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {formatDate(action.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-dark-700">
              <p className="text-sm text-gray-400">
                Showing {(page - 1) * itemsPerPage + 1} to{" "}
                {Math.min(page * itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} actions
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1
                  )
                  .map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="px-2 py-1 text-gray-400">...</span>
                      )}
                      <Button
                        variant={p === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    </React.Fragment>
                  ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
