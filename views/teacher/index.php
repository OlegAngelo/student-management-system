<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Teacher Portal</title>
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/css/base.css') ?>">
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/css/teacher.css') ?>">
</head>
<body>
    <main class="shell"
        data-students-api="<?= htmlspecialchars($baseUrl . '/teacher/api/students', ENT_QUOTES, 'UTF-8') ?>"
        data-subjects-api="<?= htmlspecialchars($baseUrl . '/teacher/api/subjects', ENT_QUOTES, 'UTF-8') ?>">
        <h1 class="page-title">Teacher Dashboard</h1>

        <!-- student & subject container -->
        <div class="teacher-section-cards">
            <!-- Student List -->
            <section class="card">
                <div class="card-header">
                    <h2>Student List</h2>
                    <button type="button" id="add-student-toggle" class="button primary"> + Add Student</button>
                </div>
                
                <!-- student form -->
                <div id="add-student-panel" class="add-student-form-container" hidden>
                    <h3>Add New Student</h3>

                    <form id="add-student-form" class="add-student-form">
                        <!-- student id -->
                        <label for="student_id">Student ID</label>
                        <input type="text" id="student_id" name="student_id" placeholder="123456789"
                            pattern="[0-9]+" inputmode="numeric" autocomplete="off"
                            title="Student ID must contain only digits (0–9).">

                        <!-- name -->
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" placeholder="John Doe" autocomplete="off">

                        <!-- year -->
                        <label for="year">Batch Year</label>
                        <input type="text" id="year" name="year" placeholder="2027"
                            pattern="[0-9]+" inputmode="numeric" autocomplete="off"
                            title="Batch Year must contain only digits (0–9).">

                        <!-- section -->
                        <label for="section">Section</label>
                        <select id="section" name="section" required>
                            <option value="" disabled selected>Select Section</option>
                            <option value="A">Group 1</option>
                            <option value="B">Group 2</option>
                        </select>

                        <div class="action-btns">
                            <button type="submit" class="button primary">Save</button>
                            <button type="button" id="add-student-cancel" class="button secondary">Cancel</button>
                        </div>
                    </form>
                </div>

                <div class="student-list-toolbar" id="student-list-toolbar">
                    <div class="student-list-toolbar__search">
                        <label for="student-list-search" class="visually-hidden">Search students</label>
                        <input type="search" id="student-list-search" class="student-list-toolbar__input"
                            placeholder="Search by ID, name, year, or section…" autocomplete="off">
                    </div>
                    <div class="student-list-toolbar__sort">
                        <label for="student-list-sort">Sort by</label>
                        <select id="student-list-sort" class="student-list-toolbar__select">
                            <option value="name-asc">Name (A–Z)</option>
                            <option value="name-desc">Name (Z–A)</option>
                            <option value="id-asc">Student ID (ascending)</option>
                            <option value="id-desc">Student ID (descending)</option>
                            <option value="year-asc">Year (oldest first)</option>
                            <option value="year-desc">Year (newest first)</option>
                            <option value="section-asc">Section (A–Z)</option>
                            <option value="section-desc">Section (Z–A)</option>
                        </select>
                    </div>
                </div>

                <!-- student list -->
                 <div id="student-list">
                    <table class="student-list-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Batch Year</th>
                                <th>Group Section</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5">Loading students...</td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
            </section>

            <!-- Subject & Schedules List -->
            <section class="card">
                <div class="card-header">
                    <h2>Subjects and Schedules List</h2>
                    <button type="button" id="add-subject-toggle" class="button primary"> + Add Subject</button>
                </div>
                
                <!-- subject & schedule form -->
                <div id="add-subject-panel" class="add-subject-form-container" hidden>
                    <h3>Add New Subject</h3>

                    <form id="add-subject-form" class="add-subject-form">
                        <!-- subject name -->
                        <label for="subject_name">Subject Name</label>
                        <input type="text" id="subject_name" name="subject_name" placeholder="CPE 3222 - Web Development">

                        <!-- schedule time / late after: MySQL TIME columns (HH:MM:SS); HTML time value HH:MM is accepted -->
                        <label for="schedule_time">Schedule Time</label>
                        <small class="field-hint">24-hour clock (HH:MM), stored as <code>TIME</code> in the database.</small>
                        <input type="time" id="schedule_time" name="schedule_time" step="60" required>

                        <label for="late_after_time">Late After Time</label>
                        <small class="field-hint">Same format; should be after the schedule time.</small>
                        <input type="time" id="late_after_time" name="late_after_time" step="60" required>

                        <div class="action-btns">
                            <button type="submit" class="button primary">Save</button>
                            <button type="button" id="add-subject-cancel" class="button secondary">Cancel</button>
                        </div>
                    </form>
                </div>

                <div class="subject-schedule-toolbar" id="subject-schedule-toolbar">
                    <label for="subject-list-search" class="visually-hidden">Search subjects by name</label>
                    <input type="search" id="subject-list-search" class="subject-schedule-toolbar__input"
                        placeholder="Search by subject name…" autocomplete="off">
                </div>

                <!-- subject & schedule list (rendered from API) -->
                <div class="subject-schedule-list" id="subject-schedule-list" role="list">
                    <article class="subject-schedule-card" role="listitem" data-subject-name="">
                        <div class="subject-schedule-card__meta">
                            <span>Loading subjects...</span>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    </main>

    <div id="student-qr-modal" class="modal" hidden role="dialog" aria-modal="true" aria-labelledby="student-qr-modal-title">
        <button type="button" class="modal__backdrop" id="student-qr-modal-backdrop" tabindex="-1" aria-label="Close dialog"></button>
        <div class="modal__panel modal-qr-panel">
            <h2 id="student-qr-modal-title" class="modal-qr-panel__title">QR Code for</h2>
            <div class="modal-qr-panel__figure" id="student-qr-modal-container">
                <!-- QR code will be generated here -->
            </div>
            <div class="modal-qr-panel__actions">
                <button type="button" class="button primary" id="student-qr-modal-download">Download QR</button>
                <button type="button" class="button secondary" id="student-qr-modal-close">Close</button>
            </div>
        </div>
    </div>

    <!-- edit student modal -->
    <div id="student-edit-modal" class="modal" hidden role="dialog" aria-modal="true" aria-labelledby="student-edit-modal-title">
        <button type="button" class="modal__backdrop" id="student-edit-modal-backdrop" tabindex="-1" aria-label="Close dialog"></button>
        <div class="modal__panel modal-edit-panel">
            <h2 id="student-edit-modal-title" class="modal-edit-panel__title">Edit Student</h2>

            <form id="edit-student-form" class="add-student-form">
                <label for="edit_student_id">Student ID</label>
                <input type="text" id="edit_student_id" name="student_id" readonly>

                <label for="edit_name">Name</label>
                <input type="text" id="edit_name" name="name" autocomplete="off">

                <label for="edit_year">Batch Year</label>
                <input type="text" id="edit_year" name="year"
                    pattern="[0-9]+" inputmode="numeric" autocomplete="off"
                    title="Batch Year must contain only digits (0–9).">

                <label for="edit_section">Section</label>
                <select id="edit_section" name="section" required>
                    <option value="" disabled>Select Section</option>
                    <option value="A">Group 1</option>
                    <option value="B">Group 2</option>
                </select>

                <div class="action-btns">
                    <button type="submit" class="button primary">Save Changes</button>
                    <button type="button" id="student-edit-modal-close" class="button secondary">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/teacher-row-helpers.js') ?>"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/teacher.js') ?>"></script>
</body>
</html>
