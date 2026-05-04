<?php
    declare(strict_types=1);

/**
 * Teacher model for table: teachers
 *
 * Fields:
 * - id
 * - name
 * - subject
 */
    class Teacher
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
         * Gets all teacher rows ordered by newest first.
         *
         * @return list<array<string, mixed>>
         */
        public function all(): array
        {
            $sql = 'SELECT id, name, subject FROM teachers ORDER BY id DESC';
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
         * Gets one teacher row by id.
         */
        public function findById(int $id): ?array
        {
            $sql = 'SELECT id, name, subject FROM teachers WHERE id = ? LIMIT 1';
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
         * Inserts a new teacher row.
         */
        public function create(string $name, string $subject): bool
        {
            $sql = 'INSERT INTO teachers (name, subject) VALUES (?, ?)';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('ss', $name, $subject);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * updateById
         * Returns: bool
         * Updates teacher name and subject by id.
         */
        public function updateById(int $id, string $name, string $subject): bool
        {
            $sql = 'UPDATE teachers SET name = ?, subject = ? WHERE id = ?';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('ssi', $name, $subject, $id);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * deleteById
         * Returns: bool
         * Deletes a teacher row by id.
         */
        public function deleteById(int $id): bool
        {
            $sql = 'DELETE FROM teachers WHERE id = ?';
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
