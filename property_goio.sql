-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 19, 2025 at 03:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `property_goio`
--

-- --------------------------------------------------------

--
-- Table structure for table `arrival_mode`
--

CREATE TABLE `arrival_mode` (
  `id` int(11) NOT NULL,
  `mode_code` varchar(10) NOT NULL,
  `mode_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `arrival_mode`
--

INSERT INTO `arrival_mode` (`id`, `mode_code`, `mode_name`, `description`, `is_active`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'WALKIN', 'Walk-In', 'Guest arrived without prior booking', 1, 101, 101, NULL, '2025-06-09 10:30:51', '2025-06-09 10:30:51', NULL),
(2, 'ONLINE', 'Online Booking', 'Guest booked through the hotel website', 1, 101, 101, NULL, '2025-06-09 10:30:51', '2025-06-09 10:30:51', NULL),
(3, 'AGENT', 'Travel Agent', 'Booking made via a travel agent', 1, 101, 101, NULL, '2025-06-09 10:30:51', '2025-06-09 10:30:51', NULL),
(4, 'PHONE', 'Phone Reservation', 'Booking confirmed via telephone', 1, 101, 101, NULL, '2025-06-09 10:30:51', '2025-06-09 10:30:51', NULL),
(5, 'EMAIL', 'Email Booking', 'Booking made through email communication', 1, 101, 101, NULL, '2025-06-09 10:30:51', '2025-06-09 10:30:51', NULL),
(6, 'CORP', 'Corporate Booking', 'Corporate guest reservation', 1, 101, 101, NULL, '2025-06-09 10:30:51', '2025-06-09 10:30:51', NULL),
(7, 'OTA', 'Online Travel Agency', 'Booked via OTAs like Booking.com or Expedia', 1, 101, 101, NULL, '2025-06-09 10:30:51', '2025-06-09 10:30:51', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `block_master`
--

CREATE TABLE `block_master` (
  `id` int(11) NOT NULL,
  `block_no` varchar(50) NOT NULL,
  `block_name` varchar(100) NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `block_master`
--

INSERT INTO `block_master` (`id`, `block_no`, `block_name`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'B-101', 'South Block', 1, 1, '2025-06-06 05:39:28', '2025-06-07 05:34:06', '2025-06-07 05:34:06'),
(2, 'B-102', 'East Block', 1, 1, '2025-06-06 05:39:51', '2025-06-07 05:34:06', '2025-06-07 05:34:06'),
(3, 'B-103', 'West Block', 1, 1, '2025-06-06 05:40:21', '2025-06-07 05:34:07', '2025-06-07 05:34:07'),
(4, 'B-104', 'North Block', 1, 1, '2025-06-06 05:41:04', '2025-06-07 05:34:07', '2025-06-07 05:34:07'),
(5, 'BLK-A', 'Block A', 1, 1, '2025-06-07 11:05:57', '2025-06-07 11:05:57', NULL),
(6, 'BLK-B', 'Block B', 1, 1, '2025-06-07 11:05:57', '2025-06-07 11:05:57', NULL),
(7, 'BLK-C', 'Block C', 2, 2, '2025-06-07 11:05:57', '2025-06-07 11:05:57', NULL),
(8, 'TWR-1', 'Tower 1', 1, 2, '2025-06-07 11:05:57', '2025-06-07 11:05:57', NULL),
(9, 'TWR-2', 'Tower 2', 3, 3, '2025-06-07 11:05:57', '2025-06-07 11:05:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `block_rooms`
--

CREATE TABLE `block_rooms` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `status_id` int(11) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `fromdatetime` datetime NOT NULL,
  `todatetime` datetime NOT NULL,
  `blocked_by` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `block_rooms`
--

INSERT INTO `block_rooms` (`id`, `room_id`, `status_id`, `reason`, `fromdatetime`, `todatetime`, `blocked_by`, `timestamp`) VALUES
(1, 1, 4, 'Tesing', '2025-06-11 18:30:00', '2025-06-12 18:30:00', 1, '2025-06-12 13:02:24'),
(2, 3, 7, 'testing', '2025-06-11 18:30:00', '2025-06-12 18:30:00', 1, '2025-06-12 13:05:15'),
(3, 5, 4, 'testing', '2025-06-12 18:30:00', '2025-06-13 18:30:00', 1, '2025-06-12 13:08:31'),
(4, 6, 7, 'testing', '2025-06-12 18:30:00', '2025-06-13 18:30:00', 1, '2025-06-12 13:09:24'),
(5, 7, 7, 'Tesing', '2025-06-12 18:30:00', '2025-06-18 18:30:00', 1, '2025-06-12 13:11:18'),
(6, 9, 7, 'Tesing', '2025-06-19 18:30:00', '2025-06-18 18:30:00', 1, '2025-06-12 13:14:01'),
(7, 10, 7, 'testing', '2025-06-11 18:30:00', '2025-06-13 18:30:00', 1, '2025-06-12 13:15:31'),
(8, 11, 7, 'Tesing', '2025-06-11 18:30:00', '2025-06-12 18:30:00', 1, '2025-06-12 13:17:52'),
(9, 14, 4, '1500.00', '2025-06-13 18:30:00', '2025-06-29 18:30:00', 1, '2025-06-14 11:33:19'),
(10, 18, 7, 'None', '2025-06-16 18:30:00', '2025-06-24 18:30:00', 1, '2025-06-17 06:26:14');

-- --------------------------------------------------------

--
-- Table structure for table `business_source`
--

CREATE TABLE `business_source` (
  `id` int(11) NOT NULL,
  `source_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_source`
--

INSERT INTO `business_source` (`id`, `source_name`, `created_at`, `updated_at`) VALUES
(1, 'Referral', '2025-06-09 12:20:44', '2025-06-09 12:20:44'),
(2, 'Online Ads', '2025-06-09 12:20:44', '2025-06-09 12:20:44'),
(3, 'Cold Call', '2025-06-09 12:20:44', '2025-06-09 12:20:44'),
(4, 'Walk-in', '2025-06-09 12:20:44', '2025-06-09 12:20:44');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `checkin_master`
--

CREATE TABLE `checkin_master` (
  `id` int(11) NOT NULL,
  `is_reservation` tinyint(1) DEFAULT NULL,
  `reservation_number` varchar(50) DEFAULT NULL,
  `arrival_mode` varchar(50) DEFAULT NULL,
  `ota` varchar(100) DEFAULT NULL,
  `booking_id` varchar(100) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `title` varchar(10) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `id_number` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `check_in_mode` varchar(50) DEFAULT NULL,
  `allow_credit` varchar(10) DEFAULT NULL,
  `foreign_guest` varchar(10) DEFAULT NULL,
  `segment_id` int(11) DEFAULT NULL,
  `business_source_id` int(11) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `document` varchar(255) DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `guest_company` varchar(150) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gst_type` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `visit_remark` text DEFAULT NULL,
  `pin_code` varchar(10) DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `booking_instructions` text DEFAULT NULL,
  `guest_special_instructions` text DEFAULT NULL,
  `is_vip` tinyint(1) DEFAULT NULL,
  `check_in_type` varchar(50) DEFAULT NULL,
  `check_in_datetime` datetime DEFAULT NULL,
  `number_of_days` int(11) DEFAULT NULL,
  `check_out_datetime` datetime DEFAULT NULL,
  `grace_hours` int(11) DEFAULT NULL,
  `payment_by` varchar(50) DEFAULT NULL,
  `allow_charges_posting` tinyint(1) DEFAULT NULL,
  `enable_paxwise` tinyint(1) DEFAULT NULL,
  `enable_room_sharing` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkin_master`
--

INSERT INTO `checkin_master` (`id`, `is_reservation`, `reservation_number`, `arrival_mode`, `ota`, `booking_id`, `contact`, `title`, `first_name`, `last_name`, `gender`, `city`, `id_number`, `email`, `check_in_mode`, `allow_credit`, `foreign_guest`, `segment_id`, `business_source_id`, `photo`, `document`, `gst_number`, `guest_company`, `age`, `gst_type`, `address`, `visit_remark`, `pin_code`, `nationality`, `booking_instructions`, `guest_special_instructions`, `is_vip`, `check_in_type`, `check_in_datetime`, `number_of_days`, `check_out_datetime`, `grace_hours`, `payment_by`, `allow_charges_posting`, `enable_paxwise`, `enable_room_sharing`, `created_at`, `updated_at`) VALUES
(1, 0, NULL, '1', 'asdfsg', '23456', '12345678', '1', 'kalidass', 'R', '1', 'Chennai', '12345678', 'kalidass@gmail.com', 'Day', 'No', 'No', 2, 4, NULL, NULL, '12345678', 'asdcfvg', 22, 'UNREGISTERED', 'asdcfghj', 'qwertyuio', '123456', 'Indian', 'asdfghj', 'qwertghjk', 1, '24 Hours CheckIn', '2025-06-14 15:30:51', 1, '2025-06-15 15:30:51', 2, 'Direct', 1, 1, 0, '2025-06-14 04:34:36', '2025-06-14 04:34:36'),
(2, 0, NULL, '2', NULL, NULL, '123456789', '1', 'Dass', 'R', '1', 'Chennai', '1234567890', NULL, 'Day', 'No', 'No', 1, NULL, NULL, NULL, NULL, NULL, NULL, 'UNREGISTERED', NULL, NULL, NULL, 'Indian', NULL, NULL, 1, '24 Hours CheckIn', '2025-06-14 17:01:49', 1, '2025-06-15 17:01:49', 2, 'Direct', 1, 0, 0, '2025-06-14 06:05:59', '2025-06-14 06:05:59'),
(3, 0, NULL, '1', 'qwqwqw', '1212212212', '232323123', '1', 'kalidass', 'r', '1', 'Chennai', '212311213', 'dass@gmai.com', 'Day', 'Yes', 'No', 2, 2, NULL, NULL, 'qwqwwqwdd', 'qwqwqwqw', 21, 'UNREGISTERED', 'sddasad', 'cacacca', '233233', 'Indian', 'dcsfdwsd', 'sdccsdcsdcsdcscdsdc', 1, '24 Hours CheckIn', '2025-06-17 12:49:19', 1, '2025-06-24 12:49:19', 2, 'Direct', 1, 0, 0, '2025-06-17 01:55:25', '2025-06-17 01:55:25');

-- --------------------------------------------------------

--
-- Table structure for table `checkin_room_trans`
--

CREATE TABLE `checkin_room_trans` (
  `id` int(11) NOT NULL,
  `checkin_id` int(11) DEFAULT NULL,
  `room_type_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `rate_plan_id` int(11) DEFAULT NULL,
  `guest_name` varchar(150) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `male` int(11) DEFAULT NULL,
  `female` int(11) DEFAULT NULL,
  `extra` int(11) DEFAULT NULL,
  `net_rate` decimal(10,2) DEFAULT NULL,
  `disc_type` varchar(50) DEFAULT NULL,
  `disc_val` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkin_room_trans`
--

INSERT INTO `checkin_room_trans` (`id`, `checkin_id`, `room_type_id`, `room_id`, `rate_plan_id`, `guest_name`, `contact`, `male`, `female`, `extra`, `net_rate`, `disc_type`, `disc_val`, `total`, `created_at`, `updated_at`) VALUES
(3, 2, 3, 5, 1, 'dass', '123456789', 1, 1, 0, 1100.00, 'Percentage', 24.00, 836.00, '2025-06-14 06:05:59', '2025-06-14 06:05:59'),
(4, 3, 3, 1, 1, 'Alan', '98765245', 2, 0, 1, 1100.00, 'Amount', 100.00, 1000.00, '2025-06-17 01:55:25', '2025-06-17 01:55:25'),
(5, 3, 4, 6, 4, 'Helan', '12121312', 2, 0, 0, 1500.00, 'Percentage', 50.00, 750.00, '2025-06-17 01:55:25', '2025-06-17 01:55:25');

-- --------------------------------------------------------

--
-- Table structure for table `checkout_master`
--

CREATE TABLE `checkout_master` (
  `id` int(11) NOT NULL,
  `checkin_id` int(11) NOT NULL,
  `check_room_id` bigint(20) DEFAULT NULL,
  `actual_checkout_datetime` datetime NOT NULL,
  `early_checkout` tinyint(1) DEFAULT 0,
  `late_checkout` tinyint(1) DEFAULT 0,
  `checkout_remarks` text DEFAULT NULL,
  `payment_status` enum('Paid','Pending','Partially Paid') NOT NULL DEFAULT 'Pending',
  `total_amount` decimal(12,2) NOT NULL,
  `tax_amount` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) DEFAULT 0.00,
  `grand_total` decimal(12,2) NOT NULL,
  `amount_paid` decimal(12,2) DEFAULT 0.00,
  `balance_due` decimal(12,2) DEFAULT 0.00,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkout_master`
--

INSERT INTO `checkout_master` (`id`, `checkin_id`, `check_room_id`, `actual_checkout_datetime`, `early_checkout`, `late_checkout`, `checkout_remarks`, `payment_status`, `total_amount`, `tax_amount`, `discount_amount`, `grand_total`, `amount_paid`, `balance_due`, `created_by`, `created_at`, `updated_at`) VALUES
(3, 1, 1, '2025-06-14 10:11:53', 1, 0, NULL, 'Paid', 1000.00, 120.00, 0.00, 1120.00, 1120.00, 0.00, 1, '2025-06-14 04:43:07', '2025-06-14 04:43:07'),
(4, 1, 2, '2025-06-14 10:16:14', 1, 0, NULL, 'Partially Paid', 1465.00, 175.80, 0.00, 1640.80, 1000.00, 640.80, 1, '2025-06-14 04:46:39', '2025-06-14 04:46:39'),
(5, 2, 3, '2025-06-14 11:55:14', 1, 0, NULL, 'Paid', 1076.00, 129.12, 0.00, 1205.12, 1205.12, 0.00, 1, '2025-06-14 06:25:32', '2025-06-14 06:25:32');

-- --------------------------------------------------------

--
-- Table structure for table `checkout_payments`
--

CREATE TABLE `checkout_payments` (
  `id` int(11) NOT NULL,
  `checkout_id` int(11) NOT NULL,
  `payment_method` enum('Cash','Credit Card','Debit Card','UPI','Bank Transfer','Online Payment','Wallet') NOT NULL,
  `payment_amount` decimal(12,2) NOT NULL,
  `payment_date` datetime NOT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL,
  `payment_notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkout_payments`
--

INSERT INTO `checkout_payments` (`id`, `checkout_id`, `payment_method`, `payment_amount`, `payment_date`, `transaction_reference`, `payment_notes`, `created_by`, `created_at`, `updated_at`) VALUES
(3, 3, 'Cash', 1120.00, '2025-06-14 10:13:07', 'PAY-1749895987', NULL, 1, '2025-06-14 04:43:07', '2025-06-14 04:43:07'),
(4, 4, 'Cash', 1000.00, '2025-06-14 10:16:39', 'PAY-1749896199', NULL, 1, '2025-06-14 04:46:39', '2025-06-14 04:46:39'),
(5, 5, 'Cash', 1205.12, '2025-06-14 11:55:32', 'PAY-1749902132', NULL, 1, '2025-06-14 06:25:32', '2025-06-14 06:25:32');

-- --------------------------------------------------------

--
-- Table structure for table `city_master`
--

CREATE TABLE `city_master` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state_id` bigint(20) UNSIGNED NOT NULL,
  `city_code` varchar(10) NOT NULL,
  `city_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `city_master`
--

INSERT INTO `city_master` (`id`, `state_id`, `city_code`, `city_name`, `description`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 4, 'CHN', 'Chennai', 'Capital city of Tamil Nadu', 1, NULL, NULL, '2025-06-07 09:56:10', '2025-06-07 09:56:10', NULL),
(2, 4, 'MDU', 'Madurai', 'City known for Meenakshi Temple', 1, NULL, NULL, '2025-06-07 09:56:10', '2025-06-07 09:56:10', NULL),
(3, 4, 'CBE', 'Coimbatore', 'Major industrial city', 1, NULL, NULL, '2025-06-07 09:56:10', '2025-06-07 09:56:10', NULL),
(4, 4, 'TRV', 'Tiruvannamalai', 'City famous for Annamalaiyar Temple', 1, NULL, NULL, '2025-06-07 09:56:10', '2025-06-07 09:56:10', NULL),
(5, 4, 'TNJ', 'Tanjore', 'City known for Brihadeeswarar Temple', 1, NULL, NULL, '2025-06-07 09:56:10', '2025-06-07 09:56:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cleaner_master`
--

CREATE TABLE `cleaner_master` (
  `id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `shift` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cleaner_master`
--

INSERT INTO `cleaner_master` (`id`, `name`, `phone`, `shift`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Rahul Sharma', '9876543210', 'Morning', 1, '2025-06-17 05:15:24', '2025-06-17 05:15:24'),
(2, 'Anita Verma', '9123456780', 'Evening', 1, '2025-06-17 05:15:24', '2025-06-17 05:15:24'),
(3, 'Suresh Kumar', '9988776655', 'Night', 1, '2025-06-17 05:15:24', '2025-06-17 05:15:24'),
(4, 'Meena Joshi', '9090909090', 'Morning', 1, '2025-06-17 05:15:24', '2025-06-17 05:15:24'),
(5, 'Vikram Patel', '8888888888', 'Evening', 1, '2025-06-17 05:15:24', '2025-06-17 05:15:24');

-- --------------------------------------------------------

--
-- Table structure for table `cleaning_status_master`
--

CREATE TABLE `cleaning_status_master` (
  `id` bigint(20) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cleaning_status_master`
--

INSERT INTO `cleaning_status_master` (`id`, `status_name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Pending', 1, '2025-06-17 05:18:23', '2025-06-17 05:18:23'),
(2, 'In Progress', 1, '2025-06-17 05:18:23', '2025-06-17 05:18:23'),
(3, 'Completed', 1, '2025-06-17 05:18:23', '2025-06-17 05:18:23'),
(4, 'Skipped', 1, '2025-06-17 05:18:23', '2025-06-17 05:18:23'),
(5, 'Delayed', 1, '2025-06-17 05:18:23', '2025-06-17 05:18:23');

-- --------------------------------------------------------

--
-- Table structure for table `country_master`
--

CREATE TABLE `country_master` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `country_code` varchar(10) NOT NULL,
  `country_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `country_master`
--

INSERT INTO `country_master` (`id`, `country_code`, `country_name`, `description`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'IN', 'India', 'Country in South Asia', 1, NULL, NULL, '2025-06-07 09:53:37', '2025-06-07 09:53:37', NULL),
(2, 'US', 'United States', 'Country in North America', 1, NULL, NULL, '2025-06-07 09:53:37', '2025-06-07 09:53:37', NULL),
(3, 'GB', 'United Kingdom', 'Country in Europe', 1, NULL, NULL, '2025-06-07 09:53:37', '2025-06-07 09:53:37', NULL),
(4, 'AU', 'Australia', 'Country in Oceania', 1, NULL, NULL, '2025-06-07 09:53:37', '2025-06-07 09:53:37', NULL),
(5, 'CA', 'Canada', 'Country in North America', 1, NULL, NULL, '2025-06-07 09:53:37', '2025-06-07 09:53:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `floor_master`
--

CREATE TABLE `floor_master` (
  `id` int(11) NOT NULL,
  `floor_no` varchar(50) NOT NULL,
  `floor_name` varchar(100) NOT NULL,
  `block_id` int(11) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `floor_master`
--

INSERT INTO `floor_master` (`id`, `floor_no`, `floor_name`, `block_id`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'F-101', 'First Floor', 1, 1, 1, NULL, '2025-06-06 11:50:28', '2025-06-07 05:34:14', '2025-06-07 05:34:14'),
(2, 'F-102', 'Second Floor', 1, 1, 1, NULL, '2025-06-06 11:50:37', '2025-06-07 05:34:14', '2025-06-07 05:34:14'),
(3, 'F-201', 'Third Floor', 2, 2, 2, NULL, '2025-06-06 11:50:37', '2025-06-07 05:34:15', '2025-06-07 05:34:15'),
(4, 'F-301', 'Fourth Floor', 4, 2, 2, NULL, '2025-06-06 06:33:16', '2025-06-07 05:34:15', '2025-06-07 05:34:15'),
(5, 'F-101', 'First Floor', 5, 1, 1, NULL, '2025-06-07 05:40:32', '2025-06-07 05:40:32', NULL),
(6, 'F-201', 'Second Floor', 5, 1, 1, NULL, '2025-06-07 05:41:05', '2025-06-07 05:41:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `gender_master`
--

CREATE TABLE `gender_master` (
  `id` int(11) NOT NULL,
  `gender_code` varchar(10) NOT NULL,
  `gender_name` varchar(20) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gender_master`
--

INSERT INTO `gender_master` (`id`, `gender_code`, `gender_name`, `is_active`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'M', 'Male', 1, 1, 1, NULL, '2025-06-09 10:35:23', '2025-06-09 10:35:23', NULL),
(2, 'F', 'Female', 1, 1, 1, NULL, '2025-06-09 10:35:23', '2025-06-09 10:35:23', NULL),
(3, 'O', 'Other', 1, 1, 1, NULL, '2025-06-09 10:35:23', '2025-06-09 10:35:23', NULL),
(4, 'U', 'Unspecified', 1, 1, 1, NULL, '2025-06-09 10:35:23', '2025-06-09 10:35:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `checkout_id` int(11) NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `notes` text DEFAULT NULL,
  `terms` text DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `amount_paid` decimal(10,2) NOT NULL DEFAULT 0.00,
  `balance_due` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_number`, `checkout_id`, `invoice_date`, `due_date`, `status`, `notes`, `terms`, `subtotal`, `tax_amount`, `total_amount`, `amount_paid`, `balance_due`, `created_at`, `updated_at`) VALUES
(3, 'INV-1749895987', 3, '2025-06-14', '2025-06-21', 'Paid', NULL, 'Payment due within 7 days', 1000.00, 120.00, 1120.00, 1120.00, 0.00, '2025-06-14 04:43:07', '2025-06-14 04:43:07'),
(4, 'INV-1749896199', 4, '2025-06-14', '2025-06-21', 'Pending', NULL, 'Payment due within 7 days', 1465.00, 175.80, 1640.80, 1000.00, 640.80, '2025-06-14 04:46:39', '2025-06-14 04:46:39'),
(5, 'INV-1749902132', 5, '2025-06-14', '2025-06-21', 'Paid', NULL, 'Payment due within 7 days', 1076.00, 129.12, 1205.12, 1205.12, 0.00, '2025-06-14 06:25:32', '2025-06-14 06:25:32');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `item_type` enum('Room','Service','Tax','Discount','Other') NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 1.00,
  `unit_price` decimal(12,2) NOT NULL,
  `tax_rate` decimal(5,2) DEFAULT 0.00,
  `amount` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `item_type`, `description`, `quantity`, `unit_price`, `tax_rate`, `amount`, `created_at`, `updated_at`) VALUES
(3, 3, 'Room', 'Room 501 - Standard Room (1 night)', 1.00, 1100.00, 12.00, 1000.00, '2025-06-14 04:43:07', '2025-06-14 04:43:07'),
(4, 4, 'Room', 'Room 502 - Deluxe Room (1 night)', 1.00, 1500.00, 12.00, 1465.00, '2025-06-14 04:46:39', '2025-06-14 04:46:39'),
(5, 5, 'Room', 'Room 505 - Standard Room (1 night)', 1.00, 1100.00, 12.00, 1076.00, '2025-06-14 06:25:32', '2025-06-14 06:25:32');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_master`
--

CREATE TABLE `maintenance_master` (
  `id` bigint(20) NOT NULL,
  `issue_type` varchar(150) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_master`
--

INSERT INTO `maintenance_master` (`id`, `issue_type`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'AC Problem', 1, '2025-06-17 06:39:28', '2025-06-17 06:39:28'),
(2, 'Plumbing Issue', 1, '2025-06-17 06:39:28', '2025-06-17 06:39:28'),
(3, 'Electrical Issue', 1, '2025-06-17 06:39:28', '2025-06-17 06:39:28'),
(4, 'Furniture Damage', 1, '2025-06-17 06:39:28', '2025-06-17 06:39:28'),
(5, 'Water Leakage', 1, '2025-06-17 06:39:28', '2025-06-17 06:39:28');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_status_master`
--

CREATE TABLE `maintenance_status_master` (
  `id` bigint(20) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_status_master`
--

INSERT INTO `maintenance_status_master` (`id`, `status_name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Reported', 1, '2025-06-17 06:39:14', '2025-06-17 06:39:14'),
(2, 'In Progress', 1, '2025-06-17 06:39:14', '2025-06-17 06:39:14'),
(3, 'On Hold', 1, '2025-06-17 06:39:14', '2025-06-17 06:39:14'),
(4, 'Resolved', 1, '2025-06-17 06:39:14', '2025-06-17 06:39:14'),
(5, 'Cancelled', 1, '2025-06-17 06:39:14', '2025-06-17 06:39:14');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_06_05_093134_create_personal_access_tokens_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(10, 'App\\Models\\User', 1, 'authToken', 'f2f5019743df53a6f05deacbd3f3fa6498b95384dd79c66b2b1ebe09fc2b7168', '[\"*\"]', NULL, NULL, '2025-06-06 01:57:35', '2025-06-06 01:57:35'),
(21, 'App\\Models\\User', 3, 'authToken', 'd7d8af470a71386cdaebb1a6496ebe71a81284fec3cb24e15e336921152a10cc', '[\"*\"]', '2025-06-07 02:25:43', NULL, '2025-06-07 01:34:08', '2025-06-07 02:25:43'),
(26, 'App\\Models\\User', 1, 'authToken', '903c1123a705d8f9486c119a496c983a466726e9c3f377138188de7162de0ff4', '[\"*\"]', NULL, NULL, '2025-06-07 05:19:53', '2025-06-07 05:19:53'),
(27, 'App\\Models\\User', 1, 'authToken', 'c05b29c2b4445535f159b68c4de580238c96bf8085a282374f143151653f8fd4', '[\"*\"]', '2025-06-07 05:20:39', NULL, '2025-06-07 05:19:56', '2025-06-07 05:20:39'),
(28, 'App\\Models\\User', 1, 'authToken', 'd69237ece7ddb47ce1572b4eaef7e4f9af7e09ae5c39ababc9280baf9fa39084', '[\"*\"]', NULL, NULL, '2025-06-07 05:20:54', '2025-06-07 05:20:54'),
(29, 'App\\Models\\User', 1, 'authToken', 'b62eac3e22fff3188615c968a1917b19ad6a9087ec28d2bd8370b3dc885185cc', '[\"*\"]', NULL, NULL, '2025-06-07 05:20:56', '2025-06-07 05:20:56'),
(31, 'App\\Models\\User', 1, 'authToken', '64905b4d3b0ec5f791754157992bfaa4b6501bc4da8296f0e8204c1407440899', '[\"*\"]', '2025-06-09 07:44:18', NULL, '2025-06-07 06:49:43', '2025-06-09 07:44:18'),
(37, 'App\\Models\\User', 1, 'authToken', 'd89fa79fc868f14955acc49a2c718f020175fea52b0457a4a6f294d5878ab157', '[\"*\"]', NULL, NULL, '2025-06-11 23:14:47', '2025-06-11 23:14:47'),
(42, 'App\\Models\\User', 1, 'authToken', '1f8c85be947214cde0f47128a9a2313990127cd3705dcae2fd2d7e008258c14c', '[\"*\"]', NULL, NULL, '2025-06-17 06:52:28', '2025-06-17 06:52:28'),
(43, 'App\\Models\\User', 1, 'authToken', 'cf1389fe6addcacf44a81e5f7b18a313c24f1b2cf6b2b128d8dba5353c7b8e5f', '[\"*\"]', NULL, NULL, '2025-06-17 06:59:58', '2025-06-17 06:59:58'),
(44, 'App\\Models\\User', 1, 'authToken', '40b6bad42a5442ea93fef73da6cd753605201410f29c431fc667536de449a59b', '[\"*\"]', NULL, NULL, '2025-06-17 07:04:55', '2025-06-17 07:04:55'),
(45, 'App\\Models\\User', 1, 'authToken', '2ea298769c2c17c81d510443a0689e9c711337e46dc96dfd132c8035716f1432', '[\"*\"]', NULL, NULL, '2025-06-17 07:13:17', '2025-06-17 07:13:17'),
(46, 'App\\Models\\User', 1, 'authToken', '811e9e05393de31cfb20ffc6f8428e566400b4fa26217f7237c331cc5ead5c91', '[\"*\"]', NULL, NULL, '2025-06-17 07:15:20', '2025-06-17 07:15:20'),
(47, 'App\\Models\\User', 1, 'authToken', '751c1670bfdeb9110bda52b7bd7b43767d176b824720ede92b23a4f6caa5d37f', '{\"database\":\"admin_panel\"}', NULL, NULL, '2025-06-17 07:24:04', '2025-06-17 07:24:04'),
(48, 'App\\Models\\User', 1, 'authToken', '4fbd90a84fb1a51d1b0e73ded475838f490b4d2c1db7260bdbbaad3167c56159', '{\"database\":\"admin_panel\"}', NULL, NULL, '2025-06-17 07:24:57', '2025-06-17 07:24:57'),
(49, 'App\\Models\\User', 1, 'authToken', 'bce4a95600a2cf7b2928f798a07c4e3e4f3eace5192e385b32cce2ab384c1896', '{\"database\":\"admin_panel\"}', NULL, NULL, '2025-06-17 07:31:49', '2025-06-17 07:31:49'),
(50, 'App\\Models\\User', 1, 'authToken', '82e7bd52883ca16596cc3dcdde311bd0076f39172114e841184f555c085b1af1', '{\"database\":\"admin_panel\"}', NULL, NULL, '2025-06-17 07:32:13', '2025-06-17 07:32:13'),
(52, 'App\\Models\\User', 1, 'authToken', 'aa8410395d3b143dbc0006d472486bb09e066a657edf273e35f47273cf937b6c', '[\"*\"]', '2025-06-17 07:36:14', NULL, '2025-06-17 07:36:06', '2025-06-17 07:36:14'),
(53, 'App\\Models\\User', 1, 'authToken', '454ae1ac0f19678d584d8f6f231ed1b24e4c5fc386df9d5d7e11096807ddb30e', '[\"*\"]', NULL, NULL, '2025-06-17 07:47:46', '2025-06-17 07:47:46'),
(56, 'App\\Models\\User', 1, 'authToken', 'b23cefbf86c3fae44744c880c9987a9246f3364f47bbc5619515d19ec99935b3', '[\"*\"]', '2025-06-18 00:54:54', NULL, '2025-06-18 00:54:50', '2025-06-18 00:54:54'),
(57, 'App\\Models\\User', 1, 'authToken', 'e831ad1ebaae67075df379c768cf2c5f8f7a33a84db584e3a197ca8ec2c1da50', '[\"*\"]', '2025-06-18 00:55:57', NULL, '2025-06-18 00:54:53', '2025-06-18 00:55:57'),
(60, 'App\\Models\\User', 1, 'authToken', 'e46cf097127a2b0e2909aaa4ecfebbf334c6d75b32a6ee9e06915b8699835e7d', '[\"*\"]', '2025-06-18 07:45:32', NULL, '2025-06-18 07:45:20', '2025-06-18 07:45:32');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `rate_per_day` decimal(10,2) DEFAULT 0.00,
  `room_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `apply_gst` tinyint(1) DEFAULT 0,
  `apply_gst_on_sum` tinyint(1) DEFAULT 0,
  `apply_luxury_tax` tinyint(1) DEFAULT 0,
  `apply_service_tax` tinyint(1) DEFAULT 0,
  `complimentary_wifi` tinyint(1) DEFAULT 0,
  `complimentary_breakfast` tinyint(1) DEFAULT 0,
  `complimentary_lunch` tinyint(1) DEFAULT 0,
  `complimentary_dinner` tinyint(1) DEFAULT 0,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `plan_name`, `description`, `rate_per_day`, `room_type_id`, `apply_gst`, `apply_gst_on_sum`, `apply_luxury_tax`, `apply_service_tax`, `complimentary_wifi`, `complimentary_breakfast`, `complimentary_lunch`, `complimentary_dinner`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '1100 Plan', 'Standard room rent plan with all meals included and Wi-Fi.', 1100.00, 3, 1, 1, 0, 0, 1, 1, 1, 1, 'Active', 1, 1, NULL, '2025-06-07 09:34:18', '2025-06-07 09:34:18', NULL),
(2, '1100 Plan', 'Standard room rent plan with all meals included and complimentary services', 1100.00, 3, 1, 1, 0, 0, 1, 1, 1, 1, 'Active', 1, 1, NULL, '2025-06-07 09:34:18', '2025-06-07 09:34:18', NULL),
(3, '900 Plan', 'Budget plan with breakfast only', 900.00, 6, 1, 0, 0, 0, 1, 1, 0, 0, 'Active', 1, 1, NULL, '2025-06-08 03:30:00', '2025-06-08 03:30:00', NULL),
(4, '1500 Premium', 'Premium room plan with all taxes and services', 1500.00, 4, 1, 1, 1, 1, 1, 1, 1, 1, 'Active', 1, 1, NULL, '2025-06-08 04:30:00', '2025-06-08 04:30:00', NULL),
(5, '700 Economy', 'Economy plan with minimal services', 700.00, 6, 0, 0, 0, 0, 0, 1, 0, 0, 'Active', 1, 1, NULL, '2025-06-08 05:30:00', '2025-06-08 05:30:00', NULL),
(6, '2000 Deluxe', 'Deluxe plan with luxury tax and full meals', 2000.00, 3, 1, 1, 1, 0, 1, 1, 1, 1, 'Active', 1, 1, NULL, '2025-06-08 06:30:00', '2025-06-08 06:30:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `property_master`
--

CREATE TABLE `property_master` (
  `id` bigint(20) NOT NULL,
  `cmp_id` bigint(20) NOT NULL,
  `property_name` varchar(255) NOT NULL,
  `property_code` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_master`
--

INSERT INTO `property_master` (`id`, `cmp_id`, `property_name`, `property_code`, `address`, `city`, `state`, `country`, `zip_code`, `contact_number`, `email`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Goio Grand Hotel', 'goio', '456 Anna Salai, Chennai, Tamil Nadu, India', 'Chennai', 'Tamil Nadu', 'India', '600002', '+91-9845098450', 'goio@gmail.com', 1, '2025-06-17 11:53:30', '2025-06-19 08:49:05');

-- --------------------------------------------------------

--
-- Table structure for table `roomstatus_master`
--

CREATE TABLE `roomstatus_master` (
  `id` int(11) NOT NULL,
  `status_code` varchar(50) NOT NULL,
  `status_name` varchar(255) NOT NULL,
  `color_code` varchar(20) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roomstatus_master`
--

INSERT INTO `roomstatus_master` (`id`, `status_code`, `status_name`, `color_code`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'AVL', 'Available', '#a2d043', 1, 1, NULL, '2025-06-07 07:45:27', '2025-06-07 11:56:35', NULL),
(2, 'OCC', 'Occupied', '#DC3545', 1, 1, NULL, '2025-06-07 07:45:27', '2025-06-07 11:01:10', NULL),
(3, 'CLN', 'Cleaning', '#007BFF', 1, 1, NULL, '2025-06-07 07:45:27', '2025-06-07 11:01:02', NULL),
(4, 'DIR', 'Dirty', '#FFC107', 1, 1, NULL, '2025-06-07 12:09:01', '2025-06-07 12:09:01', NULL),
(5, 'MNT', 'Maintenance', '#6C757D', 1, 1, NULL, '2025-06-07 12:09:01', '2025-06-07 12:09:01', NULL),
(6, 'OOO', 'Out of Order', '#343A40', 1, 1, NULL, '2025-06-07 12:09:01', '2025-06-07 12:09:01', NULL),
(7, 'BLK', 'Blocked', '#9B59B6', 1, 1, NULL, '2025-06-07 12:09:01', '2025-06-07 12:12:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roomtype_master`
--

CREATE TABLE `roomtype_master` (
  `id` int(11) NOT NULL,
  `room_type_code` varchar(10) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `room_type_name` varchar(100) NOT NULL,
  `default_plan_id` int(11) DEFAULT NULL,
  `wifi_plan_id` int(11) DEFAULT 0,
  `max_adult_pax` int(11) DEFAULT 0,
  `max_child_pax` int(11) DEFAULT 0,
  `max_extra_pax` int(11) DEFAULT 0,
  `negative_count` int(11) DEFAULT 0,
  `roomtype_status` enum('Active','Inactive') DEFAULT 'Active',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roomtype_master`
--

INSERT INTO `roomtype_master` (`id`, `room_type_code`, `display_order`, `room_type_name`, `default_plan_id`, `wifi_plan_id`, `max_adult_pax`, `max_child_pax`, `max_extra_pax`, `negative_count`, `roomtype_status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'DLX', 1, 'DELUXE ROOM', 1, 1, 1, 1, 1, 1, 'Inactive', 1, 1, NULL, '2025-06-07 04:14:48', '2025-06-07 05:34:21', '2025-06-07 05:34:21'),
(2, 'DLX', 1, 'DELUXE ROOM', 1, 10111, 1, 1, 1, 1, 'Active', 1, 1, NULL, '2025-06-07 05:41:49', '2025-06-07 05:42:07', '2025-06-07 05:42:07'),
(3, 'STD', 1, 'Standard Room', 1, 1, 2, 1, 1, 0, 'Active', 101, 101, NULL, '2025-06-07 11:12:58', '2025-06-07 11:12:58', NULL),
(4, 'DLX', 2, 'Deluxe Room', 1, 2, 3, 1, 1, 0, 'Active', 101, 1, NULL, '2025-06-07 11:12:58', '2025-06-07 05:43:13', NULL),
(5, 'SUT', 3, 'Suite Room', 1, 3, 4, 2, 2, 0, 'Inactive', 101, 1, NULL, '2025-06-07 11:12:58', '2025-06-07 05:43:24', NULL),
(6, 'EXC', 4, 'Executive Room', 1, 2, 3, 1, 2, 0, 'Active', 101, 1, NULL, '2025-06-07 11:12:58', '2025-06-07 05:43:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `room_cleaning_logs`
--

CREATE TABLE `room_cleaning_logs` (
  `id` bigint(20) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `cleaner_id` bigint(20) NOT NULL,
  `status_id` bigint(20) NOT NULL,
  `remarks` text DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_cleaning_logs`
--

INSERT INTO `room_cleaning_logs` (`id`, `room_id`, `cleaner_id`, `status_id`, `remarks`, `started_at`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 3, 'None', '2025-06-17 00:24:06', '2025-06-17 00:53:36', '2025-06-17 00:24:06', '2025-06-17 00:53:36'),
(2, 2, 2, 3, 'Completed', '2025-06-17 00:24:58', '2025-06-17 00:24:58', '2025-06-17 00:24:58', '2025-06-17 00:24:58'),
(3, 5, 3, 2, NULL, '2025-06-17 00:54:32', NULL, '2025-06-17 00:54:32', '2025-06-17 00:54:32'),
(4, 9, 3, 3, NULL, '2025-06-17 01:40:28', '2025-06-17 01:40:51', '2025-06-17 01:40:28', '2025-06-17 01:40:51'),
(5, 3, 2, 3, NULL, '2025-06-17 01:45:32', '2025-06-17 01:45:32', '2025-06-17 01:45:32', '2025-06-17 01:45:32');

-- --------------------------------------------------------

--
-- Table structure for table `room_maintenance_logs`
--

CREATE TABLE `room_maintenance_logs` (
  `id` bigint(20) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `maintenance_type_id` bigint(20) NOT NULL,
  `maintenance_status_id` bigint(20) NOT NULL,
  `issue_description` text DEFAULT NULL,
  `reported_by` bigint(20) DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_maintenance_logs`
--

INSERT INTO `room_maintenance_logs` (`id`, `room_id`, `maintenance_type_id`, `maintenance_status_id`, `issue_description`, `reported_by`, `started_at`, `resolved_at`, `remarks`, `created_at`, `updated_at`) VALUES
(3, 1, 1, 4, 'None', 1, '2025-06-17 01:35:35', '2025-06-17 01:36:03', NULL, '2025-06-17 01:35:35', '2025-06-17 01:36:03'),
(4, 9, 4, 4, 'ssdsdsdss', 1, '2025-06-17 01:39:44', '2025-06-17 01:40:05', NULL, '2025-06-17 01:39:44', '2025-06-17 01:40:05');

-- --------------------------------------------------------

--
-- Table structure for table `room_master`
--

CREATE TABLE `room_master` (
  `id` int(11) NOT NULL,
  `room_no` varchar(10) NOT NULL,
  `display_order` int(11) NOT NULL,
  `floor_id` int(11) NOT NULL,
  `room_type_id` int(11) NOT NULL,
  `max_pax` int(11) NOT NULL DEFAULT 0,
  `max_extra_pax` int(11) NOT NULL DEFAULT 0,
  `status_id` int(11) NOT NULL,
  `checkin_id` bigint(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_master`
--

INSERT INTO `room_master` (`id`, `room_no`, `display_order`, `floor_id`, `room_type_id`, `max_pax`, `max_extra_pax`, `status_id`, `checkin_id`, `is_active`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '501', 1, 5, 3, 2, 1, 2, 3, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 01:55:25', NULL),
(2, '502', 2, 5, 4, 2, 1, 2, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 07:17:39', NULL),
(3, '503', 3, 5, 5, 3, 2, 3, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 07:17:42', NULL),
(4, '504', 4, 5, 6, 3, 2, 4, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 06:11:15', NULL),
(5, '505', 5, 5, 3, 2, 1, 5, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 07:17:46', NULL),
(6, '506', 6, 5, 4, 2, 1, 2, 3, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 01:55:25', NULL),
(7, '507', 7, 5, 5, 3, 2, 7, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 07:17:54', NULL),
(8, '508', 8, 5, 6, 3, 2, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-14 09:58:56', NULL),
(9, '509', 9, 5, 3, 2, 1, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 01:40:51', NULL),
(10, '510', 10, 5, 4, 2, 1, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-14 09:58:56', NULL),
(11, '601', 11, 6, 5, 3, 2, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-14 09:58:56', NULL),
(12, '602', 12, 6, 6, 3, 2, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 07:04:12', NULL),
(13, '603', 13, 6, 3, 2, 1, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 07:04:12', NULL),
(14, '604', 14, 6, 4, 2, 1, 4, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 00:55:38', NULL),
(15, '605', 15, 6, 5, 3, 2, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-07 11:23:53', NULL),
(16, '606', 16, 6, 6, 3, 2, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-14 09:58:56', NULL),
(17, '607', 17, 6, 3, 2, 1, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 07:04:12', NULL),
(18, '608', 18, 6, 4, 2, 1, 7, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-17 00:56:14', NULL),
(19, '609', 19, 6, 5, 3, 2, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-07 11:23:53', NULL),
(20, '610', 20, 6, 6, 3, 2, 1, NULL, 1, 101, 101, NULL, '2025-06-07 11:23:53', '2025-06-14 09:58:56', NULL),
(21, '101', 1, 6, 5, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-06-07 06:39:35', '2025-06-14 09:58:56', NULL),
(22, '102', 2, 5, 4, 2, 1, 1, NULL, 1, 1, 1, NULL, '2025-06-07 06:39:56', '2025-06-17 07:04:12', NULL),
(23, '104', 3, 6, 6, 2, 1, 1, NULL, 1, 1, 1, NULL, '2025-06-07 06:40:13', '2025-06-14 09:58:56', NULL),
(24, '106', 1, 6, 4, 1, 2, 1, NULL, 1, 1, 1, NULL, '2025-06-07 06:40:37', '2025-06-14 09:58:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `segment_master`
--

CREATE TABLE `segment_master` (
  `id` int(11) NOT NULL,
  `segment_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `segment_master`
--

INSERT INTO `segment_master` (`id`, `segment_name`, `created_at`, `updated_at`) VALUES
(1, 'Retail', '2025-06-09 12:20:44', '2025-06-09 12:20:44'),
(2, 'Corporate', '2025-06-09 12:20:44', '2025-06-09 12:20:44'),
(3, 'SME', '2025-06-09 12:20:44', '2025-06-09 12:20:44'),
(4, 'Government', '2025-06-09 12:20:44', '2025-06-09 12:20:44');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('EaWyUX8YwG83xwTWSGnvG0fLGwyaTsIGNVlyxu2n', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0g5UDYzUFZKNWlldXZ6Uk9ubTIyamhZRk5jM0VDa3lsWmhJd25OQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1750227586);

-- --------------------------------------------------------

--
-- Table structure for table `state_master`
--

CREATE TABLE `state_master` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL,
  `state_code` varchar(10) NOT NULL,
  `state_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `state_master`
--

INSERT INTO `state_master` (`id`, `country_id`, `state_code`, `state_name`, `description`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'AP', 'Andhra Pradesh', 'State in southern India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL),
(2, 1, 'MH', 'Maharashtra', 'State in western India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL),
(3, 1, 'KA', 'Karnataka', 'State in southern India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL),
(4, 1, 'TN', 'Tamil Nadu', 'State in southern India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL),
(5, 1, 'UP', 'Uttar Pradesh', 'State in northern India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL),
(6, 1, 'WB', 'West Bengal', 'State in eastern India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL),
(7, 1, 'RJ', 'Rajasthan', 'State in northwestern India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL),
(8, 1, 'GJ', 'Gujarat', 'State in western India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL),
(9, 1, 'PB', 'Punjab', 'State in northern India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL),
(10, 1, 'KL', 'Kerala', 'State in southern India', 1, NULL, NULL, '2025-06-07 09:54:46', '2025-06-07 09:54:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `title_master`
--

CREATE TABLE `title_master` (
  `id` int(11) NOT NULL,
  `title_code` varchar(10) NOT NULL,
  `title_name` varchar(20) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `title_master`
--

INSERT INTO `title_master` (`id`, `title_code`, `title_name`, `gender`, `is_active`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'MR', 'Mr.', 'Male', 1, 101, 101, NULL, '2025-06-09 10:32:14', '2025-06-09 10:32:14', NULL),
(2, 'MRS', 'Mrs.', 'Female', 1, 101, 101, NULL, '2025-06-09 10:32:14', '2025-06-09 10:32:14', NULL),
(3, 'MS', 'Ms.', 'Female', 1, 101, 101, NULL, '2025-06-09 10:32:14', '2025-06-09 10:32:14', NULL),
(4, 'DR', 'Dr.', NULL, 1, 101, 101, NULL, '2025-06-09 10:32:14', '2025-06-09 10:32:14', NULL),
(5, 'PROF', 'Prof.', NULL, 1, 101, 101, NULL, '2025-06-09 10:32:14', '2025-06-09 10:32:14', NULL),
(6, 'MX', 'Mx.', 'Other', 1, 101, 101, NULL, '2025-06-09 10:32:14', '2025-06-09 10:32:14', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `arrival_mode`
--
ALTER TABLE `arrival_mode`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mode_code` (`mode_code`);

--
-- Indexes for table `block_master`
--
ALTER TABLE `block_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `block_rooms`
--
ALTER TABLE `block_rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_source`
--
ALTER TABLE `business_source`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `checkin_master`
--
ALTER TABLE `checkin_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `checkin_room_trans`
--
ALTER TABLE `checkin_room_trans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `checkin_id` (`checkin_id`);

--
-- Indexes for table `checkout_master`
--
ALTER TABLE `checkout_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `checkin_id` (`checkin_id`);

--
-- Indexes for table `checkout_payments`
--
ALTER TABLE `checkout_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `checkout_id` (`checkout_id`);

--
-- Indexes for table `city_master`
--
ALTER TABLE `city_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_state` (`state_id`);

--
-- Indexes for table `cleaner_master`
--
ALTER TABLE `cleaner_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cleaning_status_master`
--
ALTER TABLE `cleaning_status_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `country_master`
--
ALTER TABLE `country_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `country_code` (`country_code`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `floor_master`
--
ALTER TABLE `floor_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `block_id` (`block_id`);

--
-- Indexes for table `gender_master`
--
ALTER TABLE `gender_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gender_code` (`gender_code`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `checkout_id` (`checkout_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `maintenance_master`
--
ALTER TABLE `maintenance_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `issue_type` (`issue_type`);

--
-- Indexes for table `maintenance_status_master`
--
ALTER TABLE `maintenance_status_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `property_master`
--
ALTER TABLE `property_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `property_code` (`property_code`),
  ADD KEY `fk_company` (`cmp_id`);

--
-- Indexes for table `roomstatus_master`
--
ALTER TABLE `roomstatus_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roomtype_master`
--
ALTER TABLE `roomtype_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_cleaning_logs`
--
ALTER TABLE `room_cleaning_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_maintenance_logs`
--
ALTER TABLE `room_maintenance_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_master`
--
ALTER TABLE `room_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `floor_id` (`floor_id`),
  ADD KEY `room_type_id` (`room_type_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `segment_master`
--
ALTER TABLE `segment_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `state_master`
--
ALTER TABLE `state_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_country` (`country_id`);

--
-- Indexes for table `title_master`
--
ALTER TABLE `title_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title_code` (`title_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `arrival_mode`
--
ALTER TABLE `arrival_mode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `block_master`
--
ALTER TABLE `block_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `block_rooms`
--
ALTER TABLE `block_rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `business_source`
--
ALTER TABLE `business_source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `checkin_master`
--
ALTER TABLE `checkin_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `checkin_room_trans`
--
ALTER TABLE `checkin_room_trans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `checkout_master`
--
ALTER TABLE `checkout_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `checkout_payments`
--
ALTER TABLE `checkout_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `city_master`
--
ALTER TABLE `city_master`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cleaner_master`
--
ALTER TABLE `cleaner_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cleaning_status_master`
--
ALTER TABLE `cleaning_status_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `country_master`
--
ALTER TABLE `country_master`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `floor_master`
--
ALTER TABLE `floor_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `gender_master`
--
ALTER TABLE `gender_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `maintenance_master`
--
ALTER TABLE `maintenance_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `maintenance_status_master`
--
ALTER TABLE `maintenance_status_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `property_master`
--
ALTER TABLE `property_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roomstatus_master`
--
ALTER TABLE `roomstatus_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `roomtype_master`
--
ALTER TABLE `roomtype_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `room_cleaning_logs`
--
ALTER TABLE `room_cleaning_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `room_maintenance_logs`
--
ALTER TABLE `room_maintenance_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `room_master`
--
ALTER TABLE `room_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `segment_master`
--
ALTER TABLE `segment_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `state_master`
--
ALTER TABLE `state_master`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `title_master`
--
ALTER TABLE `title_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `checkin_room_trans`
--
ALTER TABLE `checkin_room_trans`
  ADD CONSTRAINT `checkin_room_trans_ibfk_1` FOREIGN KEY (`checkin_id`) REFERENCES `checkin_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `city_master`
--
ALTER TABLE `city_master`
  ADD CONSTRAINT `fk_state` FOREIGN KEY (`state_id`) REFERENCES `state_master` (`id`);

--
-- Constraints for table `floor_master`
--
ALTER TABLE `floor_master`
  ADD CONSTRAINT `floor_master_ibfk_1` FOREIGN KEY (`block_id`) REFERENCES `block_master` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `property_master`
--
ALTER TABLE `property_master`
  ADD CONSTRAINT `fk_company` FOREIGN KEY (`cmp_id`) REFERENCES `company_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `room_master`
--
ALTER TABLE `room_master`
  ADD CONSTRAINT `room_master_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `floor_master` (`id`),
  ADD CONSTRAINT `room_master_ibfk_2` FOREIGN KEY (`room_type_id`) REFERENCES `roomtype_master` (`id`),
  ADD CONSTRAINT `room_master_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `roomstatus_master` (`id`);

--
-- Constraints for table `state_master`
--
ALTER TABLE `state_master`
  ADD CONSTRAINT `fk_country` FOREIGN KEY (`country_id`) REFERENCES `country_master` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
