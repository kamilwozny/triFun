'use client';

import type { LatLng } from 'leaflet';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import type { Location } from '@/components/map/types';
import '@/components/trainings/Trainings.css';
import Link from 'next/link';

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
}

interface TrainingsPageClientProps {
  trainings: ITraining[];
}

export const NewTrainings: React.FC<TrainingsPageClientProps> = ({
  trainings,
}) => {
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [location, setLocation] = useState<Location>({});
  const [filter, setFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date');

  const filteredTrainings = trainings.filter((training) => {
    if (filter === 'All') {
      return trainings;
    }
    return JSON.parse(training.distances).some(
      (item) => 'activity' in item && item.activity === filter
    );
  });

  const sortedEvents = filteredTrainings.sort((a, b) => {
    if (sortBy === 'date') {
      return a.date.localeCompare(b.date);
    }
    if (sortBy === 'distance') {
      return (
        JSON.parse(a.distances)[0].distance -
        JSON.parse(b.distances)[0].distance
      );
    }
    return 0;
  });

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/map/Map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  console.log(filteredTrainings);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      } as LatLng);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 ">
      <div className="flex gap-4">
        {['All', 'Run', 'Bike', 'Swim'].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-white text-neutral'
            }`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex items-start justify-center max-w-full gap-2 w-full">
        <div className="relative flex max-w-full w-full">
          <div
            className="overflow-y-auto max-h-[80vh] w-full px-4"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="flex flex-wrap justify-center gap-6">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="card bg-white shadow-lg rounded-lg flex overflow-hidden max-w-lg w-full"
                >
                  <div className="p-4 flex flex-col justify-between">
                    <div>
                      <span className="bg-black text-white text-xs uppercase font-bold px-2 py-1 rounded">
                        {event.date}
                      </span>
                      <h2 className="text-xl font-bold mt-2">{event.name}</h2>
                      <p className="text-gray-600 text-sm">
                        {event.city}, {event.country}
                      </p>
                    </div>
                    <div className="flex justify-around mt-4 text-sm">
                      {event.distances &&
                        JSON.parse(event.distances).map((dist, index) => (
                          <div key={index} className="text-center">
                            <span className="block text-gray-800 font-semibold">
                              {dist.activity}
                            </span>
                            <span className="text-gray-600">
                              {dist.distance} {dist.unit}
                            </span>
                          </div>
                        ))}
                    </div>
                    <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded text-sm font-bold self-end hover:bg-red-600">
                      See Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" min-w-[40vw] h-full mr-10 ">
          {userPosition ? (
            <Map
              position={userPosition}
              zoom={13}
              pickPoint={true}
              handleLocation={setLocation}
            />
          ) : (
            <p className="text-white text-sm">Loading map...</p>
          )}
          <div className="mt-10 p-6 bg-neutral text-center rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white">
              Create Your Own Event
            </h2>
            <p className="text-white mt-2">
              Want to organize your own training? Set up your event and invite
              friends!
            </p>
            <button className="mt-4 p-4 bg-secondary text-white py-2 px-6 rounded-lg text-lg font-semibold hover:bg-primary">
              <Link href="trainings/create" className="">
                Start Creating
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
