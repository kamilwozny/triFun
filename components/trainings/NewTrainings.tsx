'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import '@/components/trainings/Trainings.css';
import { useTrainingEvents } from '@/providers/TrainingEventsProvider';
import { useTranslation } from 'react-i18next';

import { TrainingEventList } from './TrainingEventList';
import { TrainingMapView } from './TrainingMapView';
import { CreateEventCTA } from './CreateEventCTA';
import { EventTypeCheckboxes, EventTypeFilters } from './EventTypeCheckboxes';
import { SportTypeFilters, SportType } from './SportTypeFilters';

import {
  useAdvancedEventFiltering,
  getDefaultFilters,
  AllFilters,
} from '@/hooks/useAdvancedEventFiltering';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReviewedEvents } from '@/hooks/useReviewedEvents';
import useDebounce from '@/helpers/useDebounce';
import { Separator } from '@/components/ui/separator';
import { SearchTrainings } from './SearchTrainings';

export default function NewTrainings() {
  const { data: session } = useSession();
  const { events } = useTrainingEvents();
  const { t } = useTranslation();

  const [filters, setFilters] = useState<AllFilters>(getDefaultFilters());

  const debouncedFilters = useDebounce(filters, 400);

  const userPosition = useGeolocation();

  const filteredEvents = useAdvancedEventFiltering(
    events,
    debouncedFilters,
    session?.user?.id,
  );

  const pastEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate < today;
    });
  }, [events]);

  const reviewedEventIds = useReviewedEvents(pastEvents, 'past');

  const handleEventTypeFiltersChange = (eventTypeFilters: EventTypeFilters) => {
    setFilters((prev) => ({
      ...prev,
      eventType: eventTypeFilters,
    }));
  };

  const handleSportsChange = (sports: SportType[]) => {
    setFilters((prev) => ({
      ...prev,
      sports,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row items-start justify-center max-w-full gap-8 w-full">
        <div className="w-full lg:w-1/6 xl:w-1/5">
          <div className="overflow-y-auto max-h-[80vh] space-y-6 rounded-xl bg-base-100 p-6">
            <h1 className="text-2xl font-bold text-black">{t('filters')}</h1>
            <Separator />

            <EventTypeCheckboxes
              filters={filters.eventType}
              onFiltersChange={handleEventTypeFiltersChange}
            />

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 text-black">
                {t('sportType')}
              </h3>
              <SportTypeFilters
                selectedSports={filters.sports}
                onSportsChange={handleSportsChange}
              />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/6 xl:w-2/5">
          <SearchTrainings />
          <div className="no-scrollbar overflow-y-auto max-h-[70vh] pr-4 space-y-6 rounded-xl bg-base-100 p-6 mt-6">
            <TrainingEventList
              events={filteredEvents}
              activeTab={'upcoming'}
              userId={session?.user?.id}
              reviewedEventIds={reviewedEventIds}
            />
          </div>
        </div>

        <div className="w-full lg:w-2/6 xl:w-2/5 sticky top-0">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <TrainingMapView
              userPosition={userPosition}
              events={filteredEvents}
              selectedTraining={null}
            />
          </div>
          {/* <CreateEventCTA /> */}
        </div>
      </div>
    </div>
  );
}
