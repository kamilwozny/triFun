'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { LatLng } from 'leaflet';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import '@/components/trainings/Trainings.css';
import Link from 'next/link';
import { useTrainingEvents } from '@/providers/TrainingEventsProvider';

import { useSession } from 'next-auth/react';
import { EventFilters } from './EventFilters';
import { LocationSearch } from './LocationSearch';
import { BulkReviewForm } from '../reviews/BulkReviewForm';
import useDebounce from '@/helpers/useDebounce';
import { LocationSuggestion } from '../map/types';
import { TrainingTab } from '../trainingTab/TrainingTab';
import { TrainingEvent } from '@/types/training';
import MapSkeleton from '../skeletons/MapSkeleton';
import { getReviewsForEvent } from '@/actions/reviews';

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Expert: 'bg-red-100 text-red-800',
};

type TabType = 'upcoming' | 'myEvents' | 'past';

export default function NewTrainings() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const { events } = useTrainingEvents();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [reviewedEventIds, setReviewedEventIds] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewEventId, setReviewEventId] = useState<string>('');
  const [reviewEvent, setReviewEvent] = useState<TrainingEvent | undefined>();

  const searchQuery = useDebounce(searchInput, 300);

  // Get upcoming events
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });
  }, [events]);

  // Filter events the user is participating in or created
  const userEvents = useMemo(() => {
    if (!session?.user?.id) return [];
    return upcomingEvents.filter((event) => {
      return (
        event.createdBy === session?.user?.id ||
        event.attendees?.find(
          (attendee) => attendee.attendeeId === session?.user?.id
        )
      );
    });
  }, [upcomingEvents, session?.user?.id]);

  // Get past events
  const pastEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate < today;
    });
  }, [events]);

  useEffect(() => {
    if (activeTab === 'past') {
      Promise.all(
        pastEvents.map(async (event) => {
          if (event.attendees && event.attendees.length < 1) return event.id;
          const reviews = await getReviewsForEvent(event.id);
          return reviews && reviews.length > 0 ? event.id : null;
        })
      ).then((ids) => {
        console.log(ids);
        setReviewedEventIds(ids.filter(Boolean) as string[]);
      });
    }
  }, [activeTab, pastEvents]);

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

  // Show suggestions of locations only on already created events
  const locationSuggestions = useMemo(() => {
    const suggestions: LocationSuggestion[] = [];
    const uniqueCities = new Set<string>();
    const uniqueCountries = new Set<string>();

    displayEvents.forEach((event) => {
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
  }, [displayEvents]);

  // Filter events based on search and tabs
  const filteredEvents = useMemo(() => {
    return displayEvents.filter((event) => {
      const matchesSearch = searchQuery
        ? event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.country.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesActivity =
        !selectedActivity || selectedActivity === 'All'
          ? true
          : event.activities.includes(selectedActivity);

      return matchesSearch && matchesActivity;
    });
  }, [displayEvents, selectedActivity, searchQuery]);

  // Map component
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/map/Map'), {
        loading: () => <MapSkeleton />,
        ssr: true,
      }),
    []
  );

  // Get user position to show country based map view
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          } as LatLng);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []);

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
          <div
            className={`overflow-y-auto max-h-[80vh] pr-4 space-y-6 rounded-xl bg-base-100 p-6`}
          >
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  setSelectedTraining(event.id);
                  router.push(`/trainings/${event.id}`);
                }}
                className={`card bg-white shadow-xl rounded-xl transition-all hover:shadow-2xl hover:cursor-pointer ${
                  selectedTraining === event.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                        {event.name}
                      </h3>
                      <p className="text-neutral-600 flex items-center gap-2">
                        <span className="inline-block">📍</span>
                        {event.city}, {event.country}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold">
                        {formatDate(event.date)}
                      </span>
                      <span
                        className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          difficultyColors[
                            event.level as keyof typeof difficultyColors
                          ]
                        }`}
                      >
                        {event.level}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                    {event.activities.map((activity) => (
                      <div
                        key={activity}
                        className="bg-neutral-50 p-4 rounded-lg flex items-center gap-3"
                      >
                        <div>
                          <span className="block text-sm font-semibold text-neutral-800">
                            {activity}
                          </span>
                          <span className="text-neutral-600">
                            {
                              event.parsedDistances.find(
                                (d) => d.activity === activity
                              )?.distance
                            }{' '}
                            {
                              event.parsedDistances.find(
                                (d) => d.activity === activity
                              )?.unit
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeTab === 'past' &&
                    session?.user?.id === event.createdBy &&
                    !reviewedEventIds.includes(event.id) && (
                      <div className="mt-6 pt-4 border-t border-base-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewEventId(event.id);
                            setShowReviewModal(true);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          Review Participants
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="text-center text-neutral text-xl font-extrabold mt-4">
                {activeTab === 'myEvents'
                  ? "You don't have any events yet."
                  : activeTab === 'past'
                  ? 'No past events found.'
                  : 'No events found matching your criteria.'}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 xl:w-2/5 sticky top-0">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {userPosition ? (
              <Map
                position={userPosition}
                pickPoint={false}
                handleLocation={() => {}}
                events={filteredEvents}
                markers={filteredEvents.map((event) => {
                  const position = event.location
                    ? ({
                        lat: event.location.lat,
                        lng: event.location.lng,
                      } as LatLng)
                    : (() => {
                        const [lat, lng] = event.userPosition
                          .split(',')
                          .map(Number);
                        return { lat, lng } as LatLng;
                      })();

                  const primaryActivity = event.activities[0]?.toLowerCase() as
                    | 'run'
                    | 'bike'
                    | 'swim';

                  return {
                    position,
                    popup: event.name,
                    details: `${event.city}, ${event.country}`,
                    type: primaryActivity,
                    selected: selectedTraining === event.id,
                  };
                })}
              />
            ) : (
              <MapSkeleton />
            )}
          </div>

          <div className="mt-8 bg-neutral text-center rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Create Your Own Event
            </h2>
            <p className="text-white/90 mb-6">
              Want to organize your own training? Set up your event and invite
              friends!
            </p>
            <Link href="trainings/create" className="btn btn-primary btn-lg">
              Start Creating
            </Link>
          </div>
        </div>
      </div>
      {showReviewModal && reviewEvent?.attendees && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-6">
              Review Participants - {reviewEvent.name}
            </h3>
            <BulkReviewForm
              eventId={reviewEventId}
              participants={reviewEvent.attendees}
              userId={session?.user?.id}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                setShowReviewModal(false);
              }}
            >
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
}
