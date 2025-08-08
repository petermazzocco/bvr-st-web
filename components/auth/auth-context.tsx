"use client";

// Note: Client-side token functions removed - using HTTP-only cookies managed server-side
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isMember: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshAuth: () => void;
  updateAuthState: (authState: Partial<InitialAuthState>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type InitialAuthState = {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isMember: boolean;
};

export function AuthProvider({
  children,
  initialAuthState,
}: {
  children: React.ReactNode;
  initialAuthState: InitialAuthState;
}) {
  const [token, setToken] = useState<string | null>(initialAuthState.token);
  const [userId, setUserId] = useState<string | null>(initialAuthState.userId);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState.isAuthenticated);
  const [isMember, setIsMember] = useState(initialAuthState.isMember);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAuth = () => {
    // Since cookies are HTTP-only, we can't read them client-side
    // This function is now primarily used for clearing auth state
    // The server provides initial auth state via props
    console.log("refreshAuth called - clearing auth state");
    
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const updateAuthState = (authState: Partial<InitialAuthState>) => {
    if (authState.token !== undefined) setToken(authState.token);
    if (authState.userId !== undefined) setUserId(authState.userId);
    if (authState.isAuthenticated !== undefined) setIsAuthenticated(authState.isAuthenticated);
    if (authState.isMember !== undefined) setIsMember(authState.isMember);
    setIsLoading(false);
  };

  const logout = () => {
    // Clear client-side state
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    setIsMember(false);
    setIsLoading(false);
    
    // Note: HTTP-only cookie removal should be handled server-side
    // via logout server action or API route
  };

  // Remove useEffect since we now get initial state from server
  // useEffect(() => {
  //   refreshAuth();
  // }, []);

  const value = {
    token,
    userId,
    isAuthenticated,
    isMember,
    isLoading,
    logout,
    refreshAuth,
    updateAuthState,
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
