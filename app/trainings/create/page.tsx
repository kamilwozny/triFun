'use client';

import { useEffect, useRef, useState } from 'react';
import '@/components/trainings/Trainings.css';
import type {
  Location,
  RouteResult,
  StaticRoute,
} from '@/components/map/types';
import { useForm } from 'react-hook-form';
import { createNewTrainingEvent } from '@/actions/trainingEvents';
import { useRouter } from 'next/navigation';
import { Level } from '@/types/training';
import {
  FaCalendar,
  FaClock,
  FaExclamationTriangle,
  FaRoute,
  FaUpload,
  FaTimes,
  FaMountain,
  FaRunning,
  FaBicycle,
  FaSwimmer,
} from 'react-icons/fa';
import { format } from 'date-fns';
import 'react-day-picker/style.css';
import { DatePickerModal } from '@/components/datePickerModal/DatePickerModal';
import { EventTypeSelect } from '@/components/eventTypeSelect/EventTypeSelect';
import Map from '@/components/map/Map';
import { useTranslation } from 'react-i18next';
import { parseGPX, gpxToGeoJson } from '@/lib/gpx';

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

const ACTIVITY_COLORS: Record<string, string> = {
  Run: '#FF2E63',
  Bike: '#9B5DE5',
  Swim: '#00BBF9',
};

const ACTIVITY_CONFIG = [
  { key: 'Run', Icon: FaRunning, color: '#FF2E63' },
  { key: 'Bike', Icon: FaBicycle, color: '#9B5DE5' },
  { key: 'Swim', Icon: FaSwimmer, color: '#00BBF9' },
];

