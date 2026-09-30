import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (nextUnit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-slate-600 bg-slate-900 p-1"
      role="group"
      aria-label="Unidade de temperatura"
    >
      {(['celsius', 'fahrenheit'] as const).map((option) => {
        const selected = unit === option;
        const label = option === 'celsius' ? '°C' : '°F';

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={selected}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              selected ? 'bg-sky-500 text-white' : 'text-slate-300'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
