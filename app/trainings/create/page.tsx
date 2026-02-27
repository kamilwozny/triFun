'use client';

import { useEffect, useRef, useState } from 'react';
import '@/components/trainings/Trainings.css';
import type { Location } from '@/components/map/types';
import { useForm } from 'react-hook-form';
import { createNewTrainingEvent } from '@/actions/trainingEvents';
import { useRouter } from 'next/navigation';
import { Level } from '@/types/training';
import { FaCalendar, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { format } from 'date-fns';
import 'react-day-picker/style.css';
import { DatePickerModal } from '@/components/datePickerModal/DatePickerModal';
import { EventTypeSelect } from '@/components/eventTypeSelect/EventTypeSelect';
import sendSimpleMessage from '@/helpers/sendMail';
import Map from '@/components/map/Map';

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
  startTime: string;
  isPrivate: boolean;
}

export default function CreateTrainingEvent() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [location, setLocation] = useState<Location>({});
  const [selectedActivities, setSelectedActivities] = useState<Array<string>>(
    [],
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const [distances, setDistances] = useState<DistanceData[]>([]);
  const [activitiesList] = useState<Array<string>>(['Swim', 'Bike', 'Run']);
  const [error, setError] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const handleBodyScroll = (isOpen: boolean) => {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    if (!modalRef.current) return;
    if (isDatePickerOpen) {
      handleBodyScroll(true);
      modalRef.current.showModal();
    } else {
      handleBodyScroll(false);
      modalRef.current.close();
    }
    return () => {
      handleBodyScroll(false);
    };
  }, [isDatePickerOpen]);

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
    unit: 'meters' | 'kilometers',
  ) => {
    setDistances((prev) => {
      const existingActivity = prev.find((d) => d.activity === activity);
      if (existingActivity) {
        return prev.map((d) =>
          d.activity === activity
            ? { ...d, distance: value === '' ? 0 : Number(value), unit }
            : d,
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
        },
      );
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  useEffect(() => {
    if (isDatePickerOpen) {
      modalRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      modalRef.current?.close();
      document.body.style.overflow = 'unset';
    }
  }, [isDatePickerOpen]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setIsDatePickerOpen(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    let redirectPath: string | null = null;
    try {
      setError(null);
      if (!location.city || !location.country || !location.position) {
        setError('Please select a location on the map');
        return;
      }

      if (!selectedDate) {
        setError('Please select a date');
        return;
      }

      if (!selectedTime) {
        setError('Please select a start time');
        return;
      }

      const distancesWithUnits: DistanceData[] = distances.map(
        ({ activity, distance, unit }) => ({
          activity,
          distance,
          unit,
        }),
      );

      await createNewTrainingEvent(
        {
          name: data.name,
          description: data.description,
          activities: selectedActivities,
          level: data.level as Level,
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedTime,
          distances: distancesWithUnits,
          isPrivate: data.isPrivate,
        },
        location,
      );
      sendSimpleMessage();

      redirectPath = '/trainings';
    } catch (error) {
      console.error('Error creating event:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to create event',
      );
    } finally {
      redirectPath && router.push(redirectPath);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Create a New Event
      </h2>
      {error && (
        <div className="alert alert-error mb-4">
          <FaExclamationTriangle />
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
                          'meters',
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
                        e.target.value as 'meters' | 'kilometers',
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

          {/* Privacy Toggle */}
          <div className="form-control">
            <label className="label text-sm font-medium">Event Privacy</label>
            <div className="flex items-center gap-4">
              <EventTypeSelect
                onChange={(isPrivate) => setIsPrivate(isPrivate)}
              />
              <span className="text-md text">
                {isPrivate ? 'Private Event' : 'Public Event'}
              </span>
            </div>
          </div>

          <input
            type="hidden"
            {...register('isPrivate')}
            value={isPrivate.toString()}
          />

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
          <div className="mb-4 space-y-2">
            <label className="block text-gray-800 text-base font-medium">
              Event Date & Time
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(true)}
                  className="input input-bordered w-full pl-10 h-10 flex items-center text-left"
                >
                  <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  {selectedDate
                    ? format(selectedDate, 'MMMM d, yyyy')
                    : 'Select date'}
                </button>
              </div>
              <div className="relative flex-1">
                <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-0" />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="input input-bordered w-full pl-10 h-10 z-1"
                  required
                />
              </div>
            </div>
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

      <DatePickerModal
        handleDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        modalRef={modalRef}
        handleVisibilityPicker={() => setIsDatePickerOpen(false)}
      />
    </div>
  );
}
