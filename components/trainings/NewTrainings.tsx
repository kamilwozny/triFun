'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import '@/components/trainings/Trainings.css';
import { useTrainingEvents } from '@/providers/TrainingEventsProvider';
import { useTranslation } from 'react-i18next';

import { TrainingEventList } from './TrainingEventList';
import { TrainingMapView } from './TrainingMapView';
import { EventTypeCheckboxes, EventTypeFilters } from './EventTypeCheckboxes';
import { SportTypeFilters, SportType } from './SportTypeFilters';
import { LocationSearch } from './LocationSearch';
import { useLocationSuggestions } from '@/hooks/useLocationSuggestions';
import { useTrainingsSearch } from '@/providers/TrainingsSearchContext';

import {
  useAdvancedEventFiltering,
  getDefaultFilters,
  AllFilters,
} from '@/hooks/useAdvancedEventFiltering';
import { getTodayMidnight } from '@/lib/utils';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReviewedEvents } from '@/hooks/useReviewedEvents';
import useDebounce from '@/hooks/useDebounce';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewTrainingsProps {
  initialSearch?: string;
  initialLocation?: string;
  initialRadius?: string;
}

export default function NewTrainings({
  initialSearch = '',
  initialLocation = '',
  initialRadius = '0',
}: NewTrainingsProps) {
  const { data: session } = useSession();
  const { events } = useTrainingEvents();
  const { t } = useTranslation();
  const router = useRouter();

  const [filters, setFilters] = useState<AllFilters>(() => ({
    ...getDefaultFilters(),
    location: {
      city: initialLocation,
      distanceKm: Number(initialRadius),
    },
  }));

  const [showMap, setShowMap] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(initialSearch);
  const [mobileLocation, setMobileLocation] = useState(initialLocation);
  const [mobileRadius, setMobileRadius] = useState(
    initialRadius && initialRadius !== '0' ? initialRadius : '10',
  );

  const debouncedFilters = useDebounce(filters, 400);

  const userPosition = useGeolocation();

  const filteredEvents = useAdvancedEventFiltering(
    events,
    debouncedFilters,
    session?.user?.id,
    userPosition ?? undefined,
  );

  const pastEvents = useMemo(() => {
    const today = getTodayMidnight();
    return events.filter((event) => new Date(event.date) < today);
  }, [events]);

  const reviewedEventIds = useReviewedEvents(pastEvents, 'past');

  const handleEventTypeFiltersChange = useCallback(
    (eventTypeFilters: EventTypeFilters) => {
      setFilters((prev) => ({ ...prev, eventType: eventTypeFilters }));
    },
    [],
  );

  const handleSportsChange = useCallback((sports: SportType[]) => {
    setFilters((prev) => ({ ...prev, sports }));
  }, []);

  const locationSuggestionsFromEvents = useLocationSuggestions(events);
  const { setLocationSuggestions } = useTrainingsSearch();

  useEffect(() => {
    setLocationSuggestions(locationSuggestionsFromEvents);
  }, [locationSuggestionsFromEvents, setLocationSuggestions]);

  const handleMobileSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (mobileSearch.trim()) params.set('search', mobileSearch.trim());
    if (mobileLocation.trim()) params.set('location', mobileLocation.trim());
    if (mobileLocation.trim() && mobileRadius !== '0')
      params.set('radius', mobileRadius);
    router.push(`/trainings${params.toString() ? `?${params}` : ''}`);
  }, [mobileSearch, mobileLocation, mobileRadius, router]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 lg:p-8">
      <div className="lg:hidden w-full space-y-3">
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-4 space-y-2">
          <input
            className="input input-bordered h-9 w-full text-sm text-black"
            placeholder={t('searchEventKeyword', 'Search event, keyword…')}
            value={mobileSearch}
            onChange={(e) => setMobileSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMobileSearch()}
          />
          <div className="flex gap-2">
            <LocationSearch
              searchInput={mobileLocation}
              setSearchInput={setMobileLocation}
              locationSuggestions={locationSuggestionsFromEvents}
              onSearch={handleMobileSearch}
              className="flex-1"
            />
            {mobileLocation.trim() && (
              <Select value={mobileRadius} onValueChange={setMobileRadius}>
                <SelectTrigger className="h-9 w-20 text-sm text-black shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50, 100].map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d}km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <button
              className="btn btn-sm rounded-full bg-foreground text-white hover:bg-foreground/80 shrink-0 px-4"
              onClick={handleMobileSearch}
            >
              {t('search', 'Search')}
            </button>
          </div>
        </div>

        <div className="flex gap-1 p-1 bg-base-200 rounded-2xl">
          <button
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
              showMobileFilters
                ? 'bg-foreground text-white shadow-sm'
                : 'text-base-content/70 hover:text-base-content'
            }`}
            onClick={() => setShowMobileFilters((v) => !v)}
          >
            {t('filters')}
          </button>
          <button
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
              showMap
                ? 'bg-foreground text-white shadow-sm'
                : 'text-base-content/70 hover:text-base-content'
            }`}
            onClick={() => setShowMap((v) => !v)}
          >
            {showMap ? t('hideMap', 'Hide Map') : t('showMap', 'Show Map')}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
            showMobileFilters
              ? 'max-h-[600px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-base-100 rounded-2xl border border-base-300 p-4 flex gap-6">
            <div className="flex-1">
              <EventTypeCheckboxes
                filters={filters.eventType}
                onFiltersChange={handleEventTypeFiltersChange}
              />
            </div>
            <div className="shrink-0">
              <h3 className="text-sm font-semibold mb-3 text-black">
                {t('sportType')}
              </h3>
              <SportTypeFilters
                selectedSports={filters.sports}
                onSportsChange={handleSportsChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden w-full">
        {showMap ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[70vh]">
            <TrainingMapView
              userPosition={userPosition}
              events={filteredEvents}
              selectedTraining={null}
            />
          </div>
        ) : (
          <div className="no-scrollbar overflow-y-auto max-h-[70vh] rounded-2xl bg-base-100 p-4 space-y-6">
            <TrainingEventList
              events={filteredEvents}
              activeTab={'upcoming'}
              userId={session?.user?.id}
              reviewedEventIds={reviewedEventIds}
            />
          </div>
        )}
      </div>

      <div className="hidden lg:flex flex-row items-start justify-center max-w-full gap-8 w-full">
        <div className="w-1/6 xl:w-1/5">
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

        <div className="w-3/6 xl:w-2/5">
          <div className="no-scrollbar overflow-y-auto max-h-[70vh] pr-4 space-y-6 rounded-xl bg-base-100 p-6">
            <TrainingEventList
              events={filteredEvents}
              activeTab={'upcoming'}
              userId={session?.user?.id}
              reviewedEventIds={reviewedEventIds}
            />
          </div>
        </div>

        <div className="w-2/6 xl:w-2/5 sticky top-0">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden h-[70vh]">
            <TrainingMapView
              userPosition={userPosition}
              events={filteredEvents}
              selectedTraining={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
