CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`reviewer_id` text NOT NULL,
	`target_user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `training_events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewer_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_event_id_reviewer_id_target_user_id_unique` ON `reviews` (`event_id`,`reviewer_id`,`target_user_id`);