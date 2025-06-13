import React from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// types for company data and pagination
export interface Company {
  id: string;
  name: string;
  service: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CompaniesData {
  data: Company[];
  pagination: Pagination;
}

export interface CompaniesCardProps {
  data?: CompaniesData;
  isLoading: boolean;
  searchInput: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  handleSort: (column: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  setPage: (v: number) => void;
}

export const CompaniesCard: React.FC<CompaniesCardProps> = ({
  data,
  isLoading,
  searchInput,
  handleSearch,
  statusFilter,
  setStatusFilter,
  handleSort,
  sortBy,
  sortOrder,
  page,
  setPage,
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
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
    <Card>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies"
                value={searchInput}
                onChange={handleSearch}
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
                  Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => handleSort("createdAt")}
                >
                  Created At{" "}
                  {sortBy === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
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

        {/* pagination handling block */}
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
              {/* previous page button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {/* total number of pages */}
              {[...Array(Math.min(5, data.pagination.totalPages))].map(
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    // quick page setter
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "primary" : "outline"}
                      size="icon"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}
              {/* next page */}
              <Button
                variant="outline"
                size="icon"
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
  );
};