export default function CreateTrainingEvent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<FormData>();
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [location, setLocation] = useState<Location>({});
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [distances, setDistances] = useState<DistanceData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);

  const [activityRoutes, setActivityRoutes] = useState<
    Record<string, RouteResult | null>
  >({});
  const [drawingActivity, setDrawingActivity] = useState<string | null>(null);
  const [pickingSwim, setPickingSwim] = useState(false);
  const [animatedPoints, setAnimatedPoints] = useState<
    [number, number][] | undefined
  >();
  const [animatingActivity, setAnimatingActivity] = useState<string | null>(
    null,
  );

  const gpxInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity],
    );
  };

  const handleDistanceChange = (
    activity: string,
    value: number,
    unit: 'meters' | 'kilometers',
  ) => {
    setDistances((prev) => {
      const existing = prev.find((d) => d.activity === activity);
      if (existing) {
        return prev.map((d) =>
          d.activity === activity ? { ...d, distance: value, unit } : d,
        );
      }
      return [...prev, { activity, distance: value, unit }];
    });
  };

  const autoFillDistance = (activity: string, distanceKm: number) => {
    setDistances((prev) => {
      const existing = prev.find((d) => d.activity === activity);
      if (existing) {
        return prev.map((d) =>
          d.activity === activity
            ? { ...d, distance: distanceKm, unit: 'kilometers' }
            : d,
        );
      }
      return [...prev, { activity, distance: distanceKm, unit: 'kilometers' }];
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => console.error('Error getting geolocation:', err),
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
    if (isDatePickerOpen)
      document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    if (date) setIsDatePickerOpen(false);
  };

  const handleGpxFile = (activity: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const gpxData = parseGPX(text);
      if (!gpxData) {
        setError(t('invalidGpxFile'));
        return;
      }

      const routeGeoJson = gpxToGeoJson(gpxData.points);
      const result: RouteResult = {
        points: gpxData.points,
        distanceKm: gpxData.distanceKm,
        elevationGainM: gpxData.elevationGainM,
        routeGeoJson,
        start: gpxData.start,
        end: gpxData.end,
      };

      setActivityRoutes((prev) => ({ ...prev, [activity]: result }));
      autoFillDistance(activity, gpxData.distanceKm);

      setAnimatingActivity(activity);
      setAnimatedPoints(gpxData.points);
      setDrawingActivity(null);

      if (!location.position) {
        setLocation((prev) => ({ ...prev, position: gpxData.start }));
      }
    };
    reader.readAsText(file);
  };

  const handleRouteChange = (activity: string, data: RouteResult) => {
    setActivityRoutes((prev) => ({ ...prev, [activity]: data }));
    autoFillDistance(activity, data.distanceKm);
    setDrawingActivity(null);
    if (!location.position) {
      setLocation((prev) => ({ ...prev, position: data.start }));
    }
  };

  const clearRoute = (activity: string) => {
    setActivityRoutes((prev) => ({ ...prev, [activity]: null }));
    if (animatingActivity === activity) {
      setAnimatedPoints(undefined);
      setAnimatingActivity(null);
    }
    if (drawingActivity === activity) setDrawingActivity(null);
  };

  const staticRoutes: StaticRoute[] = Object.entries(activityRoutes)
    .filter(
      ([act, r]) =>
        r !== null && act !== drawingActivity && act !== animatingActivity,
    )
    .map(([act, r]) => ({
      points: r!.points,
      color: ACTIVITY_COLORS[act] ?? '#9B5DE5',
    }));

  const activeAnimatedPoints =
    animatingActivity && animatedPoints ? animatedPoints : undefined;
  const activeColor = drawingActivity
    ? (ACTIVITY_COLORS[drawingActivity] ?? '#9B5DE5')
    : animatingActivity
      ? (ACTIVITY_COLORS[animatingActivity] ?? '#9B5DE5')
      : '#9B5DE5';

  const onSubmit = async (data: FormData) => {
    let redirectPath: string | null = null;
    try {
      setError(null);
      if (!location.position) {
        setError(t('selectLocation'));
        return;
      }

      if (!location.city || !location.country) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.position.lat}&lon=${location.position.lng}`,
          );
          const geo = await response.json();
          location.city =
            geo.address.city ||
            geo.address.town ||
            geo.address.village ||
            geo.address.suburb ||
            '';
          location.country = geo.address.country || '';
        } catch {}
      }

      if (!selectedDate) {
        setError(t('selectDate'));
        return;
      }
      if (!selectedTime) {
        setError(t('selectTime'));
        return;
      }

      const routesObj: Record<
        string,
        { geoJson: string; distanceKm: number; elevationGainM: number }
      > = {};
      for (const [act, r] of Object.entries(activityRoutes)) {
        if (r)
          routesObj[act] = {
            geoJson: r.routeGeoJson,
            distanceKm: r.distanceKm,
            elevationGainM: r.elevationGainM,
          };
      }
      const hasRoutes = Object.keys(routesObj).length > 0;

      await createNewTrainingEvent(
        {
          name: data.name,
          description: data.description,
          activities: selectedActivities,
          level: data.level as Level,
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedTime,
          distances: distances.map(({ activity, distance, unit }) => ({
            activity,
            distance,
            unit,
          })),
          isPrivate: data.isPrivate,
          routeGeoJson: hasRoutes ? JSON.stringify(routesObj) : undefined,
        },
        location,
      );
      redirectPath = '/trainings';
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err instanceof Error ? err.message : t('failedCreateEvent'));
    } finally {
      redirectPath && router.push(redirectPath);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        {t('createNewEvent')}
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
          <div>
            <label className="block text-gray-800 text-base font-medium">
              {t('eventName')}
            </label>
            <input
              className="input input-sm input-bordered w-full max-w-md"
              {...register('name', { required: true })}
            />
          </div>
          <div>
            <label className="block text-gray-800 text-base font-medium">
              {t('description')}
            </label>
            <textarea
              className="textarea textarea-sm textarea-bordered w-full max-w-md"
              {...register('description', { required: true })}
            />
          </div>

          <div>
            <label className="block text-gray-800 text-base font-medium mb-2">
              {t('activities')}
            </label>
            <div className="flex gap-3">
              {ACTIVITY_CONFIG.map(({ key, Icon, color }) => {
                const selected = selectedActivities.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleActivity(key)}
                    className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all flex-1 ${
                      selected
                        ? 'border-current shadow-md bg-base-100'
                        : 'border-base-300 opacity-50 hover:opacity-75'
                    }`}
                    style={selected ? { borderColor: color, color } : {}}
                  >
                    <Icon className="h-7 w-7" />
                    <span className="text-xs font-semibold text-gray-700">
                      {t(key.toLowerCase())}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedActivities.map((activity) => {
            const isSwim = activity === 'Swim';
            const route = activityRoutes[activity] ?? null;
            const color = ACTIVITY_COLORS[activity] ?? '#9B5DE5';
            const ActivityIcon =
              ACTIVITY_CONFIG.find((a) => a.key === activity)?.Icon ??
              FaRunning;
            const isDrawing = drawingActivity === activity;

            return (
              <div
                key={activity}
                className="border border-base-300 rounded-xl p-3 space-y-2"
              >
                <div className="flex items-center gap-2" style={{ color }}>
                  <ActivityIcon className="h-5 w-5" />
                  <span className="font-semibold text-gray-800">
                    {t(activity.toLowerCase())}
                  </span>
                </div>

                {isSwim ? (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder={t('enterDistance')}
                        className="input input-sm input-bordered flex-1"
                        value={
                          distances.find((d) => d.activity === activity)
                            ?.distance || ''
                        }
                        onChange={(e) =>
                          handleDistanceChange(
                            activity,
                            e.target.value ? Number(e.target.value) : 0,
                            distances.find((d) => d.activity === activity)
                              ?.unit || 'meters',
                          )
                        }
                      />
                      <select
                        className="select select-sm select-bordered"
                        value={
                          distances.find((d) => d.activity === activity)
                            ?.unit || 'meters'
                        }
                        onChange={(e) =>
                          handleDistanceChange(
                            activity,
                            distances.find((d) => d.activity === activity)
                              ?.distance || 0,
                            e.target.value as 'meters' | 'kilometers',
                          )
                        }
                      >
                        <option value="meters">{t('meters')}</option>
                        <option value="kilometers">{t('kilometers')}</option>
                      </select>
                    </div>

                    {location.position ? (
                      <div className="flex items-center gap-2 text-sm bg-base-200 rounded-lg px-3 py-2">
                        <span style={{ color }} className="font-semibold">
                          {location.city}, {location.country}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setLocation({});
                            setPickingSwim(false);
                          }}
                          className="ml-auto text-gray-400 hover:text-gray-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPickingSwim((p) => !p)}
                        className={`btn btn-xs gap-1 ${pickingSwim ? 'btn-primary' : 'btn-outline'}`}
                      >
                        <FaSwimmer className="text-xs" />
                        {pickingSwim ? t('picking') : t('pickLocation')}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {route ? (
                      <div className="flex items-center gap-3 text-sm bg-base-200 rounded-lg px-3 py-2">
                        <FaRoute style={{ color }} />
                        <span className="font-semibold">
                          {route.distanceKm} km
                        </span>
                        {route.elevationGainM > 0 && (
                          <>
                            <FaMountain className="text-success" />
                            <span className="font-semibold">
                              +{route.elevationGainM} m
                            </span>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => clearRoute(activity)}
                          className="ml-auto text-gray-400 hover:text-gray-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <label className="flex items-center gap-1 btn btn-xs btn-outline cursor-pointer">
                          <FaUpload className="text-xs" />
                          {t('uploadGpx')}
                          <input
                            type="file"
                            accept=".gpx"
                            className="hidden"
                            ref={(el) => {
                              gpxInputRefs.current[activity] = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleGpxFile(activity, file);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setDrawingActivity(isDrawing ? null : activity);
                            setAnimatedPoints(undefined);
                            setAnimatingActivity(null);
                          }}
                          className={`btn btn-xs gap-1 ${isDrawing ? 'btn-primary' : 'btn-outline'}`}
                        >
                          <FaRoute className="text-xs" />
                          {isDrawing ? t('drawing') : t('drawOnMap')}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          <div className="form-control">
            <label className="label text-sm font-medium">
              {t('eventPrivacy')}
            </label>
            <div className="flex items-center gap-4">
              <EventTypeSelect onChange={(val) => setIsPrivate(val)} />
              <span className="text-md">
                {isPrivate ? t('privateEvent') : t('publicEvent')}
              </span>
            </div>
          </div>

          <input
            type="hidden"
            {...register('isPrivate')}
            value={isPrivate.toString()}
          />

          <div>
            <label className="block text-gray-800 text-base font-medium">
              {t('level')}
            </label>
            <select
              className="select select-sm select-bordered w-full max-w-md"
              {...register('level', { required: true })}
            >
              <option value="Beginner">{t('beginner')}</option>
              <option value="Intermediate">{t('intermediate')}</option>
              <option value="Expert">{t('expert')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-800 text-base font-medium">
              {t('eventDateTime')}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(true)}
                  className="input input-bordered w-full pl-10 h-10 flex items-center text-left"
                >
                  <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  {selectedDate
                    ? format(selectedDate, 'MMMM d, yyyy')
                    : 'Select date'}
                </button>
              </div>
              <div className="relative flex-1">
                <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-0" />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="input input-bordered w-full pl-10 h-10"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-sm w-full max-w-md"
          >
            {t('btnCreateEvent')}
          </button>
        </div>

        <div className="flex-1 min-h-[400px] lg:min-h-[700px]">
          {drawingActivity && (
            <div className="text-xs text-center text-gray-500 mb-1">
              {t('drawingRouteFor')}{' '}
              <strong style={{ color: ACTIVITY_COLORS[drawingActivity] }}>
                {drawingActivity}
              </strong>
            </div>
          )}
          {userPosition ? (
            <Map
              position={userPosition}
              zoom={13}
              showSearch={true}
              pickPoint={pickingSwim}
              handleLocation={(loc) => {
                setLocation(loc);
                setPickingSwim(false);
              }}
              routeMode={!!drawingActivity}
              onRouteChange={
                drawingActivity
                  ? (data) => handleRouteChange(drawingActivity, data)
                  : undefined
              }
              animatedPoints={activeAnimatedPoints}
              activityColor={activeColor}
              staticRoutes={staticRoutes}
              swimPoint={
                selectedActivities.includes('Swim') && location.position
                  ? location.position
                  : undefined
              }
            />
          ) : (
            <div className="skeleton w-full h-[700px] flex items-center justify-center" />
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
