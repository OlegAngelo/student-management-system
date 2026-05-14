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
        <h1 class="page-title">QR Attendance</h1>
        <section class="card">

            <?php
                /** @var list<array<string, mixed>> $subjects */
                $subjects ??= [];
                $hasSubjects = $subjects !== [];
            ?>

            <form class="attendance-form" method="post" action="<?= htmlspecialchars($baseUrl . '/student/attendance') ?>">
                <div class="form-group">
                    <label for="subject_id">Select Subject</label>
                    <select id="subject_id" name="subject_id" required <?= $hasSubjects ? '' : 'disabled' ?>>
                        <?php if (!$hasSubjects) { ?>
                            <option value="" disabled selected>No subjects found</option>
                        <?php } else { ?>
                            <option value="" disabled selected>Select Subject</option>
                            <?php foreach ($subjects as $subject) {
                                $teacherName = trim((string) ($subject['teacher_name'] ?? ''));
                                $label = (string) $subject['subject_name'];
                                if ($teacherName !== '') {
                                    $label .= ' - ' . $teacherName;
                                }
                                $label .= ' - ' . (string) $subject['schedule_time'];
                                ?>
                                <option value="<?= htmlspecialchars((string) $subject['id']) ?>">
                                    <?= htmlspecialchars($label) ?>
                                </option>
                            <?php } ?>
                        <?php } ?>
                    </select>
                </div>
            </form>

            <div id="attendance-placeholder" class="qr-attendance-area qr-attendance-area--empty">
                <p><?= $hasSubjects
                    ? 'Please select a subject to start scanning'
                    : 'No subjects available yet. Ask your teacher to add one.' ?></p>
            </div>

            <section id="attendance-scanner" class="qr-attendance-scanner" hidden>
                <div class="qr-attendance-area qr-attendance-area--scanner">
                    <p>Please align your QR code to the camera</p>
                </div>
            </section>
        </section>
    </main>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/script.js') ?>"></script>
</body>
</html>
