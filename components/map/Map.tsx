'use client';

import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { SearchField } from '@/helpers/searchControl';
import { useState, useEffect } from 'react';
import type { MapProps, MapMarker, Location } from './types';
import { LocationMarker } from './utils';
import { icons } from './MarkerIcon';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

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
        // Get country from coordinates
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

function createClusterCustomIcon(cluster: any) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 'small' : count < 100 ? 'medium' : 'large';
  const sizeMap = {
    small: 40,
    medium: 45,
    large: 50,
  };

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
  markers = [],
}: MapProps) {
  const [markerPosition, setMarkerPosition] = useState(
    position ? { lat: position.lat, lng: position.lng } : null,
  );

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
      <MapContainer
        key={`${markerPosition?.lat}-${markerPosition?.lng}`}
        center={markerPosition || position}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-[700px] w-full"
      >
        <SearchField />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!pickPoint && position && (
          <CountryBoundsInitializer position={[position.lat, position.lng]} />
        )}
        {pickPoint && markerPosition && (
          <Marker position={markerPosition} icon={icons.run}>
            <Popup>Your selected location</Popup>
          </Marker>
        )}
        {/* {markers.map((marker: MapMarker, index: number) => {
          const iconKey = marker.selected
            ? `${marker.type || 'default'}Selected`
            : marker.type || 'default';
          const icon = icons[iconKey as keyof typeof icons] || icons.run;

          return (
            <Marker key={index} position={marker.position} icon={icon}>
              <Popup className="custom-popup">
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-1">{marker.popup}</h3>
                  {marker.details && (
                    <p className="text-sm text-gray-600">{marker.details}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })} */}
        {!pickPoint && markers.length > 0 && (
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
                      <h3 className="font-bold text-lg mb-1">{marker.popup}</h3>
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
      </MapContainer>
    </>
  );
}

export default Map;
