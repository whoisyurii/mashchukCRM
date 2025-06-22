import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ArrowLeft, Upload, Trash2, Edit2, Save, X } from "lucide-react";
import { companyService } from "../../services/companyService";
import { useAuth } from "../../contexts/AuthContext";
import { Company, ActionHistory } from "../../types";
import CompanyLocationDisplay from "./CompanyLocationDisplay";
import toast from "react-hot-toast";

export const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    service: "",
    capital: 0,
  });
  // Fetch company details
  const { data: company, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => companyService.getCompany(id!),
    enabled: !!id,
  });

  // Update edit form when company data loads
  useEffect(() => {
    if (company) {
      setEditForm({
        name: company.name,
        service: company.service,
        capital: company.capital,
      });
    }
  }, [company]);

  // Check if user can edit this company
  const canEdit =
    user &&
    company &&
    (user.role === "SuperAdmin" ||
      user.role === "Admin" ||
      (company.userId && company.userId === user.id));
  // Upload logo mutation
  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => companyService.uploadLogo(id!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      toast.success("Logo uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload logo");
    },
  });

  // Delete logo mutation
  const deleteLogoMutation = useMutation({
    mutationFn: () => companyService.deleteLogo(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      toast.success("Logo deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete logo");
    },
  });

  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: (data: Partial<Company>) =>
      companyService.updateCompany(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      setIsEditing(false);
      toast.success("Company updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update company");
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadLogoMutation.mutate(file);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyMutation.mutate(editForm);
  };

  const handleEditCancel = () => {
    if (company) {
      setEditForm({
        name: company.name,
        service: company.service,
        capital: company.capital,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-400">Company not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/companies")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
          <h1 className="text-2xl font-bold text-white">{company.name}</h1>
          <Badge variant="success">{company.status}</Badge>
        </div>
        {canEdit && !isEditing && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Company
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Info */}
        <div className="lg:col-span-1">
          <Card>
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">
                Company Information
              </h2>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Service
                    </label>
                    <input
                      type="text"
                      value={editForm.service}
                      onChange={(e) =>
                        setEditForm({ ...editForm, service: e.target.value })
                      }
                      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Capital
                    </label>
                    <input
                      type="number"
                      value={editForm.capital}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          capital: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={updateCompanyMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleEditCancel}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Company Name
                    </label>
                    <p className="text-white text-lg">{company.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Service
                    </label>
                    <p className="text-white">{company.service}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Capital
                    </label>
                    <p className="text-emerald-400 text-lg font-semibold">
                      ${company.capital.toLocaleString()}
                    </p>
                  </div>
                  {company.owner && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Owner
                      </label>
                      <p className="text-white">
                        {company.owner.firstName} {company.owner.lastName} (
                        {company.owner.email})
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Created At
                    </label>
                    <p className="text-gray-300">
                      {new Date(company.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Company Location (center column) */}
        <div>
          <CompanyLocationDisplay
            companyName={company.name}
            address={company.address}
            latitude={company.latitude}
            longitude={company.longitude}
          />
        </div>

        {/* Logo Section + Action History */}
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Company Logo</h2>

              <div className="flex flex-col items-center space-y-4">
                {company.logoUrl ? (
                  <div className="relative">
                    <img
                      src={`http://localhost:3001/public/${company.logoUrl}`}
                      alt={`${company.name} logo`}
                      className="w-32 h-32 object-cover rounded-lg border border-dark-600"
                    />
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700"
                        onClick={() => deleteLogoMutation.mutate()}
                        loading={deleteLogoMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-dark-700 border-2 border-dashed border-dark-600 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm text-center">
                      No logo
                    </span>
                  </div>
                )}

                {canEdit && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      loading={uploadLogoMutation.isPending}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {company.logoUrl ? "Change Logo" : "Upload Logo"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">
                Action History
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {company.actionHistory && company.actionHistory.length > 0 ? (
                  company.actionHistory.map((action: ActionHistory) => (
                    <div
                      key={action.id}
                      className="p-3 bg-dark-800 rounded-lg border border-dark-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            {action.details}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            by {action.user.firstName} {action.user.lastName}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(action.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No action history available
                  </p>
                )}              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
