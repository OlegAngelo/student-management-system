<?php
    declare(strict_types=1);

    class Student
    {
        private mysqli $conn;

        /**
         * Loads the shared mysqli connection from dbconfig.php.
         *
         * @return void
         */
        public function __construct()
        {
            // Use existing local DB config.
            require __DIR__ . '/../dbconfig.php';

            /** @var mysqli $conn */
            $this->conn = $conn;
        }

        /**
         * Gets all student rows ordered by newest first.
         *
         * @return list<array<string, mixed>>
         */
        public function all(): array
        {
            $sql = 'SELECT id, student_id, name, year, section, date_created
                        FROM students
                        ORDER BY date_created DESC, id DESC';
            $result = $this->conn->query($sql);
            if ($result === false) {
                return [];
            }

            /** @var list<array<string, mixed>> $rows */
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            return $rows;
        }

        /**
         * Gets one student row by student_id.
         *
         * @param string $studentId
         * @return array<string, mixed>|null
         */
        public function findByStudentId(string $studentId): ?array
        {
            $sql = 'SELECT id, student_id, name, year, section, date_created
                    FROM students
                    WHERE student_id = ?
                    LIMIT 1';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return null;
            }

            $stmt->bind_param('s', $studentId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();

            return $row !== null ? $row : null;
        }

        /**
         * Inserts a new student row.
         *
         * @param string $studentId
         * @param string $name
         * @param string $year
         * @param string $section
         * @return bool
         */
        public function create(string $studentId, string $name, string $year, string $section): bool
        {
            $sql = 'INSERT INTO students (student_id, name, year, section)
                    VALUES (?, ?, ?, ?)';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('ssss', $studentId, $name, $year, $section);
            try {
                $ok = $stmt->execute();
            } catch (\mysqli_sql_exception $e) {
                $ok = false;
            }
            $stmt->close();

            return $ok;
        }

        /**
         * Updates name, year, and section using student_id.
         *
         * @param string $studentId
         * @param string $name
         * @param string $year
         * @param string $section
         * @return bool
         */
        public function updateByStudentId(string $studentId, string $name, string $year, string $section): bool
        {
            $sql = 'UPDATE students
                    SET name = ?, year = ?, section = ?
                    WHERE student_id = ?';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('ssss', $name, $year, $section, $studentId);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * Deletes a student row by student_id.
         *
         * @param string $studentId
         * @return bool
         */
        public function deleteByStudentId(string $studentId): bool
        {
            $sql = 'DELETE FROM students WHERE student_id = ?';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('s', $studentId);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

    }
?>
