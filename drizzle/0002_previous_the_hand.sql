CREATE TABLE `announcementComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`announcementId` int NOT NULL,
	`nickname` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `announcementComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `announcementLikes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`announcementId` int NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `announcementLikes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communicationPartners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`phone` varchar(50),
	`telegram` varchar(100),
	`kakao` varchar(100),
	`whatsapp` varchar(50),
	`wechat` varchar(100),
	`avatarUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `communicationPartners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` text NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`imageUrl` text,
	`siteName` varchar(200),
	`originalContent` text,
	`translatedContent` text,
	`authorName` varchar(100) NOT NULL DEFAULT 'XPLAY Admin',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsLinks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `announcements` ADD `likeCount` int DEFAULT 0 NOT NULL;