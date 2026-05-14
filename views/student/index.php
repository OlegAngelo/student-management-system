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
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/student.js') ?>"></script>
</body>
</html>
