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
        data-subjects-api="<?= htmlspecialchars($baseUrl . '/teacher/api/subjects', ENT_QUOTES, 'UTF-8') ?>"
        data-teachers-api="<?= htmlspecialchars($baseUrl . '/teacher/api/teachers', ENT_QUOTES, 'UTF-8') ?>">
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

            <!-- Teachers & Their Schedules -->
            <section class="card">
                <div class="card-header">
                    <h2>Teacher and Schedule List</h2>
                    <button type="button" id="open-teacher-modal-btn" class="button primary"> + Add/Manage Teachers</button>
                </div>

                <!-- teachers list container (hierarchical: teachers with nested subjects) -->
                <div id="teachers-list-container" class="teachers-list" role="list">
                    <div style="text-align: center; padding: 24px; color: #666;">
                        <p>Loading teachers...</p>
                    </div>
                </div>
            </section>
        </div>

        <!-- teacher management modal -->
        <div id="teacher-modal" class="modal" hidden role="dialog" aria-modal="true" aria-labelledby="teacher-modal-title">
            <button type="button" class="modal__backdrop" id="teacher-modal-backdrop" tabindex="-1" aria-label="Close dialog"></button>
            <div class="modal__panel modal-edit-panel">
                <h2 id="teacher-modal-title" class="modal-edit-panel__title">Manage Teachers</h2>

                <form id="teacher-form" class="add-student-form">
                    <input type="hidden" id="teacher_edit_id" name="teacher_id" value="">

                    <label for="teacher_edit_name">Teacher Name</label>
                    <input type="text" id="teacher_edit_name" name="name" placeholder="Dr. Angelo Balagtas" autocomplete="off" required>

                    <label for="teacher_edit_department">Department</label>
                    <input type="text" id="teacher_edit_department" name="department" placeholder="Computer Engineering" autocomplete="off" required>

                    <div class="action-btns">
                        <button type="submit" class="button primary" id="teacher-form-submit">Save Teacher</button>
                        <button type="button" id="teacher-modal-close" class="button secondary">Close</button>
                    </div>
                </form>

                <!-- teachers list for management -->
                <div id="teachers-management-container" style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #ddd;">
                    <h3 style="margin-bottom: 12px;">Existing Teachers</h3>
                    <div id="teachers-management-list" style="max-height: 300px; overflow-y: auto;">
                        <p style="color: #666;">Loading teachers...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- template for inline subject form (cloned for each teacher) -->
        <template id="subject-form-template">
            <div class="add-subject-form-container" style="margin: 16px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 4px; background-color: #f9f9f9;">
                <h4 style="margin-top: 0;">Add Subject</h4>
                <form class="add-subject-form" data-teacher-id="">
                    <input type="hidden" name="subject_id" value="">
                    <input type="hidden" name="current_teacher_id" value="">

                    <label for="subject_name_teacher">Subject Name</label>
                    <input type="text" name="subject_name" placeholder="CPE 3222 - Web Development" required>

                    <label for="schedule_time_teacher">Schedule Time</label>
                    <small class="field-hint">24-hour clock (HH:MM)</small>
                    <input type="time" name="schedule_time" step="60" required>

                    <label for="late_after_time_teacher">Late After Time</label>
                    <small class="field-hint">Same format; should be after the schedule time.</small>
                    <input type="time" name="late_after_time" step="60" required>

                    <div class="action-btns">
                        <button type="submit" class="button primary">Save</button>
                        <button type="button" class="button secondary cancel-add-subject">Cancel</button>
                    </div>
                </form>
            </div>
        </template>

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

    <!-- Core utilities (required by all modules) -->
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/ui-helpers.js') ?>"></script>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/api-client.js') ?>"></script>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/teacher-row-helpers.js') ?>"></script>

    <!-- Feature modules (order matters: dependencies first) -->
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/teacher-dashboard.js') ?>"></script>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/teacher-student-qr.js') ?>"></script>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/teacher-student-crud.js') ?>"></script>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/teacher-hierarchy.js') ?>"></script>
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/teacher-hierarchy-crud.js') ?>"></script>

    <!-- External library for QR code generation -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

    <!-- Entry point (initializes all modules) -->
    <script src="<?= htmlspecialchars($baseUrl . '/assets/js/teacher.js') ?>"></script>
</body>
</html>
