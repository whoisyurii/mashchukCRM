import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { dashboardService } from "../../services/dashboardService";
import { companyService } from "../../services/companyService";
import { useAuth } from "../../contexts/AuthContext";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: any;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  editingUser,
}) => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "User",
    companyIds: [] as string[],
  });

  // Fill form when editing
  useEffect(() => {
    if (editingUser) {
      setFormData({
        email: editingUser.email || "",
        password: "", // Password is always empty for security
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        role: editingUser.role || "User",
        companyIds: editingUser.companyIds || [],
      });
    } else {
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "User",
        companyIds: [],
      });
    }
  }, [editingUser, isOpen]);

  // Fetch companies for selection
  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getCompanies({ page: 1, limit: 100 }),
    enabled: isOpen,
  });
  const addUserMutation = useMutation({
    mutationFn: (userData: typeof formData) => {
      if (editingUser) {
        return dashboardService.updateUser(editingUser.id, userData);
      }
      return dashboardService.createUser(userData);
    },
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUserMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (companyId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      companyIds: checked
        ? [...prev.companyIds, companyId]
        : prev.companyIds.filter((id) => id !== companyId),
    }));
  };

  // Determine available roles based on current user's role
  const getAvailableRoles = () => {
    if (currentUser?.role === "SuperAdmin") {
      return [
        { value: "SuperAdmin", label: "Super Admin" },
        { value: "Admin", label: "Admin" },
        { value: "User", label: "User" },
      ];
    } else if (currentUser?.role === "Admin") {
      return [{ value: "User", label: "User" }];
    }
    return [];
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 border border-dark-700 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">
          {editingUser ? "Edit User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              First Name
            </label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Last Name
            </label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-dark-800 text-white p-2"
              required
            >
              {getAvailableRoles().map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required={!editingUser}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Assign Companies (Optional)
            </label>{" "}
            <div className="max-h-32 overflow-y-auto border border-gray-700 rounded-md p-2 bg-dark-800">
              {companiesData?.data?.map((company) => (
                <label
                  key={company.id}
                  className="flex items-center space-x-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={formData.companyIds.includes(company.id)}
                    onChange={(e) =>
                      handleCompanyChange(company.id, e.target.checked)
                    }
                    className="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-white">{company.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addUserMutation.isPending}
              className="flex-1"
            >
              {addUserMutation.isPending
                ? "Saving..."
                : editingUser
                ? "Update User"
                : "Add User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
