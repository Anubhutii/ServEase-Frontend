import React, { createContext, useContext, useState, useEffect } from "react";

/* 1️⃣ Context ka type */
type AuthContextType = {
  isLoggedIn: boolean;
  user: any;
  loading: boolean;
  login: (userData?: any) => void;
  logout: () => void;
};

/* 2️⃣ Context create */
const AuthContext = createContext<AuthContextType | null>(null);

/* 3️⃣ Provider */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    } else if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = (userData?: any) => {
    setIsLoggedIn(true);
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* 4️⃣ Custom hook */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
