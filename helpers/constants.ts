export const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-green-bg text-green-text border border-green-text/30',
  Intermediate: 'bg-yellow-bg text-yellow-text border border-yellow-text/40',
  Expert: 'bg-red-bg text-red-text border border-red-text/30',
};

export const DISTANCE_OPTIONS = [
  { label: '10km', value: '10' },
  { label: '20km', value: '20' },
  { label: '30km', value: '30' },
  { label: '50km', value: '50' },
  { label: '100km', value: '100' },
] as const;

export const COOKIE_NAME = 'tri-fun-token';
export const SECRET_AUTH = process.env.JWT_SECRET ?? '';

// Session storage keys for the trainings page
export const TRAININGS_SCROLL_KEY = 'trainings-scroll-row';
export const TRAININGS_FILTER_KEY = 'trainings-filter-state';
export const TRAININGS_RETURN_URL_KEY = 'trainings-return-url';
