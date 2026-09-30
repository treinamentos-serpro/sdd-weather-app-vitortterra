import { describe, expect, it } from 'vitest';
import { normalizeWeatherResponse } from '../../src/lib/weatherMapper';

describe('weather response normalization', () => {
  it('rejects invalid payloads with required fields missing', () => {
    expect(() =>
      normalizeWeatherResponse({
        timezone: 'America/Sao_Paulo',
        current: { temperature_2m: 24.4 },
        daily: {
          time: ['2026-09-30'],
          weather_code: [0],
          temperature_2m_min: [20],
          temperature_2m_max: [30],
        },
      }),
    ).toThrow('Invalid weather payload');

    expect(() =>
      normalizeWeatherResponse({
        city: { name: 'Rio', latitude: 'bad', longitude: -43.1729 },
        current: { temperature_2m: 24.4, time: '2026-09-30T12:00:00', weather_code: 0 },
        timezone: 'America/Sao_Paulo',
        daily: {
          time: ['2026-09-30'],
          weather_code: [0],
          temperature_2m_min: [20],
          temperature_2m_max: [30],
        },
      }),
    ).toThrow('Invalid weather payload');
  });

  it('rejects misaligned or incomplete daily arrays', () => {
    const payload = {
      city: { name: 'Rio de Janeiro', latitude: -22.9, longitude: -43.17 },
      current: { temperature_2m: 24.4, time: '2026-09-30T12:00:00', weather_code: 0 },
      timezone: 'America/Sao_Paulo',
      daily: {
        time: ['2026-09-30', '2026-10-01'],
        weather_code: [0],
        temperature_2m_min: [19, 18],
        temperature_2m_max: [30, 31],
      },
    };

    expect(() => normalizeWeatherResponse(payload)).toThrow('Invalid weather payload');
  });

  it('accepts a valid payload and preserves order and expected shape', () => {
    const payload = {
      city: { name: 'Rio de Janeiro', latitude: -22.9, longitude: -43.17 },
      current: { temperature_2m: 24.4, time: '2026-09-30T12:00:00', weather_code: 0 },
      timezone: 'America/Sao_Paulo',
      daily: {
        time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
        weather_code: [0, 1, 2, 3, 61],
        temperature_2m_min: [20, 19, 18, 17, 16],
        temperature_2m_max: [30, 29, 28, 27, 26],
      },
    };

    const normalized = normalizeWeatherResponse(payload);

    expect(normalized.city.name).toBe('Rio de Janeiro');
    expect(normalized.current.temperature).toBe(24.4);
    expect(normalized.current.timezone).toBe('America/Sao_Paulo');
    expect(normalized.daily).toHaveLength(5);
    expect(normalized.daily[0].date).toBe('2026-09-30');
    expect(normalized.daily[4].condition).toBe('Chuva leve');
  });

  it('omits optional fields that are absent from the source payload', () => {
    const normalized = normalizeWeatherResponse({
      city: { name: 'São Paulo', latitude: -23.55, longitude: -46.63 },
      current: { temperature_2m: 25, time: '2026-09-30T12:00:00', weather_code: 1 },
      timezone: 'America/Sao_Paulo',
      daily: {
        time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
        weather_code: [1, 1, 1, 1, 1],
        temperature_2m_min: [20, 20, 20, 20, 20],
        temperature_2m_max: [29, 29, 29, 29, 29],
      },
    });

    expect('metadata' in normalized).toBe(false);
    expect(normalized.current.apparentTemperature).toBeUndefined();
  });
});
