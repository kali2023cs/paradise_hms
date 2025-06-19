-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 19, 2025 at 03:45 PM
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
-- Database: `admin_master`
--

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
-- Table structure for table `company_master`
--

CREATE TABLE `company_master` (
  `id` bigint(20) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_code` varchar(100) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_master`
--

INSERT INTO `company_master` (`id`, `company_name`, `company_code`, `contact_person`, `email`, `phone`, `address`, `gst_number`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Goio Foundations', 'GOIO001', 'Mr. Kalidass', 'info@goio.com', '+91-9876543210', '123 MG Road, Chennai, Tamil Nadu, India', '33ABCDE1234F1Z5', 1, '2025-06-17 06:23:11', '2025-06-19 08:38:21');

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
(45, 'App\\Models\\User', 1, 'authToken', '68713d49359a7806c1691a7278ac30eab9ccaf744c0ccc3f3138bd9d2a97a639', '[\"*\"]', '2025-06-18 06:47:21', NULL, '2025-06-18 06:47:18', '2025-06-18 06:47:21'),
(46, 'App\\Models\\User', 1, 'authToken', '3bc7cafd208930c8533d03142a6fd6ae96f1b55cb6bb3d3bc58c329a09cb5fb5', '[\"*\"]', '2025-06-18 06:55:33', NULL, '2025-06-18 06:55:30', '2025-06-18 06:55:33'),
(47, 'App\\Models\\User', 1, 'authToken', 'ec4e16f8029a484bd4e2e8f75cd6feb751260af3effc49b556604ccae3096930', '[\"*\"]', '2025-06-18 07:13:58', NULL, '2025-06-18 07:00:42', '2025-06-18 07:13:58'),
(48, 'App\\Models\\User', 1, 'authToken', 'c471f2100aa9deeaa954ff2fd8d4d7d56125b3a7a45ae775dfc5a6dafbc51929', '{\"property_code\":\"dev\"}', '2025-06-18 07:23:36', NULL, '2025-06-18 07:17:33', '2025-06-18 07:23:36'),
(49, 'App\\Models\\User', 1, 'auth-token', 'b9cdbe630b30dea525a0979aac798830ac509225b5ab039aba313e9187049c86', '{\"property_code\":\"dev\"}', '2025-06-18 07:33:45', NULL, '2025-06-18 07:23:45', '2025-06-18 07:33:45'),
(50, 'App\\Models\\User', 1, 'auth-token', 'f2b6b33476e987d7cb372624d333891803c51c7ec914f29466231bd4e7c4e5d6', '{\"property_code\":\"dev\"}', '2025-06-18 07:38:16', NULL, '2025-06-18 07:34:37', '2025-06-18 07:38:16'),
(51, 'App\\Models\\User', 1, 'auth-token', 'fe357bfb5d2209b9820f7606310eebbc756bf1e486be6eca65f48ba3bfa77464', '{\"property_code\":\"dev\"}', '2025-06-18 07:42:32', NULL, '2025-06-18 07:39:25', '2025-06-18 07:42:32'),
(52, 'App\\Models\\User', 1, 'auth-token', 'dc94e7e961a570ffc49c69d744ff8fcef4ba0d82d9c1e123a3e26fc9fc3dcd4e', '{\"property_code\":\"dev\"}', '2025-06-18 07:43:24', NULL, '2025-06-18 07:43:21', '2025-06-18 07:43:24'),
(54, 'App\\Models\\User', 1, 'authToken', '3c10403d753bea7153eac7b791f8658f6025af7f6bdd46533192d03171966a17', '[\"*\"]', '2025-06-18 07:58:34', NULL, '2025-06-18 07:58:20', '2025-06-18 07:58:34'),
(55, 'App\\Models\\User', 1, 'authToken', 'd0179b0b473ee5fcd2c02d3749f88ae0ff8bae742cb8a793d5afd9f9df956ba8', '[\"*\"]', '2025-06-18 08:04:43', NULL, '2025-06-18 08:00:07', '2025-06-18 08:04:43'),
(56, 'App\\Models\\User', 1, 'authToken', '755a81b9751c0772fcea9857a0cbe2e8a3015e8eca86c83e63b09e111eb4569f', '[\"*\"]', '2025-06-18 08:19:57', NULL, '2025-06-18 08:05:04', '2025-06-18 08:19:57'),
(58, 'App\\Models\\User', 1, 'authToken', '26c00d607d40f671888bd63159e995f88600736e7a9f26bcff07270c259e00e6', '[\"*\"]', '2025-06-18 23:32:55', NULL, '2025-06-18 23:32:49', '2025-06-18 23:32:55'),
(61, 'App\\Models\\User', 1, 'auth_token', '69c8f4a843957ffac7018c95adf53e6f794cbb62f9f6b81d50ccf5fa7bd6d3bf', '[\"*\"]', '2025-06-19 00:15:29', NULL, '2025-06-19 00:05:12', '2025-06-19 00:15:29'),
(64, 'App\\Models\\User', 1, 'auth_token', '3da2620a3644bd5b2594c2ce551500f320c1f42738bd725548ee9e34c21a0a2e', '[\"*\"]', '2025-06-19 00:52:19', NULL, '2025-06-19 00:18:26', '2025-06-19 00:52:19'),
(69, 'App\\Models\\User', 1, 'auth_token', '75959050fcd0f641fd47a5f3dd4c826fea081427da495bc8ced492ad80d30f45', '[\"*\"]', '2025-06-19 01:11:48', NULL, '2025-06-19 01:06:06', '2025-06-19 01:11:48'),
(72, 'App\\Models\\User', 1, 'auth_token', 'fbe02c140b0caf6ba74bb5c9cac26562eadee36d379a7baf40d7b0f6bb133a95', '[\"*\"]', '2025-06-19 01:29:40', NULL, '2025-06-19 01:26:44', '2025-06-19 01:29:40'),
(75, 'stdClass', 1, 'auth_token', '719999e81f31b552b1fa71ed97970800040ff7579c375b0e3497369bb71ee71b', '[\"*\"]', NULL, NULL, '2025-06-19 03:35:23', '2025-06-19 03:35:23'),
(76, 'stdClass', 1, 'auth_token', '97fb2261f6f2f953c65e1230035cc508f42d917ec77c8abd7c16d0dc66d81ebc', '[\"*\"]', NULL, NULL, '2025-06-19 03:36:35', '2025-06-19 03:36:35'),
(85, 'App\\Models\\User', 1, 'auth_token', '13160dba723ec1abba8799c5d8ecb03791e3caed8e4fe7a4bf202bc102d93039', '[\"*\"]', '2025-06-19 08:13:49', NULL, '2025-06-19 04:14:48', '2025-06-19 08:13:49'),
(89, 'App\\Models\\User', 1, 'auth_token', 'e1f89850f52db8ffc33064060241df5d9cbff11ba731cb5b92c8f700b33eb237', '[\"*\"]', '2025-06-19 08:14:06', NULL, '2025-06-19 05:58:44', '2025-06-19 08:14:06');

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
(1, 1, 'Goio Grand Hotel', 'goio', '456 Anna Salai, Chennai, Tamil Nadu, India', 'Chennai', 'Tamil Nadu', 'India', '600002', '+91-9845098450', 'goio@gmail.com', 1, '2025-06-17 11:53:30', '2025-06-19 08:37:14'),
(2, 1, 'Grand Hotel', 'grand', 'Kilakarai-Ramanathapuram, India', 'Ramnad', 'Tamil Nadu', 'India', '623515', '+91-9845098450', 'grand@gmail.com', 1, '2025-06-17 06:23:30', '2025-06-19 03:07:14');

-- --------------------------------------------------------

--
-- Table structure for table `roles_master`
--

CREATE TABLE `roles_master` (
  `id` bigint(20) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `role_code` varchar(50) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles_master`
--

INSERT INTO `roles_master` (`id`, `role_name`, `role_code`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'ADMIN', 1, '2025-06-18 12:00:18', '2025-06-18 12:00:18'),
(2, 'Manager', 'MANAGER', 1, '2025-06-18 12:00:18', '2025-06-18 12:00:18'),
(3, 'Receptionist', 'RECEPTIONIST', 1, '2025-06-18 12:00:18', '2025-06-18 12:00:18'),
(4, 'Housekeeping', 'HOUSEKEEPING', 1, '2025-06-18 12:00:18', '2025-06-18 12:00:18');

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `prop_id` bigint(20) DEFAULT NULL,
  `cmp_id` bigint(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `prop_id`, `cmp_id`, `role_id`, `name`, `email`, `email_verified_at`, `password`, `is_admin`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'Admin', 'admin@gmail.com', NULL, '$2y$12$D8JKGHYWr4/jb.23Cjzl3ecuC1WNlgQ21ja4Mo25k3za7poL5j1Wu', 1, NULL, '2025-06-05 04:46:13', '2025-06-05 04:46:13'),
(2, 2, 1, 2, 'Kalidass', 'kalidass@gmail.com', NULL, '$2y$12$D8JKGHYWr4/jb.23Cjzl3ecuC1WNlgQ21ja4Mo25k3za7poL5j1Wu', 1, NULL, '2025-06-06 05:43:46', '2025-06-06 05:43:46'),
(3, 1, 1, 3, 'Suresh', 'suresh@gmail.com', NULL, '$2y$12$lBsVFAakzBafsi3ssqInV.1WetHVr0ICqYix54bKBEW0U.O0bK.SS', 1, NULL, '2025-06-07 01:33:51', '2025-06-07 01:33:51');

--
-- Indexes for dumped tables
--

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
-- Indexes for table `company_master`
--
ALTER TABLE `company_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `company_code` (`company_code`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

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
-- Indexes for table `property_master`
--
ALTER TABLE `property_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `property_code` (`property_code`),
  ADD KEY `fk_company` (`cmp_id`);

--
-- Indexes for table `roles_master`
--
ALTER TABLE `roles_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_code` (`role_code`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company_master`
--
ALTER TABLE `company_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `property_master`
--
ALTER TABLE `property_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles_master`
--
ALTER TABLE `roles_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `property_master`
--
ALTER TABLE `property_master`
  ADD CONSTRAINT `fk_company` FOREIGN KEY (`cmp_id`) REFERENCES `company_master` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
