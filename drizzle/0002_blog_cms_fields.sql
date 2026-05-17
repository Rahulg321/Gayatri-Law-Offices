ALTER TABLE `blog_posts` ADD `category_parent` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `status` text DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `tags` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `series_slug` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `series_title` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `author_name` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `author_image_url` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `author_bio` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `featured_image_url` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `canonical_url` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `twitter_card` text DEFAULT 'summary_large_image' NOT NULL;--> statement-breakpoint
UPDATE `blog_posts` SET `status` = CASE WHEN `published` = 0 THEN 'draft' ELSE 'published' END;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `published`;
