import { LatLng } from 'leaflet';
import { TrainingEvent, Level } from '@/types/training';

export interface MapMarker {
  id: string;
  position: LatLng;
  popup: string;
  selected?: boolean;
  type?: 'run' | 'bike' | 'swim';
  city: string;
  country: string;
  date: string;
  startTime: string;
  level: Level;
  activities: string[];
  parsedDistances: { activity: string; distance: number; unit: string }[];
}

export interface MapBounds {
  northEast: LatLng;
  southWest: LatLng;
}

export interface RouteResult {
  points: [number, number][];
  distanceKm: number;
  elevationGainM: number;
  routeGeoJson: string;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

export interface StaticRoute {
  points: [number, number][];
  color: string;
}

export interface MapProps {
  position?: { lat: number; lng: number };
  zoom?: number;
  events?: TrainingEvent[];
  userPosition?: { lat: number; lng: number } | null;
  onBoundsChange?: (bounds: MapBounds) => void;
  pickPoint?: boolean;
  handleLocation?: (location: Location) => void;
  onLocating?: (isLocating: boolean) => void;
  markers?: MapMarker[];
  routeMode?: boolean;
  onRouteChange?: (data: RouteResult) => void;
  onElevationUpdate?: (elevationGainM: number) => void;
  displayRoute?: [number, number][];
  animatedPoints?: [number, number][];
  activityColor?: string;
  showSearch?: boolean;
  staticRoutes?: StaticRoute[];
  swimPoint?: { lat: number; lng: number };
  className?: string;
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
