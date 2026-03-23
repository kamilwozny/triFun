'use client';

import {
  FaRoute,
  FaUpload,
  FaTimes,
  FaMountain,
  FaSwimmer,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import type { RouteResult, Location } from '@/components/map/types';

interface DistanceData {
  activity: string;
  distance: number;
  unit: 'meters' | 'kilometers';
}

interface ActivityRouteSectionProps {
  activity: string;
  color: string;
  Icon: React.ElementType;
  route: RouteResult | null;
  isDrawing: boolean;
  isSwim: boolean;
  pickingSwim: boolean;
  swimLocating: boolean;
  location: Location;
  distances: DistanceData[];
  onDistanceChange: (
    activity: string,
    value: number,
    unit: 'meters' | 'kilometers',
  ) => void;
  onPickSwimToggle: () => void;
  onClearLocation: () => void;
  onClearRoute: (activity: string) => void;
  onDrawToggle: (activity: string) => void;
  onGpxFile: (activity: string, file: File) => void;
  gpxInputRef: (el: HTMLInputElement | null) => void;
}

export function ActivityRouteSection({
  activity,
  color,
  Icon,
  route,
  isDrawing,
  isSwim,
  pickingSwim,
  swimLocating,
  location,
  distances,
  onDistanceChange,
  onPickSwimToggle,
  onClearLocation,
  onClearRoute,
  onDrawToggle,
  onGpxFile,
  gpxInputRef,
}: ActivityRouteSectionProps) {
  const { t } = useTranslation();
  const distanceEntry = distances.find((d) => d.activity === activity);

  return (
    <div className="border border-base-300 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2" style={{ color }}>
        <Icon className="h-5 w-5" />
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
              value={distanceEntry?.distance || ''}
              onChange={(e) =>
                onDistanceChange(
                  activity,
                  e.target.value ? Number(e.target.value) : 0,
                  distanceEntry?.unit || 'meters',
                )
              }
            />
            <select
              className="select select-sm select-bordered"
              value={distanceEntry?.unit || 'meters'}
              onChange={(e) =>
                onDistanceChange(
                  activity,
                  distanceEntry?.distance || 0,
                  e.target.value as 'meters' | 'kilometers',
                )
              }
            >
              <option value="meters">{t('meters')}</option>
              <option value="kilometers">{t('kilometers')}</option>
            </select>
          </div>

          {swimLocating ? (
            <div className="flex items-center gap-2 text-sm bg-base-200 rounded-lg px-3 py-2">
              <span className="loading loading-spinner loading-xs" />
              <span className="text-gray-500">{t('locating', 'Locating…')}</span>
            </div>
          ) : location.position ? (
            <div className="flex items-center gap-2 text-sm bg-base-200 rounded-lg px-3 py-2">
              <span style={{ color }} className="font-semibold">
                {[location.city, location.country].filter(Boolean).join(', ') ||
                  t('locationSelected', 'Location selected')}
              </span>
              <button
                type="button"
                onClick={onClearLocation}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onPickSwimToggle}
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
              <span className="font-semibold">{route.distanceKm} km</span>
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
                onClick={() => onClearRoute(activity)}
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
                  ref={gpxInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onGpxFile(activity, file);
                    e.target.value = '';
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => onDrawToggle(activity)}
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
}
