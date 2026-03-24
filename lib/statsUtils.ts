export interface SportCounts {
  Run: number;
  Bike: number;
  Swim: number;
  Other: number;
}

export function getActivityKey(activity: string): keyof SportCounts {
  if (activity === 'Run') return 'Run';
  if (activity === 'Bike') return 'Bike';
  if (activity === 'Swim') return 'Swim';
  const lower = activity.toLowerCase();
  if (lower.includes('run')) return 'Run';
  if (lower.includes('bike') || lower.includes('cycl')) return 'Bike';
  if (lower.includes('swim')) return 'Swim';
  return 'Other';
}

export function getWeekIndex(dateStr: string, cutoffDate: Date): number {
  const date = new Date(dateStr);
  const diffMs = date.getTime() - cutoffDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}
