CREATE TABLE `attr_values` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`attribute_id` bigint unsigned,
	`value` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	CONSTRAINT `attr_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attributes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	CONSTRAINT `attributes_id` PRIMARY KEY(`id`),
	CONSTRAINT `attributes_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`product_id` bigint unsigned,
	`name` varchar(255),
	`slug` varchar(255),
	`price` decimal(10,2),
	`description` text,
	`image` varchar(255),
	`images` text,
	`stock` bigint DEFAULT 0,
	CONSTRAINT `product_variants_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_variants_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`category_id` bigint unsigned,
	`image` varchar(255),
	`images` text,
	`badge` varchar(50),
	`technical_specs` text,
	`type` varchar(20) DEFAULT 'simple',
	`seo_title` varchar(255),
	`seo_description` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `variant_attr` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`variant_id` bigint unsigned,
	`attribute_value_id` bigint unsigned,
	CONSTRAINT `variant_attr_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `attr_values` ADD CONSTRAINT `attr_values_attribute_id_attributes_id_fk` FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `variant_attr` ADD CONSTRAINT `variant_attr_variant_id_product_variants_id_fk` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `variant_attr` ADD CONSTRAINT `variant_attr_attribute_value_id_attr_values_id_fk` FOREIGN KEY (`attribute_value_id`) REFERENCES `attr_values`(`id`) ON DELETE no action ON UPDATE no action;