import { describe, expect, it } from 'vitest';
import { getWeatherConditionLabel } from '../../src/lib/weatherCode';

describe('weather code mapping', () => {
  it.each([
    [0, 'Céu limpo'],
    [1, 'Predominantemente limpo'],
    [2, 'Parcialmente nublado'],
    [3, 'Nublado'],
    [45, 'Nevoeiro'],
    [48, 'Nevoeiro com geada'],
    [51, 'Garoa leve'],
    [53, 'Garoa'],
    [55, 'Garoa forte'],
    [56, 'Geada leve'],
    [57, 'Geada forte'],
    [61, 'Chuva leve'],
    [63, 'Chuva moderada'],
    [65, 'Chuva forte'],
    [66, 'Chuva gelada leve'],
    [67, 'Chuva gelada forte'],
    [71, 'Neve leve'],
    [73, 'Neve moderada'],
    [75, 'Neve forte'],
    [77, 'Granizo'],
    [80, 'Pancadas leves'],
    [81, 'Pancadas moderadas'],
    [82, 'Pancadas fortes'],
    [85, 'Neve leve em pancadas'],
    [86, 'Neve forte em pancadas'],
    [95, 'Trovoada'],
    [96, 'Trovoada com granizo leve'],
    [99, 'Trovoada com granizo forte'],
  ])('maps WMO code %i to %s', (code, expected) => {
    expect(getWeatherConditionLabel(code)).toBe(expected);
  });

  it('returns a generic label for unknown codes without exposing the number', () => {
    expect(getWeatherConditionLabel(999)).toBe('Condição meteorológica');
    expect(getWeatherConditionLabel(999)).not.toContain('999');
  });
});
