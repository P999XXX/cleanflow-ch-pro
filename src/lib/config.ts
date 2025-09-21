// Configuration for Google Maps
export const GOOGLE_MAPS_CONFIG = {
  // For development, you can set VITE_GOOGLE_MAPS_API_KEY in your environment
  // For production, this should be handled via secure environment variables
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  defaultCenter: {
    lat: 46.8182, // Center of Switzerland
    lng: 8.2275
  },
  defaultZoom: 15
};

// Helper to check if Google Maps is configured
export const isGoogleMapsConfigured = () => {
  return !!GOOGLE_MAPS_CONFIG.apiKey;
};