-- NexTravel Holidays — MySQL database schema
-- Compatible with MySQL 8.x (utf8mb4)
--
-- Import example:
--   mysql -u root -p < database/nextravel.sql
--
-- After schema import, seed packages/gallery with:
--   npm run db:seed

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE IF NOT EXISTS `nextravel`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `nextravel`;

-- ---------------------------------------------------------------------------
-- Packages catalog
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `package_items`;
DROP TABLE IF EXISTS `package_itinerary`;
DROP TABLE IF EXISTS `package_highlights`;
DROP TABLE IF EXISTS `package_gallery`;
DROP TABLE IF EXISTS `packages`;
DROP TABLE IF EXISTS `gallery_items`;
DROP TABLE IF EXISTS `app_meta`;

CREATE TABLE `packages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 4.8,
  `description` TEXT NOT NULL,
  `overview` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `price` VARCHAR(64) NOT NULL,
  `duration` VARCHAR(128) NOT NULL,
  `category` VARCHAR(32) NOT NULL DEFAULT 'Other',
  `itinerary_intro` TEXT NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 1,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_packages_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `package_gallery` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_gallery_package` (`package_id`),
  CONSTRAINT `fk_gallery_package`
    FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `package_highlights` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_highlights_package` (`package_id`),
  CONSTRAINT `fk_highlights_package`
    FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `package_itinerary` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_id` INT UNSIGNED NOT NULL,
  `day_number` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `activities` JSON NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_itinerary_package` (`package_id`),
  CONSTRAINT `fk_itinerary_package`
    FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `package_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_id` INT UNSIGNED NOT NULL,
  `kind` ENUM('included', 'not_included') NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_items_package` (`package_id`),
  CONSTRAINT `fk_items_package`
    FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Site / gallery / admin meta
-- ---------------------------------------------------------------------------

CREATE TABLE `app_meta` (
  `meta_key` VARCHAR(64) NOT NULL,
  `meta_value` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `gallery_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) NOT NULL,
  `aspect` ENUM('portrait', 'landscape', 'square', 'wide') NOT NULL DEFAULT 'landscape',
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_gallery_items_sort` (`sort_order`, `id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Default admin login (editable later in Admin → Settings)
-- Email: pulkit@nextravelholidays.com
-- Password: 8866486477
-- ---------------------------------------------------------------------------

INSERT INTO `app_meta` (`meta_key`, `meta_value`) VALUES
  ('admin_email', 'pulkit@nextravelholidays.com'),
  ('admin_password', '8866486477')
ON DUPLICATE KEY UPDATE `meta_value` = VALUES(`meta_value`);

SET FOREIGN_KEY_CHECKS = 1;

-- Optional app DB user (skip if user already exists)
-- CREATE USER IF NOT EXISTS 'nextravel'@'%' IDENTIFIED BY 'nextravel';
-- GRANT ALL PRIVILEGES ON nextravel.* TO 'nextravel'@'%';
-- FLUSH PRIVILEGES;
