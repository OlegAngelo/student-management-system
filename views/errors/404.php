<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Not Found</title>
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/style.css') ?>">
</head>
<body>
    <main class="shell">
        <section class="card">
            <h1 class="page-title">Page not found</h1>
            <p class="page-intro">Requested page does not exist.</p>
            <p class="page-actions"><a class="button primary" href="<?= htmlspecialchars($baseUrl . '/') ?>">Go home</a></p>
        </section>
    </main>
</body>
</html>
