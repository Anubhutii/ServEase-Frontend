import axios from "./axios";

/* 📍 LOCATION */
export const reverseGeocode = (lat: number, lon: number) => {
  return axios.get(
    `/api/location/reverse-geocode?lat=${lat}&lon=${lon}`
  );
};

/* 🔐 AUTH */
export const loginUser = (payload: any) => {
  return axios.post("/api/auth/login", payload);
};

/* 🧑‍💼 USER Register */
export const registerUser = (payload: any) => {
  return axios.post("/api/auth/register", payload);
}

/* 🧑‍🔧 PROVIDER */
export const registerProvider = (payload: any) => {
  return axios.post("/api/provider/register", payload);
};

export const createProvider = (payload: any) => {
  return axios.post("/api/provider/create-provider", payload);
};
