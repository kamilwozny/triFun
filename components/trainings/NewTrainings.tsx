'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { LatLng } from 'leaflet';
import { getTrainingEvents } from '@/actions/trainingEvents';
import { useRouter } from 'next/navigation';
import { TrainingEvent } from '@/types/training';
import { FaSwimmer, FaBiking, FaRunning } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import '@/components/trainings/Trainings.css';
import Link from 'next/link';

interface LocationSuggestion {
  text: string;
  type: 'city' | 'country';
}

const activityIcons = {
  Swim: <FaSwimmer className="h-5 w-5" />,
  Bike: <FaBiking className="h-5 w-5" />,
  Run: <FaRunning className="h-5 w-5" />,
};

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

// Add useClickOutside hook
function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default function NewTrainings() {
  const router = useRouter();
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [events, setEvents] = useState<TrainingEvent[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchQuery = useDebounce(searchInput, 300);

  const searchRef = useClickOutside(() => setShowSuggestions(false));

  const locationSuggestions = useMemo(() => {
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

  // Update filteredSuggestions to use searchInput instead of searchQuery for immediate feedback
  const filteredSuggestions = useMemo(() => {
    if (!searchInput) return [];
    return locationSuggestions.filter((suggestion) =>
      suggestion.text.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [locationSuggestions, searchInput]);

  // Keep filteredEvents using the debounced searchQuery
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
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
  }, [events, selectedActivity, searchQuery]);

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getTrainingEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events. Please try again.');
      }
    };

    fetchEvents();
  }, []);

  // Update the handleKeyDown function to use setSearchInput
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          setSearchInput(filteredSuggestions[selectedIndex].text);
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredSuggestions]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 lg:p-8">
      <div className="flex flex-wrap gap-4 justify-center w-full mb-6">
        <div className="relative" ref={searchRef}>
          <label className="input flex items-center gap-2">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              type="search"
              placeholder="Search by location"
              className="w-full"
              aria-label="Search locations"
              aria-controls="location-suggestions"
              aria-activedescendant={
                selectedIndex >= 0
                  ? `suggestion-${filteredSuggestions[selectedIndex].text}`
                  : undefined
              }
            />
          </label>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div
              id="location-suggestions"
              role="listbox"
              className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.text}-${index}`}
                  id={`suggestion-${suggestion.text}`}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`w-full px-4 py-2 text-left hover:bg-neutral/5 flex items-center gap-2 ${
                    index === selectedIndex ? 'bg-neutral/10' : ''
                  }`}
                  onClick={() => {
                    setSearchInput(suggestion.text);
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="text-neutral-500 text-sm">
                    {suggestion.type === 'city' ? '🏙️' : '🌍'}
                  </span>
                  <span className="font-medium">{suggestion.text}</span>
                  <span className="text-xs text-neutral-400 ml-auto">
                    {suggestion.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        {['All', 'Run', 'Bike', 'Swim'].map((activity) => (
          <button
            key={activity}
            onClick={() =>
              setSelectedActivity(activity === 'All' ? null : activity)
            }
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 hover:bg-neutral hover:text-white ${
              (activity === 'All' && !selectedActivity) ||
              selectedActivity === activity
                ? 'bg-neutral text-white shadow-lg scale-105'
                : 'bg-white text-neutral'
            }`}
          >
            {activity !== 'All' &&
              activityIcons[activity as keyof typeof activityIcons]}
            {activity}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-center max-w-full gap-8 w-full">
        <div className="w-full lg:w-1/2 xl:w-3/5">
          <div className="overflow-y-auto max-h-[80vh] pr-4 space-y-6">
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
                        {activityIcons[activity as keyof typeof activityIcons]}
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
            {filteredSuggestions.length === 0 && searchInput && (
              <div className="text-center text-neutral text-xl font-extrabold mt-4">
                No location suggestions found.
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
