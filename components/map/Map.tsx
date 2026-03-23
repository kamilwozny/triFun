'use client';

import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
  useMap,
  Polyline,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useState, useEffect } from 'react';
import type { MapProps, MapMarker, Location, RouteResult } from './types';
import { LocationMarker } from './utils';
import { icons } from './MarkerIcon';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useTranslation } from 'react-i18next';
import { getOSRMRoute, getElevationGain } from '@/lib/routing';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

function MapCursorController({
  pickPoint,
  handleLocation,
}: {
  pickPoint: boolean;
  handleLocation?: (location: Location) => void;
}) {
  useMapEvents({
    click: async (e) => {
      if (pickPoint && handleLocation) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`,
          );
          const data = await response.json();

          handleLocation({
            city:
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb,
            country: data.address.country,
            position: {
              lat: e.latlng.lat,
              lng: e.latlng.lng,
            },
          });
        } catch (error) {
          console.error('Error fetching location details:', error);
        }
      }
    },
  });

  return null;
}

function CountryBoundsInitializer({
  position,
}: {
  position: L.LatLngExpression;
}) {
  const map = useMap();

  useEffect(() => {
    async function setCountryBounds() {
      if (!map) return;

      map.invalidateSize();
      try {
        const [lat, lng] = Array.isArray(position)
          ? position
          : [position.lat, position.lng];

        const response = await fetch(`/api/latlng?lat=${lat}&lng=${lng}`);
        const boundsData = await response.json();

        if (boundsData[0]) {
          const bounds = L.latLngBounds(
            [boundsData[0].boundingbox[0], boundsData[0].boundingbox[2]],
            [boundsData[0].boundingbox[1], boundsData[0].boundingbox[3]],
          );
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error('Error setting country bounds:', error);
      }
    }

    setCountryBounds();
  }, [map, position]);

  return null;
}

function MapSearchControl() {
  const map = useMap();
  const { t } = useTranslation();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: t('searchLocationPlaceholder'),
    });
    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);
  return null;
}

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

const startIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const endIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const swimIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36"><circle cx="18" cy="18" r="16" fill="#00BBF9" stroke="white" stroke-width="2"/><g transform="translate(8,10)" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M0 4c.4.3.8.7 1.7.7 1.7 0 1.7-1.3 3.3-1.3 1.7 0 1.6 1.3 3.3 1.3 1.7 0 1.7-1.3 3.3-1.3 .9 0 1.3.3 1.7.7"/><path d="M0 8c.4.3.8.7 1.7.7 1.7 0 1.7-1.3 3.3-1.3 1.7 0 1.6 1.3 3.3 1.3 1.7 0 1.7-1.3 3.3-1.3 .9 0 1.3.3 1.7.7"/><path d="M0 12c.4.3.8.7 1.7.7 1.7 0 1.7-1.3 3.3-1.3 1.7 0 1.6 1.3 3.3 1.3 1.7 0 1.7-1.3 3.3-1.3 .9 0 1.3.3 1.7.7"/></g></svg>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function AnimatedPolyline({
  points,
  color,
}: {
  points: [number, number][];
  color: string;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      setVisibleCount(0);
      return;
    }
    setVisibleCount(0);

    const totalFrames = Math.min(points.length, 300);
    const chunkSize = Math.ceil(points.length / totalFrames);
    const intervalMs = 1200 / totalFrames;

    let current = 0;
    const interval = setInterval(() => {
      current += chunkSize;
      if (current >= points.length) {
        setVisibleCount(points.length);
        clearInterval(interval);
      } else {
        setVisibleCount(current);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [points]);

  useEffect(() => {
    if (visibleCount === points.length && points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [visibleCount, points, map]);

  if (visibleCount === 0) return null;

  return (
    <Polyline
      positions={points.slice(0, visibleCount)}
      pathOptions={{
        color,
        weight: 4,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  );
}

function RouteController({
  onRouteChange,
  onPhaseChange,
  activityColor,
}: {
  onRouteChange: (data: RouteResult) => void;
  onPhaseChange: (
    phase: 'pick-start' | 'pick-end' | 'routing' | 'done',
  ) => void;
  activityColor: string;
}) {
  const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<L.LatLng | null>(null);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const map = useMap();

  useMapEvents({
    click: async (e) => {
      if (!startPoint) {
        setStartPoint(e.latlng);
        onPhaseChange('pick-end');
        return;
      }
      if (!endPoint) {
        setEndPoint(e.latlng);
        onPhaseChange('routing');

        const result = await getOSRMRoute(
          { lat: startPoint.lat, lng: startPoint.lng },
          { lat: e.latlng.lat, lng: e.latlng.lng },
        );

        if (result) {
          setRoutePoints(result.points);
          const elevationGainM = await getElevationGain(result.points);
          onRouteChange({
            ...result,
            elevationGainM,
            start: { lat: startPoint.lat, lng: startPoint.lng },
            end: { lat: e.latlng.lat, lng: e.latlng.lng },
          });
          const bounds = L.latLngBounds(result.points);
          map.fitBounds(bounds, { padding: [20, 20] });
        }
        onPhaseChange('done');
        return;
      }
      setStartPoint(e.latlng);
      setEndPoint(null);
      setRoutePoints([]);
      onPhaseChange('pick-end');
    },
  });

  return (
    <>
      {startPoint && (
        <Marker position={startPoint} icon={startIcon}>
          <Popup>Start</Popup>
        </Marker>
      )}
      {endPoint && (
        <Marker position={endPoint} icon={endIcon}>
          <Popup>Finish</Popup>
        </Marker>
      )}
      {routePoints.length > 0 && (
        <Polyline
          positions={routePoints}
          pathOptions={{
            color: activityColor,
            weight: 4,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}
    </>
  );
}

function Map({
  position,
  zoom,
  pickPoint = false,
  handleLocation,
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
              <MapCursorController
                pickPoint={pickPoint}
                handleLocation={handleLocation}
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
