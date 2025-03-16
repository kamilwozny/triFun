'use client';

import { useEffect, useMemo, useState } from 'react';
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

interface Distance {
  activity: string;
  distance: number;
  unit: string;
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

export default function NewTrainings() {
  const router = useRouter();
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [events, setEvents] = useState<TrainingEvent[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);

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

  const filteredEvents = useMemo(() => {
    if (!selectedActivity || selectedActivity === 'All') return events;
    return events.filter((event) =>
      event.activities.some((activity) => activity === selectedActivity)
    );
  }, [events, selectedActivity]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 lg:p-8">
      <div className="flex flex-wrap gap-4 justify-center w-full mb-6">
        {['All', 'Run', 'Bike', 'Swim'].map((activity) => (
          <button
            key={activity}
            onClick={() =>
              setSelectedActivity(activity === 'All' ? null : activity)
            }
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
              (activity === 'All' && !selectedActivity) ||
              selectedActivity === activity
                ? 'bg-neutral text-white shadow-lg scale-105'
                : 'bg-white text-neutral hover:bg-primary/10'
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
                className={`card bg-white shadow-xl rounded-xl transition-all hover:shadow-2xl ${
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
