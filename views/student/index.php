<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Student Portal</title>
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/style.css') ?>">
</head>
<body>
    <nav class="site-top" aria-label="Main">
        <a href="<?= htmlspecialchars($baseUrl . '/') ?>">Home</a>
        <a href="<?= htmlspecialchars($baseUrl . '/teacher') ?>">Teacher</a>
        <a href="<?= htmlspecialchars($baseUrl . '/student') ?>" aria-current="page">Student</a>
    </nav>
    <main class="shell">
        <section class="card">
            <h1 class="page-title">Student portal</h1>
            <!-- <p class="page-intro">Student records will appear here once data is available.</p> -->

            <?php
                /** @var list<array<string, mixed>> $students */
                $students ??= [];
            ?>

            <?php if ($students === []) { ?>
                <p>No students loaded yet.</p>
            <?php } else { ?>
                <ul>
                    <?php foreach ($students as $row) { ?>
                        <li><?= htmlspecialchars((string) ($row['name'] ?? json_encode($row))) ?></li>
                    <?php } ?>
                </ul>
            <?php } ?>

            <p class="page-actions"><a class="button secondary" href="<?= htmlspecialchars($baseUrl . '/') ?>">Back to home</a></p>
        </section>
    </main>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/script.js') ?>"></script>
</body>
</html>
