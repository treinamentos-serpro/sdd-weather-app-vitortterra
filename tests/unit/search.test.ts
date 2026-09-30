import { describe, expect, it } from 'vitest';
import { buildCitySearchUrl, normalizeCityQuery } from '../../src/lib/search';

describe('normalizeCityQuery', () => {
  it('rejects empty, whitespace-only and single-character values', () => {
    expect(normalizeCityQuery('')).toBeNull();
    expect(normalizeCityQuery('   ')).toBeNull();
    expect(normalizeCityQuery('A')).toBeNull();
  });

  it('accepts two-character queries and trims surrounding spaces', () => {
    expect(normalizeCityQuery('  SP  ')).toBe('SP');
    expect(normalizeCityQuery('  Rj  ')).toBe('Rj');
  });

  it('preserves accents and special characters in the normalized query', () => {
    const query = '  São José - Pires  ';

    expect(normalizeCityQuery(query)).toBe('São José - Pires');
    expect(buildCitySearchUrl(query)).toBe(
      'https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Jos%C3%A9%20-%20Pires&count=5&language=pt&format=json',
    );
  });

  it('does not interpret input as HTML or executable code', () => {
    const unsafe = '<script>alert("xss")</script>';
    const output = normalizeCityQuery(unsafe);
    const url = buildCitySearchUrl(unsafe);

    expect(output).toBe('<script>alert("xss")</script>');
    expect(url).toContain('%3Cscript%3E');
    expect(url).toContain('%3C%2Fscript%3E');
    expect(url).not.toContain('<script>');
  });
});
