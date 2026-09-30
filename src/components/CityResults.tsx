import type { City } from '../types/weather';

interface CityResultsProps {
  cities: City[];
  selectedCityId?: number | null;
  onSelect: (city: City) => void;
}

export default function CityResults({ cities, selectedCityId, onSelect }: CityResultsProps) {
  if (cities.length === 0) {
    return null;
  }

  return (
    <div className="mt-4" role="region" aria-label="Resultados da busca">
      <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-300">
        Selecione uma cidade
      </h2>
      <ul className="space-y-2">
        {cities.map((city) => {
          const selected = city.id === selectedCityId;
          return (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => onSelect(city)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                  selected
                    ? 'border-sky-400 bg-sky-500/10 text-sky-100'
                    : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500'
                }`}
              >
                <span>
                  <span className="block font-medium">{city.name}</span>
                  <span className="text-xs text-slate-400">
                    {city.region ?? city.country ?? 'Local'}
                  </span>
                </span>
                <span className="text-xs text-slate-300">{city.country ?? 'Global'}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
