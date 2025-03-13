'use client';

import type { LatLng } from 'leaflet';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import type { Location } from '@/components/map/types';
import '@/components/trainings/Trainings.css';
import Link from 'next/link';
import L from 'leaflet';
import { FaRunning, FaBicycle, FaSwimmer } from 'react-icons/fa';

interface Distance {
  activity: string;
  distance: number;
  unit: string;
}

interface ITraining {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  distances: string;
  level: string;
  userPosition: string;
  date: string;
  lat?: number;
  lng?: number;
}

interface TrainingsPageClientProps {
  trainings: ITraining[];
}

const sportIcons = {
  Run: <FaRunning className="text-red-500 h-6 w-6" />,
  Bike: <FaBicycle className="text-green-500 h-6 w-6" />,
  Swim: <FaSwimmer className="text-blue-500 h-6 w-6" />,
};

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

export const NewTrainings: React.FC<TrainingsPageClientProps> = ({
  trainings,
}) => {
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [location, setLocation] = useState<Location>({});
  const [filter, setFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date');
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);

  const filteredTrainings = trainings.filter((training) => {
    if (filter === 'All') {
      return true;
    }
    return JSON.parse(training.distances).some(
      (item: { activity: string }) =>
        'activity' in item && item.activity === filter
    );
  });

  const sortedEvents = filteredTrainings.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'distance') {
      return (
        JSON.parse(a.distances)[0].distance -
        JSON.parse(b.distances)[0].distance
      );
    }
    return 0;
  });

  // Convert training locations to map markers
  const trainingMarkers = sortedEvents.map((event) => {
    const pos = JSON.parse(event.userPosition);
    const distances: Distance[] = JSON.parse(event.distances);
    const mainActivity = distances[0]?.activity || 'default';

    // Create details string with all activities
    const details = distances
      .map((d: Distance) => `${d.activity}: ${d.distance} ${d.unit}`)
      .join(' • ');

    return {
      position: new L.LatLng(pos.lat, pos.lng),
      popup: `${event.name} - ${event.city}`,
      selected: selectedTraining === event.id,
      details,
      type: mainActivity.toLowerCase() as 'run' | 'bike' | 'swim',
    };
  });

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/map/Map'), {
        loading: () => (
          <div className="min-w-[40vw] h-[700px] mr-10 text-center">
            <p className="text-white text-lg font-bold">Loading map...</p>
          </div>
        ),
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      } as LatLng);
    });
  }, []);
  console.log(trainingMarkers);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 lg:px-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {['All', 'Run', 'Bike', 'Swim'].map((type) => (
          <button
            key={type}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === type
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-white text-neutral hover:bg-primary/10'
            }`}
            onClick={() => setFilter(type)}
          >
            <div className="flex items-center gap-2">
              {type !== 'All' && sportIcons[type as keyof typeof sportIcons]}
              {type}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-center max-w-full gap-8 w-full">
        <div className="w-full lg:w-1/2 xl:w-3/5">
          <div
            className="overflow-y-auto max-h-[80vh] pr-4"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="grid grid-cols-1 gap-6">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className={`card bg-white shadow-xl rounded-xl transition-all hover:shadow-2xl ${
                    selectedTraining === event.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTraining(event.id)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                          {event.name}
                        </h2>
                        <p className="text-neutral-600 flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
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
                            ] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {event.level}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                      {event.distances &&
                        JSON.parse(event.distances).map(
                          (
                            dist: {
                              activity: string;
                              distance: number;
                              unit: string;
                            },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="bg-neutral-50 p-4 rounded-lg flex items-center gap-3"
                            >
                              {
                                sportIcons[
                                  dist.activity as keyof typeof sportIcons
                                ]
                              }
                              <div>
                                <span className="block text-sm font-semibold text-neutral-800">
                                  {dist.activity}
                                </span>
                                <span className="text-neutral-600">
                                  {dist.distance} {dist.unit}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                    </div>

                    <div className="flex justify-end mt-4">
                      <Link
                        href={`trainings/${event.id}`}
                        className="btn btn-primary p-4 font-bold text-lg leading-3"
                      >
                        See Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 xl:w-2/5 sticky top-0">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {userPosition ? (
              <Map
                position={userPosition}
                zoom={13}
                pickPoint={false}
                handleLocation={setLocation}
                markers={trainingMarkers}
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
};
