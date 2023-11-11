CREATE TABLE `odds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` text NOT NULL,
	`event_name` text,
	`market_id` text NOT NULL,
	`market_name` text,
	`outcome_id` text NOT NULL,
	`outcome` text NOT NULL,
	`odds_decimal` real,
	`odds_fractional` text,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `plot_history_for_market` ON `odds` (`event_id`,`market_id`,`timestamp`);