ALTER TABLE `portfolio_projects` ADD `body_markdown` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `featured_image_url` text;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `start_date` text;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `end_date` text;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `ongoing` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `project_status` text DEFAULT 'completed' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `project_type` text DEFAULT 'freelance' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `featured` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `client_name` text;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `client_url` text;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `skills` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `metrics` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `gallery_json` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `videos_json` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `links_json` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `attachments_json` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `testimonials_json` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `challenges_markdown` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `team_size` text;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `budget_range` text;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `tags` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `canonical_url` text;--> statement-breakpoint
ALTER TABLE `portfolio_projects` ADD `twitter_card` text DEFAULT 'summary_large_image' NOT NULL;--> statement-breakpoint
