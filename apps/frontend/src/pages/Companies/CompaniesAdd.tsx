import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Upload, Save, ArrowLeft } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { companyService } from "../../services/companyService";
import { useAuth } from "../../contexts/AuthContext";
import CompanyLocationAdd from "../../components/companies/details/CompanyLocationAdd";

const CompaniesAdd = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    capital: "",
    ownerId: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  const createCompanyMutation = useMutation({
    mutationFn: companyService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company created successfully!");
      navigate("/companies");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create company");
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Company name must be at least 3 characters";
    }

    if (!formData.service.trim()) {
      newErrors.service = "Service is required";
    } else if (formData.service.trim().length < 3) {
      newErrors.service = "Service must be at least 3 characters";
    }

    if (!formData.capital.trim()) {
      newErrors.capital = "Capital is required";
    } else if (
      formData.capital.trim().length < 4 ||
      !/^\d+$/.test(formData.capital)
    ) {
      newErrors.capital = "Capital must be at least 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("service", formData.service);
    formDataToSend.append("capital", formData.capital);
    formDataToSend.append("status", "Active");

    if (formData.ownerId) {
      formDataToSend.append("ownerId", formData.ownerId);
    }

    if (logo) {
      formDataToSend.append("logo", logo);
    }

    // Add location data if provided
    if (location) {
      formDataToSend.append("address", location.address);
      formDataToSend.append("latitude", location.latitude.toString());
      formDataToSend.append("longitude", location.longitude.toString());
    }

    createCompanyMutation.mutate(formDataToSend);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationChange = (
    locationData: {
      latitude: number;
      longitude: number;
      address: string;
    } | null
  ) => {
    setLocation(locationData);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Company</h1>
          <p className="text-gray-400 mt-1">
            Create a new company in the system
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/companies")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Companies
        </Button>
      </div>

      {/* Form */}
      <Card>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Logo Upload Section */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Logo (Optional)
                </label>
                <div className="space-y-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-700"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLogo(null);
                          setLogoPreview("");
                        }}
                        className="absolute top-2 right-2"
                        // className="mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2"
                        >
                          Upload Logo
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Name & Service - 2 columns on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter company name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Service *
                    </label>
                    <Input
                      value={formData.service}
                      onChange={(e) =>
                        handleInputChange("service", e.target.value)
                      }
                      placeholder="Enter service type"
                      className={errors.service ? "border-red-500" : ""}
                    />
                    {errors.service && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.service}
                      </p>
                    )}
                  </div>
                </div>

                {/* Capital & Owner - 2 columns on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Capital *
                    </label>
                    <Input
                      type="number"
                      value={formData.capital}
                      onChange={(e) =>
                        handleInputChange("capital", e.target.value)
                      }
                      placeholder="Enter capital amount"
                      className={errors.capital ? "border-red-500" : ""}
                    />
                    {errors.capital && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.capital}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Owner ID (Optional)
                    </label>
                    <Input
                      value={formData.ownerId}
                      onChange={(e) =>
                        handleInputChange("ownerId", e.target.value)
                      }
                      placeholder={`Leave empty to assign to yourself, ${user?.firstName} ${user?.lastName}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mt-6">
              <CompanyLocationAdd
                onLocationChange={handleLocationChange}
                initialLocation={null}
              />
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/companies")}
                disabled={createCompanyMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCompanyMutation.isPending}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                {createCompanyMutation.isPending
                  ? "Creating..."
                  : "Create Company"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CompaniesAdd;
