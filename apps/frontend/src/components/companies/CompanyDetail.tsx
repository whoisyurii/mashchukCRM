import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ArrowLeft, Edit2 } from "lucide-react";
import { companyService } from "../../services/companyService";
import { useAuth } from "../../contexts/AuthContext";
import { ActionHistory } from "../../types";
import CompanyLocationDisplay from "./details/CompanyLocationDisplay";
import { CompanyInfoCard } from "./details/CompanyInfoCard";
import { CompanyLogoCard } from "./details/CompanyLogoCard";
import { CompanyActionHistory } from "./details/CompanyActionHistory";
import { useCompanyMutations } from "../../hooks/useCompanyMutations";

export const CompanyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    service: "",
    capital: 0,
  });

  const { uploadLogoMutation, deleteLogoMutation, updateCompanyMutation } =
    useCompanyMutations(id!, setIsEditing);
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
            <span className="max-md:hidden">Back to Companies</span>
          </Button>
          <h1 className="text-2xl font-bold text-white">{company.name}</h1>
          <Badge variant="success" className="max-md:hidden">
            {company.status}
          </Badge>
        </div>
        {canEdit && !isEditing && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4 mr-2 max-md:mr-0" />
            <span className="max-md:hidden">Edit Company</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Info component */}
        <div className="lg:col-span-1">
          <CompanyInfoCard
            isEditing={isEditing}
            editForm={editForm}
            setEditForm={setEditForm}
            handleEditSubmit={handleEditSubmit}
            handleEditCancel={handleEditCancel}
            canEdit={!!canEdit}
            company={company}
            updateCompanyMutation={updateCompanyMutation}
          />
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

        {/* Logo Section */}
        <div className="space-y-6">
          <CompanyLogoCard
            company={company}
            canEdit={!!canEdit}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            uploadLogoMutation={uploadLogoMutation}
            deleteLogoMutation={deleteLogoMutation}
          />
          {/* Action History Section */}
          <CompanyActionHistory
            actionHistory={company.actionHistory as ActionHistory[]}
          />
        </div>
      </div>
    </div>
  );
};
