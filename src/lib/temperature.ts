import type { Unit } from '../types/weather';

export const TEMPERATURE_ROUNDING_RULE = 'nearest whole number' as const;

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function toCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function formatTemperature(value: number, unit: Unit): string {
  const displayValue = Math.round(value);
  const symbol = unit === 'celsius' ? 'C' : 'F';

  return `${displayValue}°${symbol}`;
}
