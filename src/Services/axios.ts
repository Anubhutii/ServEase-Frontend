import axios from "axios";

const getBaseUrl = () => {
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return `http://${window.location.hostname}:5000`;
  }
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

