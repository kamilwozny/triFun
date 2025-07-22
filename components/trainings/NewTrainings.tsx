'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import '@/components/trainings/Trainings.css';
import { useTrainingEvents } from '@/providers/TrainingEventsProvider';

import { EventFilters } from './EventFilters';
import { LocationSearch } from './LocationSearch';
import { TrainingTab } from '../trainingTab/TrainingTab';
import { TrainingEvent } from '@/types/training';
import { TrainingEventList } from './TrainingEventList';
import { TrainingMapView } from './TrainingMapView';
import { CreateEventCTA } from './CreateEventCTA';
import { ReviewModal } from './ReviewModal';

import { useTrainingEventsFilter, useEventFiltering } from '@/hooks/useTrainingEvents';
import { useLocationSuggestions } from '@/hooks/useLocationSuggestions';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReviewedEvents } from '@/hooks/useReviewedEvents';
import useDebounce from '@/helpers/useDebounce';

type TabType = 'upcoming' | 'myEvents' | 'past';

export default function NewTrainings() {
  const { data: session } = useSession();
  const { events } = useTrainingEvents();
  
  // State
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewEventId, setReviewEventId] = useState<string>('');
  const [reviewEvent, setReviewEvent] = useState<TrainingEvent | undefined>();

  const searchQuery = useDebounce(searchInput, 300);
  
  // Custom hooks
  const userPosition = useGeolocation();
  const { upcomingEvents, userEvents, pastEvents } = useTrainingEventsFilter(events, session?.user?.id);
  const reviewedEventIds = useReviewedEvents(pastEvents, activeTab);


  // Select which events to display based on active tab
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
  const filteredEvents = useEventFiltering(displayEvents, searchQuery, selectedActivity);

  // Event handlers
  const handleSelectTraining = (eventId: string) => {
    setSelectedTraining(eventId);
  };

  const handleReviewEvent = (eventId: string) => {
    setReviewEventId(eventId);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  useEffect(() => {
    if (reviewEventId) {
      setReviewEvent(pastEvents.find((event) => event.id === reviewEventId));
    }
  }, [reviewEventId, pastEvents]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 lg:p-8">
      <div className="flex flex-wrap gap-4 justify-center w-full mb-4">
        <div className="tabs tabs-boxed bg-base-200/50 p-2 rounded-xl mr-auto">
          <TrainingTab
            label="Upcoming events"
            activeTab={activeTab}
            activeLabel="upcoming"
            onClick={() => setActiveTab('upcoming')}
          />
          <TrainingTab
            label="My events"
            activeTab={activeTab}
            activeLabel="myEvents"
            onClick={() => setActiveTab('myEvents')}
          />
          <TrainingTab
            label="Past events"
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
        <div className="w-full lg:w-1/2 xl:w-3/5">
          <div className="overflow-y-auto max-h-[80vh] pr-4 space-y-6 rounded-xl bg-base-100 p-6">
            <TrainingEventList
              events={filteredEvents}
              selectedTraining={selectedTraining}
              onSelectTraining={handleSelectTraining}
              activeTab={activeTab}
              userId={session?.user?.id}
              reviewedEventIds={reviewedEventIds}
              onReview={handleReviewEvent}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 xl:w-2/5 sticky top-0">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <TrainingMapView
              userPosition={userPosition}
              events={filteredEvents}
              selectedTraining={selectedTraining}
            />
          </div>
          <CreateEventCTA />
        </div>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={handleCloseReviewModal}
        reviewEvent={reviewEvent}
        reviewEventId={reviewEventId}
        userId={session?.user?.id}
      />
    </div>
  );
}
