/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "./input";
import { Loader } from "@googlemaps/js-api-loader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  }) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Cache for API key to avoid repeated requests
let cachedApiKey: string | null = null;
let apiKeyPromise: Promise<string> | null = null;

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Adresse eingeben...",
  disabled = false,
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch API key with caching and retry logic
  const fetchApiKey = useCallback(async (retries = 3): Promise<string> => {
    console.log('AddressAutocomplete: Fetching API key, retries left:', retries);
    
    // Return cached key if available
    if (cachedApiKey) {
      console.log('AddressAutocomplete: Using cached API key');
      return cachedApiKey;
    }

    // Return existing promise if already fetching
    if (apiKeyPromise) {
      console.log('AddressAutocomplete: Waiting for existing API key request');
      return apiKeyPromise;
    }

    apiKeyPromise = (async () => {
      try {
        console.log('AddressAutocomplete: Calling get-maps-config edge function');
        const { data, error } = await supabase.functions.invoke('get-maps-config');
        
        if (error) {
          console.error('AddressAutocomplete: Edge function error:', error);
          throw new Error(`Edge function error: ${error.message}`);
        }

        if (!data?.apiKey) {
          console.error('AddressAutocomplete: No API key in response:', data);
          throw new Error('No API key received from server');
        }

        console.log('AddressAutocomplete: Successfully received API key');
        cachedApiKey = data.apiKey;
        return data.apiKey;
      } catch (err) {
        console.error('AddressAutocomplete: Failed to fetch API key:', err);
        if (retries > 0) {
          console.log('AddressAutocomplete: Retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          apiKeyPromise = null; // Clear promise for retry
          return fetchApiKey(retries - 1);
        }
        throw err;
      } finally {
        apiKeyPromise = null;
      }
    })();

    return apiKeyPromise;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAutocomplete = async () => {
      try {
        console.log('AddressAutocomplete: Initializing autocomplete');
        setError(null);

        // Get API key with retry logic
        const apiKey = await fetchApiKey();
        
        if (!isMounted) {
          console.log('AddressAutocomplete: Component unmounted, aborting');
          return;
        }

        console.log('AddressAutocomplete: Loading Google Maps API');
        
        // Load Google Maps API
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"],
        });

        await loader.load();
        console.log('AddressAutocomplete: Google Maps API loaded successfully');

        if (!inputRef.current || !isMounted) {
          console.log('AddressAutocomplete: Input ref or component not available');
          return;
        }

        // Initialize Autocomplete with optimized settings
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "ch" },
          fields: ["address_components", "formatted_address"],
        });

        autocompleteRef.current = autocomplete;
        console.log('AddressAutocomplete: Autocomplete initialized successfully');

        // Handle place selection
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          console.log('AddressAutocomplete: Place selected:', place);
          
          if (!place.address_components) {
            console.warn('AddressAutocomplete: No address components in selected place');
            return;
          }

          const addressComponents = place.address_components;
          let street = "";
          let postalCode = "";
          let city = "";
          let country = "Schweiz";

          addressComponents.forEach((component) => {
            const types = component.types;

            if (types.includes("street_number")) {
              street = component.long_name + " " + street;
            }
            if (types.includes("route")) {
              street += component.long_name;
            }
            if (types.includes("postal_code")) {
              postalCode = component.long_name;
            }
            if (types.includes("locality")) {
              city = component.long_name;
            }
            if (types.includes("country")) {
              country = component.long_name;
            }
          });

          const parsedAddress = {
            street: street.trim(),
            postalCode,
            city,
            country,
          };

          console.log('AddressAutocomplete: Parsed address:', parsedAddress);

          onChange(parsedAddress.street);
          
          if (onAddressSelect) {
            onAddressSelect(parsedAddress);
          }

          // Show success toast
          toast({
            title: "Adresse ausgewählt",
            description: `${parsedAddress.street}, ${parsedAddress.postalCode} ${parsedAddress.city}`,
          });
        });

        if (isMounted) {
          setIsLoading(false);
          console.log('AddressAutocomplete: Initialization complete');
        }
      } catch (error) {
        console.error("AddressAutocomplete: Error during initialization:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        
        toast({
          title: "Adressautovervollständigung nicht verfügbar",
          description: "Sie können die Adresse manuell eingeben.",
          variant: "destructive",
        });
        
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAutocomplete();

    return () => {
      isMounted = false;
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onAddressSelect, toast, fetchApiKey]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isLoading ? "Wird geladen..." : error ? placeholder : placeholder}
        disabled={disabled || isLoading}
        className={className}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
