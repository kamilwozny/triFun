'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import '@/components/trainings/Trainings.css';
import type { LatLng } from 'leaflet';
import type { Location } from '@/components/map/types';
import { useForm } from 'react-hook-form';
import { createNewTrainingEvent } from '@/actions/trainingEvents';
import { useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { revalidateTrainings } from '@/actions/revalidations';
import { Level } from '@/types/training';

interface DistanceData {
  activity: string;
  distance: number;
  unit: 'meters' | 'kilometers';
}

interface FormData {
  name: string;
  description: string;
  activities: string[];
  distances: DistanceData[];
  level: string;
  date: string;
  isPrivate: boolean;
}

export default function CreateTrainingEvent() {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<FormData>();
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [location, setLocation] = useState<Location>({});
  const [selectedActivities, setSelectedActivities] = useState<Array<string>>(
    []
  );
  const [distances, setDistances] = useState<DistanceData[]>([]);
  const [activitiesList] = useState<Array<string>>(['Swim', 'Bike', 'Run']);
  const [error, setError] = useState<string | null>(null);

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev: string[]) => {
      const newSelection = prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity];
      setSelectedActivities(newSelection);
      return newSelection;
    });
  };

  const handleDistanceChange = (
    activity: string,
    value: number | '',
    unit: 'meters' | 'kilometers'
  ) => {
    setDistances((prev) => {
      const existingActivity = prev.find((d) => d.activity === activity);
      if (existingActivity) {
        return prev.map((d) =>
          d.activity === activity
            ? { ...d, distance: value === '' ? 0 : Number(value), unit }
            : d
        );
      } else {
        return [
          ...prev,
          {
            activity,
            distance: value === '' ? 0 : Number(value),
            unit,
          },
        ];
      }
    });
  };

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/map/Map'), {
        loading: () => (
          <div className="skeleton h-full flex items-center justify-center"></div>
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
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      if (!location.city || !location.country || !location.position) {
        setError('Please select a location on the map');
        return;
      }

      const distancesWithUnits: DistanceData[] = distances.map(
        ({ activity, distance, unit }) => ({
          activity,
          distance,
          unit,
        })
      );

      const result = await createNewTrainingEvent(
        {
          name: data.name,
          description: data.description,
          activities: selectedActivities,
          level: data.level as Level,
          date: data.date,
          distances: distancesWithUnits,
          isPrivate: data.isPrivate,
        },
        location
      );

      if (result?.success) {
        router.push('/trainings');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to create event'
      );
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Create a New Event
      </h2>
      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row gap-6"
      >
        <div className="flex-1 space-y-4 mx-auto max-w-md">
          <div className="mb-2">
            <label className="block text-gray-800 text-base font-medium">
              Event Name
            </label>
            <input
              className="input input-sm input-bordered w-full max-w-md"
              {...register('name', { required: true })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-800 text-base font-medium">
              Description
            </label>
            <textarea
              className="textarea textarea-sm textarea-bordered w-full max-w-md"
              {...register('description', { required: true })}
            />
          </div>
          <div className="form-control">
            <label className="label text-sm font-medium">Activities</label>
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-sm btn-outline w-full">
                {selectedActivities.length > 0
                  ? selectedActivities.join(', ')
                  : 'Select activities'}
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] bg-white shadow-md rounded-md p-2 w-full border border-gray-300"
              >
                {activitiesList.map((activity) => (
                  <li key={activity} className="p-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedActivities.includes(activity)}
                        onChange={() => toggleActivity(activity)}
                      />
                      <span className="text-sm">{activity}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {selectedActivities.length > 0 && (
            <div className="space-y-2">
              <label className="label text-sm font-medium">Distance</label>
              {selectedActivities.map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <span className="w-16 text-sm font-medium">{activity}</span>
                  <input
                    type="number"
                    placeholder="Enter distance"
                    className="input input-sm input-bordered w-full"
                    onChange={(e) =>
                      handleDistanceChange(
                        activity,
                        e.target.value ? Number(e.target.value) : 0,
                        distances.find((d) => d.activity === activity)?.unit ||
                          'meters'
                      )
                    }
                  />
                  <select
                    className="select select-sm select-bordered"
                    defaultValue="meters"
                    onChange={(e) =>
                      handleDistanceChange(
                        activity,
                        distances.find((d) => d.activity === activity)
                          ?.distance || 0,
                        e.target.value as 'meters' | 'kilometers'
                      )
                    }
                  >
                    <option value="meters">Meters</option>
                    <option value="kilometers">Kilometers</option>
                  </select>
                </div>
              ))}
            </div>
          )}
          <div className="mb-2">
            <label className="block text-gray-800 text-base font-medium">
              Level
            </label>
            <select
              className="select select-sm select-bordered w-full max-w-md"
              {...register('level', { required: true })}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-gray-800 text-base font-medium">
              Date
            </label>
            <input
              type="date"
              className="input input-sm input-bordered w-full max-w-md"
              {...register('date', { required: true })}
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-sm w-full max-w-md"
            >
              Create Event
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-[700px]">
          {userPosition ? (
            <Map
              position={userPosition}
              zoom={13}
              pickPoint={true}
              handleLocation={setLocation}
            />
          ) : (
            <div className="skeleton w-full h-[700px] flex items-center justify-center"></div>
          )}
        </div>
      </form>
    </div>
  );
}
