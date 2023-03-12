-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2022 at 05:01 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xqjcwlsx_code_dbms`
--

-- --------------------------------------------------------

--
-- Table structure for table `users_info`
--

CREATE TABLE `users_info` (
  `ID` int(11) NOT NULL,
  `Date` varchar(100) NOT NULL DEFAULT current_timestamp(),
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `telephone` int(11) NOT NULL,
  `password` varchar(100) NOT NULL,
  `user_role` varchar(100) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `EIIN` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_info`
--

INSERT INTO `users_info` (`ID`, `Date`, `name`, `username`, `telephone`, `password`, `user_role`, `address`, `EIIN`) VALUES
(1, '0000-00-00', 'Akash', 'deo@akash.com', 1234567890, 'akash', 'deo', NULL, NULL),
(2, '0000-00-00', 'Dola', 'ueo@dola.com', 1234567890, 'dola', 'ueo', NULL, NULL),
(3, '0000-00-00', 'Setu', 'hm@setu.com', 1234567890, 'setu', 'hm', NULL, NULL),
(4, '0000-00-00', 'alif nayon', 'admin@alifn.com', 1234567890, 'alifn', 'admin', NULL, NULL),
(13, '0000-00-00', 'Soumitra Shaha', 'ceo@soumitra.com', 1234567890, 'admin', 'admin', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users_info`
--
ALTER TABLE `users_info`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `EIIN` (`EIIN`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users_info`
--
ALTER TABLE `users_info`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
