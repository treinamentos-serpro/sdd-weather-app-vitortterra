import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import WeatherView from '../../src/components/WeatherView';
import type { WeatherData } from '../../src/types/weather';

describe('WeatherView', () => {
  it('renders current weather and forecast when data is available', () => {
    const weather = {
      city: { id: 1, name: 'São Paulo', latitude: -23.55, longitude: -46.64, country: 'Brazil' },
      current: {
        temperature: 25,
        condition: 'Céu limpo',
        observedAt: '2025-01-10T12:00',
        timezone: 'America/Sao_Paulo',
      },
      daily: [
        { date: '2025-01-10', minTemperature: 20, maxTemperature: 28, condition: 'Céu limpo' },
        {
          date: '2025-01-11',
          minTemperature: 19,
          maxTemperature: 27,
          condition: 'Parcialmente nublado',
        },
        { date: '2025-01-12', minTemperature: 18, maxTemperature: 26, condition: 'Nublado' },
        { date: '2025-01-13', minTemperature: 17, maxTemperature: 25, condition: 'Chuva leve' },
        { date: '2025-01-14', minTemperature: 16, maxTemperature: 24, condition: 'Céu limpo' },
      ],
      fetchedAt: '2025-01-10T12:00:00Z',
    } as unknown as WeatherData;

    render(
      <WeatherView
        weather={weather}
        status="success"
        query="São Paulo"
        unit="celsius"
        onUnitChange={() => undefined}
        onRetry={() => undefined}
        cities={[]}
        onSelectCity={() => undefined}
        searchStatus="success"
      />,
    );

    expect(screen.getAllByText('25°C').length).toBeGreaterThan(0);
    expect(screen.getByText('Próximos dias')).toBeInTheDocument();
  });
});
