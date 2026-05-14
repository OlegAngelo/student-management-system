<?php
    declare(strict_types=1);

    /* StudentController - student-facing screens (attendance, QR scan, etc.)*/

    class StudentController
    {
        public function index(string $baseUrl): void
        {
            $subjectModel = new Subject();

            $hasSubjects = $subjectModel->existsAny();
            $subjectTeachers = $hasSubjects ? $subjectModel->teachersWithSubjects() : [];

            require ROOT . '/views/student/index.php';
        }

        /**
         * JSON list of subjects for the student picker (lazy load; capped rows).
         * GET /student/subjects?teacher_id=123&q=optional
         * Omit teacher_id to search across all teachers (q must be at least 2 characters).
         * Use multiple words in q to match both teacher and subject (each word must appear somewhere).
         */
        public function subjectsJson(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $teacherRaw = $_GET['teacher_id'] ?? null;
            $q = isset($_GET['q']) ? (string) $_GET['q'] : '';

            $teacherId = null;
            if ($teacherRaw !== null && $teacherRaw !== '') {
                if (!is_numeric($teacherRaw)) {
                    http_response_code(400);
                    echo json_encode(['subjects' => [], 'error' => 'Invalid teacher_id'], JSON_UNESCAPED_UNICODE);
                    return;
                }
                $teacherId = (int) $teacherRaw;
            }

            $model = new Subject();
            $subjects = $model->listForStudentPortal($teacherId, $q, 120);

            echo json_encode(['subjects' => $subjects], JSON_UNESCAPED_UNICODE);
        }
    }
?>
