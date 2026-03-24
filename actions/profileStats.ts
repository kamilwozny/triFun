'use server';

import { db } from '@/db/db';
import { eventAttendees, trainingEvents } from '@/db/schema';
import { eq, gte, and } from 'drizzle-orm';
import { getActivityKey, getWeekIndex, SportCounts } from '@/lib/statsUtils';
import { unstable_cache } from 'next/cache';

export type { SportCounts };

export interface WeeklyData {
  label: string;
  Run: number;
  Bike: number;
  Swim: number;
  Other: number;
  total: number;
}

export interface ProfileStatsResult {
  total: number;
  bySport: SportCounts;
  weeklyData: WeeklyData[];
}

const _getProfileStatsCached = unstable_cache(
  async (userId: string): Promise<ProfileStatsResult> => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 28);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    const hostedEvents = await db
      .select({
        id: trainingEvents.id,
        distances: trainingEvents.distances,
        date: trainingEvents.date,
      })
      .from(trainingEvents)
      .where(
        and(
          eq(trainingEvents.createdBy, userId),
          gte(trainingEvents.date, cutoffStr),
        ),
      );

    const attendedRows = await db
      .select({
        id: trainingEvents.id,
        distances: trainingEvents.distances,
        date: trainingEvents.date,
        createdBy: trainingEvents.createdBy,
      })
      .from(eventAttendees)
      .innerJoin(
        trainingEvents,
        eq(eventAttendees.eventId, trainingEvents.id),
      )
      .where(
        and(
          eq(eventAttendees.attendeeId, userId),
          eq(eventAttendees.status, 'confirmed'),
          gte(trainingEvents.date, cutoffStr),
        ),
      );

    const seen = new Set<string>();
    const allEvents: { id: string; distances: string; date: string }[] = [];
    for (const e of [...hostedEvents, ...attendedRows]) {
      if (!seen.has(e.id)) {
        seen.add(e.id);
        allEvents.push(e);
      }
    }

    const bySport: SportCounts = { Run: 0, Bike: 0, Swim: 0, Other: 0 };

    const weeks: WeeklyData[] = Array.from({ length: 4 }, (_, i) => ({
      label: `W${i + 1}`,
      Run: 0,
      Bike: 0,
      Swim: 0,
      Other: 0,
      total: 0,
    }));

    for (const event of allEvents) {
      let parsedDistances: { activity: string }[] = [];
      try {
        parsedDistances = JSON.parse(event.distances);
      } catch {
        parsedDistances = [];
      }

      const weekIdx = Math.min(
        3,
        Math.max(0, getWeekIndex(event.date, cutoff)),
      );
      weeks[weekIdx].total++;

      for (const d of parsedDistances) {
        const key = getActivityKey(d.activity);
        bySport[key]++;
        weeks[weekIdx][key]++;
      }

      if (parsedDistances.length === 0) {
        bySport.Other++;
        weeks[weekIdx].Other++;
      }
    }

    return {
      total: allEvents.length,
      bySport,
      weeklyData: weeks,
    };
  },
  ['profile-stats'],
  { revalidate: 300 },
);

export const getProfileStats = async (userId: string): Promise<ProfileStatsResult> =>
  _getProfileStatsCached(userId);
