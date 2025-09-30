import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme();

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
          libraries: ['places']
        });

        const google = await loader.load();
        const geocoder = new google.maps.Geocoder();
        
        // Dark mode styles for Google Maps
        const darkModeStyles = [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }]
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }]
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }]
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }]
          }
        ];

        // Light mode styles (minimal, hide POI labels)
        const lightModeStyles = [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ];

        // Determine which styles to use based on theme
        const isDark = theme === 'dark';
        const mapStyles = isDark ? darkModeStyles : lightModeStyles;
        
        // Geocode the address
        geocoder.geocode({ address: fullAddress }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const map = new google.maps.Map(mapRef.current!, {
              zoom: 15,
              center: results[0].geometry.location,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              zoomControl: true,
              styles: mapStyles
            });

            // Add marker with theme colors
            new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
              title: fullAddress,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeColor: '#1e40af',
                strokeWeight: 2
              }
            });

            setIsLoading(false);
          } else {
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
  }, [fullAddress, apiKey, theme]);

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
    <div className="relative w-full h-full">
      <div ref={mapRef} className={className} style={{ width: '100%', height: '100%' }} />
      {isLoading && (
        <div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
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