import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';
import { getWeatherConditionLabel } from './weatherCode';

type WeatherApiCity = {
  name?: string;
  latitude?: number | string;
  longitude?: number | string;
  region?: string;
  country?: string;
  id?: number;
};

type WeatherApiPayload = {
  city?: WeatherApiCity;
  current?: {
    temperature_2m?: number | string;
    time?: string;
    weather_code?: number;
  };
  timezone?: string;
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_min?: number[] | string[];
    temperature_2m_max?: number[] | string[];
  };
};

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export function normalizeWeatherResponse(payload: unknown): WeatherData {
  const data = payload as WeatherApiPayload;

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid weather payload');
  }

  const citySource = data.city;
  const cityName = typeof citySource?.name === 'string' ? citySource.name.trim() : '';
  const latitude = readNumber(citySource?.latitude);
  const longitude = readNumber(citySource?.longitude);

  if (!cityName || latitude === null || longitude === null) {
    throw new Error('Invalid weather payload');
  }

  const city: City = {
    id: Number(citySource?.id ?? 0),
    name: cityName,
    latitude,
    longitude,
    ...(citySource?.region ? { region: citySource.region } : {}),
    ...(citySource?.country ? { country: citySource.country } : {}),
  };

  const currentSource = data.current;
  const temperature = readNumber(currentSource?.temperature_2m);
  const observedAt = typeof currentSource?.time === 'string' ? currentSource.time : '';
  const timezone = typeof data.timezone === 'string' && data.timezone.trim() ? data.timezone : '';

  if (temperature === null || !observedAt || !timezone) {
    throw new Error('Invalid weather payload');
  }

  const current: CurrentWeather = {
    temperature,
    condition: getWeatherConditionLabel(Number(currentSource?.weather_code ?? 0)),
    observedAt,
    timezone,
  };

  const timeSeries = data.daily;
  const dailyTimes = Array.isArray(timeSeries?.time) ? timeSeries.time : [];
  const dailyWeatherCodes = Array.isArray(timeSeries?.weather_code) ? timeSeries.weather_code : [];
  const dailyMin = Array.isArray(timeSeries?.temperature_2m_min)
    ? timeSeries.temperature_2m_min
    : [];
  const dailyMax = Array.isArray(timeSeries?.temperature_2m_max)
    ? timeSeries.temperature_2m_max
    : [];

  if (
    dailyTimes.length !== 5 ||
    dailyWeatherCodes.length !== 5 ||
    dailyMin.length !== 5 ||
    dailyMax.length !== 5
  ) {
    throw new Error('Invalid weather payload');
  }

  const daily: ForecastDay[] = dailyTimes.map((date, index) => {
    const dateValue = typeof date === 'string' ? date : '';
    const code = Number(dailyWeatherCodes[index] ?? 0);
    const min = readNumber(dailyMin[index]);
    const max = readNumber(dailyMax[index]);

    if (!dateValue || min === null || max === null) {
      throw new Error('Invalid weather payload');
    }

    return {
      date: dateValue,
      minTemperature: min,
      maxTemperature: max,
      condition: getWeatherConditionLabel(code),
    };
  });

  const cityId = Number.isFinite(Number(citySource?.id)) ? Number(citySource?.id) : 0;
  const normalizedCity: City = {
    ...city,
    id: cityId,
  };

  const weatherData: WeatherData = {
    city: normalizedCity,
    current,
    daily: daily as [ForecastDay, ForecastDay, ForecastDay, ForecastDay, ForecastDay],
    fetchedAt: new Date().toISOString(),
  };

  return weatherData;
}
