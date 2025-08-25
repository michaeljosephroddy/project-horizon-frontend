import React, { createContext, ReactNode, useEffect, useState } from "react";
import { clearToken, getToken, saveToken } from "./tokenStore";

type User = { id: number; email?: string } | null;

export const AuthContext = createContext<{
  user: User;
  signIn: (cred: any) => Promise<void>;
  signOut: () => void;
  register: (cred: any) => Promise<void>;
}>({
  user: null,
  signIn: async () => {},
  signOut: () => {},
  register: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        // we don't have a real endpoint yet; assume userId=1 until backend implements auth
        setUser({ id: 1 });
      }
    })();
  }, []);

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    // backend auth not implemented yet - we simulate success
    // when you implement backend, replace this with real call
    // const res = await apiClient.post('/auth/login', { email, password });
    // await saveToken(res.data.token);
    await saveToken("dev-token-placeholder");
    setUser({ id: 1, email });
  }

  async function register({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    // no backend auth yet
    await saveToken("dev-token-placeholder");
    setUser({ id: 1, email });
  }

  function signOut() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
}
