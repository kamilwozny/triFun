CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `authenticator` (
	`credentialID` text NOT NULL,
	`userId` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`credentialPublicKey` text NOT NULL,
	`counter` integer NOT NULL,
	`credentialDeviceType` text NOT NULL,
	`credentialBackedUp` integer NOT NULL,
	`transports` text,
	PRIMARY KEY(`userId`, `credentialID`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE TABLE `checklistItems` (
	`id` text PRIMARY KEY NOT NULL,
	`checklist_id` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`amount` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `checklists` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`event_start_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event_attendees` (
	`event_id` text NOT NULL,
	`attendee_id` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_attendees_event_id_attendee_id_unique` ON `event_attendees` (`event_id`,`attendee_id`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`description` text,
	`location` text,
	`distance` integer,
	`time` integer,
	`avg_heart_rate` integer,
	`avg_speed` integer,
	`activity_type` text,
	`platform` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`reviewer_id` text NOT NULL,
	`target_user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`event_id`) REFERENCES `training_events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewer_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_event_id_reviewer_id_target_user_id_unique` ON `reviews` (`event_id`,`reviewer_id`,`target_user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `training_data` (
	`id` text PRIMARY KEY NOT NULL,
	`athlete_id` text NOT NULL,
	`post_id` text NOT NULL,
	`activity_type` text NOT NULL,
	`distance` integer NOT NULL,
	`duration` integer NOT NULL,
	`calories_burned` integer NOT NULL,
	`elevation_gain` integer NOT NULL,
	`avg_pace` integer NOT NULL,
	`avg_heart_rate` integer NOT NULL,
	`source_platform` text NOT NULL,
	`timestamp` text NOT NULL,
	`location` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `training_events` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`user_position` text NOT NULL,
	`distances` text NOT NULL,
	`date` text NOT NULL,
	`start_time` text NOT NULL,
	`level` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`is_private` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` integer,
	`image` text,
	`bio` text,
	`location` text,
	`customAvatar` text,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
