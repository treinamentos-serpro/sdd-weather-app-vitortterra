import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWeatherForCoordinates, searchCities } from '../../src/services/openMeteo';

describe('openMeteo service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('searches cities with a normalized query', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          { id: 1, name: 'São Paulo', latitude: -23.55, longitude: -46.64, country: 'Brazil' },
        ],
      }),
    } as Response);

    const result = await searchCities('  são paulo  ');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('name=s%C3%A3o%20paulo'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(result[0]?.name).toBe('São Paulo');
  });

  it('converts weather payload into app model', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        timezone: 'America/Sao_Paulo',
        current: {
          temperature_2m: 22,
          time: '2025-01-10T12:00',
          weather_code: 0,
        },
        daily: {
          time: ['2025-01-10', '2025-01-11', '2025-01-12', '2025-01-13', '2025-01-14'],
          weather_code: [0, 1, 2, 3, 61],
          temperature_2m_min: [18, 17, 16, 15, 14],
          temperature_2m_max: [28, 29, 26, 25, 21],
        },
      }),
    } as Response);

    const result = await fetchWeatherForCoordinates(-23.55, -46.64);

    expect(result.city.name).toBe('Cidade selecionada');
    expect(result.current.temperature).toBe(22);
    expect(result.daily).toHaveLength(5);
  });
});
