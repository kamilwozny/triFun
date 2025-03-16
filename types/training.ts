export type Level = 'Beginner' | 'Intermediate' | 'Expert';

export interface TrainingEvent {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  userPosition: string;
  distances: string;
  date: string;
  level: Level;
  createdBy: string;
  createdAt: string;
  isPrivate: boolean;
  // Computed fields
  activities: string[];
  location?: {
    lat: number;
    lng: number;
  };
  parsedDistances: Array<{
    activity: string;
    distance: number;
    unit: string;
  }>;
}
