<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Teacher Portal</title>
    <link rel="stylesheet" href="<?= htmlspecialchars($baseUrl . '/assets/style.css') ?>">
</head>
<body>
    <main class="shell">
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

                    <form class="add-student-form">
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

                <!-- student list -->
                 <div id="student-list">
                    <table class="student-list-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Year</th>
                                <th>Section</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2024100001</td>
                                <td>Juan Dela Cruz</td>
                                <td>2024</td>
                                <td>A</td>
                                <td class="student-list-table__actions">
                                    <div class="student-row-actions">
                                        <button type="button" class="subject-icon-btn" aria-label="Edit student 2024100001">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        </button>
                                        <button type="button" class="subject-icon-btn" aria-label="Delete student 2024100001">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                        </button>
                                        <button type="button" class="subject-icon-btn student-qr-open-btn" aria-label="Show QR code for student 2024100001" data-student-id="2024100001" data-student-name="Juan Dela Cruz">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z"/></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>2024100002</td>
                                <td>Maria Santos</td>
                                <td>2024</td>
                                <td>B</td>
                                <td class="student-list-table__actions">
                                    <div class="student-row-actions">
                                        <button type="button" class="subject-icon-btn" aria-label="Edit student 2024100002">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        </button>
                                        <button type="button" class="subject-icon-btn" aria-label="Delete student 2024100002">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                        </button>
                                        <button type="button" class="subject-icon-btn student-qr-open-btn" aria-label="Show QR code for student 2024100002" data-student-id="2024100002" data-student-name="Maria Santos">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z"/></svg>
                                        </button>
                                    </div>
                                </td>
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

                    <form class="add-subject-form">
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

                <!-- subject & schedule list (static sample data) -->
                <div class="subject-schedule-list" role="list">
                    <article class="subject-schedule-card" role="listitem">
                        <div class="subject-schedule-card__top">
                            <h3 class="subject-schedule-card__title">Mathematics</h3>
                            <div class="subject-schedule-card__actions">
                                <button type="button" class="subject-icon-btn" aria-label="Edit Mathematics">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button type="button" class="subject-icon-btn" aria-label="Delete Mathematics">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="subject-schedule-card__meta">
                            <span>Schedule: 08:00</span>
                            <span>Late after: 08:15</span>
                        </div>
                    </article>

                    <article class="subject-schedule-card" role="listitem">
                        <div class="subject-schedule-card__top">
                            <h3 class="subject-schedule-card__title">Physics</h3>
                            <div class="subject-schedule-card__actions">
                                <button type="button" class="subject-icon-btn" aria-label="Edit Physics">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button type="button" class="subject-icon-btn" aria-label="Delete Physics">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="subject-schedule-card__meta">
                            <span>Schedule: 10:00</span>
                            <span>Late after: 10:15</span>
                        </div>
                    </article>

                    <article class="subject-schedule-card" role="listitem">
                        <div class="subject-schedule-card__top">
                            <h3 class="subject-schedule-card__title">Chemistry</h3>
                            <div class="subject-schedule-card__actions">
                                <button type="button" class="subject-icon-btn" aria-label="Edit Chemistry">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button type="button" class="subject-icon-btn" aria-label="Delete Chemistry">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="subject-schedule-card__meta">
                            <span>Schedule: 13:00</span>
                            <span>Late after: 13:15</span>
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
            <div class="modal-qr-panel__figure">
                <img
                    id="student-qr-modal-img"
                    class="modal-qr-panel__qr-img"
                    src="https://api.qrserver.com/v1/create-qr-code/?size=280x280&amp;margin=8&amp;data=student-management%3Apreview"
                    width="280"
                    height="280"
                    alt=""
                    decoding="async"
                    referrerpolicy="no-referrer-when-downgrade"
                >
            </div>
            <button type="button" class="modal-qr-panel__close" id="student-qr-modal-close">Close</button>
        </div>
    </div>

    <script src="<?= htmlspecialchars($baseUrl . '/assets/script.js') ?>"></script>
</body>
</html>
