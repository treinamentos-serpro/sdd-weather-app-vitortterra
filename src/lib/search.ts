export const MIN_CITY_QUERY_LENGTH = 2;

export function normalizeCityQuery(input: string): string | null {
  const normalized = input.trim();

  if (normalized.length === 0 || normalized.length < MIN_CITY_QUERY_LENGTH) {
    return null;
  }

  return normalized;
}

export function buildCitySearchUrl(input: string): string | null {
  const normalized = normalizeCityQuery(input);

  if (!normalized) {
    return null;
  }

  const encodedName = encodeURIComponent(normalized);

  return `https://geocoding-api.open-meteo.com/v1/search?name=${encodedName}&count=5&language=pt&format=json`;
}
