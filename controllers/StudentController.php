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

        /**
         * Records a manual attendance entry for the selected subject.
         * POST /student/attendance
         */
        public function recordAttendance(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $rawInput = file_get_contents('php://input');
            $input = [];
            if (is_string($rawInput) && $rawInput !== '') {
                $decoded = json_decode($rawInput, true);
                if (is_array($decoded)) {
                    $input = $decoded;
                }
            }
            if ($input === []) {
                $input = $_POST;
            }

            $studentId = trim((string) ($input['student_id'] ?? ''));
            $subjectIdRaw = $input['subject_id'] ?? '';

            if ($studentId === '') {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Student ID is required.'], JSON_UNESCAPED_UNICODE);
                return;
            }

            if (!preg_match('/^\d+$/', $studentId)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Student ID must contain digits only.'], JSON_UNESCAPED_UNICODE);
                return;
            }

            if (!is_numeric($subjectIdRaw) || (int) $subjectIdRaw <= 0) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Please select a subject before recording attendance.'], JSON_UNESCAPED_UNICODE);
                return;
            }

            $subjectId = (int) $subjectIdRaw;

            $studentModel = new Student();
            $student = $studentModel->findByStudentId($studentId);
            if ($student === null) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Student ID not found.'], JSON_UNESCAPED_UNICODE);
                return;
            }

            $subjectModel = new Subject();
            $subject = $subjectModel->findById($subjectId);
            if ($subject === null) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Selected subject was not found.'], JSON_UNESCAPED_UNICODE);
                return;
            }

            $date = date('Y-m-d');
            $currentTime = date('H:i:s');
            $lateAfterTime = trim((string) ($subject['late_after_time'] ?? ''));
            $status = $lateAfterTime !== '' && $currentTime > $lateAfterTime ? 'late' : 'present';

            $attendanceModel = new Attendance();
            $existing = $attendanceModel->findByKey($studentId, $subjectId, $date);
            if ($existing !== null) {
                http_response_code(409);
                echo json_encode(['success' => false, 'error' => 'Attendance already recorded for this subject today.'], JSON_UNESCAPED_UNICODE);
                return;
            }

            if (!$attendanceModel->create($studentId, $subjectId, $date, $currentTime, $status)) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Unable to save attendance right now. Please try again.'], JSON_UNESCAPED_UNICODE);
                return;
            }

            echo json_encode([
                'success' => true,
                'message' => 'Attendance recorded successfully.',
            ], JSON_UNESCAPED_UNICODE);
        }
    }
?>
