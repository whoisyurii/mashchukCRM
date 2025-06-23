import { Card } from "../../ui/Card";
import { ActionHistory } from "../../../types";

interface CompanyActionHistoryProps {
  actionHistory: ActionHistory[];
}

export const CompanyActionHistory: React.FC<CompanyActionHistoryProps> = ({
  actionHistory,
}) => (
  <Card>
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Action History</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {actionHistory && actionHistory.length > 0 ? (
          actionHistory.map((action) => (
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
        )}
      </div>
    </div>
  </Card>
);
