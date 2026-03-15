CREATE TABLE `leaderReferrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referralType` enum('self','acquaintance') NOT NULL,
	`referrerName` varchar(200) NOT NULL,
	`referrerContact` varchar(300) NOT NULL,
	`referrerEmail` varchar(320),
	`leaderName` varchar(200),
	`leaderContact` varchar(300),
	`previousExperience` text,
	`teamSize` varchar(100),
	`organizationStructure` text,
	`region` varchar(200),
	`expertise` varchar(300),
	`introduction` text,
	`additionalNotes` text,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`adminNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderReferrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pushSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pushSubscriptions_id` PRIMARY KEY(`id`)
);
