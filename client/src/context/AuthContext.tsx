import React, { createContext, useContext, useState, useEffect } from "react";
import User, { UserRole } from "@/vite-env";
import { getUser, logoutUser } from "@/api/user.api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole;
  isCandidate: boolean;
  isRecruiter: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async (): Promise<User | null> => {
    try {
      const userData = await getUser();
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      localStorage.removeItem("token");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const role: UserRole = user?.role || "candidate";
  const isCandidate = role === "candidate";
  const isRecruiter = role === "recruiter";
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
        isCandidate,
        isRecruiter,
        isAdmin,
        setUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
