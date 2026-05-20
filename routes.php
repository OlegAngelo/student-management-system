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
     * 2. Add one line here pointing to [ControllerClassName::class, 'methodName'].
     */

    return [
        // Main pages
        '/' => [HomeController::class, 'index'],
        '/teacher' => [TeacherController::class, 'index'],
        '/student' => [StudentController::class, 'index'],

        // API routes for CRUD operations on students (for teacher dashboard)
        'GET:/teacher/api/students' => [TeacherController::class, 'studentsJson'],
        'POST:/teacher/api/students' => [TeacherController::class, 'createStudent'],
        'DELETE:/teacher/api/students' => [TeacherController::class, 'deleteStudent'],
        'PUT:/teacher/api/students' => [TeacherController::class, 'updateStudent'],
        
        // API routes for CRUD operations on subjects (for teacher dashboard)
        'GET:/teacher/api/subjects' => [TeacherController::class, 'subjectsJson'],
        'GET:/teacher/api/teachers-hierarchy' => [TeacherController::class, 'teachersHierarchyJson'],
        'POST:/teacher/api/subjects' => [TeacherController::class, 'createSubject'],
        'DELETE:/teacher/api/subjects' => [TeacherController::class, 'deleteSubject'],
        'PUT:/teacher/api/subjects' => [TeacherController::class, 'updateSubject'],

        // API routes for CRUD operations on teachers
        'GET:/teacher/api/teachers' => [TeacherController::class, 'teachersJson'],
        'POST:/teacher/api/teachers' => [TeacherController::class, 'createTeacher'],
        'DELETE:/teacher/api/teachers' => [TeacherController::class, 'deleteTeacher'],
        'PUT:/teacher/api/teachers' => [TeacherController::class, 'updateTeacher'],

        // API routes for CRUD operations on subjects (for student dashboard)
        '/student/subjects' => [StudentController::class, 'subjectsJson'],
    ];
?>
