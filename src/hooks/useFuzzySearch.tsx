import { useMemo } from 'react';
import Fuse from 'fuse.js';

interface FuzzySearchOptions {
  keys: string[];
  threshold?: number;
  includeScore?: boolean;
}

/**
 * Hook for fuzzy search functionality
 * @param items Array of items to search
 * @param searchTerm Search term
 * @param options Fuse.js options
 */
export function useFuzzySearch<T>(
  items: T[],
  searchTerm: string,
  options: FuzzySearchOptions
) {
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: options.keys,
      threshold: options.threshold || 0.3, // 0 = perfect match, 1 = match anything
      includeScore: options.includeScore || false,
      ignoreLocation: true,
      minMatchCharLength: 2,
      findAllMatches: true,
    });
  }, [items, options.keys, options.threshold, options.includeScore]);

  const results = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return items;
    }

    const fuseResults = fuse.search(searchTerm);
    return fuseResults.map((result) => result.item);
  }, [fuse, searchTerm, items]);

  return results;
}
