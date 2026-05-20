<?php
    declare(strict_types=1);

    require_once __DIR__ . '/../modelHelpers/SqlSearch.php';

    class Subject
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
         * Gets all subject rows with teacher_name, ordered by newest first.
         *
         * @return list<array<string, mixed>>
         */
        public function all(): array
        {
            $sql = 'SELECT s.id, s.subject_name, s.teacher_id, s.schedule_time, s.late_after_time,
                           t.name AS teacher_name
                    FROM subjects s
                    LEFT JOIN teachers t ON t.id = s.teacher_id
                    ORDER BY s.id DESC';
            $result = $this->conn->query($sql);
            if ($result === false) {
                return [];
            }

            /** @var list<array<string, mixed>> $rows */
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            return $rows;
        }

        /**
         * True when at least one subject row exists (cheap empty check).
         *
         * @return bool
         */
        public function existsAny(): bool
        {
            $result = $this->conn->query('SELECT 1 FROM subjects LIMIT 1');
            return $result !== false && $result->num_rows > 0;
        }

        /**
         * Distinct teachers linked to at least one subject (id 0 means unassigned).
         *
         * @return list<array{id: int, name: string}>
         */
        public function teachersWithSubjects(): array
        {
            $sql = 'SELECT COALESCE(s.teacher_id, 0) AS id,
                           COALESCE(
                               NULLIF(TRIM(MAX(t.name)), \'\'),
                               IF(COALESCE(s.teacher_id, 0) = 0, \'No teacher assigned\', CONCAT(\'Teacher #\', COALESCE(s.teacher_id, 0)))
                           ) AS name
                    FROM subjects s
                    LEFT JOIN teachers t ON t.id = s.teacher_id
                    GROUP BY COALESCE(s.teacher_id, 0)
                    ORDER BY name ASC';
            $result = $this->conn->query($sql);
            if ($result === false) {
                return [];
            }

            /** @var list<array<string, mixed>> $rows */
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            /** @var list<array{id: int, name: string}> $out */
            $out = [];
            foreach ($rows as $row) {
                $out[] = [
                    'id' => (int) ($row['id'] ?? 0),
                    'name' => (string) ($row['name'] ?? ''),
                ];
            }

            return $out;
        }

        /**
         * Bounded subject list for the student portal (multi-word AND search).
         *
         * @param int|null $teacherId Filter by teacher, or null for all teachers (requires 2+ chars in $search)
         * @param string $search Space-separated tokens matched with LIKE AND
         * @param int $limit Max rows (clamped 1-200)
         * @return list<array<string, mixed>>
         */
        public function listForStudentPortal(?int $teacherId, string $search, int $limit = 120): array
        {
            $limit = max(1, min($limit, 200));
            $searchTrim = trim($search);
            $tokens = SqlSearch::splitSearchTerms($searchTrim);
            $likePatterns = SqlSearch::likePatternsFromTokens($tokens);

            if ($teacherId === null) {
                if (strlen($searchTrim) < 2) {
                    return [];
                }

                if ($likePatterns === []) {
                    return [];
                }

                $hay = SqlSearch::subjectJoinHaystackSql();
                $whereParts = [];
                foreach ($likePatterns as $_) {
                    $whereParts[] = $hay . ' LIKE ?';
                }
                $whereSql = implode(' AND ', $whereParts);

                $sql = 'SELECT s.id, s.subject_name, s.teacher_id, s.schedule_time, s.late_after_time,
                               t.name AS teacher_name
                        FROM subjects s
                        LEFT JOIN teachers t ON t.id = s.teacher_id
                        WHERE ' . $whereSql . '
                        ORDER BY s.subject_name ASC, s.id ASC
                        LIMIT ?';
                $stmt = $this->conn->prepare($sql);
                if ($stmt === false) {
                    return [];
                }

                $types = str_repeat('s', count($likePatterns)) . 'i';
                $bind = array_merge($likePatterns, [$limit]);
                if (!SqlSearch::bindPreparedParams($stmt, $types, $bind)) {
                    $stmt->close();

                    return [];
                }

                $stmt->execute();
                $result = $stmt->get_result();
                /** @var list<array<string, mixed>> $rows */
                $rows = $result->fetch_all(MYSQLI_ASSOC);
                $stmt->close();

                return $rows;
            }

            $base = 'SELECT s.id, s.subject_name, s.teacher_id, s.schedule_time, s.late_after_time,
                             t.name AS teacher_name
                      FROM subjects s
                      LEFT JOIN teachers t ON t.id = s.teacher_id
                      WHERE ';
            if ($teacherId <= 0) {
                $base .= '(s.teacher_id IS NULL OR s.teacher_id = 0)';
            } else {
                $base .= 's.teacher_id = ?';
            }

            if ($likePatterns !== []) {
                $hay = SqlSearch::subjectJoinHaystackSql();
                foreach ($likePatterns as $_) {
                    $base .= ' AND ' . $hay . ' LIKE ?';
                }
            }

            $base .= ' ORDER BY s.subject_name ASC, s.id ASC LIMIT ?';

            $stmt = $this->conn->prepare($base);
            if ($stmt === false) {
                return [];
            }

            $bind = [];
            $types = '';

            if ($teacherId > 0) {
                $types .= 'i';
                $bind[] = $teacherId;
            }

            foreach ($likePatterns as $p) {
                $types .= 's';
                $bind[] = $p;
            }

            $types .= 'i';
            $bind[] = $limit;

            if (!SqlSearch::bindPreparedParams($stmt, $types, $bind)) {
                $stmt->close();

                return [];
            }

            $stmt->execute();
            $result = $stmt->get_result();
            /** @var list<array<string, mixed>> $rows */
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            return $rows;
        }

        /**
         * Inserts a new subject row.
         *
         * @param string $subjectName
         * @param int $teacherId
         * @param string $scheduleTime
         * @param string $lateAfterTime
         * @return bool
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
         * Updates a subject row by id.
         *
         * @param int $id
         * @param string $subjectName
         * @param int $teacherId
         * @param string $scheduleTime
         * @param string $lateAfterTime
         * @return bool
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
         * Deletes a subject row by id.
         *
         * @param int $id
         * @return bool
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
