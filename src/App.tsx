import { useMemo } from 'react';
import CityResults from './components/CityResults';
import SearchForm from './components/SearchForm';
import StatusMessage from './components/StatusMessage';
import WeatherView from './components/WeatherView';
import { useUnitPreference } from './hooks/useUnitPreference';
import { useWeather } from './hooks/useWeather';

export default function App() {
  const { unit, setUnit } = useUnitPreference();
  const {
    searchQuery,
    searchResults,
    selectedCity,
    weather,
    searchStatus,
    weatherStatus,
    errorMessage,
    setSearchQuery,
    submitSearch,
    selectCity,
    retrySearch,
    retryWeather,
  } = useWeather();

  const selectedCityId = useMemo(() => selectedCity?.id ?? null, [selectedCity]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-slate-950/30 backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-300">Weather App</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Previsão do tempo</h1>
            </div>
          </div>

          <div className="mt-6">
            <SearchForm
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={submitSearch}
              isLoading={searchStatus === 'loading'}
              error={searchStatus === 'error' ? errorMessage : undefined}
            />
          </div>

          {searchResults.length > 0 ? (
            <CityResults
              cities={searchResults}
              selectedCityId={selectedCityId}
              onSelect={selectCity}
            />
          ) : null}
        </header>

        <section className="mt-6 space-y-4">
          {searchStatus === 'empty' && !weather ? (
            <StatusMessage status="empty" query={searchQuery} />
          ) : null}

          {searchStatus === 'idle' && !weather ? (
            <StatusMessage status="idle" query={searchQuery} />
          ) : null}

          {weather || weatherStatus === 'loading' ? (
            <WeatherView
              weather={weather}
              status={weatherStatus}
              query={searchQuery}
              unit={unit}
              onUnitChange={setUnit}
              onRetry={retryWeather}
              cities={searchResults}
              selectedCityId={selectedCityId}
              onSelectCity={selectCity}
              searchStatus={searchStatus}
            />
          ) : null}

          {weatherStatus === 'error' ? (
            <StatusMessage
              status="error"
              query={searchQuery}
              errorMessage={errorMessage}
              onRetry={retrySearch}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}
