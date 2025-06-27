import { v4 as uuid_v4 } from 'uuid';
import { relations, sql } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';
import type { AdapterAccountType } from 'next-auth/adapters';

type Level = 'Beginner' | 'Intermediate' | 'Expert';

const id = () =>
  text('id')
    .primaryKey()
    .$default(() => uuid_v4());

const createdAt = () =>
  text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull();

const boolean = (field: string) => integer(field, { mode: 'boolean' });

export const users = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  bio: text('bio'),
  location: text('location'),
  customAvatar: text('customAvatar'),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  events: many(trainingEvents),
  posts: many(posts),
  trainingData: many(trainingData),
  attendedEvents: many(eventAttendees),
  reviewsGiven: many(reviews, {
    relationName: 'reviewerUser',
  }),
  reviewsReceived: many(reviews, {
    relationName: 'targetUser',
  }),
}));

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const eventAttendees = sqliteTable(
  'event_attendees',
  {
    eventId: text('event_id').notNull(),
    attendeeId: text('attendee_id').notNull(),
    status: text('status', {
      enum: ['pending', 'confirmed', 'declined'],
    }).notNull(),
    isHost: boolean('is_host').default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    pk: unique().on(table.eventId, table.attendeeId),
  })
);

export const eventeAttendeesRelations = relations(
  eventAttendees,
  ({ one }) => ({
    event: one(trainingEvents, {
      references: [trainingEvents.id],
      fields: [eventAttendees.eventId],
    }),
    attendee: one(users, {
      references: [users.id],
      fields: [eventAttendees.attendeeId],
    }),
  })
);

export const posts = sqliteTable('posts', {
  id: id(),
  userId: text('user_id').notNull(),
  description: text('description'),
  location: text('location'),
  distance: integer('distance'),
  time: integer('time'),
  avgHeartRate: integer('avg_heart_rate'),
  avgSpeed: integer('avg_speed'),
  activityType: text('activity_type'),
  platform: text('platform'),
  createdAt: createdAt(),
  updatedAt: text('updatedAt'),
});

export const postsRelations = relations(posts, ({ many, one }) => ({
  user: one(users, {
    references: [users.id],
    fields: [posts.userId],
  }),
  comments: many(comments),
  trainingData: many(trainingData),
}));

export const comments = sqliteTable('comments', {
  id: id(),
  postId: text('post_id').notNull(),
  userId: text('user_id').notNull(),
  content: text('content').notNull(),
  createdAt: createdAt(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    references: [posts.id],
    fields: [comments.postId],
  }),
  user: one(users, {
    references: [users.id],
    fields: [comments.userId],
  }),
}));

export const checklists = sqliteTable('checklists', {
  id: id(),
  eventId: text('event_id').notNull(),
  userId: text('user_id').notNull(),
  eventStartDate: text('event_start_date').notNull(),
});

export const checklistsRelations = relations(checklists, ({ one, many }) => ({
  user: one(users, {
    references: [users.id],
    fields: [checklists.userId],
  }),
  items: many(checklistItems),
}));

export const checklistItems = sqliteTable('checklistItems', {
  id: id(),
  checklistId: text('checklist_id').notNull(),
  name: text('name').notNull(),
  status: text('status').notNull(),
  amount: integer('amount').notNull(),
});

export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
  checklist: one(checklists, {
    references: [checklists.id],
    fields: [checklistItems.checklistId],
  }),
}));

export const trainingEvents = sqliteTable('training_events', {
  id: id(),
  description: text('description').notNull(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  userPosition: text('user_position').notNull(),
  distances: text('distances').notNull(),
  date: text('date').notNull(),
  startTime: text('start_time').notNull(),
  level: text('level').notNull().$type<Level>(),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
  isPrivate: boolean('is_private').default(false).notNull(),
});

export const trainingEventsRelations = relations(
  trainingEvents,
  ({ one, many }) => ({
    createdByUser: one(users, {
      references: [users.id],
      fields: [trainingEvents.createdBy],
    }),
    attendees: many(eventAttendees),
  })
);

export const trainingData = sqliteTable('training_data', {
  id: id(),
  athleteId: text('athlete_id').notNull(),
  postId: text('post_id').notNull(),
  activityType: text('activity_type').notNull(),
  distance: integer('distance').notNull(),
  duration: integer('duration').notNull(),
  caloriesBurned: integer('calories_burned').notNull(),
  elevationGain: integer('elevation_gain').notNull(),
  avgPace: integer('avg_pace').notNull(),
  avgHeartRate: integer('avg_heart_rate').notNull(),
  sourcePlatform: text('source_platform').notNull(),
  timestamp: text('timestamp').notNull(),
  location: text('location').notNull(),
});

export const trainingDataRelations = relations(trainingData, ({ one }) => ({
  athlete: one(users, {
    references: [users.id],
    fields: [trainingData.athleteId],
  }),
  post: one(posts, {
    references: [posts.id],
    fields: [trainingData.postId],
  }),
}));

export const reviews = sqliteTable(
  'reviews',
  {
    id: id(),
    eventId: text('event_id')
      .notNull()
      .references(() => trainingEvents.id, { onDelete: 'cascade' }),
    reviewerId: text('reviewer_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    targetUserId: text('target_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: createdAt(),
    updatedAt: text('updatedAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    uniqueReview: unique().on(
      table.eventId,
      table.reviewerId,
      table.targetUserId
    ),
  })
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  event: one(trainingEvents, {
    fields: [reviews.eventId],
    references: [trainingEvents.id],
  }),
  reviewerUser: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: 'reviewerUser',
  }),
  targetUser: one(users, {
    fields: [reviews.targetUserId],
    references: [users.id],
    relationName: 'targetUser',
  }),
}));
