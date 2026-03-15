CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('document','blog','video') NOT NULL,
	`lang` varchar(10) NOT NULL DEFAULT 'all',
	`title` varchar(500) NOT NULL,
	`description` text,
	`thumbnailUrl` text,
	`url` text NOT NULL,
	`fileType` varchar(20),
	`platform` varchar(100),
	`youtubeId` varchar(50),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
