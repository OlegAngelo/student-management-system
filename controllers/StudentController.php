<?php
    declare(strict_types=1);

    /* StudentController - student-facing screens (attendance, QR scan, etc.)*/

    class StudentController
    {
        public function index(string $baseUrl): void
        {
            $studentModel = new Student();
            $students = $studentModel->all();
            require ROOT . '/views/student/index.php';
        }
    }
?>
