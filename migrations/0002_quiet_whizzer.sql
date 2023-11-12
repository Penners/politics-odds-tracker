CREATE TABLE `latest_odds` (
	`event_id` text NOT NULL,
	`event_name` text,
	`market_id` text NOT NULL,
	`market_name` text,
	`outcome_id` text NOT NULL,
	`outcome` text NOT NULL,
	`odds_decimal` real,
	`odds_fractional` text,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`bookmaker` text NOT NULL,
	PRIMARY KEY(`bookmaker`, `event_id`, `market_id`, `outcome_id`)
);
