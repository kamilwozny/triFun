import { LatLng } from 'leaflet';
import { Dispatch, SetStateAction } from 'react';

export interface MapProps {
  position: LatLng;
  zoom: number;
  pickPoint: boolean;
  handleLocation: Dispatch<SetStateAction<Location>>;
}

export interface LocationMarkerProps {
  pickPointMode: boolean;
  setPosition: (position: LatLng) => void;
}

export interface MapCursorControllerProps {
  pickPoint: boolean;
}

export interface ReverseGeocodeProps {
  latlng: LatLng | null;
  setLocation: (location: { city: string; country: string }) => void;
}

export interface Location {
  city?: string;
  country?: string;
}
