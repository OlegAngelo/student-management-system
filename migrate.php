<?php
    declare(strict_types=1);

    // Minimal migration runner.
    // Run: php migrate.php

    require __DIR__ . '/dbconfig.php';

    // Track executed migration files.
    $createMigrationsTableSql = "
        CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ";

    if ($conn->query($createMigrationsTableSql) === false) {
        die('Failed to create migrations table: ' . $conn->error . PHP_EOL);
    }

    $executed = [];
    $result = $conn->query('SELECT migration FROM migrations ORDER BY id ASC');
    if ($result !== false) {
        while ($row = $result->fetch_assoc()) {
            $executed[] = $row['migration'];
        }
    }

    $migrationFiles = glob(__DIR__ . '/migrations/*.php');
    if ($migrationFiles === false) {
        die('Failed to read migration files.' . PHP_EOL);
    }

    if ($migrationFiles === []) {
        echo 'No migration files found.' . PHP_EOL;
        exit;
    }

    $pendingFiles = [];
    foreach ($migrationFiles as $filePath) {
        $migrationName = basename($filePath);
        if (!in_array($migrationName, $executed, true)) {
            $pendingFiles[$migrationName] = $filePath;
        }
    }

    if ($pendingFiles === []) {
        echo 'No pending migration. Database is up to date.' . PHP_EOL;
        exit;
    }

    $args = $argv ?? [];
    $runAll = in_array('--all', $args, true);
    $targetFile = null;

    foreach ($args as $arg) {
        if (str_starts_with($arg, '--file=')) {
            $targetFile = trim(substr($arg, 7));
            break;
        }
    }

    $filesToRun = [];

    if ($targetFile !== null && $targetFile !== '') {
        if (!array_key_exists($targetFile, $pendingFiles)) {
            if (in_array($targetFile, $executed, true)) {
                echo 'Target migration already executed: ' . $targetFile . PHP_EOL;
                exit;
            }
            die('Target migration not found in pending files: ' . $targetFile . PHP_EOL);
        }

        $filesToRun = [$pendingFiles[$targetFile]];
        echo 'Running target migration: ' . $targetFile . PHP_EOL;
    } elseif ($runAll) {
        // Deterministic order for FK-safe seed/data chains.
        ksort($pendingFiles);
        $filesToRun = array_values($pendingFiles);
        echo 'Running all pending migrations in filename order...' . PHP_EOL;
    } else {
        // Default mode: latest pending migration only.
        uasort(
            $pendingFiles,
            static function (string $a, string $b): int {
                return filemtime($b) <=> filemtime($a);
            }
        );
        $filesToRun = [array_values($pendingFiles)[0]];
    }

    foreach ($filesToRun as $filePath) {
        $migrationName = basename($filePath);
        echo 'Running: ' . $migrationName . PHP_EOL;

        $migrationContent = require $filePath;
        $ok = false;

        // Option 1 (simple): return one SQL string
        if (is_string($migrationContent)) {
            $ok = $conn->query($migrationContent) === true;
        }

        // Option 2 (simple): return array of SQL strings
        if (is_array($migrationContent)) {
            $ok = true;
            foreach ($migrationContent as $sql) {
                if (!is_string($sql)) {
                    $ok = false;
                    break;
                }
                if ($conn->query($sql) !== true) {
                    $ok = false;
                    break;
                }
            }
        }

        // Option 3 (advanced): return callable for custom logic
        if (is_callable($migrationContent)) {
            $ok = $migrationContent($conn) === true;
        }

        if ($ok !== true) {
            die('Migration failed: ' . $migrationName . PHP_EOL . 'DB Error: ' . $conn->error . PHP_EOL);
        }

        $stmt = $conn->prepare('INSERT INTO migrations (migration) VALUES (?)');
        if ($stmt === false) {
            die('Failed to save migration status: ' . $conn->error . PHP_EOL);
        }

        $stmt->bind_param('s', $migrationName);
        $stmt->execute();
        $stmt->close();

        echo 'Done: ' . $migrationName . PHP_EOL;
    }
?>
