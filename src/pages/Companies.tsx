import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { companyService } from "../services/companyService";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export const Companies: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["companies", page, search, sortBy, sortOrder, statusFilter],
    queryFn: () =>
      companyService.getCompanies({
        page,
        limit: 10,
        search,
        sortBy,
        sortOrder,
        status: statusFilter,
      }),
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-dark-700 rounded w-48" />
          <div className="h-10 bg-dark-700 rounded w-32" />
        </div>
        <Card>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-dark-800 rounded" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Companies</h1>
          <p className="text-gray-400 mt-1">Manage your company portfolio</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Company
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Status
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created At
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-dark-800 hover:bg-dark-800/50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-white">
                          {company.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {company.service}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          company.status === "Active" ? "success" : "warning"
                        }
                      >
                        {company.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.pagination && (
            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
              <div className="text-sm text-gray-400">
                Showing {(data.pagination.page - 1) * data.pagination.limit + 1}{" "}
                to{" "}
                {Math.min(
                  data.pagination.page * data.pagination.limit,
                  data.pagination.total
                )}{" "}
                of {data.pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {[...Array(Math.min(5, data.pagination.totalPages))].map(
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.pagination.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
