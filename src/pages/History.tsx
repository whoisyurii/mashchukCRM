import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
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
import { historyService, HistoryAction } from "../services/historyService";

const getActionIcon = (type: string, action: string) => {
  if (action === "created") {
    switch (type) {
      case "company":
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case "user":
        return <User className="w-4 h-4 text-emerald-400" />;
      default:
        return <Plus className="w-4 h-4 text-emerald-400" />;
    }
  } else if (action === "updated") {
    return <Edit3 className="w-4 h-4 text-blue-400" />;
  } else if (action === "deleted") {
    return <Trash2 className="w-4 h-4 text-red-400" />;
  } else {
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
      setPage(1); // Reset to first page when search changes
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, actionFilter]);

  const {
    data: historyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["history", page, search, typeFilter, actionFilter],
    queryFn: () =>
      historyService.getHistory({
        page,
        limit: itemsPerPage,
        search,
        type: typeFilter || undefined,
        action: actionFilter || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-dark-800 rounded w-1/3"></div>
        <div className="h-4 bg-dark-800 rounded w-2/3"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-dark-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Error loading history</p>
        <p className="text-red-400 text-sm mt-2">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  const { data: historyActions = [], pagination } = historyData || {
    data: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  };

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
            {historyActions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No actions found</p>
              </div>
            ) : (
              historyActions.map((action) => (
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
                          {formatDate(action.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-dark-700">
              <p className="text-sm text-gray-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} actions
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPage(pagination.page - 1)}
                >
                  Previous
                </Button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === pagination.totalPages ||
                      Math.abs(p - pagination.page) <= 1
                  )
                  .map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="text-gray-400 px-2">...</span>
                      )}{" "}
                      <Button
                        variant={p === pagination.page ? "primary" : "outline"}
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
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
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
