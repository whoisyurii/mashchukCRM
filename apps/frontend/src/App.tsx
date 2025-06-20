import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Companies } from "./pages/Companies/Companies";
import CompaniesAdd from "./pages/Companies/CompaniesAdd";
import { CompanyDetail } from "./components/companies/CompanyDetail";
import { Users } from "./pages/Users/Users";
import UsersAdd from "./pages/Users/UsersAdd";
import { Profile } from "./pages/Profile";
import { History } from "./pages/History";
import { LoginPage, RegisterPage } from "./pages/auth";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/companies/add-new",
    element: (
      <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
        <CompaniesAdd />
      </ProtectedRoute>
    ),
  },
  {
    path: "/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanyDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/add-new",
    element: (
      <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
        <UsersAdd />
      </ProtectedRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute allowedRoles={["SuperAdmin"]}>
        <History />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1F2937",
              color: "#F9FAFB",
              border: "1px solid #374151",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#F9FAFB",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#F9FAFB",
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
