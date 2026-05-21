import { useState, useEffect, useRef } from 'react';

export interface CityResult {
  city_name: string;
  city_slug: string;
}

export function useCitySearch(query: string, debounceMs = 200) {
  const [results, setResults] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/cities?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
        });
        const data: CityResult[] = await res.json();
        setResults(data);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return { results, isLoading };
}
