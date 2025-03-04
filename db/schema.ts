import { randomUUID } from 'crypto';
import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

type Level = 'Beginner' | 'Intermediate' | 'Expert';

const id = () =>
  text('id')
    .primaryKey()
    .$default(() => randomUUID());

const createdAt = () =>
  text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull();

const date = (name: string) => text(name);

const boolean = (field: string) => integer(field, { mode: 'boolean' });

export const users = sqliteTable('users', {
  id: id(),
  createdAt: createdAt(),
  lastLogin: text('lastLogin'),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  username: text('username').notNull(),
  name: text('name'),
  surname: text('surname'),
  country: text('country'),
  city: text('city'),
  bio: text('username'),
  age: integer('age'),
  expierenceLevel: text('experienceLevel').$type<Level>(),
});

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  posts: many(posts),
  trainingData: many(trainingData),
}));

export const events = sqliteTable(
  'events',
  {
    id: id(),
    createdAt: createdAt(),
    name: text('name').notNull(),
    startOn: date('startOn').notNull(),
    createdById: text('createdById').notNull(),
    description: text('description'),
    country: text('country'),
    city: text('city'),
    address: text('address'),
    organization: text('organization'),
    distance_swim: integer('distance_swim'),
    distance_bike: integer('distance_bike'),
    distance_run: integer('distance_run'),
    isPrivate: boolean('isPrivate').default(false).notNull(),
    price: integer('price'),
    status: text('status', {
      enum: ['draft', 'live', 'started', 'ended', 'canceled'],
    })
      .default('draft')
      .notNull(),
  },
  (table) => ({
    unq: unique().on(table.createdById, table.name),
  })
);

export const eventsRelations = relations(events, ({ many, one }) => ({
  createdBy: one(users, {
    references: [users.id],
    fields: [events.createdById],
  }),
}));

export const eventAttendees = sqliteTable(
  'event_attendees',
  {
    eventId: text('event_id').notNull(),
    attendeeId: text('attendee_id').notNull(),
  },
  (table) => ({
    pk: unique().on(table.eventId, table.attendeeId),
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
  event: one(events, {
    references: [events.id],
    fields: [checklists.eventId],
  }),
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
  level: text('level').notNull().$type<Level>(),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
});

export const trainingEventsRelations = relations(trainingEvents, ({ one }) => ({
  createdByUser: one(users, {
    references: [users.id],
    fields: [trainingEvents.createdBy],
  }),
}));

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
