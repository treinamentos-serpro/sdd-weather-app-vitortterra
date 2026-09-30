import { formatDateLabel } from '../lib/date';
import { formatTemperature, toFahrenheit } from '../lib/temperature';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastListProps {
  days: ForecastDay[];
  unit: Unit;
  timezone?: string;
}

export default function ForecastList({ days, unit, timezone }: ForecastListProps) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 text-lg font-semibold text-white">Próximos dias</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {days.map((day) => {
          const min = unit === 'fahrenheit' ? toFahrenheit(day.minTemperature) : day.minTemperature;
          const max = unit === 'fahrenheit' ? toFahrenheit(day.maxTemperature) : day.maxTemperature;

          return (
            <article
              key={day.date}
              className="rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-slate-100"
            >
              <p className="text-sm font-medium text-sky-200">
                {formatDateLabel(day.date, timezone) ?? day.date}
              </p>
              <p className="mt-2 text-xs text-slate-400">{day.condition}</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-lg font-semibold">{formatTemperature(max, unit)}</span>
                <span className="text-sm text-slate-400">{formatTemperature(min, unit)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
