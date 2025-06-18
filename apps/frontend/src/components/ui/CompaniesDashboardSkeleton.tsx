const CompaniesDashboardSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-3 bg-dark-800 rounded-lg animate-pulse">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-4 bg-gray-600 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-600 rounded w-20"></div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-600 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-600 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompaniesDashboardSkeleton;
