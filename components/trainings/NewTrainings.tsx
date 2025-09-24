'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import '@/components/trainings/Trainings.css';
import { useTrainingEvents } from '@/providers/TrainingEventsProvider';
import { useTranslation } from 'react-i18next';

import { EventFilters } from './EventFilters';
import { LocationSearch } from './LocationSearch';
import { TrainingTab } from '../trainingTab/TrainingTab';
import { TrainingEventList } from './TrainingEventList';
import { TrainingMapView } from './TrainingMapView';
import { CreateEventCTA } from './CreateEventCTA';

import {
  useTrainingEventsFilter,
  useEventFiltering,
} from '@/hooks/useTrainingEvents';
import { useLocationSuggestions } from '@/hooks/useLocationSuggestions';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReviewedEvents } from '@/hooks/useReviewedEvents';
import useDebounce from '@/helpers/useDebounce';
import { Separator } from '@/components/ui/separator';

type TabType = 'upcoming' | 'myEvents' | 'past';

export default function NewTrainings() {
  const { data: session } = useSession();
  const { events } = useTrainingEvents();

  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const searchQuery = useDebounce(searchInput, 300);
  const { t } = useTranslation();

  const userPosition = useGeolocation();
  const { upcomingEvents, userEvents, pastEvents } = useTrainingEventsFilter(
    events,
    session?.user?.id
  );
  const reviewedEventIds = useReviewedEvents(pastEvents, activeTab);

  const displayEvents = useMemo(() => {
    switch (activeTab) {
      case 'myEvents':
        return userEvents;
      case 'past':
        return pastEvents;
      case 'upcoming':
      default:
        return upcomingEvents;
    }
  }, [activeTab, upcomingEvents, userEvents, pastEvents]);

  const locationSuggestions = useLocationSuggestions(displayEvents);
  const filteredEvents = useEventFiltering(
    displayEvents,
    searchQuery,
    selectedActivity
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 lg:p-8">
      <div className="flex flex-wrap gap-4 justify-center w-full mb-4">
        <div className="tabs tabs-boxed bg-base-200/50 p-2 rounded-xl mr-auto ml-[21%]">
          <TrainingTab
            label={t('upcomingEvents')}
            activeTab={activeTab}
            activeLabel="upcoming"
            onClick={() => setActiveTab('upcoming')}
          />
          <TrainingTab
            label={t('myEvents')}
            activeTab={activeTab}
            activeLabel="myEvents"
            onClick={() => setActiveTab('myEvents')}
          />
          <TrainingTab
            label={t('pastEvents')}
            activeTab={activeTab}
            activeLabel="past"
            onClick={() => setActiveTab('past')}
          />
        </div>

        <LocationSearch
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          locationSuggestions={locationSuggestions}
        />
        <EventFilters
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
        />
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-center max-w-full gap-8 w-full">
        <div className="w-full lg:w-1/6 xl:w-1/5">
          <div className="overflow-y-auto max-h-[80vh] space-y-6 rounded-xl bg-base-100">
            <h1 className="text-2xl font-bold pt-6 pl-6">Filters</h1>
            <Separator />
            <button>test</button>
          </div>
        </div>
        <div className="w-full lg:w-3/6 xl:w-2/5 bg-background">
          <div className="no-scrollbar overflow-y-auto max-h-[75vh] pr-4 space-y-6 rounded-xl bg-base-100 p-6">
            <TrainingEventList
              events={filteredEvents}
              activeTab={activeTab}
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
          <CreateEventCTA />
        </div>
      </div>
    </div>
  );
}
