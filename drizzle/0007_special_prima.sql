CREATE TABLE `urgentNotices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`message` text NOT NULL,
	`meetingType` varchar(30) NOT NULL DEFAULT 'general',
	`meetingLink` text,
	`meetingTime` varchar(200),
	`isActive` boolean NOT NULL DEFAULT true,
	`authorName` varchar(100) NOT NULL DEFAULT 'XPLAY Admin',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `urgentNotices_id` PRIMARY KEY(`id`)
);
