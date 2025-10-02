/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { Loader } from "@googlemaps/js-api-loader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const initAutocomplete = async () => {
      try {
        // Get API key from edge function
        const { data, error } = await supabase.functions.invoke('get-maps-config');
        
        if (error || !data?.apiKey) {
          console.error('Failed to load Google Maps API key:', error);
          if (isMounted) setIsLoading(false);
          return;
        }

        // Load Google Maps API
        const loader = new Loader({
          apiKey: data.apiKey,
          version: "weekly",
          libraries: ["places"],
        });

        await loader.load();

        if (!inputRef.current || !isMounted) return;

        // Initialize Autocomplete
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "ch" },
          fields: ["address_components", "formatted_address"],
        });

        autocompleteRef.current = autocomplete;

        // Handle place selection
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          
          if (!place.address_components) return;

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

          onChange(street.trim());
          
          if (onAddressSelect) {
            onAddressSelect({
              street: street.trim(),
              postalCode,
              city,
              country,
            });
          }
        });

        if (isMounted) setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Google Places Autocomplete:", error);
        toast({
          title: "Adressautovervollständigung nicht verfügbar",
          description: "Sie können die Adresse manuell eingeben.",
          variant: "destructive",
        });
        if (isMounted) setIsLoading(false);
      }
    };

    initAutocomplete();

    return () => {
      isMounted = false;
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onAddressSelect, toast]);

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={isLoading ? "Wird geladen..." : placeholder}
      disabled={disabled || isLoading}
      className={className}
    />
  );
}
