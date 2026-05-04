<?php
    declare(strict_types=1);

/**
 * Attendance model for table: attendance
 *
 * Fields:
 * - id
 * - student_id
 * - subject_id
 * - date
 * - checkin_time
 * - status (present, late, absent)
 */
    class Attendance
    {
        private mysqli $conn;

        /**
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
         * Gets all attendance rows ordered by latest date and id.
         *
         * @return list<array<string, mixed>>
         */
        public function all(): array
        {
            $sql = 'SELECT id, student_id, subject_id, date, checkin_time, status
                    FROM attendance
                    ORDER BY date DESC, id DESC';
            $result = $this->conn->query($sql);
            if ($result === false) {
                return [];
            }

            /** @var list<array<string, mixed>> $rows */
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            return $rows;
        }

        /**
         * findByKey
         * Returns: array<string, mixed>|null
         * Gets one attendance row using student_id + subject_id + date.
         */
        public function findByKey(string $studentId, int $subjectId, string $date): ?array
        {
            $sql = 'SELECT id, student_id, subject_id, date, checkin_time, status
                    FROM attendance
                    WHERE student_id = ? AND subject_id = ? AND date = ?
                    LIMIT 1';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return null;
            }

            $stmt->bind_param('sis', $studentId, $subjectId, $date);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();

            return $row !== null ? $row : null;
        }

        /**
         * create
         * Returns: bool
         * Inserts a new attendance row.
         */
        public function create(string $studentId, int $subjectId, string $date, ?string $checkinTime, string $status): bool
        {
            $sql = 'INSERT INTO attendance (student_id, subject_id, date, checkin_time, status)
                    VALUES (?, ?, ?, ?, ?)';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('sisss', $studentId, $subjectId, $date, $checkinTime, $status);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * updateStatusById
         * Returns: bool
         * Updates status and check-in time by attendance id.
         */
        public function updateStatusById(int $id, string $status, ?string $checkinTime): bool
        {
            $sql = 'UPDATE attendance SET status = ?, checkin_time = ? WHERE id = ?';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('ssi', $status, $checkinTime, $id);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * deleteById
         * Returns: bool
         * Deletes an attendance row by id.
         */
        public function deleteById(int $id): bool
        {
            $sql = 'DELETE FROM attendance WHERE id = ?';
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
