function escapeHtml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function buildStudentRowActions(studentId) {
	var editSvg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
	var deleteSvg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';
	var qrSvg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z"/></svg>';

	return (
		'<div class="student-row-actions">' +
		'<button type="button" class="subject-icon-btn" aria-label="Edit student ' +
		studentId +
		'">' +
		editSvg +
		"</button>" +
		'<button type="button" class="subject-icon-btn student-delete-btn" aria-label="Delete student ' +
		studentId +
		'" data-student-id="' +
		studentId +
		'">' +
		deleteSvg +
		"</button>" +
		'<button type="button" class="subject-icon-btn student-qr-open-btn" aria-label="Show QR code for student ' +
		studentId +
		'" data-student-id="' +
		studentId +
		'">' +
		qrSvg +
		"</button>" +
		"</div>"
	);
}

function buildStudentRow(row) {
	var sid = escapeHtml(row.student_id || "");
	var name = escapeHtml(row.name || "");
	var year = escapeHtml(row.year || "");
	var section = escapeHtml(row.section || "");

	return (
		'<tr data-student-id="' +
		sid +
		'" data-name="' +
		name +
		'" data-year="' +
		year +
		'" data-section="' +
		section +
		'">' +
		"<td>" +
		sid +
		"</td>" +
		"<td>" +
		name +
		"</td>" +
		"<td>" +
		year +
		"</td>" +
		"<td>" +
		section +
		"</td>" +
		'<td class="student-list-table__actions">' +
		buildStudentRowActions(sid) +
		"</td>" +
		"</tr>"
	);
}
