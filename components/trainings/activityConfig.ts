import { FaRunning, FaBicycle, FaSwimmer } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export const ACTIVITY_COLORS: Record<string, string> = {
  Run: '#FF2E63',
  Bike: '#9B5DE5',
  Swim: '#00BBF9',
};

export interface ActivityConfigEntry {
  key: 'Run' | 'Bike' | 'Swim';
  Icon: IconType;
  color: string;
}

export const ACTIVITY_CONFIG: ActivityConfigEntry[] = [
  { key: 'Run', Icon: FaRunning, color: ACTIVITY_COLORS.Run },
  { key: 'Bike', Icon: FaBicycle, color: ACTIVITY_COLORS.Bike },
  { key: 'Swim', Icon: FaSwimmer, color: ACTIVITY_COLORS.Swim },
];

export function getActivityConfig(activity: string): ActivityConfigEntry | undefined {
  return ACTIVITY_CONFIG.find(
    (a) => a.key.toLowerCase() === activity.toLowerCase(),
  );
}
