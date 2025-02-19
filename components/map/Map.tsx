import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { SearchField } from '@/helpers/searchControl';
import { useState } from 'react';
import type { MapProps } from './types';
import { LocationMarker, MapCursorController, ReverseGeocode } from './utils';

export default function Map({
  position,
  zoom,
  pickPoint,
  handleLocation,
}: MapProps) {
  const [markerPosition, setMarkerPosition] = useState(position);

  return (
    <>
      <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
        <SearchField />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition}></Marker>
        <LocationMarker
          pickPointMode={pickPoint}
          setPosition={setMarkerPosition}
        />
        <MapCursorController pickPoint={pickPoint} />
        <ReverseGeocode latlng={markerPosition} setLocation={handleLocation} />
      </MapContainer>
    </>
  );
}
