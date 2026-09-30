const weatherCodeMap: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Nevoeiro',
  48: 'Nevoeiro com geada',
  51: 'Garoa leve',
  53: 'Garoa',
  55: 'Garoa forte',
  56: 'Geada leve',
  57: 'Geada forte',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva gelada leve',
  67: 'Chuva gelada forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Granizo',
  80: 'Pancadas leves',
  81: 'Pancadas moderadas',
  82: 'Pancadas fortes',
  85: 'Neve leve em pancadas',
  86: 'Neve forte em pancadas',
  95: 'Trovoada',
  96: 'Trovoada com granizo leve',
  99: 'Trovoada com granizo forte',
};

export function getWeatherConditionLabel(code: number): string {
  return weatherCodeMap[code] ?? 'Condição meteorológica';
}
