import { describe, expect, it } from 'vitest';
import {
  formatTemperature,
  TEMPERATURE_ROUNDING_RULE,
  toCelsius,
  toFahrenheit,
} from '../../src/lib/temperature';

describe('temperature conversion and formatting', () => {
  it('converts Celsius to Fahrenheit without rounding the internal value', () => {
    expect(toFahrenheit(0)).toBe(32);
    expect(toFahrenheit(100)).toBe(212);
    expect(toFahrenheit(-40)).toBe(-40);
    expect(toFahrenheit(12.5)).toBeCloseTo(54.5, 10);
  });

  it('converts in both directions with precise values', () => {
    expect(toCelsius(32)).toBe(0);
    expect(toCelsius(212)).toBe(100);
    expect(toCelsius(68)).toBeCloseTo(20, 10);
  });

  it('formats for the active unit and records the rounding rule', () => {
    expect(TEMPERATURE_ROUNDING_RULE).toBe('nearest whole number');
    expect(formatTemperature(0, 'celsius')).toBe('0°C');
    expect(formatTemperature(0.5, 'celsius')).toBe('1°C');
    expect(formatTemperature(32, 'fahrenheit')).toBe('32°F');
    expect(formatTemperature(68.6, 'fahrenheit')).toBe('69°F');
  });
});
