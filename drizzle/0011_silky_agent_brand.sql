CREATE TABLE `liveFeedConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`configKey` varchar(50) NOT NULL,
	`configValue` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `liveFeedConfig_id` PRIMARY KEY(`id`),
	CONSTRAINT `liveFeedConfig_configKey_unique` UNIQUE(`configKey`)
);
--> statement-breakpoint
ALTER TABLE `communicationPartners` ADD `openKakaoChat` text;--> statement-breakpoint
ALTER TABLE `communicationPartners` ADD `personalCommunity` text;