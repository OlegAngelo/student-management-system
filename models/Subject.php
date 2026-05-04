<?php
    declare(strict_types=1);

/**
 * Subject model for table: subjects
 *
 * Fields:
 * - id
 * - subject_name
 * - teacher_id
 * - schedule_time
 * - late_after_time
 */
    class Subject
    {
        private mysqli $conn;

        /**
         * Constructor
         * Returns: void
         * Loads DB connection from dbconfig.php.
         */
        public function __construct()
        {
            require __DIR__ . '/../dbconfig.php';
            /** @var mysqli $conn */
            $this->conn = $conn;
        }

        /**
         * all
         * Returns: list<array<string, mixed>>
         * Gets all subject rows ordered by newest first.
         *
         * @return list<array<string, mixed>>
         */
        public function all(): array
        {
            $sql = 'SELECT id, subject_name, teacher_id, schedule_time, late_after_time
                    FROM subjects
                    ORDER BY id DESC';
            $result = $this->conn->query($sql);
            if ($result === false) {
                return [];
            }

            /** @var list<array<string, mixed>> $rows */
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            return $rows;
        }

        /**
         * findById
         * Returns: array<string, mixed>|null
         * Gets one subject row by id.
         */
        public function findById(int $id): ?array
        {
            $sql = 'SELECT id, subject_name, teacher_id, schedule_time, late_after_time
                    FROM subjects
                    WHERE id = ?
                    LIMIT 1';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return null;
            }

            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();

            return $row !== null ? $row : null;
        }

        /**
         * create
         * Returns: bool
         * Inserts a new subject row.
         */
        public function create(string $subjectName, int $teacherId, string $scheduleTime, string $lateAfterTime): bool
        {
            $sql = 'INSERT INTO subjects (subject_name, teacher_id, schedule_time, late_after_time)
                    VALUES (?, ?, ?, ?)';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('siss', $subjectName, $teacherId, $scheduleTime, $lateAfterTime);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * updateById
         * Returns: bool
         * Updates a subject row by id.
         */
        public function updateById(int $id, string $subjectName, int $teacherId, string $scheduleTime, string $lateAfterTime): bool
        {
            $sql = 'UPDATE subjects
                    SET subject_name = ?, teacher_id = ?, schedule_time = ?, late_after_time = ?
                    WHERE id = ?';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('sissi', $subjectName, $teacherId, $scheduleTime, $lateAfterTime, $id);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * deleteById
         * Returns: bool
         * Deletes a subject row by id.
         */
        public function deleteById(int $id): bool
        {
            $sql = 'DELETE FROM subjects WHERE id = ?';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('i', $id);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }
    }
?>
