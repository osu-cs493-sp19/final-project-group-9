-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jun 12, 2019 at 11:32 PM
-- Server version: 10.3.15-MariaDB-1:10.3.15+maria~bionic
-- PHP Version: 7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tarpaulin-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `courseId` int(11) NOT NULL,
  `title` varchar(64) NOT NULL,
  `points` int(3) NOT NULL,
  `due` datetime(6) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`courseId`, `title`, `points`, `due`, `id`) VALUES
(1, 'CS ASSIGNMENT 1', 50, '2019-11-07 00:00:00.000000', 1),
(6, 'CS 160 ASSIGNMENT 1', 25, '2019-06-20 00:00:00.000000', 2),
(2, 'Bio 101 Assignment 1', 100, '2019-06-14 00:00:00.000000', 3),
(3, 'CS 493 Assignment 1', 100, '2019-06-29 00:00:00.000000', 4),
(4, 'COMM 123 Assignment 1', 123, '2019-06-14 00:00:00.000000', 5);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `subject` varchar(8) NOT NULL,
  `number` varchar(3) NOT NULL,
  `title` varchar(256) NOT NULL,
  `term` varchar(11) NOT NULL,
  `year` int(4) NOT NULL,
  `instructorId` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`subject`, `number`, `title`, `term`, `year`, `instructorId`, `id`) VALUES
('CS', '101', 'COMPUTERS STUFF', 'Fall', 2019, 3, 1),
('BI', '101', 'Some BIO Class', 'Fall', 2045, 3, 2),
('CS', '493', 'Cloud Development', 'Winter', 2019, 3, 3),
('COMM', '123', 'COMM Class', 'Winter', 2065, 3, 4),
('ECE', '160', 'Some ECE COURSE', 'Spring', 2058, 3, 5),
('CS', '160', 'Some OTHER CS COURSE', 'Summer', 2038, 3, 6),
('CH', '420', 'If you know, you know ', 'Winter', 2045, 3, 7),
('ECE', '321', 'Higher Level ECE', 'Winter', 2095, 3, 8),
('COMM', '321', 'Advanced COMM class', 'Spring', 2044, 3, 9),
('COMM', '221', 'Harder COMM class', 'Spring', 2014, 3, 10),
('BI', '225', 'Cyberpunk', 'Summer', 2077, 3, 11);

-- --------------------------------------------------------

--
-- Table structure for table `enrolled`
--

CREATE TABLE `enrolled` (
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `enrolled`
--

INSERT INTO `enrolled` (`userId`, `courseId`) VALUES
(4, 1),
(4, 2),
(4, 3),
(5, 1),
(5, 3),
(6, 4),
(6, 6);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject`) VALUES
('BI'),
('CH'),
('COMM'),
('CS'),
('ECE');

-- --------------------------------------------------------

--
-- Table structure for table `submission`
--

CREATE TABLE `submission` (
  `id` varchar(16) NOT NULL,
  `assignmentId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `file` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `submission`
--

INSERT INTO `submission` (`id`, `assignmentId`, `studentId`, `timestamp`, `file`) VALUES
('0861fa97cb91f2ac', 1, 4, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/0861fa97cb91f2ac'),
('2c6ac35688276bb1', 3, 4, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/2c6ac35688276bb1'),
('5cb8d7259bea955b', 1, 4, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/5cb8d7259bea955b'),
('71b8172127d206a2', 1, 4, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/71b8172127d206a2'),
('8982641c1b53f428', 1, 5, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/8982641c1b53f428'),
('a3d111d66bd78246', 3, 4, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/a3d111d66bd78246'),
('a3dc35f62cffa7d4', 4, 5, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/a3dc35f62cffa7d4'),
('a719f0d1cd69ef20', 4, 5, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/a719f0d1cd69ef20'),
('aec6f061da3ab8b6', 3, 4, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/aec6f061da3ab8b6'),
('cc3ca9ec12a84ddd', 5, 6, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/cc3ca9ec12a84ddd'),
('d053442de324ece3', 3, 4, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/d053442de324ece3'),
('de371b1b01826760', 2, 6, '2019-06-12 15:34:50.817000', 'D:\\Classes\\CS 493\\final-project-group-9/submissions/de371b1b01826760');

-- --------------------------------------------------------

--
-- Table structure for table `term`
--

CREATE TABLE `term` (
  `term` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `term`
--

INSERT INTO `term` (`term`) VALUES
('Fall'),
('Spring'),
('Summer'),
('Winter');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `name` varchar(64) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` varchar(16) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`name`, `email`, `password`, `role`, `id`) VALUES
('Sung Kim', 'fake@email.com', '$2a$08$UtFz0pHzTuooNd.7fJaSW.7L/IaiMSvIqBH.dXEZak.INUjMoKd5q', 'admin', 1),
('Trevor Hammock', 'hammockt@oregonstate.edu', '$2a$08$FZTSocehoCu.60MzmO2C.Oy./M5dXN1tCsalj3ohA9hjDUjqfZND6', 'admin', 2),
('instructorPerson', 'instruct@email.com', '$2a$08$sp4Ghbm3jPtxb8AebwhTbuYVyMF9RPornSuBxUABrkcEgfDvPgqkC', 'instructor', 3),
('studentKid', 'student@email.com', '$2a$08$TE3BvDiaX0cMfcDDxMrX8OzkWrf78qu7vtkst9F5bUlF2qGe0Mb8u', 'student', 4),
('studentGuy', 'fake2@email.com', '$2a$08$f4tqPxXX2pQ4j1G9/rboMOSaFylZ1Gt0x3ZeO.MQUeA2mveerY0Uq', 'student', 5),
('studentPersonGuy', 'fake3@email.com', '$2a$08$bLluwoHIbHh6dw2PgvjvsOdRZtdZjfp2.8plARqBqQy1Z5biJpSKO', 'student', 6);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `role` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`role`) VALUES
('admin'),
('instructor'),
('student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseId` (`courseId`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instructorId` (`instructorId`),
  ADD KEY `subject` (`subject`),
  ADD KEY `term` (`term`);

--
-- Indexes for table `enrolled`
--
ALTER TABLE `enrolled`
  ADD KEY `userId` (`userId`,`courseId`),
  ADD KEY `fk_courseId` (`courseId`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject`);

--
-- Indexes for table `submission`
--
ALTER TABLE `submission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignmentId` (`assignmentId`,`studentId`),
  ADD KEY `fk_studentSub` (`studentId`);

--
-- Indexes for table `term`
--
ALTER TABLE `term`
  ADD PRIMARY KEY (`term`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_role` (`role`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `fk_courseToAssignment` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `fk_instructorId` FOREIGN KEY (`instructorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_term` FOREIGN KEY (`term`) REFERENCES `term` (`term`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subject` FOREIGN KEY (`subject`) REFERENCES `subjects` (`subject`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `enrolled`
--
ALTER TABLE `enrolled`
  ADD CONSTRAINT `fk_courseId` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `submission`
--
ALTER TABLE `submission`
  ADD CONSTRAINT `fk_assignmentSub` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_studentSub` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_role` FOREIGN KEY (`role`) REFERENCES `user_roles` (`role`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
