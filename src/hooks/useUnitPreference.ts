import { useCallback, useEffect, useState } from 'react';
import type { Unit } from '../types/weather';

const STORAGE_KEY = 'weather-app:unit';

export function useUnitPreference() {
  const [unit, setUnit] = useState<Unit>(() => {
    if (typeof window === 'undefined') {
      return 'celsius';
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, unit);
    }
  }, [unit]);

  const setPreferredUnit = useCallback((nextUnit: Unit) => {
    setUnit(nextUnit);
  }, []);

  return {
    unit,
    setUnit: setPreferredUnit,
  };
}
