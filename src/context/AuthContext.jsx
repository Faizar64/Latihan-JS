import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';

const AuthContext = createContext(null);

const STORAGE_KEY = 'wms_pro_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // default logged in as admin for smooth evaluation, or allow logout
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [authError, setAuthError] = useState('');

  const login = (username, password) => {
    setAuthError('');
    const found = INITIAL_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (found) {
      const { password, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
      return { success: true };
    } else {
      const errorMsg = 'Username atau kata sandi tidak valid. Coba username: admin & password: password123';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const loginAsDemo = (roleKey = 'admin') => {
    const target = INITIAL_USERS.find((u) => u.username === roleKey) || INITIAL_USERS[0];
    const { password, ...safeUser } = target;
    setUser(safeUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        logout,
        authError,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

