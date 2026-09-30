import { normalizeCityQuery } from '../lib/search';
import { normalizeWeatherResponse } from '../lib/weatherMapper';
import type { City, WeatherData } from '../types/weather';

export class OpenMeteoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenMeteoError';
  }
}

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchJson<T>(input: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const effectiveSignal = signal ?? controller.signal;
  const timeoutId = globalThis.setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(input, { signal: effectiveSignal });
    if (!response.ok) {
      throw new OpenMeteoError(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new OpenMeteoError('Tempo limite da consulta excedido.');
    }
    if (error instanceof OpenMeteoError) {
      throw error;
    }
    throw new OpenMeteoError('Não foi possível completar a consulta.');
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

export async function searchCities(query: string): Promise<City[]> {
  const normalized = normalizeCityQuery(query);

  if (!normalized) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(normalized)}&count=5&language=pt&format=json`;

  try {
    const payload = await fetchJson<{ results?: Array<Record<string, unknown>> }>(url);

    if (!payload.results || payload.results.length === 0) {
      return [];
    }

    return payload.results.map((result) => ({
      id: Number(result.id ?? 0),
      name: String(result.name ?? ''),
      latitude: Number(result.latitude ?? Number.NaN),
      longitude: Number(result.longitude ?? Number.NaN),
      region: typeof result.admin1 === 'string' ? result.admin1 : undefined,
      country: typeof result.country === 'string' ? result.country : undefined,
    }));
  } catch {
    return [];
  }
}

export async function fetchWeatherForCoordinates(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto&forecast_days=5`;

  const payload = await fetchJson<Record<string, unknown>>(url);
  const response = {
    city: {
      name: 'Cidade selecionada',
      latitude,
      longitude,
    },
    current: payload.current,
    timezone: payload.timezone,
    daily: payload.daily,
  };

  return normalizeWeatherResponse(response);
}
