import React, { useState, useEffect } from "react";
import { Search, Calendar } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Pagination } from "../components/ui/Pagination";
import { getActionIcon, formatDate } from "../utils/action-helpers";
import { useHistoryQuery } from "../hooks/useHistoryQuery";

export const History: React.FC = () => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

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
  } = useHistoryQuery({
    page,
    search,
    typeFilter,
    actionFilter,
    limit: itemsPerPage,
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
        </div>{" "}
        <div className="space-y-3">
          {historyActions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No actions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Target
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyActions.map((action) => (
                    <tr
                      key={action.id}
                      className="border-b border-dark-800 hover:bg-dark-800/50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getActionIcon(action.type, action.action)}
                          </div>
                          <div>
                            <span className="font-medium text-white capitalize">
                              {action.action}
                            </span>
                            {action.details && (
                              <p className="text-xs text-gray-400 mt-1 truncate w-48 max-md:w-24">
                                {action.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={
                            action.type === "company"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : action.type === "user"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          }
                        >
                          {action.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {action.target || "-"}
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span className="text-white">
                            {action.user.firstName} {action.user.lastName}
                          </span>
                          <p className="text-xs text-gray-400 capitalize">
                            {action.user.role}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300 text-sm">
                        {formatDate(action.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>{" "}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
};
