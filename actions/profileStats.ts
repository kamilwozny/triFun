'use server';

import { db } from '@/db/db';
import { eventAttendees, trainingEvents } from '@/db/schema';
import { eq, gte, or, and } from 'drizzle-orm';

export interface SportCounts {
  Run: number;
  Bike: number;
  Swim: number;
  Other: number;
}

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

function getActivityKey(activity: string): keyof SportCounts {
  if (activity === 'Run') return 'Run';
  if (activity === 'Bike') return 'Bike';
  if (activity === 'Swim') return 'Swim';
  const lower = activity.toLowerCase();
  if (lower.includes('run')) return 'Run';
  if (lower.includes('bike') || lower.includes('cycl')) return 'Bike';
  if (lower.includes('swim')) return 'Swim';
  return 'Other';
}

function getWeekIndex(dateStr: string, cutoffDate: Date): number {
  const date = new Date(dateStr);
  const diffMs = date.getTime() - cutoffDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

export async function getProfileStats(
  userId: string,
): Promise<ProfileStatsResult> {
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
    .innerJoin(trainingEvents, eq(eventAttendees.eventId, trainingEvents.id))
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

    const weekIdx = Math.min(3, Math.max(0, getWeekIndex(event.date, cutoff)));
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
}
