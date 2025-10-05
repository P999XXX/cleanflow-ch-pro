import { useState, useCallback, useMemo } from 'react';

// Sample Swiss postal codes with cities (subset for performance)
// In production, this should be loaded from a complete database
const SWISS_POSTAL_CODES: Record<string, string[]> = {
  '8000': ['Zürich'],
  '8001': ['Zürich'],
  '8002': ['Zürich'],
  '8003': ['Zürich'],
  '8004': ['Zürich'],
  '8005': ['Zürich'],
  '8006': ['Zürich'],
  '8008': ['Zürich'],
  '8032': ['Zürich'],
  '8037': ['Zürich'],
  '8038': ['Zürich'],
  '8044': ['Zürich'],
  '8045': ['Zürich'],
  '8046': ['Zürich'],
  '8047': ['Zürich'],
  '8048': ['Zürich'],
  '8049': ['Zürich'],
  '8050': ['Zürich'],
  '8051': ['Zürich'],
  '8052': ['Zürich'],
  '8053': ['Zürich'],
  '8055': ['Zürich'],
  '8057': ['Zürich'],
  '8064': ['Zürich'],
  '8302': ['Kloten'],
  '8303': ['Bassersdorf'],
  '8304': ['Wallisellen'],
  '8305': ['Dietlikon'],
  '8400': ['Winterthur'],
  '8401': ['Winterthur'],
  '8404': ['Winterthur'],
  '8405': ['Winterthur'],
  '8408': ['Winterthur'],
  '3000': ['Bern'],
  '3001': ['Bern'],
  '3003': ['Bern'],
  '3004': ['Bern'],
  '3005': ['Bern'],
  '3006': ['Bern'],
  '3007': ['Bern'],
  '3008': ['Bern'],
  '3010': ['Bern'],
  '3011': ['Bern'],
  '3012': ['Bern'],
  '3013': ['Bern'],
  '3014': ['Bern'],
  '3015': ['Bern'],
  '4000': ['Basel'],
  '4001': ['Basel'],
  '4002': ['Basel'],
  '4051': ['Basel'],
  '4052': ['Basel'],
  '4053': ['Basel'],
  '4054': ['Basel'],
  '4055': ['Basel'],
  '4056': ['Basel'],
  '4057': ['Basel'],
  '4058': ['Basel'],
  '6000': ['Luzern'],
  '6003': ['Luzern'],
  '6004': ['Luzern'],
  '6005': ['Luzern'],
  '9000': ['St. Gallen'],
  '9004': ['St. Gallen'],
  '9008': ['St. Gallen'],
  '1200': ['Genève', 'Genf'],
  '1201': ['Genève', 'Genf'],
  '1202': ['Genève', 'Genf'],
  '1203': ['Genève', 'Genf'],
  '1204': ['Genève', 'Genf'],
  '1205': ['Genève', 'Genf'],
  '1206': ['Genève', 'Genf'],
  '1207': ['Genève', 'Genf'],
  '1208': ['Genève', 'Genf'],
  '1209': ['Genève', 'Genf'],
  '6900': ['Lugano'],
  '6901': ['Lugano'],
  '6903': ['Lugano'],
  '6904': ['Lugano'],
  '6906': ['Lugano'],
  '2500': ['Biel', 'Bienne'],
  '2501': ['Biel', 'Bienne'],
  '2502': ['Biel', 'Bienne'],
  '2503': ['Biel', 'Bienne'],
  '2504': ['Biel', 'Bienne'],
  '7000': ['Chur'],
  '5000': ['Aarau'],
  '8200': ['Schaffhausen'],
  '1950': ['Sion', 'Sitten'],
  '1700': ['Fribourg', 'Freiburg'],
  '6300': ['Zug'],
  '1800': ['Vevey'],
  '1820': ['Montreux'],
  '1400': ['Yverdon-les-Bains'],
};

interface PostalCodeSuggestion {
  postalCode: string;
  cities: string[];
}

export function useSwissPostalCodes() {
  const [suggestions, setSuggestions] = useState<PostalCodeSuggestion[]>([]);

  const getCityByPostalCode = useCallback((postalCode: string): string[] => {
    return SWISS_POSTAL_CODES[postalCode] || [];
  }, []);

  const getPostalCodeSuggestions = useCallback((input: string): PostalCodeSuggestion[] => {
    if (!input || input.trim().length < 2) return [];

    const searchTerm = input.toLowerCase().trim();
    const results: PostalCodeSuggestion[] = [];

    // Search by postal code
    if (/^\d+$/.test(searchTerm)) {
      Object.entries(SWISS_POSTAL_CODES).forEach(([code, cities]) => {
        if (code.startsWith(searchTerm)) {
          results.push({ postalCode: code, cities });
        }
      });
    } 
    // Search by city name
    else {
      Object.entries(SWISS_POSTAL_CODES).forEach(([code, cities]) => {
        const matchingCities = cities.filter(city => 
          city.toLowerCase().includes(searchTerm)
        );
        if (matchingCities.length > 0) {
          results.push({ postalCode: code, cities: matchingCities });
        }
      });
    }

    return results.slice(0, 10); // Limit to 10 results
  }, []);

  const autoFillCity = useCallback((postalCode: string): string => {
    const cities = getCityByPostalCode(postalCode);
    return cities.length > 0 ? cities[0] : '';
  }, [getCityByPostalCode]);

  return {
    getCityByPostalCode,
    getPostalCodeSuggestions,
    autoFillCity,
    suggestions,
    setSuggestions,
  };
}
