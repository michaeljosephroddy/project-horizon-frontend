import React, { createContext, useContext, useEffect, useState } from 'react';
import { authStorage } from '../utils/authStorage';

type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  setAuth: (user: AuthUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  setAuth: async () => {},
  logout: async () => {},
  refreshAuth: async () => {},
});

// -------------------------------
// Provider Component
// -------------------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load credentials from storage
  useEffect(() => {
    refreshAuth();
  }, []);

  const refreshAuth = async () => {
    setLoading(true);
    try {
      const storedUser = await authStorage.getUser();
      const storedToken = await authStorage.getToken();
      setUser(storedUser);
      setToken(storedToken);
    } finally {
      setLoading(false);
    }
  };

  const setAuth = async (newUser: AuthUser, newToken: string) => {
    await authStorage.setCredentials(newToken, newUser);
    setUser(newUser);
    setToken(newToken);
  };

  const logout = async () => {
    await authStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, setAuth, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// -------------------------------
// Hook for convenience
// -------------------------------
export const useAuth = () => useContext(AuthContext);
