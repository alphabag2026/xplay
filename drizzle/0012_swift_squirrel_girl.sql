CREATE TABLE `faqItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faqItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tutorials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`youtubeId` varchar(50) NOT NULL,
	`videoUrl` text,
	`iconName` varchar(50) NOT NULL DEFAULT 'Rocket',
	`iconColor` varchar(20) NOT NULL DEFAULT '#00f5ff',
	`title` text NOT NULL,
	`description` text NOT NULL,
	`tooltip` text,
	`category` varchar(20) NOT NULL DEFAULT 'beginner',
	`steps` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tutorials_id` PRIMARY KEY(`id`)
);
