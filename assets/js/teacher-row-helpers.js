// SVG icons (shared across components)
var ICONS = {
	edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
	delete: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
	qr: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z"/></svg>'
};

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function buildStudentRowActions(studentId) {
	return `
		<div class="student-row-actions">
			<button type="button" class="subject-icon-btn student-edit-btn" aria-label="Edit student ${studentId}" data-student-id="${studentId}">
				${ICONS.edit}
			</button>
			<button type="button" class="subject-icon-btn student-delete-btn" aria-label="Delete student ${studentId}" data-student-id="${studentId}">
				${ICONS.delete}
			</button>
			<button type="button" class="subject-icon-btn student-qr-open-btn" aria-label="Show QR code for student ${studentId}" data-student-id="${studentId}">
				${ICONS.qr}
			</button>
		</div>
	`;
}

function buildStudentRow(row) {
	var sid = escapeHtml(row.student_id || "");
	var name = escapeHtml(row.name || "");
	var year = escapeHtml(row.year || "");
	var section = escapeHtml(row.section || "");

	return `
		<tr data-student-id="${sid}" data-name="${name}" data-year="${year}" data-section="${section}">
			<td>${sid}</td>
			<td>${name}</td>
			<td>${year}</td>
			<td>${section}</td>
			<td class="student-list-table__actions">
				${buildStudentRowActions(sid)}
			</td>
		</tr>
	`;
}

function buildSubjectCard(subject) {
	var scheduleDisplay = subject.schedule_time.substring(0, 5);
	var lateAfterDisplay = subject.late_after_time.substring(0, 5);
	var subjectName = escapeHtml(subject.subject_name);

	return `
		<div class="subject-schedule-card" data-subject-id="${subject.id}">
			<div class="subject-schedule-card__top">
				<h3 class="subject-schedule-card__title">${subjectName}</h3>
				<div class="subject-schedule-card__actions">
					<button type="button" class="subject-icon-btn subject-edit-btn" data-subject-id="${subject.id}" aria-label="Edit ${subjectName}">
						${ICONS.edit}
					</button>
					<button type="button" class="subject-icon-btn subject-delete-btn" data-subject-id="${subject.id}" aria-label="Delete ${subjectName}">
						${ICONS.delete}
					</button>
				</div>
			</div>
			<div class="subject-schedule-card__meta">
				<span>Schedule: ${scheduleDisplay}</span>
				<span>Late after: ${lateAfterDisplay}</span>
			</div>
		</div>
	`;
}

function buildSubjectsList(subjects) {
	if (!subjects || subjects.length === 0) {
		return '<p style="color: #666;">No subjects for this teacher yet.</p>';
	}
	return subjects.map(buildSubjectCard).join("");
}

function buildAddSubjectForm(teacherId, teacherName) {
	return `
		<div class="add-subject-form-container" style="display: none; margin-top: 16px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 4px; background-color: #f9f9f9;">
			<h4 style="margin-top: 0;">Add Subject for ${escapeHtml(teacherName)}</h4>
			<form class="add-subject-form" data-teacher-id="${teacherId}">
				<input type="hidden" name="subject_id" value="">
				<input type="hidden" name="current_teacher_id" value="${teacherId}">

				<label>Subject Name</label>
				<input type="text" name="subject_name" placeholder="CPE 3222 - Web Development" required>

				<label>Schedule Time</label>
				<small class="field-hint">24-hour clock (HH:MM)</small>
				<input type="time" name="schedule_time" step="60" required>

				<label>Late After Time</label>
				<small class="field-hint">Should be after the schedule time.</small>
				<input type="time" name="late_after_time" step="60" required>

				<div class="action-btns">
					<button type="submit" class="button primary">Save</button>
					<button type="button" class="button secondary cancel-add-subject">Cancel</button>
				</div>
			</form>
		</div>
	`;
}

function buildTeacherCardHeader(teacher, subjectCount) {
	var teacherName = escapeHtml(teacher.name);
	var department = escapeHtml(teacher.department);
	var subjectLabel = subjectCount !== 1 ? "s" : "";

	return `
		<div class="teacher-card-header" style="padding: 12px; background-color: #f5f5f5; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
			<div style="display: flex; align-items: center; flex: 1;">
				<span class="disclosure-triangle" style="display: inline-block; margin-right: 8px; font-size: 12px; transition: transform 0.2s;">▶</span>
				<strong>${teacherName}</strong>
				<span style="color: #666; margin-left: 8px;">(${department} Department)</span>
				<span class="subject-count-badge" style="display: inline-block; margin-left: 12px; background-color: #e0e0e0; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
					${subjectCount} subject${subjectLabel}
				</span>
			</div>
		</div>
	`;
}

function buildTeacherCard(teacher, subjectsByTeacher) {
	var teacherSubjects = subjectsByTeacher[teacher.id] || [];
	var subjectCount = teacherSubjects.length;
	var subjectsList = buildSubjectsList(teacherSubjects);
	var addSubjectForm = buildAddSubjectForm(teacher.id, teacher.name);
	var header = buildTeacherCardHeader(teacher, subjectCount);

	return `
		<div class="teacher-card" data-teacher-id="${teacher.id}" style="border: 1px solid #ddd; border-radius: 4px; margin-bottom: 16px; overflow: hidden;">
			${header}
			<div class="teacher-card-content" style="display: none; padding: 16px; border-top: 1px solid #ddd;">
				<button type="button" class="add-subject-btn button secondary" data-teacher-id="${teacher.id}" style="margin-bottom: 12px;">+ Add Subject</button>
				<div class="subjects-list" style="margin-bottom: 16px;">
					${subjectsList}
				</div>
				${addSubjectForm}
			</div>
		</div>
	`;
}

function buildTeacherModalRow(teacher) {
	var teacherName = escapeHtml(teacher.name);
	var department = escapeHtml(teacher.department);

	return `
		<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
			<div>
				<strong>${teacherName}</strong> - ${department} Department
			</div>
			<div style="display: flex; gap: 4px;">
				<button type="button" class="teacher-edit-btn" data-teacher-id="${teacher.id}" style="padding: 4px 8px; font-size: 12px;">Edit</button>
				<button type="button" class="teacher-delete-btn" data-teacher-id="${teacher.id}" style="padding: 4px 8px; font-size: 12px; background-color: #dc3545; color: white;">Delete</button>
			</div>
		</div>
	`;
}
