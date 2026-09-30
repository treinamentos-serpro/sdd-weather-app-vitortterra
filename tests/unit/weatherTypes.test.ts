import { describe, expect, it } from 'vitest';
import type { City, CurrentWeather, ForecastDay, Unit, WeatherData } from '../../src/types/weather';

describe('weather domain types', () => {
  it('accepts valid domain values', () => {
    const unit: Unit = 'celsius';
    const city: City = {
      id: 1,
      name: 'Rio de Janeiro',
      latitude: -22.9068,
      longitude: -43.1729,
      region: 'Rio de Janeiro',
      country: 'Brasil',
    };

    const current: CurrentWeather = {
      temperature: 28.6,
      condition: 'ensolarado',
      observedAt: '2026-09-30T12:00:00-03:00',
      timezone: 'America/Sao_Paulo',
    };

    const day: ForecastDay = {
      date: '2026-10-01',
      minTemperature: 22,
      maxTemperature: 31,
      condition: 'parcialmente nublado',
    };

    const weatherData: WeatherData = {
      city,
      current,
      daily: [day, day, day, day, day],
      fetchedAt: '2026-09-30T12:05:00-03:00',
      metadata: {
        source: 'Open-Meteo',
      },
    };

    expect(unit).toBe('celsius');
    expect(city.id).toBe(1);
    expect(current.temperature).toBe(28.6);
    expect(weatherData.daily).toHaveLength(5);
  });

  it('rejects invalid domain assignments at compile time', () => {
    // @ts-expect-error Unit must be Celsius or Fahrenheit only
    const invalidUnit: Unit = 'kelvin';

    const invalidCity: City = {
      // @ts-expect-error City requires a numeric id and finite coordinates
      id: '1',
      name: 'Test City',
      latitude: Number.NaN,
      longitude: -43.1729,
    };

    expect(invalidUnit).toBeDefined();
    expect(invalidCity.name).toBe('Test City');
  });
});
