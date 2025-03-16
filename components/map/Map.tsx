import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { SearchField } from '@/helpers/searchControl';
import { useState } from 'react';
import type { MapProps, MapMarker, Location } from './types';
import { LocationMarker } from './utils';
import { icons } from './MarkerIcon';

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
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
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

export default function Map({
  position,
  zoom = 13,
  pickPoint = false,
  handleLocation,
  markers = [],
}: MapProps) {
  const [markerPosition, setMarkerPosition] = useState(
    position ? { lat: position.lat, lng: position.lng } : null
  );

  return (
    <MapContainer
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
      {/* Display user's position marker if in pick point mode */}
      {pickPoint && markerPosition && (
        <Marker position={markerPosition} icon={icons.default}>
          <Popup>Your selected location</Popup>
        </Marker>
      )}
      {/* Display all training markers */}
      {markers.map((marker: MapMarker, index: number) => {
        const iconKey = marker.selected
          ? `${marker.type || 'default'}Selected`
          : marker.type || 'default';
        const icon = icons[iconKey as keyof typeof icons] || icons.default;

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
      })}
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
  );
}
