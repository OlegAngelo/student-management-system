<?php
    declare(strict_types=1);

    /**
     * Central route map — the first place to look when a URL should show a new page.
     *
     * Format: 'PATH' => [ControllerClass::class, 'methodName']
     *
     * - PATH format should be: '/', '/teacher', '/student', '/student/subjects' (leading slash, no trailing slash).
     * - Controllers must be required in public/index.php BEFORE this file is loaded.
     *
     * To add a route:
     * 1. Add a public function to a controller.
     * 2. Add one line here pointing to [ThatController::class, 'yourMethod'].
     */

    return [
        '/' => [HomeController::class, 'index'],
        '/teacher' => [TeacherController::class, 'index'],
        '/student' => [StudentController::class, 'index'],
        '/student/subjects' => [StudentController::class, 'subjectsJson'],
    ];
?>
