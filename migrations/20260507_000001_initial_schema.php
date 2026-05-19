<?php
    declare(strict_types=1);

    // Initial schema migration.
    // File order matters: keep timestamp prefix.

    return function (mysqli $conn): bool {
        $sql = "
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(50) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                year VARCHAR(20) NOT NULL,
                section VARCHAR(50) NOT NULL,
                date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ";

        if ($conn->query($sql) === false) {
            echo 'students table error: ' . $conn->error . PHP_EOL;
            return false;
        }

        $sql = "
            CREATE TABLE IF NOT EXISTS teachers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                department VARCHAR(100) NOT NULL,
                CONSTRAINT uq_teachers_name_department
                    UNIQUE (name, department)
            )
        ";

        if ($conn->query($sql) === false) {
            echo 'teachers table error: ' . $conn->error . PHP_EOL;
            return false;
        }

        $sql = "
            CREATE TABLE IF NOT EXISTS subjects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                subject_name VARCHAR(100) NOT NULL,
                teacher_id INT NOT NULL,
                schedule_time TIME NOT NULL,
                late_after_time TIME NOT NULL,
                CONSTRAINT uq_subjects_unique
                    UNIQUE (subject_name, teacher_id, schedule_time, late_after_time),
                CONSTRAINT fk_subjects_teacher
                    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            )
        ";

        if ($conn->query($sql) === false) {
            echo 'subjects table error: ' . $conn->error . PHP_EOL;
            return false;
        }

        $sql = "
            CREATE TABLE IF NOT EXISTS attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(50) NOT NULL,
                subject_id INT NOT NULL,
                date DATE NOT NULL,
                checkin_time TIME NULL,
                status ENUM('present', 'late', 'absent') NOT NULL DEFAULT 'absent',
                CONSTRAINT fk_attendance_student
                    FOREIGN KEY (student_id) REFERENCES students(student_id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
                CONSTRAINT fk_attendance_subject
                    FOREIGN KEY (subject_id) REFERENCES subjects(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
                CONSTRAINT uq_attendance_student_subject_date
                    UNIQUE (student_id, subject_id, date)
            )
        ";

        if ($conn->query($sql) === false) {
            echo 'attendance table error: ' . $conn->error . PHP_EOL;
            return false;
        }

        return true;
    };
?>
