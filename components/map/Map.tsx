'use client';

import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useState } from 'react';
import Link from 'next/link';
import type { MapProps, MapMarker } from './types';
import { LocationMarker } from './utils';
import { icons, startIcon, endIcon, swimIcon } from './MarkerIcon';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useTranslation } from 'react-i18next';
import { MapSearchControl } from './MapSearchControl';
import { CountryBoundsInitializer } from './CountryBoundsInitializer';
import { LocationPickerController } from './LocationPickerController';
import { AnimatedPolyline } from './AnimatedPolyline';
import { RouteController } from './RouteController';
import { getActivityConfig } from '@/components/trainings/activityConfig';
import { formatDate } from '@/lib/utils';
import { DIFFICULTY_COLORS } from '@/helpers/constants';

function createClusterCustomIcon(cluster: any) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 'small' : count < 100 ? 'medium' : 'large';
  const sizeMap = { small: 40, medium: 45, large: 50 };

  return L.divIcon({
    html: `<div class="cluster-icon bg-foreground cluster-icon-${size}">${count}</div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(sizeMap[size], sizeMap[size]),
  });
}

function Map({
  position,
  zoom = 7,
  pickPoint = false,
  handleLocation,
  onLocating,
  markers = [],
  routeMode = false,
  onRouteChange,
  onElevationUpdate,
  displayRoute,
  animatedPoints,
  activityColor = '#9B5DE5',
  showSearch = false,
  staticRoutes = [],
  swimPoint,
  className = 'h-[700px]',
}: MapProps) {
  const [markerPosition, setMarkerPosition] = useState(
    position ? { lat: position.lat, lng: position.lng } : null,
  );
  const [routePhase, setRoutePhase] = useState<
    'pick-start' | 'pick-end' | 'routing' | 'done'
  >('pick-start');
  const { t } = useTranslation();

  const mapKey =
    routeMode ||
    displayRoute ||
    animatedPoints ||
    pickPoint ||
    swimPoint ||
    staticRoutes.length > 0
      ? 'route-map'
      : `${markerPosition?.lat}-${markerPosition?.lng}`;

  return (
    <>
      <style jsx global>{`
        .custom-marker-cluster {
          background: none;
          border: none;
          z-index: 500 !important;
        }
        .cluster-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ff2e63;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .cluster-icon-small {
          width: 40px;
          height: 40px;
          font-size: 14px;
        }
        .cluster-icon-medium {
          width: 45px;
          height: 45px;
          font-size: 16px;
        }
        .cluster-icon-large {
          width: 50px;
          height: 50px;
          font-size: 18px;
        }
      `}</style>

      {routeMode && (
        <div className="text-sm text-center py-1 px-3 mb-1 rounded bg-base-200 text-base-content">
          {routePhase === 'pick-start' && t('clickToSetStart')}
          {routePhase === 'pick-end' && t('clickToSetEnd')}
          {routePhase === 'routing' && (
            <span className="flex items-center justify-center gap-2">
              <span className="loading loading-spinner loading-xs" />
              {t('calculatingRoute')}
            </span>
          )}
          {routePhase === 'done' && (
            <span className="text-success">
              {t('routeReady')} — {t('clickToReset')}
            </span>
          )}
        </div>
      )}

      <div className="relative h-full">
        {routePhase === 'routing' && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/10 rounded pointer-events-none">
            <div className="bg-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-medium">
              <span className="loading loading-spinner loading-sm" />
              {t('calculatingRoute')}
            </div>
          </div>
        )}
        <MapContainer
          key={mapKey}
          center={markerPosition || position}
          zoom={zoom}
          scrollWheelZoom={true}
          className={`${className} w-full`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {showSearch && <MapSearchControl />}

          {staticRoutes.map((r, i) => (
            <Polyline
              key={i}
              positions={r.points}
              pathOptions={{
                color: r.color,
                weight: 4,
                opacity: 0.6,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          ))}

          {swimPoint && (
            <Marker position={[swimPoint.lat, swimPoint.lng]} icon={swimIcon}>
              <Popup>Swim start</Popup>
            </Marker>
          )}

          {!pickPoint &&
            !routeMode &&
            !displayRoute &&
            !animatedPoints &&
            staticRoutes.length === 0 &&
            position && (
              <CountryBoundsInitializer lat={position.lat} lng={position.lng} />
            )}

          {pickPoint && markerPosition && (
            <Marker position={markerPosition} icon={icons.swim}>
              <Popup>{t('yourSelectedLocation')}</Popup>
            </Marker>
          )}
          {pickPoint && (
            <>
              <LocationMarker
                pickPointMode={pickPoint}
                setPosition={setMarkerPosition}
              />
              <LocationPickerController
                pickPoint={pickPoint}
                handleLocation={handleLocation}
                onLocating={onLocating}
              />
            </>
          )}

          {routeMode && onRouteChange && (
            <RouteController
              onRouteChange={onRouteChange}
              onElevationUpdate={onElevationUpdate}
              onPhaseChange={setRoutePhase}
              activityColor={activityColor}
            />
          )}

          {animatedPoints && animatedPoints.length > 1 && (
            <>
              <AnimatedPolyline points={animatedPoints} color={activityColor} />
              <Marker position={animatedPoints[0]} icon={startIcon}>
                <Popup>Start</Popup>
              </Marker>
              <Marker
                position={animatedPoints[animatedPoints.length - 1]}
                icon={endIcon}
              >
                <Popup>Finish</Popup>
              </Marker>
            </>
          )}

          {displayRoute && displayRoute.length > 1 && !animatedPoints && (
            <>
              <Polyline
                positions={displayRoute}
                pathOptions={{
                  color: activityColor,
                  weight: 4,
                  opacity: 0.85,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
              <Marker position={displayRoute[0]} icon={startIcon}>
                <Popup>Start</Popup>
              </Marker>
              <Marker
                position={displayRoute[displayRoute.length - 1]}
                icon={endIcon}
              >
                <Popup>Finish</Popup>
              </Marker>
            </>
          )}

          {!pickPoint && !routeMode && markers.length > 0 && (
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterCustomIcon}
            >
              {markers.map((marker: MapMarker, index: number) => {
                const iconKey = marker.selected
                  ? `${marker.type || 'default'}Selected`
                  : marker.type || 'default';
                const icon = icons[iconKey as keyof typeof icons] || icons.run;

                return (
                  <Marker key={index} position={marker.position} icon={icon}>
                    <Popup className="custom-popup">
                      <div className="w-[220px] space-y-2">
                        <h3 className="font-bold text-base leading-tight line-clamp-2 m-0">
                          {marker.popup}
                        </h3>
                        <div className="flex items-center justify-between gap-2 text-xs text-gray-600">
                          <span>
                            {formatDate(marker.date)} · {marker.startTime}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              DIFFICULTY_COLORS[
                                marker.level as keyof typeof DIFFICULTY_COLORS
                              ] ?? ''
                            }`}
                          >
                            {t(marker.level.toLowerCase())}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {marker.activities.map((activity, idx) => {
                            const cfg = getActivityConfig(activity);
                            const Icon = cfg?.Icon;
                            const dist = marker.parsedDistances.find(
                              (d) =>
                                d.activity.toLowerCase() ===
                                activity.toLowerCase(),
                            );
                            return (
                              <span
                                key={`${activity}-${idx}`}
                                className="inline-flex items-center gap-1 text-xs"
                                style={{ color: cfg?.color }}
                              >
                                {Icon && <Icon className="h-3 w-3" />}
                                {dist && (
                                  <span className="text-gray-700">
                                    {dist.distance}
                                    {t(dist.unit)}
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-gray-500 m-0 truncate">
                          {marker.city}, {marker.country}
                        </p>
                        <Link
                          href={`/trainings/${marker.id}`}
                          prefetch
                          className="btn btn-primary btn-xs w-full text-white"
                        >
                          {t('viewDetails')}
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          )}
        </MapContainer>
      </div>
    </>
  );
}

export default Map;
