<?php
    declare(strict_types=1);

    class Teacher
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
         * Gets all teacher rows ordered by newest first.
         *
         * @return list<array<string, mixed>>
         */
        public function all(): array
        {
            $sql = 'SELECT id, name, department FROM teachers ORDER BY id DESC';
            $result = $this->conn->query($sql);
            if ($result === false) {
                return [];
            }

            /** @var list<array<string, mixed>> $rows */
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            return $rows;
        }

        /**
         * Inserts a new teacher row.
         *
         * @param string $name
         * @param string $department
         * @return bool
         */
        public function create(string $name, string $department): bool
        {
            $sql = 'INSERT INTO teachers (name, department) VALUES (?, ?)';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('ss', $name, $department);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * Updates teacher name and department by id.
         *
         * @param int $id
         * @param string $name
         * @param string $department
         * @return bool
         */
        public function updateById(int $id, string $name, string $department): bool
        {
            $sql = 'UPDATE teachers SET name = ?, department = ? WHERE id = ?';
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                return false;
            }

            $stmt->bind_param('ssi', $name, $department, $id);
            $ok = $stmt->execute();
            $stmt->close();

            return $ok;
        }

        /**
         * Deletes a teacher row by id.
         *
         * @param int $id
         * @return bool
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
