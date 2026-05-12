<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Student Portal</title>
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/style.css') ?>">
</head>
<body>
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

        </section>
    </main>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/script.js') ?>"></script>
</body>
</html>
