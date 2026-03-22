'use client';

import { createContext, useContext, useState } from 'react';
import { LocationSuggestion } from '@/components/map/types';

interface TrainingsSearchContextType {
  locationSuggestions: LocationSuggestion[];
  setLocationSuggestions: (suggestions: LocationSuggestion[]) => void;
}

const TrainingsSearchContext = createContext<TrainingsSearchContextType | null>(null);

export function TrainingsSearchProvider({ children }: { children: React.ReactNode }) {
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);

  return (
    <TrainingsSearchContext.Provider value={{ locationSuggestions, setLocationSuggestions }}>
      {children}
    </TrainingsSearchContext.Provider>
  );
}

export function useTrainingsSearch() {
  const ctx = useContext(TrainingsSearchContext);
  if (!ctx) throw new Error('useTrainingsSearch must be used within TrainingsSearchProvider');
  return ctx;
}
