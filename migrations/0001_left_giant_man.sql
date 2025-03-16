DROP INDEX "authenticator_credentialID_unique";--> statement-breakpoint
DROP INDEX "event_attendees_event_id_attendee_id_unique";--> statement-breakpoint
DROP INDEX "events_createdById_name_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `event_attendees` ALTER COLUMN "status" TO "status" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `event_attendees_event_id_attendee_id_unique` ON `event_attendees` (`event_id`,`attendee_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `events_createdById_name_unique` ON `events` (`createdById`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `event_attendees` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL;