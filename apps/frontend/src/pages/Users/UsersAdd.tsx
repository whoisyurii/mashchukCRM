import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Upload } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../contexts/AuthContext";
import { useCreateUser } from "../../hooks/useUsersQueries";

const UsersAdd = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "User",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user has permission
  if (!user || (user.role !== "SuperAdmin" && user.role !== "Admin")) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card>
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400 mb-6">
              You don't have permission to create users. Error 401.
            </p>
            <Button onClick={() => navigate("/users")} className="w-full">
              Go to Users
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  // useMutation function to CRUD user on the server
  const createUserMutation = useCreateUser();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    // append data fields into the form -> key-value pairs
    formDataToSend.append("firstName", formData.firstName.trim());
    formDataToSend.append("lastName", formData.lastName.trim());
    formDataToSend.append("email", formData.email.trim().toLowerCase());
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);

    if (avatar) {
      formDataToSend.append("avatar", avatar);
    }

    createUserMutation.mutate(formDataToSend);
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Add New User</h1>
          <p className="text-gray-400 mt-1">Create a new user account</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 max-md:ml-2"
        >
          <ArrowLeft size={16} />
          <span className="max-md:hidden">Back to Users</span>
        </Button>
      </div>

      {/* Form */}
      <Card>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Avatar Section */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  User Avatar (Optional)
                </label>
                <div className="flex flex-col items-center space-y-4">
                  {avatarPreview ? (
                    <div className="relative">
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-32 h-32 object-cover rounded-full border-2 border-gray-700"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAvatar(null);
                          setAvatarPreview("");
                        }}
                        className="absolute top-0 right-0"
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="w-32 h-32 bg-dark-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-700 cursor-pointer hover:border-gray-600"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Click to upload</p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm"
                  >
                    {avatarPreview ? "Change Avatar" : "Upload Avatar"}
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />

                  <p className="text-xs text-gray-500 text-center">
                    PNG, JPG, WebP, GIF up to 5MB
                  </p>
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* First Name & Last Name - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter last name"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email & Role - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email address"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-700 bg-dark-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="User">User</option>
                      {user?.role === "SuperAdmin" && (
                        <>
                          <option value="Admin">Admin</option>
                          <option value="SuperAdmin">SuperAdmin</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Password - Full width */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter password (min 6 characters)"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/users")}
                disabled={createUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default UsersAdd;
