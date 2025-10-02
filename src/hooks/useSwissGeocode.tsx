import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeocodeCache {
  [key: string]: string | null;
}

export const useSwissGeocode = () => {
  const { toast } = useToast();
  const cache = useRef<GeocodeCache>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch Google Maps API key
  const fetchApiKey = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-maps-config');
      
      if (error) {
        console.error('Error fetching Google Maps API key:', error);
        return null;
      }

      return data?.apiKey || null;
    } catch (error) {
      console.error('Error fetching Google Maps API key:', error);
      return null;
    }
  }, []);

  // Load Google Maps API
  const loadGoogleMapsApi = useCallback(async (): Promise<boolean> => {
    if (typeof google !== 'undefined' && google.maps) {
      return true;
    }

    const apiKey = await fetchApiKey();
    if (!apiKey) {
      return false;
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }, [fetchApiKey]);

  // Get city from postal code
  const getCityFromPostalCode = useCallback(async (postalCode: string): Promise<string | null> => {
    // Validate Swiss postal code format (4 digits)
    if (!/^\d{4}$/.test(postalCode)) {
      return null;
    }

    // Check cache first
    const cacheKey = `PLZ:${postalCode}`;
    if (cache.current[cacheKey] !== undefined) {
      return cache.current[cacheKey];
    }

    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Load Google Maps API
      const isLoaded = await loadGoogleMapsApi();
      if (!isLoaded) {
        return null;
      }

      // Use Geocoding API
      const geocoder = new google.maps.Geocoder();
      
      return new Promise((resolve) => {
        geocoder.geocode(
          {
            address: `${postalCode}, Schweiz`,
            componentRestrictions: { country: 'CH' }
          },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              // Extract city from address components
              const addressComponents = results[0].address_components;
              const cityComponent = addressComponents.find(
                (component) => 
                  component.types.includes('locality') || 
                  component.types.includes('postal_town')
              );

              const city = cityComponent?.long_name || null;
              cache.current[cacheKey] = city;
              resolve(city);
            } else {
              cache.current[cacheKey] = null;
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error geocoding postal code:', error);
      return null;
    }
  }, [loadGoogleMapsApi]);

  // Get postal code from city
  const getPostalCodeFromCity = useCallback(async (city: string): Promise<string | null> => {
    // Validate minimum city name length
    if (!city || city.trim().length < 2) {
      return null;
    }

    const normalizedCity = city.trim();

    // Check cache first
    const cacheKey = `CITY:${normalizedCity.toLowerCase()}`;
    if (cache.current[cacheKey] !== undefined) {
      return cache.current[cacheKey];
    }

    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Load Google Maps API
      const isLoaded = await loadGoogleMapsApi();
      if (!isLoaded) {
        return null;
      }

      // Use Geocoding API
      const geocoder = new google.maps.Geocoder();
      
      return new Promise((resolve) => {
        geocoder.geocode(
          {
            address: `${normalizedCity}, Schweiz`,
            componentRestrictions: { country: 'CH' }
          },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              // Extract postal code from address components
              const addressComponents = results[0].address_components;
              const postalCodeComponent = addressComponents.find(
                (component) => component.types.includes('postal_code')
              );

              const postalCode = postalCodeComponent?.long_name || null;
              cache.current[cacheKey] = postalCode;
              resolve(postalCode);
            } else {
              cache.current[cacheKey] = null;
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error geocoding city:', error);
      return null;
    }
  }, [loadGoogleMapsApi]);

  return {
    getCityFromPostalCode,
    getPostalCodeFromCity
  };
};
