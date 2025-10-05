import React, { createContext, useContext, useState } from 'react';

type User = { id: string; name: string; isAdmin?: boolean } | null;

type AuthContextValue = {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  async function login(username: string, password: string) {
    // In-memory fake auth: any username with password 'admin' becomes admin
    if (password === 'admin') {
      setUser({ id: '1', name: username, isAdmin: true });
      return true;
    }
    // simple non-admin login
    setUser({ id: '2', name: username });
    return true;
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
