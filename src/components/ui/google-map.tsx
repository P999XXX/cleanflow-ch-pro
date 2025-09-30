import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapProps {
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  address, 
  postal_code, 
  city, 
  country = 'Schweiz',
  className = "w-full h-64 rounded-lg"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Construct full address
  const fullAddress = [address, postal_code, city, country]
    .filter(Boolean)
    .join(', ');

  // Fetch API key from Edge Function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-maps-config');
        
        if (error) {
          throw new Error(`Function error: ${error.message}`);
        }
        
        if (data?.apiKey) {
          setApiKey(data.apiKey);
        } else {
          setError('Google Maps API-Schlüssel nicht konfiguriert');
        }
      } catch (err) {
        console.error('Error fetching Maps API key:', err);
        setError('Google Maps API-Schlüssel konnte nicht geladen werden');
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    if (!fullAddress || !mapRef.current || !apiKey) {
      if (!apiKey && !error) {
        // Still loading API key
        return;
      }
      setIsLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places', 'marker']
        });

        const google = await loader.load();
        const geocoder = new google.maps.Geocoder();
        
        // Geocode the address
        geocoder.geocode({ address: fullAddress, componentRestrictions: { country: 'CH' } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const map = new google.maps.Map(mapRef.current!, {
              zoom: 15,
              center: results[0].geometry.location,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              zoomControl: true,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            });

            // Add marker using AdvancedMarkerElement
            if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
              new google.maps.marker.AdvancedMarkerElement({
                position: results[0].geometry.location,
                map,
                title: fullAddress
              });
            } else {
              // Fallback to classic Marker if AdvancedMarker not available
              new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                title: fullAddress
              });
            }

            setIsLoading(false);
          } else {
            console.error('Geocoding error:', status, fullAddress);
            setError('Adresse konnte nicht gefunden werden');
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error('Google Maps loading error:', err);
        setError('Karte konnte nicht geladen werden');
        setIsLoading(false);
      }
    };

    initMap();
  }, [fullAddress, apiKey]);

  if (!fullAddress) {
    return (
      <div className={`${className} bg-muted/30 rounded-lg flex items-center justify-center border border-dashed border-muted-foreground/25`}>
        <div className="text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Keine Adresse verfügbar</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-muted/30 rounded-lg flex items-center justify-center border border-dashed border-muted-foreground/25`}>
        <div className="text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">{error}</p>
          <p className="text-xs mt-1 px-4">{fullAddress}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className={`${className} border border-border/50`} />
      {isLoading && (
        <div className={`${className} absolute inset-0 bg-muted/30 rounded-lg flex items-center justify-center border border-border/50`}>
          <div className="text-center text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50 animate-pulse" />
            <p className="text-sm">Karte wird geladen...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;