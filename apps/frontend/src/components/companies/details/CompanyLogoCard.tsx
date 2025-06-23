import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Upload, Trash2 } from "lucide-react";

interface CompanyLogoCardProps {
  company: {
    logoUrl?: string;
    name: string;
  };
  canEdit: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadLogoMutation: {
    isPending: boolean;
    mutate: (file: File) => void;
  };
  deleteLogoMutation: {
    isPending: boolean;
    mutate: () => void;
  };
}

export const CompanyLogoCard: React.FC<CompanyLogoCardProps> = ({
  company,
  canEdit,
  fileInputRef,
  handleFileSelect,
  uploadLogoMutation,
  deleteLogoMutation,
}) => (
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
            <span className="text-gray-400 text-sm text-center">No logo</span>
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
);
