import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../../src/hooks/useWeather';
import * as openMeteo from '../../src/services/openMeteo';

describe('useWeather', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('searches cities and tracks status', async () => {
    vi.spyOn(openMeteo, 'searchCities').mockResolvedValue([
      { id: 1, name: 'Rio de Janeiro', latitude: -22.9, longitude: -43.2, country: 'Brazil' },
    ]);

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.submitSearch('rio');
    });

    await waitFor(() => expect(result.current.searchStatus).toBe('success'));
    expect(result.current.searchResults[0]?.name).toBe('Rio de Janeiro');
  });

  it('loads weather for a selected city', async () => {
    vi.spyOn(openMeteo, 'fetchWeatherForCoordinates').mockResolvedValue({
      city: { id: 1, name: 'Rio', latitude: -22.9, longitude: -43.2, country: 'Brazil' },
      current: {
        temperature: 26,
        condition: 'Céu limpo',
        observedAt: '2025-01-10T12:00',
        timezone: 'America/Sao_Paulo',
      },
      daily: [
        { date: '2025-01-10', minTemperature: 22, maxTemperature: 28, condition: 'Céu limpo' },
        {
          date: '2025-01-11',
          minTemperature: 21,
          maxTemperature: 29,
          condition: 'Parcialmente nublado',
        },
        { date: '2025-01-12', minTemperature: 20, maxTemperature: 27, condition: 'Nublado' },
        { date: '2025-01-13', minTemperature: 19, maxTemperature: 25, condition: 'Chuva leve' },
        { date: '2025-01-14', minTemperature: 18, maxTemperature: 24, condition: 'Céu limpo' },
      ],
      fetchedAt: '2025-01-10T12:00:00.000Z',
    });

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.selectCity({
        id: 1,
        name: 'Rio',
        latitude: -22.9,
        longitude: -43.2,
        country: 'Brazil',
      });
    });

    await waitFor(() => expect(result.current.weatherStatus).toBe('success'));
    expect(result.current.weather?.current.temperature).toBe(26);
  });
});
