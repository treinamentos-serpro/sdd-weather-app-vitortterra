import type { FormEvent } from 'react';

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  isLoading: boolean;
  error?: string;
}

export default function SearchForm({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
}: SearchFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <label htmlFor="city-search" className="mb-2 block text-sm font-medium text-slate-200">
        Cidade
      </label>
      <div className="flex gap-2">
        <input
          id="city-search"
          name="city-search"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite a cidade"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'city-search-help' : undefined}
          className="flex-1 rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none ring-0 transition focus:border-sky-400"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-sky-500 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Buscar
        </button>
      </div>
      {error ? (
        <p id="city-search-help" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
      {isLoading ? (
        <div role="status" className="mt-2 text-sm text-sky-200">
          Buscando cidade…
        </div>
      ) : null}
    </form>
  );
}
