<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Teacher Portal</title>
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/style.css') ?>">
</head>
<body>
    <nav class="site-top" aria-label="Main">
        <a href="<?= htmlspecialchars($baseUrl . '/') ?>">Home</a>
        <a href="<?= htmlspecialchars($baseUrl . '/teacher') ?>" aria-current="page">Teacher</a>
        <a href="<?= htmlspecialchars($baseUrl . '/student') ?>">Student</a>
    </nav>
    <main class="shell">
        <section class="card">
            <h1 class="page-title">Teacher portal</h1>
            <p class="page-intro">This is the teacher dashboard route. Next step is wiring CRUD pages into this controller.</p>
            <p class="page-actions"><a class="button secondary" href="<?= htmlspecialchars($baseUrl . '/') ?>">Back to home</a></p>
        </section>
    </main>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/script.js') ?>"></script>
</body>
</html>
