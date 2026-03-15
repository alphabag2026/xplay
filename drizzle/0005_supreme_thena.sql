CREATE TABLE `csTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketNo` varchar(20) NOT NULL,
	`name` varchar(200) NOT NULL,
	`contact` varchar(300),
	`category` varchar(50) NOT NULL DEFAULT 'general',
	`subject` varchar(500) NOT NULL,
	`message` text NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'open',
	`priority` varchar(20) NOT NULL DEFAULT 'normal',
	`reply` text,
	`repliedBy` varchar(200),
	`repliedAt` timestamp,
	`telegramMsgId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `csTickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `csTickets_ticketNo_unique` UNIQUE(`ticketNo`)
);
--> statement-breakpoint
ALTER TABLE `communicationPartners` ADD `isUserRegistered` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `communicationPartners` ADD `registeredByOpenId` varchar(64);