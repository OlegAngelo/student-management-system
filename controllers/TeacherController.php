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
            try {
                $ok = $studentModel->create($studentId, $name, $year, $section);
            } catch (\Exception $e) {
                $ok = false;
            }

            if ($ok) {
                http_response_code(201);
                echo json_encode(['success' => true, 'data' => ['student_id' => $studentId, 'name' => $name, 'year' => $year, 'section' => $section]], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                $existing = $studentModel->findByStudentId($studentId);
                $error = $existing ? 'Student ID already exists' : 'Failed to create student';
                echo json_encode(['success' => false, 'error' => $error], JSON_UNESCAPED_UNICODE);
            }
        }

        /**
         * Deletes a student by student_id from DELETE JSON data.
         */
        public function deleteStudent(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $input = json_decode(file_get_contents('php://input'), true) ?? [];

            $studentId = trim($input['student_id'] ?? '');

            if (!$studentId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'student_id is required'], JSON_UNESCAPED_UNICODE);
                return;
            }

            $studentModel = new Student();
            $ok = $studentModel->deleteByStudentId($studentId);

            if ($ok) {
                echo json_encode(['success' => true, 'message' => 'Student deleted successfully.'], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Failed to delete student.'], JSON_UNESCAPED_UNICODE);
            }
        }



        /**
         * Updates a student's name, year, and section from PUT JSON data.
         */
        public function updateStudent(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $input = json_decode(file_get_contents('php://input'), true) ?? [];

            $studentId = trim($input['student_id'] ?? '');
            $name      = trim($input['name'] ?? '');
            $year      = trim($input['year'] ?? '');
            $section   = trim($input['section'] ?? '');

            if (!$studentId || !$name || !$year || !$section) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'All fields are required'], JSON_UNESCAPED_UNICODE);
                return;
            }

            $studentModel = new Student();
            $ok = $studentModel->updateByStudentId($studentId, $name, $year, $section);

            if ($ok) {
                echo json_encode(['success' => true, 'message' => 'Student updated successfully.'], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Failed to update student.'], JSON_UNESCAPED_UNICODE);
            }
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
         * Creates a new subject from POST JSON data.
         */
        public function createSubject(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

            $subjectName = trim($input['subject_name'] ?? '');
            $teacherId = (int) ($input['teacher_id'] ?? 0);
            $scheduleTime = trim($input['schedule_time'] ?? '');
            $lateAfterTime = trim($input['late_after_time'] ?? '');

            if (!$subjectName || !$scheduleTime || !$lateAfterTime) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Subject name, schedule time, and late after time are required'], JSON_UNESCAPED_UNICODE);
                return;
            }

            $subjectModel = new Subject();
            try {
                $ok = $subjectModel->create($subjectName, $teacherId, $scheduleTime, $lateAfterTime);
            } catch (\Exception $e) {
                $ok = false;
            }

            if ($ok) {
                http_response_code(201);
                echo json_encode(['success' => true, 'message' => 'Subject created successfully.', 'data' => ['subject_name' => $subjectName, 'teacher_id' => $teacherId, 'schedule_time' => $scheduleTime, 'late_after_time' => $lateAfterTime]], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Failed to create subject (duplicate or database error)'], JSON_UNESCAPED_UNICODE);
            }
        }

        /**
         * Updates a subject from PUT JSON data.
         */
        public function updateSubject(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $input = json_decode(file_get_contents('php://input'), true) ?? [];

            $id = (int) ($input['id'] ?? 0);
            $subjectName = trim($input['subject_name'] ?? '');
            $teacherId = (int) ($input['teacher_id'] ?? 0);
            $scheduleTime = trim($input['schedule_time'] ?? '');
            $lateAfterTime = trim($input['late_after_time'] ?? '');

            if (!$id || !$subjectName || !$scheduleTime || !$lateAfterTime) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'ID, subject name, schedule time, and late after time are required'], JSON_UNESCAPED_UNICODE);
                return;
            }

            $subjectModel = new Subject();
            $ok = $subjectModel->updateById($id, $subjectName, $teacherId, $scheduleTime, $lateAfterTime);

            if ($ok) {
                echo json_encode(['success' => true, 'message' => 'Subject updated successfully.'], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Failed to update subject.'], JSON_UNESCAPED_UNICODE);
            }
        }

        /**
         * Deletes a subject from DELETE JSON data.
         */
        public function deleteSubject(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $input = json_decode(file_get_contents('php://input'), true) ?? [];

            $id = (int) ($input['id'] ?? 0);

            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Subject ID is required'], JSON_UNESCAPED_UNICODE);
                return;
            }

            $subjectModel = new Subject();
            $ok = $subjectModel->deleteById($id);

            if ($ok) {
                echo json_encode(['success' => true, 'message' => 'Subject deleted successfully.'], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Failed to delete subject.'], JSON_UNESCAPED_UNICODE);
            }
        }
?>
