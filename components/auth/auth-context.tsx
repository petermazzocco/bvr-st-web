"use client";

import { getAuthToken, getUserIdFromToken, removeAuthToken } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  refreshAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuth = () => {
    const currentToken = getAuthToken();
    const currentUserId = getUserIdFromToken();

    setToken(currentToken || null);
    setUserId(currentUserId);
    setIsAuthenticated(!!currentToken && !!currentUserId);
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const value = {
    token,
    userId,
    isAuthenticated,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthToken() {
  const { token } = useAuth();
  return token;
}

export function useUserId() {
  const { userId } = useAuth();
  return userId;
}

export function useOptionalAuth() {
  const context = useContext(AuthContext);
  return context;
}
