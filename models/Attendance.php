<?php
    declare(strict_types=1);

    class Attendance
    {
        private mysqli $conn;

        /**
         * Loads the shared mysqli connection from dbconfig.php.
         *
         * @return void
         */
        public function __construct()
        {
            require __DIR__ . '/../dbconfig.php';
            /** @var mysqli $conn */
            $this->conn = $conn;
        }

        /**
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
         * Gets one attendance row by student_id, subject_id, and date.
         *
         * @param string $studentId
         * @param int $subjectId
         * @param string $date
         * @return array<string, mixed>|null
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
         * Inserts a new attendance row.
         *
         * @param string $studentId
         * @param int $subjectId
         * @param string $date
         * @param string|null $checkinTime
         * @param string $status
         * @return bool
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
         * Updates status and check-in time by attendance id.
         *
         * @param int $id
         * @param string $status
         * @param string|null $checkinTime
         * @return bool
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
         * Deletes an attendance row by id.
         *
         * @param int $id
         * @return bool
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
