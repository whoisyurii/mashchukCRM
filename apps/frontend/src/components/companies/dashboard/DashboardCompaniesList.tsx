import { Building2 } from "lucide-react";
import CompaniesDashboardSkeleton from "../dashboard/CompaniesDashboardSkeleton";
import { DashboardCompany } from "../../../types";

interface Props {
  companies: DashboardCompany[];
  isLoading: boolean;
  emptyText: string;
  showOwner?: boolean;
  onCompanyClick?: () => void;
}

export const DashboardCompaniesList: React.FC<Props> = ({
  companies,
  isLoading,
  emptyText,
  showOwner = false,
  //   onCompanyClick,
}) => (
  <div className="space-y-3">
    {isLoading ? (
      <CompaniesDashboardSkeleton />
    ) : companies.length === 0 ? (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">{emptyText}</p>
      </div>
    ) : (
      companies.map((company) => (
        <div
          key={company.id}
          className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
          //   onClick={onCompanyClick}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Building2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <span className="text-sm font-medium text-white truncate block max-md:max-w-28">
                {company.name}
              </span>
              {showOwner && company.user && (
                <p className="text-xs text-gray-400">
                  by {company.user.firstName} {company.user.lastName}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 max-md:hidden">
              ${company.capital.toLocaleString()}
            </p>
            <div
              className={`inline-block w-2 h-2 rounded-full ${
                company.status === "Active"
                  ? "bg-green-400"
                  : company.status === "Inactive"
                  ? "bg-red-400"
                  : "bg-yellow-400"
              }`}
            ></div>
          </div>
        </div>
      ))
    )}
  </div>
);
