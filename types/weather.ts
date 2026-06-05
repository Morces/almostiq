export interface WeatherData {
  temperature: number;      // in Celsius
  humidity: number;         // in %
  rainChance: number;       // in %
  windSpeed: number;        // in km/h
  summary: string;          // general description, e.g., "Heavy Rain", "Sunny"
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string; // state/region
}
