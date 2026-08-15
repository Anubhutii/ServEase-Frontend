import axios from "./axios";

/* 📍 LOCATION */
export const reverseGeocode = async (lat: number, lon: number) => {
  try {
    return await axios.get(
      `/api/location/reverse-geocode?lat=${lat}&lon=${lon}`
    );
  } catch (backendError) {
    // Fallback to public OpenStreetMap Nominatim reverse geocoding if backend is offline/unreachable
    try {
      const fallbackRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        return {
          data: {
            location: {
              address: data.address || {},
              display_name: data.display_name,
            },
          },
        };
      }
    } catch {
      // ignore fallback error and propagate original error
    }
    throw backendError;
  }
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
