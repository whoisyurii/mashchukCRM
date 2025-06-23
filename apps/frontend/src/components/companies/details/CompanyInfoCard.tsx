import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Save, X } from "lucide-react";
import type { Company } from "../../../types/index";

interface CompanyInfoCardProps {
  isEditing: boolean;
  editForm: {
    name: string;
    service: string;
    capital: number;
  };
  canEdit?: boolean;
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  handleEditSubmit: (e: React.FormEvent) => void;
  handleEditCancel: () => void;
  updateCompanyMutation: { isPending: boolean };
  company: Company;
}

export const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({
  isEditing,
  editForm,
  setEditForm,
  handleEditSubmit,
  handleEditCancel,
  updateCompanyMutation,
  company,
}) => (
  <Card>
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Company Information</h2>
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
            <Button type="button" variant="ghost" onClick={handleEditCancel}>
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
);
