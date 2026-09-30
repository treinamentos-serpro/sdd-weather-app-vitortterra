export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region?: string;
  country?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  condition: string;
  observedAt: string;
  timezone: string;
  apparentTemperature?: number;
}

export interface ForecastDay {
  date: string;
  minTemperature: number;
  maxTemperature: number;
  condition: string;
  iconCode?: number;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  daily: [ForecastDay, ForecastDay, ForecastDay, ForecastDay, ForecastDay];
  fetchedAt: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}
