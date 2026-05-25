<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Student Portal</title>
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/css/base.css') ?>">
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/css/student.css') ?>">
</head>
<body>
    <main class="shell">
        <h1 class="page-title">QR Attendance</h1>
        <section class="card">

            <?php
                /** @var bool $hasSubjects */
                $hasSubjects ??= false;
                /** @var list<array{id: int, name: string}> $subjectTeachers */
                $subjectTeachers ??= [];
            ?>

            <form class="attendance-form" method="post" action="<?= htmlspecialchars($baseUrl . '/student/attendance') ?>">
                <div class="form-group subject-picker" id="student-subject-picker"<?= $hasSubjects
                    ? ' data-subjects-api="' . htmlspecialchars($baseUrl . '/student/subjects', ENT_QUOTES, 'UTF-8') . '"'
                    : '' ?>>
                    <?php if ($hasSubjects) { ?>
                        <div class="subject-picker-toolbar" role="group" aria-label="Narrow subject list">
                            <div class="subject-picker-toolbar__field">
                                <label for="subject-teacher-filter">Teacher</label>
                                <select id="subject-teacher-filter">
                                    <option value="" selected>All teachers</option>
                                    <?php foreach ($subjectTeachers as $t) { ?>
                                        <option value="<?= (int) $t['id'] ?>">
                                            <?= htmlspecialchars($t['name']) ?>
                                        </option>
                                    <?php } ?>
                                </select>
                            </div>
                            <div class="subject-picker-toolbar__field subject-picker-toolbar__field--grow">
                                <label for="subject-search">Filter</label>
                                <input type="search" id="subject-search" autocomplete="off"
                                       placeholder="Search for subject, teacher, or schedule" inputmode="search">
                            </div>
                        </div>
                        <!-- <p class="subject-picker-hint"><?= htmlspecialchars('Subjects load when you pick a teacher, or when you type at least two characters with "All teachers" selected. With "All teachers", you can type several words (e.g. a teacher surname and part of a subject name); every word must match somewhere in the subject row.') ?></p> -->
                    <?php } ?>
                    <label for="subject_id">Select Subject</label>
                    <select id="subject_id" name="subject_id" required <?= $hasSubjects ? '' : 'disabled' ?>>
                        <?php if (!$hasSubjects) { ?>
                            <option value="" disabled selected>No subjects found</option>
                        <?php } else { ?>
                            <option value="" disabled selected>Pick a teacher or type to search</option>
                        <?php } ?>
                    </select>
                </div>
            </form>

            <div class="attendance-workspace">
                <div id="attendance-placeholder" class="qr-attendance-area qr-attendance-area--empty attendance-workspace__placeholder">
                    <p><?= $hasSubjects
                        ? 'Please select a subject to start scanning'
                        : 'No subjects available yet. Ask your teacher to add one.' ?></p>
                </div>

                <section class="manual-attendance-panel" aria-labelledby="manual-attendance-title">
                    <div class="manual-attendance-panel__header">
                        <div>
                            <h2 id="manual-attendance-title">Manual Attendance</h2>
                            <p id="manual-attendance-help" class="manual-attendance-panel__subtitle">
                                Select a subject above, then enter only your Student ID to record attendance.
                            </p>
                        </div>
                        <span class="manual-attendance-panel__badge">Alternative option</span>
                    </div>

                    <div id="manual-attendance-message" class="manual-attendance-message" role="status" aria-live="polite" hidden></div>

                    <form id="manual-attendance-form" class="manual-attendance-form" method="post" action="<?= htmlspecialchars($baseUrl . '/student/attendance') ?>" novalidate>
                        <input type="hidden" id="manual-subject-id" name="subject_id" value="">

                        <div class="manual-attendance-form__field">
                            <label for="manual-student-id">Student ID</label>
                            <input
                                type="text"
                                id="manual-student-id"
                                name="student_id"
                                placeholder="Enter your Student ID"
                                autocomplete="off"
                                inputmode="numeric"
                                pattern="[0-9]+"
                                aria-describedby="manual-attendance-help manual-attendance-message"
                                required>
                        </div>

                        <div class="manual-attendance-form__actions">
                            <button type="submit" id="manual-attendance-submit" class="button primary" disabled>Record Attendance</button>
                        </div>
                    </form>
                </section>
            </div>

            <section id="attendance-scanner" class="qr-attendance-scanner" hidden>
                <div class="qr-attendance-area qr-attendance-area--scanner">
                    <div class="qr-attendance-scanner__frame">
                        <video id="attendance-video" class="qr-attendance-scanner__video" autoplay playsinline muted></video>
                        <div class="qr-attendance-scanner__overlay" aria-hidden="true"></div>
                    </div>
                    <div class="qr-attendance-scanner__status-row">
                        <p id="attendance-scanner-message" class="qr-attendance-scanner__message" role="status" aria-live="polite">
                            Camera scanner is loading…
                        </p>
                        <button type="button" id="attendance-scanner-restart" class="button secondary qr-attendance-scanner__restart" hidden>
                            Restart scanner
                        </button>
                    </div>
                </div>
            </section>
        </section>
    </main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js"></script>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/student.js') ?>"></script>
</body>
</html>
