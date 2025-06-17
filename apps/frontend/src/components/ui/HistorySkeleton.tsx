import React from "react";

interface HistorySkeletonProps {
  count?: number;
}

export const HistorySkeleton: React.FC<HistorySkeletonProps> = ({
  count = 4,
}) => {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
            <div className="flex-1">
              <div className="h-4 bg-dark-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-dark-700 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-8 bg-dark-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
