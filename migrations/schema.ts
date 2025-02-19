import { sqliteTable, AnySQLiteColumn, text, integer, uniqueIndex, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const checklistItems = sqliteTable("checklistItems", {
	id: text("id").primaryKey().notNull(),
	checklistId: text("checklist_id").notNull(),
	name: text("name").notNull(),
	status: text("status").notNull(),
	amount: integer("amount").notNull(),
});

export const checklists = sqliteTable("checklists", {
	id: text("id").primaryKey().notNull(),
	eventId: text("event_id").notNull(),
	userId: text("user_id").notNull(),
	eventStartDate: text("event_start_date").notNull(),
});

export const trainingData = sqliteTable("training_data", {
	id: text("id").primaryKey().notNull(),
	athleteId: text("athlete_id").notNull(),
	postId: text("post_id").notNull(),
	activityType: text("activity_type").notNull(),
	distance: integer("distance").notNull(),
	duration: integer("duration").notNull(),
	caloriesBurned: integer("calories_burned").notNull(),
	elevationGain: integer("elevation_gain").notNull(),
	avgPace: integer("avg_pace").notNull(),
	avgHeartRate: integer("avg_heart_rate").notNull(),
	sourcePlatform: text("source_platform").notNull(),
	timestamp: text("timestamp").notNull(),
	location: text("location").notNull(),
});

export const oldPushTrainingEvents = sqliteTable("__old_push_training_events", {
	id: text("id").primaryKey().notNull(),
	description: text("description").notNull(),
	name: text("name").notNull(),
	city: text("city").notNull(),
	country: text("country").notNull(),
	userPosition: text("user_position").notNull(),
	distances: text("distances").notNull(),
	date: text("date").notNull(),
	level: text("level").notNull(),
	createdBy: text("created_by").notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const eventAttendees = sqliteTable("event_attendees", {
	eventId: text("event_id").notNull().references(() => oldPushTrainingEvents.id, { onDelete: "cascade" } ),
	attendeeId: text("attendee_id").notNull().references(() => oldPushUsers.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		eventIdAttendeeIdUnique: uniqueIndex("event_attendees_event_id_attendee_id_unique").on(table.eventId, table.attendeeId),
	}
});

export const users = sqliteTable("users", {
	id: text("id").primaryKey().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	lastLogin: text("lastLogin"),
	email: text("email").notNull(),
	password: text("password").notNull(),
	username: text("username"),
	name: text("name"),
	surname: text("surname"),
	country: text("country"),
	city: text("city"),
	age: integer("age"),
	experienceLevel: text("experienceLevel"),
},
(table) => {
	return {
		emailUnique: uniqueIndex("users_email_unique").on(table.email),
	}
});

export const comments = sqliteTable("comments", {
	id: text("id").primaryKey().notNull(),
	postId: text("post_id").notNull(),
	userId: text("user_id").notNull(),
	content: text("content").notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const events = sqliteTable("events", {
	id: text("id").primaryKey().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	name: text("name").notNull(),
	startOn: text("startOn").notNull(),
	createdById: text("createdById").notNull(),
	description: text("description"),
	country: text("country"),
	city: text("city"),
	address: text("address"),
	organization: text("organization"),
	distanceSwim: integer("distance_swim"),
	distanceBike: integer("distance_bike"),
	distanceRun: integer("distance_run"),
	isPrivate: integer("isPrivate").default(false).notNull(),
	price: integer("price"),
	status: text("status").default("draft").notNull(),
},
(table) => {
	return {
		createdByIdNameUnique: uniqueIndex("events_createdById_name_unique").on(table.createdById, table.name),
	}
});

export const posts = sqliteTable("posts", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	description: text("description"),
	location: text("location"),
	distance: integer("distance"),
	time: integer("time"),
	avgHeartRate: integer("avg_heart_rate"),
	avgSpeed: integer("avg_speed"),
	activityType: text("activity_type"),
	platform: text("platform"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text("updatedAt"),
});

export const trainingEvents = sqliteTable("training_events", {
	id: text("id").primaryKey().notNull(),
	description: text("description").notNull(),
	name: text("name").notNull(),
	city: text("city").notNull(),
	country: text("country").notNull(),
	userPosition: text("user_position").notNull(),
	distances: text("distances").notNull(),
	date: text("date").notNull(),
	level: text("level").notNull(),
	createdBy: text("created_by").notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});