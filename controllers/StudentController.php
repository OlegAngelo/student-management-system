<?php
    declare(strict_types=1);

    /* StudentController - student-facing screens (attendance, QR scan, etc.)*/

    class StudentController
    {
        public function index(string $baseUrl): void
        {
            $studentModel = new Student();
            $subjectModel = new Subject();

            $students = $studentModel->all();
            $subjects = $subjectModel->all();

            require ROOT . '/views/student/index.php';
        }
    }
?>
