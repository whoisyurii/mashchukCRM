import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { dashboardService } from "../../services/dashboardService";
import { companyService } from "../../services/companyService";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAdmin?: any;
}

export const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  editingAdmin,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    companyIds: [] as string[],
  });
  const queryClient = useQueryClient();

  // Fill form when editing
  useEffect(() => {
    if (editingAdmin) {
      setFormData({
        email: editingAdmin.email || "",
        password: "", // Password is always empty for security
        firstName: editingAdmin.firstName || "",
        lastName: editingAdmin.lastName || "",
        companyIds: editingAdmin.companyIds || [],
      });
    } else {
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        companyIds: [],
      });
    }
  }, [editingAdmin, isOpen]);
  // Fetch companies for selection
  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getCompanies({ page: 1, limit: 100 }),
  });

  const companies = companiesData?.data || [];
  const createAdminMutation = useMutation({
    mutationFn: editingAdmin
      ? (data: any) => dashboardService.updateAdmin(editingAdmin.id, data)
      : dashboardService.createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-admins"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      onClose();
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        companyIds: [],
      });
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // For editing, don't send password if it's empty
    const submitData =
      editingAdmin && !formData.password
        ? { ...formData, password: undefined }
        : formData;

    createAdminMutation.mutate(submitData);
  };
  const handleCompanyToggle = (companyId: string) => {
    setFormData((prev) => ({
      ...prev,
      companyIds: prev.companyIds.includes(companyId)
        ? prev.companyIds.filter((id) => id !== companyId)
        : [...prev.companyIds, companyId],
    }));
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-dark-900 rounded-lg p-6 w-full max-w-md modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {editingAdmin ? "Edit Admin" : "Add New Admin"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              placeholder="admin@example.com"
            />
          </div>{" "}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password {editingAdmin ? "(leave empty to keep current)" : "*"}
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required={!editingAdmin}
              placeholder={
                editingAdmin ? "Enter new password" : "Enter password"
              }
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              First Name *
            </label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Last Name *
            </label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
              placeholder="Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Assign Companies (Optional)
            </label>
            <div className="max-h-32 overflow-y-auto border border-dark-600 rounded-md p-2 space-y-1 bg-dark-800">
              {companies.map((company: any) => (
                <label
                  key={company.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.companyIds.includes(company.id)}
                    onChange={() => handleCompanyToggle(company.id)}
                    className="rounded border-gray-600 bg-dark-700"
                  />
                  <span className="text-sm text-gray-200">{company.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={createAdminMutation.isPending}
            >
              Cancel
            </Button>{" "}
            <Button
              type="submit"
              className="flex-1"
              disabled={createAdminMutation.isPending}
            >
              {createAdminMutation.isPending
                ? editingAdmin
                  ? "Updating..."
                  : "Creating..."
                : editingAdmin
                ? "Update Admin"
                : "Create Admin"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
