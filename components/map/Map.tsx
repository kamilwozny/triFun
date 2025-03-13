import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { SearchField } from '@/helpers/searchControl';
import { useState } from 'react';
import type { MapProps, MapMarker } from './types';
import { LocationMarker, MapCursorController, ReverseGeocode } from './utils';
import { icons } from './MarkerIcon';

export default function Map({
  position,
  zoom,
  pickPoint,
  handleLocation,
  markers = [],
}: MapProps) {
  const [markerPosition, setMarkerPosition] = useState(position);

  return (
    <>
      <MapContainer
        center={position}
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
            <MapCursorController pickPoint={pickPoint} />
            <ReverseGeocode
              latlng={markerPosition}
              setLocation={handleLocation}
            />
          </>
        )}
      </MapContainer>
    </>
  );
}
