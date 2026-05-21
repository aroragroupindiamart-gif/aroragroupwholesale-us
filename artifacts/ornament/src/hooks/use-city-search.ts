import { useState, useEffect, useRef } from 'react';

export interface CityResult {
  city_name: string;
  city_slug: string;
}

let citiesCache: CityResult[] | null = null;
let citiesPromise: Promise<CityResult[]> | null = null;

function loadCities(): Promise<CityResult[]> {
  if (citiesCache) return Promise.resolve(citiesCache);
  if (citiesPromise) return citiesPromise;
  citiesPromise = fetch('/cities.json')
    .then((r) => r.json())
    .then((data: CityResult[]) => {
      citiesCache = data;
      return data;
    })
    .catch(() => []);
  return citiesPromise;
}

export function useCitySearch(query: string, debounceMs = 200) {
  const [results, setResults] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (query.trim().length < 1) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    timerRef.current = setTimeout(async () => {
      const all = await loadCities();
      const q = query.toLowerCase();
      const filtered = all
        .filter((c) => c.city_name.toLowerCase().includes(q))
        .slice(0, 8);
      setResults(filtered);
      setIsLoading(false);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, debounceMs]);

  return { results, isLoading };
}
