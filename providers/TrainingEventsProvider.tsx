'use client';

import React, { createContext, useContext, useState } from 'react';
import { TrainingEvent } from '@/types/training';

interface TrainingEventsContextType {
  events: TrainingEvent[];
  setEvents: React.Dispatch<React.SetStateAction<TrainingEvent[]>>;
}

const TrainingEventsContext = createContext<
  TrainingEventsContextType | undefined
>(undefined);

export function useTrainingEvents() {
  const context = useContext(TrainingEventsContext);
  if (context === undefined) {
    throw new Error(
      'useTrainingEvents must be used within a TrainingEventsProvider'
    );
  }
  return context;
}

interface TrainingEventsProviderProps {
  children: React.ReactNode;
  initialEvents: TrainingEvent[];
}

export function TrainingEventsProvider({
  children,
  initialEvents,
}: TrainingEventsProviderProps) {
  const [events, setEvents] = useState<TrainingEvent[]>(initialEvents);

  return (
    <TrainingEventsContext.Provider value={{ events, setEvents }}>
      {children}
    </TrainingEventsContext.Provider>
  );
}
