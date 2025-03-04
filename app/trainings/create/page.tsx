'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import '@/components/trainings/Trainings.css';
import { PrimaryButton } from '@/components/primaryButton/PrimaryButton';
import type { LatLng } from 'leaflet';
import type { Location } from '@/components/map/types';
import { useForm } from 'react-hook-form';
import { createNewTrainingEvent } from '@/actions/trainingEvents';
import { useRouter } from 'next/navigation';

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
}

export default function CreateTrainingEvent() {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<FormData>();
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [location, setLocation] = useState<Location>({});
  const [selectedActivities, setSelectedActivities] = useState<Array<string>>(
    []
  );

  const [distances, setDistances] = useState<DistanceData[]>([]);
  const activitiesList = ['Swim', 'Bike', 'Run'];

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
        loading: () => <p>A map is loading</p>,
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

  const onSubmit = async (data: FormData) => {
    try {
      const distancesWithUnits: DistanceData[] = distances.map(
        ({ activity, distance, unit }) => ({
          activity,
          distance,
          unit,
        })
      );
      await createNewTrainingEvent(
        {
          name: data.name,
          description: data.description,
          activities: selectedActivities,
          level: data.level,
          date: data.date,
          distances: distancesWithUnits,
        },
        location,
        userPosition
      );
      router.push('/trainings');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Create a New Event
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-sm">Event Name</label>
          <input
            className="input input-sm input-bordered w-full"
            {...register('name', { required: true })}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-sm">Description</label>
          <textarea
            className="textarea textarea-sm textarea-bordered w-full"
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
          <label className="block text-gray-700 text-sm">Level</label>
          <select
            className="select select-sm select-bordered w-full"
            {...register('level', { required: true })}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Pro">Pro</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-sm">Date</label>
          <input
            type="date"
            className="input input-sm input-bordered w-full"
            {...register('date', { required: true })}
          />
        </div>
        {/* <PrimaryButton text="Pick a starting point" handleClick={() => {}} /> */}
        {userPosition ? (
          <Map
            position={userPosition}
            zoom={13}
            pickPoint={true}
            handleLocation={setLocation}
          />
        ) : (
          <p className="text-gray-600 text-sm">Loading map...</p>
        )}
        <div className="mt-4">
          <button type="submit" className="btn btn-primary btn-sm w-full">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
