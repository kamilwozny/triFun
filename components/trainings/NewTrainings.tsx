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

interface LocationSuggestion {
  text: string;
  type: 'city' | 'country';
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Expert: 'bg-red-100 text-red-800',
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

type TabType = 'upcoming' | 'myEvents';

export default function NewTrainings() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const { events } = useTrainingEvents();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const searchQuery = useDebounce(searchInput, 300);

  // Get only future events (today's date or later)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });
  }, [events]);

  // Filter events the user is participating in or created
  const userEvents = useMemo(() => {
    if (!session?.user?.id) return [];

    return upcomingEvents.filter((event) => {
      // Check if user created the event
      return event.createdBy === session?.user?.id;

      // Note: In a real implementation, you would also add a check for
      // events the user is participating in, using an API call or a list of participants
      // For example: || event.participants?.includes(session.user.id)
    });
  }, [upcomingEvents, session?.user?.id]);

  // Select which events to display based on active tab
  const displayEvents = useMemo(() => {
    switch (activeTab) {
      case 'myEvents':
        return userEvents;
      case 'upcoming':
      default:
        return upcomingEvents;
    }
  }, [activeTab, upcomingEvents, userEvents]);

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

  // Keep filteredEvents using the debounced searchQuery
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

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/map/Map'), {
        loading: () => (
          <div className="min-w-[40vw] h-[700px] mr-10 text-center">
            <p className="text-lg font-bold">Loading map...</p>
          </div>
        ),
        ssr: false,
      }),
    []
  );

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

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 lg:p-8">
      <div className="flex flex-wrap gap-4 justify-center w-full mb-4">
        <div className="tabs tabs-boxed bg-base-200/50 p-2 rounded-xl mr-auto">
          <button
            className={`tab text-xl font-medium transition-all duration-200 hover:bg-neutral hover:text-white ${
              activeTab === 'upcoming'
                ? 'bg-neutral text-white'
                : 'text-neutral'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={`tab text-xl font-medium transition-all duration-200 hover:bg-neutral hover:text-white ${
              activeTab === 'myEvents'
                ? 'bg-neutral text-white'
                : 'text-neutral'
            }`}
            onClick={() => setActiveTab('myEvents')}
          >
            My Events
          </button>
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
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="text-center text-neutral text-xl font-extrabold mt-4">
                {activeTab === 'myEvents'
                  ? "You don't have any events yet."
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
                zoom={13}
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
              <div className="min-w-[40vw] h-[700px] flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
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
    </div>
  );
}
