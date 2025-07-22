import { useMemo } from 'react';
import { TrainingEvent } from '@/types/training';
import { LocationSuggestion } from '../components/map/types';

export function useLocationSuggestions(events: TrainingEvent[]): LocationSuggestion[] {
  return useMemo(() => {
    const suggestions: LocationSuggestion[] = [];
    const uniqueCities = new Set<string>();
    const uniqueCountries = new Set<string>();

    events.forEach((event) => {
      if (!uniqueCities.has(event.city.toLowerCase())) {
        uniqueCities.add(event.city.toLowerCase());
        suggestions.push({ text: event.city, type: 'city' });
      }
      if (!uniqueCountries.has(event.country.toLowerCase())) {
        uniqueCountries.add(event.country.toLowerCase());
        suggestions.push({ text: event.country, type: 'country' });
      }
    });

    return suggestions;
  }, [events]);
}