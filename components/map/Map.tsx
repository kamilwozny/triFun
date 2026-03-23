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
  zoom,
  pickPoint = false,
  handleLocation,
  onLocating,
  markers = [],
  routeMode = false,
  onRouteChange,
  displayRoute,
  animatedPoints,
  activityColor = '#9B5DE5',
  showSearch = false,
  staticRoutes = [],
  swimPoint,
}: MapProps) {
  const [markerPosition, setMarkerPosition] = useState(
    position ? { lat: position.lat, lng: position.lng } : null,
  );
  const [routePhase, setRoutePhase] = useState<
    'pick-start' | 'pick-end' | 'routing' | 'done'
  >('pick-start');
  const { t } = useTranslation();

  const mapKey =
    routeMode || displayRoute || animatedPoints || pickPoint || swimPoint
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

      <div className="relative">
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
          className="h-[700px] w-full"
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
            position && (
              <CountryBoundsInitializer
                position={[position.lat, position.lng]}
              />
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
                      <div className="text-center">
                        <h3 className="font-bold text-lg mb-1">
                          {marker.popup}
                        </h3>
                        {marker.details && (
                          <p className="text-sm text-gray-600">
                            {marker.details}
                          </p>
                        )}
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
