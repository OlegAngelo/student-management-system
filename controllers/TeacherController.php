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
    }
?>
