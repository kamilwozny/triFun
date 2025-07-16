DROP INDEX "authenticator_credentialID_unique";--> statement-breakpoint
DROP INDEX "event_attendees_event_id_attendee_id_unique";--> statement-breakpoint
DROP INDEX "reviews_event_id_reviewer_id_target_user_id_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `reviews` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `event_attendees_event_id_attendee_id_unique` ON `event_attendees` (`event_id`,`attendee_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_event_id_reviewer_id_target_user_id_unique` ON `reviews` (`event_id`,`reviewer_id`,`target_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);