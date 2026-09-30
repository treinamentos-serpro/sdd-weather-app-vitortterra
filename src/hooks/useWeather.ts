import { useCallback, useMemo, useState } from 'react';
import { normalizeCityQuery } from '../lib/search';
import { fetchWeatherForCoordinates, searchCities } from '../services/openMeteo';
import type { City, WeatherData } from '../types/weather';

export type WeatherRequestStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export function useWeather() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchStatus, setSearchStatus] = useState<WeatherRequestStatus>('idle');
  const [weatherStatus, setWeatherStatus] = useState<WeatherRequestStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const queryCache = useMemo(() => new Map<string, City[]>(), []);

  const submitSearch = useCallback(
    async (nextQuery: string) => {
      const normalized = normalizeCityQuery(nextQuery);
      setSearchQuery(nextQuery.trim());

      if (!normalized) {
        setSearchResults([]);
        setSearchStatus('empty');
        return;
      }

      const cacheKey = normalized.toLowerCase();
      const cached = queryCache.get(cacheKey);

      if (cached) {
        setSearchResults(cached);
        setSearchStatus(cached.length === 0 ? 'empty' : 'success');
        return;
      }

      setSearchStatus('loading');
      setErrorMessage('');

      try {
        const results = await searchCities(normalized);
        queryCache.set(cacheKey, results);
        setSearchResults(results);
        setSearchStatus(results.length === 0 ? 'empty' : 'success');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Não foi possível buscar cidades.';
        setErrorMessage(message);
        setSearchStatus('error');
      }
    },
    [queryCache],
  );

  const selectCity = useCallback(async (city: City) => {
    setSelectedCity(city);
    setWeatherStatus('loading');
    setErrorMessage('');

    try {
      const data = await fetchWeatherForCoordinates(city.latitude, city.longitude);
      setWeather(data);
      setWeatherStatus('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível obter o clima.';
      setErrorMessage(message);
      setWeatherStatus('error');
    }
  }, []);

  const retryWeather = useCallback(async () => {
    if (!selectedCity) {
      setWeatherStatus('idle');
      return;
    }

    await selectCity(selectedCity);
  }, [selectCity, selectedCity]);

  const retrySearch = useCallback(async () => {
    if (!searchQuery) {
      setSearchStatus('idle');
      return;
    }

    await submitSearch(searchQuery);
  }, [searchQuery, submitSearch]);

  return {
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
  };
}
