<?php
    declare(strict_types=1);

    /**
     * TeacherController - pages for teachers (lists, forms, QR, etc.).
     * Start with one action per screen (index, create, store, ...).
     */

    class TeacherController
    {
        public function index(string $baseUrl): void
        {
            require ROOT . '/views/teacher/index.php';
        }

        /**
         * JSON list of students for the teacher dashboard.
         */
        public function studentsJson(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $studentModel = new Student();
            $rows = $studentModel->all();

            $students = array_map(
                static function (array $row): array {
                    return [
                        'student_id' => (string) ($row['student_id'] ?? ''),
                        'name' => (string) ($row['name'] ?? ''),
                        'year' => (string) ($row['year'] ?? ''),
                        'section' => (string) ($row['section'] ?? ''),
                    ];
                },
                $rows
            );

            echo json_encode(['students' => $students], JSON_UNESCAPED_UNICODE);
        }

        /**
         * JSON list of subjects for the teacher dashboard.
         */
        public function subjectsJson(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $subjectModel = new Subject();
            $rows = $subjectModel->all();

            $subjects = array_map(
                static function (array $row): array {
                    return [
                        'id' => (int) ($row['id'] ?? 0),
                        'subject_name' => (string) ($row['subject_name'] ?? ''),
                        'teacher_id' => (int) ($row['teacher_id'] ?? 0),
                        'teacher_name' => (string) ($row['teacher_name'] ?? ''),
                        'schedule_time' => (string) ($row['schedule_time'] ?? ''),
                        'late_after_time' => (string) ($row['late_after_time'] ?? ''),
                    ];
                },
                $rows
            );

            echo json_encode(['subjects' => $subjects], JSON_UNESCAPED_UNICODE);
        }

        /**
         * Creates a new student from POST JSON data.
         */
        public function createStudent(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

            $studentId = trim($input['student_id'] ?? '');
            $name = trim($input['name'] ?? '');
            $year = trim($input['year'] ?? '');
            $section = trim($input['section'] ?? '');

            if (!$studentId || !$name || !$year || !$section) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'All fields are required'], JSON_UNESCAPED_UNICODE);
                return;
            }

            $studentModel = new Student();
            $ok = $studentModel->create($studentId, $name, $year, $section);

            if ($ok) {
                http_response_code(201);
                echo json_encode(['success' => true, 'data' => ['student_id' => $studentId, 'name' => $name, 'year' => $year, 'section' => $section]], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Failed to create student (duplicate ID or database error)'], JSON_UNESCAPED_UNICODE);
            }
        }
    }
?>
