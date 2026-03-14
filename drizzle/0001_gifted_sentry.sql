CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`imageUrl` text,
	`isPinned` boolean NOT NULL DEFAULT false,
	`authorName` varchar(100) NOT NULL DEFAULT 'XPLAY Admin',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
