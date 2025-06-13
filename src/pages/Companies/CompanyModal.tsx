import React, { useState } from "react";
import { companyService } from "../../services/companyService";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

interface CompanyModalProps {
  open: boolean;
  onClose: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  open,
  onClose,
}) => {
  const [form, setForm] = useState({
    name: "",
    service: "",
    capital: "",
    status: "Active",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    try {
      await companyService.createCompany({
        name: form.name,
        service: form.service,
        capital: Number(form.capital),
        status: form.status || "Active",
      });
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
      setForm({ name: "", service: "", capital: "", status: "Active" });
      onClose();
    } catch (error: any) {
      setFormError(error.response?.data?.message || "Failed to create company");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-dark-900 rounded-lg p-8 w-full max-w-md shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">New Company</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Service"
            name="service"
            value={form.service}
            onChange={handleChange}
            required
          />
          <Input
            label="Capital"
            name="capital"
            type="number"
            value={form.capital}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-dark-800 text-white p-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {formError && <div className="text-red-400 text-sm">{formError}</div>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Company"}
          </Button>
        </form>
      </div>
    </div>
  );
};
