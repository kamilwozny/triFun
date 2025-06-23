import {
  sqliteTable,
  AnySQLiteColumn,
  foreignKey,
  primaryKey,
  text,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const account = sqliteTable(
  'account',
  {
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text(),
    idToken: text('id_token'),
    sessionState: text('session_state'),
  },
  (table) => [
    primaryKey({
      columns: [table.provider, table.providerAccountId],
      name: 'account_provider_providerAccountId_pk',
    }),
  ]
);

export const checklistItems = sqliteTable('checklistItems', {
  id: text().primaryKey().notNull(),
  checklistId: text('checklist_id').notNull(),
  name: text().notNull(),
  status: text().notNull(),
  amount: integer().notNull(),
});

export const checklists = sqliteTable('checklists', {
  id: text().primaryKey().notNull(),
  eventId: text('event_id').notNull(),
  userId: text('user_id').notNull(),
  eventStartDate: text('event_start_date').notNull(),
});

export const comments = sqliteTable('comments', {
  id: text().primaryKey().notNull(),
  postId: text('post_id').notNull(),
  userId: text('user_id').notNull(),
  content: text().notNull(),
  createdAt: text('created_at').default('sql`(CURRENT_TIMESTAMP)`').notNull(),
});

export const eventAttendees = sqliteTable(
  'event_attendees',
  {
    eventId: text('event_id').notNull(),
    attendeeId: text('attendee_id').notNull(),
    status: text().notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    uniqueIndex('event_attendees_event_id_attendee_id_unique').on(
      table.eventId,
      table.attendeeId
    ),
  ]
);

export const events = sqliteTable('events', {
  id: text().primaryKey().notNull(),
  createdAt: text('created_at').default('sql`(CURRENT_TIMESTAMP)`').notNull(),
  name: text().notNull(),
  startOn: text().notNull(),
  createdById: text().notNull(),
  description: text(),
  country: text(),
  city: text(),
  address: text(),
  organization: text(),
  distanceSwim: integer('distance_swim'),
  distanceBike: integer('distance_bike'),
  distanceRun: integer('distance_run'),
  isPrivate: integer().default(0).notNull(),
  price: integer(),
  status: text().default('draft').notNull(),
});

export const posts = sqliteTable('posts', {
  id: text().primaryKey().notNull(),
  userId: text('user_id').notNull(),
  description: text(),
  location: text(),
  distance: integer(),
  time: integer(),
  avgHeartRate: integer('avg_heart_rate'),
  avgSpeed: integer('avg_speed'),
  activityType: text('activity_type'),
  platform: text(),
  createdAt: text('created_at').default('sql`(CURRENT_TIMESTAMP)`').notNull(),
  updatedAt: text(),
});

export const session = sqliteTable('session', {
  sessionToken: text().primaryKey().notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expires: integer().notNull(),
});

export const trainingData = sqliteTable('training_data', {
  id: text().primaryKey().notNull(),
  athleteId: text('athlete_id').notNull(),
  postId: text('post_id').notNull(),
  activityType: text('activity_type').notNull(),
  distance: integer().notNull(),
  duration: integer().notNull(),
  caloriesBurned: integer('calories_burned').notNull(),
  elevationGain: integer('elevation_gain').notNull(),
  avgPace: integer('avg_pace').notNull(),
  avgHeartRate: integer('avg_heart_rate').notNull(),
  sourcePlatform: text('source_platform').notNull(),
  timestamp: text().notNull(),
  location: text().notNull(),
});

export const trainingEvents = sqliteTable('training_events', {
  id: text().primaryKey().notNull(),
  description: text().notNull(),
  name: text().notNull(),
  city: text().notNull(),
  country: text().notNull(),
  userPosition: text('user_position').notNull(),
  distances: text().notNull(),
  date: text().notNull(),
  level: text().notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: text('created_at').default('sql`(CURRENT_TIMESTAMP)`').notNull(),
  isPrivate: integer('is_private').default(0).notNull(),
  startTime: text('start_time'),
});

export const user = sqliteTable(
  'user',
  {
    id: text().primaryKey().notNull(),
    name: text(),
    email: text(),
    emailVerified: integer(),
    image: text(),
  },
  (table) => [uniqueIndex('user_email_unique').on(table.email)]
);

export const verificationToken = sqliteTable(
  'verificationToken',
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: integer().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.identifier, table.token],
      name: 'verificationToken_identifier_token_pk',
    }),
  ]
);

export const authenticator = sqliteTable(
  'authenticator',
  {
    credentialId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    providerAccountId: text().notNull(),
    credentialPublicKey: text().notNull(),
    counter: integer().notNull(),
    credentialDeviceType: text().notNull(),
    credentialBackedUp: integer().notNull(),
    transports: text(),
  },
  (table) => [
    primaryKey({
      columns: [table.credentialId, table.userId],
      name: 'authenticator_credentialID_userId_pk',
    }),
  ]
);
