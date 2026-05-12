<?php
    declare(strict_types=1);

    define('ROOT', __DIR__);

    require ROOT . '/models/Student.php';
    require ROOT . '/models/Teacher.php';
    require ROOT . '/models/Subject.php';
    require ROOT . '/models/Attendance.php';
    require ROOT . '/controllers/HomeController.php';
    require ROOT . '/controllers/TeacherController.php';
    require ROOT . '/controllers/StudentController.php';

    // base URL (for links/assets), example: /student-management-system
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    $baseUrl = rtrim($scriptDir, '/');
    if ($baseUrl === '/') {
        $baseUrl = '';
    }

    $routes = require ROOT . '/routes.php';

    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if ($method !== 'GET') {
        http_response_code(405);
        echo 'Method Not Allowed';
        exit;
    }

    // Normalize request path: /, /teacher, /student
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    if ($baseUrl !== '' && str_starts_with($path, $baseUrl . '/')) {
        $path = substr($path, strlen($baseUrl));
    } elseif ($baseUrl !== '' && $path === $baseUrl) {
        $path = '/';
    }
    $path = '/' . ltrim($path, '/');
    $path = rtrim($path, '/');
    if ($path === '') {
        $path = '/';
    }

    $handler = $routes[$path] ?? null;

    if ($handler === null) {
        http_response_code(404);
        require ROOT . '/views/errors/404.php';
        exit;
    }

    [$className, $action] = $handler;
    $controller = new $className();
    $controller->{$action}($baseUrl);
?>
