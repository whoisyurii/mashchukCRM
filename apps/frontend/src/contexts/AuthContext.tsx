import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../types";
import { authService } from "../services/authService";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean; // temporarily for backward compatibility
  updateUser: (updatedUser: User) => void;
  clearCache: () => void;
}
// create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// use context - custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// provide context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  
  const queryClient = useQueryClient();

  // Derived states
  const isAuthenticated = status === "authenticated";
  const role = user?.role || null;
  const loading = status === "loading"; // temporarily for backward compatibility

  // Validate token with backend
  const validateToken = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) throw new Error("No token");
    
    try {
      const response = await authService.verifyToken();
      return response;
    } catch (error) {
      throw error;
    }
  };

  // tanstack query to validate current user
  const { refetch: validateCurrentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: validateToken,
    enabled: false,
    retry: false,
  });

  // centralized cleanup function
  const clearAuthData = useCallback(() => {
    setUser(null);
    setToken(null);
    setStatus("unauthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    queryClient.removeQueries({ queryKey: ["currentUser"] });
  }, [queryClient]);

  // centralized cache clearing
  const clearCache = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  // initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        
        try {
          // Validate token with backend
          const result = await validateCurrentUser();
          if (result.data && result.data.authenticated) {
            setUser(result.data.user);
            setStatus("authenticated");
          } else {
            throw new Error("Invalid token");
          }
        } catch (error) {
          console.warn("Token validation failed:", error);
          // Fallback to localStorage user if validation fails (offline mode)
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setStatus("authenticated");
          } catch {
            clearAuthData();
          }
        }
      } else {
        setStatus("unauthenticated");
      }
    };

    initializeAuth();
  }, [validateCurrentUser, clearAuthData]);

  // login function
  const login = async (email: string, password: string) => {
    try {
      setStatus("loading");
      const { user, accessToken, refreshToken } = await authService.login({
        email,
        password,
      });

      setUser(user);
      setToken(accessToken);
      setStatus("authenticated");
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      // Clean up in case of error
      clearAuthData();
      throw err; // re-throw the error to handle it in the component
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setStatus("loading");
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.accessToken);
      setStatus("authenticated");
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      clearAuthData();
      throw err;
    }
  };

  const logout = async () => {
    try {
      setStatus("loading");
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      // Clear all cached data on logout
      clearCache();
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        status,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser,
        clearCache,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
