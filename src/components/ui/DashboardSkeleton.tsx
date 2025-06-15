import React from "react";

interface DashboardSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  count = 4,
  height = "h-24",
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
}) => {
  return (
    <div className="animate-pulse space-y-6">
      <div className={className}>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className={`bg-dark-900 border border-dark-700 rounded-lg p-6 ${height}`}
          />
        ))}
      </div>
    </div>
  );
};
