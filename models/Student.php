<?php
    declare(strict_types=1);

/**
 * Student model for table: students
 *
 * Schema fields used here:
 * - id
 * - student_id
 * - name
 * - year
 * - section
 * - date_created
 */
    class Student
    {
        private mysqli $conn;

        /**
         * Constructor
         * Returns: void
         * Loads DB connection from dbconfig.php.
         */
        public function __construct()
        {
            // Use existing local DB config.
            require __DIR__ . '/../dbconfig.php';

            /** @var mysqli $conn */
            $this->conn = $conn;
        }

        /**
         * all
         * Returns: list<array<string, mixed>>
         * Gets all student rows ordered by newest first.
         *
         * @return list<array<string, mixed>>
         */
        public function all(): array
        {
            $sql = 'SELECT id, student_id, name, year, section, date_created
                    FROM students
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
         * findByStudentId
         * Returns: array<string, mixed>|null
         * Gets one student row by student_id.
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
         * create
         * Returns: bool
         * Inserts a new student row.
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
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * updateByStudentId
         * Returns: bool
         * Updates name/year/section using student_id.
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
         * deleteByStudentId
         * Returns: bool
         * Deletes a student row by student_id.
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
