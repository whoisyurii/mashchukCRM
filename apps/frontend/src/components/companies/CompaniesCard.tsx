import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";
import { Search } from "lucide-react";

// Local types for this component
export interface CompanyItem {
  id: string;
  name: string;
  service: string;
  capital: number;
  status: "Active";
  logoUrl?: string;
  userId?: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

export interface CompanyPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CompaniesData {
  data: CompanyItem[];
  pagination: CompanyPagination;
}

export interface CompaniesCardProps {
  data?: CompaniesData;
  isLoading: boolean;
  searchInput: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;

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
  handleSort,
  sortBy,
  sortOrder,
  page,
  setPage,
}) => {
  const navigate = useNavigate();

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
        {" "}
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
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => handleSort("service")}
                >
                  Service{" "}
                  {sortBy === "service" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => handleSort("capital")}
                >
                  Capital{" "}
                  {sortBy === "capital" && (sortOrder === "asc" ? "▲" : "▼")}
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
                        {company.owner
                          ? `${company.owner.firstName} ${company.owner.lastName}`
                          : "No owner"}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white">{company.service}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-emerald-400 font-semibold">
                      ${company.capital.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-300">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/companies/${company.id}`)}
                    >
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
          <Pagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            totalItems={data.pagination.total}
            itemsPerPage={data.pagination.limit}
            onPageChange={setPage}
          />
        )}
      </div>
    </Card>
  );
};
