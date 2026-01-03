import React, { createContext, useState } from "react";
import {
  loginUser,
  registerUser,
  registerProvider,
  reverseGeocode,
} from "../Services/api";

type ApiContextType = {
  loading: boolean;
  error: string | null;
  login: (data: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  providerRegister: (data: any) => Promise<any>;
  getLocation: (lat: number, lon: number) => Promise<any>;
};

export const ApiContext = createContext<ApiContextType | null>(null);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* 🔐 LOGIN */
  const login = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const res = await loginUser(data);
      return res.data; // 👈 SUCCESS DATA
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* 🧑‍💼 REGISTER USER */
  const register = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const res = await registerUser(data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Register failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* 🧑‍🔧 PROVIDER REGISTER */
  const providerRegister = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const res = await registerProvider(data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Provider register failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* 📍 LOCATION */
  const getLocation = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await reverseGeocode(lat, lon);
      return res.data;
    } catch (err: any) {
      setError("Location fetch failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        loading,
        error,
        login,
        register,
        providerRegister,
        getLocation,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

