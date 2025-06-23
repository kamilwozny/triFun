import { LatLng } from 'leaflet';
import { TrainingEvent } from '@/types/training';

export interface MapMarker {
  position: LatLng;
  popup: string;
  selected?: boolean;
  details?: string;
  type?: 'run' | 'bike' | 'swim';
}

export interface MapBounds {
  northEast: LatLng;
  southWest: LatLng;
}

export interface MapProps {
  position?: { lat: number; lng: number };
  zoom?: number;
  events?: TrainingEvent[];
  userPosition?: { lat: number; lng: number } | null;
  onBoundsChange?: (bounds: MapBounds) => void;
  pickPoint?: boolean;
  handleLocation?: (location: Location) => void;
  markers?: MapMarker[];
}

export interface LocationMarkerProps {
  pickPointMode: boolean;
  setPosition: (position: LatLng) => void;
}

export interface MapCursorControllerProps {
  pickPoint: boolean;
}

export interface ReverseGeocodeProps {
  latlng: LatLng | null | undefined;
  setLocation: (location: Location) => void;
}

export interface Location {
  city?: string;
  country?: string;
  position?: {
    lat: number;
    lng: number;
  } | null;
}

export interface LocationSuggestion {
  text: string;
  type: 'city' | 'country';
}
