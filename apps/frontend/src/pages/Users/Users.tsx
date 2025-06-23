import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Pagination } from "../../components/ui/Pagination";
import { useUsersQuery, useUserOperations } from "../../hooks/useUsersQueries";
import { getRoleBadgeColor } from "../../utils/user-helpers";
import { filterUsers, paginateArray } from "../../utils/filtering-helpers";

export const Users: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { data: users = [], isLoading } = useUsersQuery();
  const { deleteUser, isDeleting } = useUserOperations();

  // Filter and paginate users
  const filteredUsers = filterUsers(users, searchTerm, roleFilter);
  const { paginatedItems: paginatedUsers, totalPages } = paginateArray(
    filteredUsers,
    currentPage,
    itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-dark-800 rounded w-48"></div>
        <div className="bg-dark-900 border border-dark-700 rounded-lg p-6 h-96"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <p className="text-gray-400 mt-1">
              Manage users and their permissions
            </p>
          </div>{" "}
          <Button onClick={() => navigate("/users/add-new")}>
            <Plus className="w-4 h-4 mr-2 max-md:mr-0" />
            <span className="max-md:hidden">Add User</span>
          </Button>
        </div>

        <Card>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="SuperAdmin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Created
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-dark-800 hover:bg-dark-800/50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-medium text-white">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{user.email}</td>
                    <td className="py-4 px-4">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      {" "}
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteUser(user)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>{" "}
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />{" "}
        </Card>
      </div>
    </>
  );
};
