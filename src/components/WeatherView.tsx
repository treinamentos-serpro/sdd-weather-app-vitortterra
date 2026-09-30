import type { City, Unit, WeatherData } from '../types/weather';
import CurrentWeatherPanel from './CurrentWeatherPanel';
import ForecastList from './ForecastList';
import StatusMessage from './StatusMessage';
import UnitToggle from './UnitToggle';

interface WeatherViewProps {
  weather: WeatherData | null;
  status: 'idle' | 'loading' | 'success' | 'error' | 'empty';
  query: string;
  unit: Unit;
  onUnitChange: (nextUnit: Unit) => void;
  onRetry: () => void;
  cities: City[];
  selectedCityId?: number | null;
  onSelectCity: (city: City) => void;
  searchStatus: 'idle' | 'loading' | 'success' | 'error' | 'empty';
}

export default function WeatherView({
  weather,
  status,
  query,
  unit,
  onUnitChange,
  onRetry,
  cities,
  selectedCityId,
  onSelectCity,
  searchStatus,
}: WeatherViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Previsão</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Clima</h1>
        </div>
        <UnitToggle unit={unit} onChange={onUnitChange} />
      </div>

      {weather ? <CurrentWeatherPanel weather={weather} unit={unit} /> : null}
      {weather && weather.daily.length > 0 ? (
        <ForecastList days={weather.daily} unit={unit} timezone={weather.current.timezone} />
      ) : null}

      {searchStatus !== 'success' && searchStatus !== 'loading' ? (
        <StatusMessage
          status={searchStatus}
          query={query}
          errorMessage={status === 'error' ? 'Não foi possível buscar o clima.' : undefined}
          onRetry={onRetry}
        />
      ) : null}

      {cities.length > 0 ? (
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/60 p-3">
          {cities.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`mb-2 block w-full rounded-lg px-3 py-2 text-left ${
                city.id === selectedCityId
                  ? 'bg-sky-500/20 text-white'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              {city.name} {city.region ? `- ${city.region}` : ''}
            </button>
          ))}
        </div>
      ) : null}

      {!weather && status === 'error' ? (
        <StatusMessage
          status={status}
          query={query}
          errorMessage="Não foi possível obter o clima."
          onRetry={onRetry}
        />
      ) : null}
    </div>
  );
}
