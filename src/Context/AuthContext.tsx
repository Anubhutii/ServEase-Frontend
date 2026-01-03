import React, { createContext, useContext, useState } from "react";

/* 1️⃣ Context ka type */
type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

/* 2️⃣ Context create */
const AuthContext = createContext<AuthContextType | null>(null);

/* 3️⃣ Provider */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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
