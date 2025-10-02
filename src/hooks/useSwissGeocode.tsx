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
    console.log('[useSwissGeocode] getCityFromPostalCode called with:', postalCode);
    
    // Validate Swiss postal code format (4 digits)
    if (!/^\d{4}$/.test(postalCode)) {
      console.log('[useSwissGeocode] Invalid postal code format:', postalCode);
      return null;
    }

    // Check cache first
    const cacheKey = `PLZ:${postalCode}`;
    if (cache.current[cacheKey] !== undefined) {
      console.log('[useSwissGeocode] Cache hit for:', postalCode, '→', cache.current[cacheKey]);
      return cache.current[cacheKey];
    }

    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Load Google Maps API
      console.log('[useSwissGeocode] Loading Google Maps API...');
      const isLoaded = await loadGoogleMapsApi();
      if (!isLoaded) {
        console.error('[useSwissGeocode] Failed to load Google Maps API');
        toast({
          title: 'Fehler',
          description: 'Google Maps konnte nicht geladen werden',
          variant: 'destructive'
        });
        return null;
      }

      // Use Geocoding API
      console.log('[useSwissGeocode] Geocoding postal code:', postalCode);
      const geocoder = new google.maps.Geocoder();
      
      return new Promise((resolve) => {
        geocoder.geocode(
          {
            address: `${postalCode}, Schweiz`,
            componentRestrictions: { country: 'CH' }
          },
          (results, status) => {
            console.log('[useSwissGeocode] Geocoding response:', { status, results });
            
            if (status === 'OK' && results && results[0]) {
              // Extract city from address components
              const addressComponents = results[0].address_components;
              console.log('[useSwissGeocode] Address components:', addressComponents);
              
              const cityComponent = addressComponents.find(
                (component) => 
                  component.types.includes('locality') || 
                  component.types.includes('postal_town')
              );

              const city = cityComponent?.long_name || null;
              console.log('[useSwissGeocode] Extracted city:', city);
              
              cache.current[cacheKey] = city;
              resolve(city);
            } else {
              console.warn('[useSwissGeocode] Geocoding failed:', status);
              cache.current[cacheKey] = null;
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error('[useSwissGeocode] Error geocoding postal code:', error);
      return null;
    }
  }, [loadGoogleMapsApi, toast]);

  // Get postal code from city
  const getPostalCodeFromCity = useCallback(async (city: string): Promise<string | null> => {
    console.log('[useSwissGeocode] getPostalCodeFromCity called with:', city);
    
    // Validate minimum city name length
    if (!city || city.trim().length < 2) {
      console.log('[useSwissGeocode] City name too short:', city);
      return null;
    }

    const normalizedCity = city.trim();

    // Check cache first
    const cacheKey = `CITY:${normalizedCity.toLowerCase()}`;
    if (cache.current[cacheKey] !== undefined) {
      console.log('[useSwissGeocode] Cache hit for:', city, '→', cache.current[cacheKey]);
      return cache.current[cacheKey];
    }

    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Load Google Maps API
      console.log('[useSwissGeocode] Loading Google Maps API...');
      const isLoaded = await loadGoogleMapsApi();
      if (!isLoaded) {
        console.error('[useSwissGeocode] Failed to load Google Maps API');
        toast({
          title: 'Fehler',
          description: 'Google Maps konnte nicht geladen werden',
          variant: 'destructive'
        });
        return null;
      }

      // Use Geocoding API
      console.log('[useSwissGeocode] Geocoding city:', normalizedCity);
      const geocoder = new google.maps.Geocoder();
      
      return new Promise((resolve) => {
        geocoder.geocode(
          {
            address: `${normalizedCity}, Schweiz`,
            componentRestrictions: { country: 'CH' }
          },
          (results, status) => {
            console.log('[useSwissGeocode] Geocoding response:', { status, results });
            
            if (status === 'OK' && results && results[0]) {
              // Extract postal code from address components
              const addressComponents = results[0].address_components;
              console.log('[useSwissGeocode] Address components:', addressComponents);
              
              const postalCodeComponent = addressComponents.find(
                (component) => component.types.includes('postal_code')
              );

              const postalCode = postalCodeComponent?.long_name || null;
              console.log('[useSwissGeocode] Extracted postal code:', postalCode);
              
              cache.current[cacheKey] = postalCode;
              resolve(postalCode);
            } else {
              console.warn('[useSwissGeocode] Geocoding failed:', status);
              cache.current[cacheKey] = null;
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error('[useSwissGeocode] Error geocoding city:', error);
      return null;
    }
  }, [loadGoogleMapsApi, toast]);

  return {
    getCityFromPostalCode,
    getPostalCodeFromCity
  };
};
