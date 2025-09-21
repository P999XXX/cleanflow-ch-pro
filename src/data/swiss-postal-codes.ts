// Schweizer Postleitzahlen und Ortschaften
export interface SwissPostalCode {
  plz: string;
  ort: string;
  kanton: string;
}

export const swissPostalCodes: SwissPostalCode[] = [
  // Zürich
  { plz: "8000", ort: "Zürich", kanton: "ZH" },
  { plz: "8001", ort: "Zürich", kanton: "ZH" },
  { plz: "8002", ort: "Zürich", kanton: "ZH" },
  { plz: "8003", ort: "Zürich", kanton: "ZH" },
  { plz: "8004", ort: "Zürich", kanton: "ZH" },
  { plz: "8005", ort: "Zürich", kanton: "ZH" },
  { plz: "8006", ort: "Zürich", kanton: "ZH" },
  { plz: "8008", ort: "Zürich", kanton: "ZH" },
  { plz: "8032", ort: "Zürich", kanton: "ZH" },
  { plz: "8037", ort: "Zürich", kanton: "ZH" },
  { plz: "8038", ort: "Zürich", kanton: "ZH" },
  { plz: "8041", ort: "Zürich", kanton: "ZH" },
  { plz: "8044", ort: "Zürich", kanton: "ZH" },
  { plz: "8045", ort: "Zürich", kanton: "ZH" },
  { plz: "8046", ort: "Zürich", kanton: "ZH" },
  { plz: "8047", ort: "Zürich", kanton: "ZH" },
  { plz: "8048", ort: "Zürich", kanton: "ZH" },
  { plz: "8049", ort: "Zürich", kanton: "ZH" },
  { plz: "8050", ort: "Zürich", kanton: "ZH" },
  { plz: "8051", ort: "Zürich", kanton: "ZH" },
  { plz: "8052", ort: "Zürich", kanton: "ZH" },
  { plz: "8053", ort: "Zürich", kanton: "ZH" },
  { plz: "8055", ort: "Zürich", kanton: "ZH" },
  { plz: "8057", ort: "Zürich", kanton: "ZH" },
  { plz: "8063", ort: "Zürich", kanton: "ZH" },
  { plz: "8064", ort: "Zürich", kanton: "ZH" },
  { plz: "8102", ort: "Oberengstringen", kanton: "ZH" },
  { plz: "8103", ort: "Unterengstringen", kanton: "ZH" },
  { plz: "8105", ort: "Regensdorf", kanton: "ZH" },
  { plz: "8106", ort: "Adlikon", kanton: "ZH" },
  { plz: "8107", ort: "Buchs ZH", kanton: "ZH" },
  { plz: "8108", ort: "Dällikon", kanton: "ZH" },
  { plz: "8109", ort: "Regensberg", kanton: "ZH" },
  { plz: "8110", ort: "Otelfingen", kanton: "ZH" },
  { plz: "8111", ort: "Leutschenbach", kanton: "ZH" },
  { plz: "8112", ort: "Otelfingen", kanton: "ZH" },
  { plz: "8113", ort: "Boppelsen", kanton: "ZH" },
  { plz: "8114", ort: "Dänikon ZH", kanton: "ZH" },
  { plz: "8115", ort: "Hüttikon", kanton: "ZH" },

  // Bern
  { plz: "3000", ort: "Bern", kanton: "BE" },
  { plz: "3001", ort: "Bern", kanton: "BE" },
  { plz: "3003", ort: "Bern", kanton: "BE" },
  { plz: "3004", ort: "Bern", kanton: "BE" },
  { plz: "3005", ort: "Bern", kanton: "BE" },
  { plz: "3006", ort: "Bern", kanton: "BE" },
  { plz: "3007", ort: "Bern", kanton: "BE" },
  { plz: "3008", ort: "Bern", kanton: "BE" },
  { plz: "3010", ort: "Bern", kanton: "BE" },
  { plz: "3011", ort: "Bern", kanton: "BE" },
  { plz: "3012", ort: "Bern", kanton: "BE" },
  { plz: "3013", ort: "Bern", kanton: "BE" },
  { plz: "3014", ort: "Bern", kanton: "BE" },
  { plz: "3015", ort: "Bern", kanton: "BE" },
  { plz: "3018", ort: "Bern", kanton: "BE" },
  { plz: "3019", ort: "Bern", kanton: "BE" },
  { plz: "3020", ort: "Bern", kanton: "BE" },

  // Basel
  { plz: "4000", ort: "Basel", kanton: "BS" },
  { plz: "4001", ort: "Basel", kanton: "BS" },
  { plz: "4002", ort: "Basel", kanton: "BS" },
  { plz: "4003", ort: "Basel", kanton: "BS" },
  { plz: "4051", ort: "Basel", kanton: "BS" },
  { plz: "4052", ort: "Basel", kanton: "BS" },
  { plz: "4053", ort: "Basel", kanton: "BS" },
  { plz: "4054", ort: "Basel", kanton: "BS" },
  { plz: "4055", ort: "Basel", kanton: "BS" },
  { plz: "4056", ort: "Basel", kanton: "BS" },
  { plz: "4057", ort: "Basel", kanton: "BS" },
  { plz: "4058", ort: "Basel", kanton: "BS" },

  // Genf
  { plz: "1200", ort: "Genève", kanton: "GE" },
  { plz: "1201", ort: "Genève", kanton: "GE" },
  { plz: "1202", ort: "Genève", kanton: "GE" },
  { plz: "1203", ort: "Genève", kanton: "GE" },
  { plz: "1204", ort: "Genève", kanton: "GE" },
  { plz: "1205", ort: "Genève", kanton: "GE" },
  { plz: "1206", ort: "Genève", kanton: "GE" },
  { plz: "1207", ort: "Genève", kanton: "GE" },
  { plz: "1208", ort: "Genève", kanton: "GE" },
  { plz: "1209", ort: "Genève", kanton: "GE" },

  // Lausanne
  { plz: "1000", ort: "Lausanne", kanton: "VD" },
  { plz: "1003", ort: "Lausanne", kanton: "VD" },
  { plz: "1004", ort: "Lausanne", kanton: "VD" },
  { plz: "1005", ort: "Lausanne", kanton: "VD" },
  { plz: "1006", ort: "Lausanne", kanton: "VD" },
  { plz: "1007", ort: "Lausanne", kanton: "VD" },
  { plz: "1008", ort: "Lausanne", kanton: "VD" },
  { plz: "1010", ort: "Lausanne", kanton: "VD" },
  { plz: "1011", ort: "Lausanne", kanton: "VD" },
  { plz: "1012", ort: "Lausanne", kanton: "VD" },

  // Luzern
  { plz: "6000", ort: "Luzern", kanton: "LU" },
  { plz: "6003", ort: "Luzern", kanton: "LU" },
  { plz: "6004", ort: "Luzern", kanton: "LU" },
  { plz: "6005", ort: "Luzern", kanton: "LU" },
  { plz: "6006", ort: "Luzern", kanton: "LU" },

  // St. Gallen
  { plz: "9000", ort: "St. Gallen", kanton: "SG" },
  { plz: "9001", ort: "St. Gallen", kanton: "SG" },
  { plz: "9004", ort: "St. Gallen", kanton: "SG" },
  { plz: "9006", ort: "St. Gallen", kanton: "SG" },
  { plz: "9007", ort: "St. Gallen", kanton: "SG" },
  { plz: "9008", ort: "St. Gallen", kanton: "SG" },

  // Winterthur
  { plz: "8400", ort: "Winterthur", kanton: "ZH" },
  { plz: "8401", ort: "Winterthur", kanton: "ZH" },
  { plz: "8402", ort: "Winterthur", kanton: "ZH" },
  { plz: "8404", ort: "Winterthur", kanton: "ZH" },

  // Weitere wichtige Städte
  { plz: "6900", ort: "Lugano", kanton: "TI" },
  { plz: "6901", ort: "Lugano", kanton: "TI" },
  { plz: "3900", ort: "Brig", kanton: "VS" },
  { plz: "1950", ort: "Sion", kanton: "VS" },
  { plz: "2000", ort: "Neuchâtel", kanton: "NE" },
  { plz: "1700", ort: "Fribourg", kanton: "FR" },
  { plz: "7000", ort: "Chur", kanton: "GR" },
  { plz: "5000", ort: "Aarau", kanton: "AG" },
  { plz: "4500", ort: "Solothurn", kanton: "SO" },
  { plz: "8200", ort: "Schaffhausen", kanton: "SH" },
  { plz: "8750", ort: "Glarus", kanton: "GL" },
  { plz: "6460", ort: "Altdorf UR", kanton: "UR" },
  { plz: "6430", ort: "Schwyz", kanton: "SZ" },
  { plz: "6060", ort: "Sarnen", kanton: "OW" },
  { plz: "6390", ort: "Engelberg", kanton: "OW" },
  { plz: "6370", ort: "Stans", kanton: "NW" },
  { plz: "1290", ort: "Versoix", kanton: "GE" },
  { plz: "2900", ort: "Porrentruy", kanton: "JU" },
];

// Funktion um PLZ zu suchen
export const findCityByPostalCode = (plz: string): string => {
  const found = swissPostalCodes.find(code => code.plz === plz);
  return found ? found.ort : '';
};

// Funktion um alle PLZ zu erhalten
export const getAllPostalCodes = (): string[] => {
  return swissPostalCodes.map(code => code.plz).sort();
};