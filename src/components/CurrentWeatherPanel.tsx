import { formatCivilDate, formatReferenceDate } from '../lib/date';
import { formatTemperature, toFahrenheit } from '../lib/temperature';
import type { Unit, WeatherData } from '../types/weather';

interface CurrentWeatherPanelProps {
  weather: WeatherData;
  unit: Unit;
}

export default function CurrentWeatherPanel({ weather, unit }: CurrentWeatherPanelProps) {
  const temperature =
    unit === 'fahrenheit' ? toFahrenheit(weather.current.temperature) : weather.current.temperature;

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Agora</p>
          <h2 className="mt-1 text-4xl font-semibold text-white">
            {formatTemperature(temperature, unit)}
          </h2>
        </div>
        <div className="text-right text-slate-200">
          <p className="text-lg font-medium">{weather.city.name}</p>
          <p className="text-sm text-slate-400">{weather.current.condition}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Condição</p>
          <p className="mt-2 text-base text-white">{weather.current.condition}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Atualizado</p>
          <p className="mt-2 text-base text-white">
            {formatCivilDate(weather.current.observedAt, weather.current.timezone) ??
              weather.current.observedAt}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fuso</p>
          <p className="mt-2 text-base text-white">
            {formatReferenceDate(weather.current.observedAt, weather.current.timezone)}
          </p>
        </div>
      </div>
    </article>
  );
}
