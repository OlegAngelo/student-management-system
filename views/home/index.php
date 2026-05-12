<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Student Management System</title>
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/style.css') ?>">
</head>
<body>
    <main class="shell">
        <section class="card">
            <div class="hero">
                <div class="eyebrow">Student Management System</div>
                <h1>Manage students and attendance from one place.</h1>
                <p class="lead">
                    A simple PHP and MySQL dashboard for teachers and students, with QR-based attendance tracking
                    and lightweight record management.
                </p>
                <div class="actions">
                    <a class="button primary" href="<?= htmlspecialchars($baseUrl . '/teacher') ?>">Teacher Portal</a>
                    <a class="button secondary" href="<?= htmlspecialchars($baseUrl . '/student') ?>">Student Portal</a>
                </div>
            </div>

            <div class="grid">
                <article class="tile">
                    <h2>Teacher tools</h2>
                    <p>Add, update, and remove student records, then generate QR codes for attendance.</p>
                </article>
                <article class="tile">
                    <h2>Student scan flow</h2>
                    <p>Select a subject, scan a QR code, and submit attendance in a few seconds.</p>
                </article>
                <article class="tile">
                    <h2>Simple setup</h2>
                    <p>Built for XAMPP with a small codebase and direct routes in routes.php.</p>
                </article>
            </div>
        </section>
    </main>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/script.js') ?>"></script>
</body>
</html>
