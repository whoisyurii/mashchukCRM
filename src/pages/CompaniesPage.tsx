import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Companies } from "./Companies";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-6 text-center text-red-500">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <pre className="text-sm whitespace-pre-wrap">{error.message}</pre>
    </div>
  );
}

export const CompaniesPage: React.FC = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense
      fallback={<div className="p-6 text-center">Loading companies...</div>}
    >
      <Companies />
    </Suspense>
  </ErrorBoundary>
);
