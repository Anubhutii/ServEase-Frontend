import { reverseGeocode } from "./api";

export interface StoredLocation {
  lat?: number;
  lon?: number;
  city?: string;
  address?: string;
  timestamp?: number;
}

const LOCATION_STORAGE_KEY = "userLocation";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cached location synchronously from localStorage (0ms latency)
 */
export const getCachedLocation = (): StoredLocation | null => {
  try {
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Save location to localStorage and broadcast an update event
 */
export const setCachedLocation = (location: StoredLocation): void => {
  try {
    const payload: StoredLocation = {
      ...location,
      timestamp: Date.now(),
    };
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(
      new CustomEvent("location_updated", { detail: payload })
    );
  } catch (err) {
    console.warn("Failed to persist location", err);
  }
};

/**
 * Non-blocking Background Location Detector
 * Runs asynchronously during idle time without blocking initial page render
 */
export const detectLocationInBackground = (): void => {
  const scheduleTask =
    typeof window !== "undefined" && "requestIdleCallback" in window
      ? (window as any).requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 500);

  scheduleTask(async () => {
    // 1. Check if we already have a valid cached city
    const cached = getCachedLocation();
    const isCacheFresh =
      cached &&
      cached.city &&
      cached.timestamp &&
      Date.now() - cached.timestamp < CACHE_TTL_MS;

    if (isCacheFresh) {
      // Valid cache found — skip unnecessary network geocoding
      return;
    }

    // 2. Check geolocation availability
    if (!navigator.geolocation) return;

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const res = await reverseGeocode(lat, lon);
            const loc = res.data?.location || {};
            const address = loc.address || {};
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              address.state_district ||
              "";

            if (city) {
              setCachedLocation({
                lat,
                lon,
                city,
                address: loc.display_name || city,
              });
            }
          } catch (e) {
            console.debug("Background geocoding failed, keeping default", e);
          }
        },
        () => {
          // Geolocation denied or unavailable — silently ignore in background
        },
        {
          enableHighAccuracy: false, // Low power / fast cellular / wifi lookup
          timeout: 4000,
          maximumAge: 600000, // Reuse browser-cached GPS coordinates (10 min)
        }
      );
    } catch {
      // Silently catch background errors
    }
  });
};
