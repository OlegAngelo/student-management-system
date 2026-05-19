/**
 * Teacher Student CRUD Module
 * Handles add, edit, and delete student operations
 * Dependencies: api-client.js, ui-helpers.js, teacher-dashboard.js
 * @module TeacherStudentCRUD
 */

window.TeacherStudentCRUD = (() => {
	"use strict";

	const showAddStudentForm = () =>
		window.UIHelpers.showForm("add-student-panel");

	const hideAddStudentForm = () => {
		window.UIHelpers.hideForm("add-student-panel", "add-student-form");
	};

	/**
	 * Initialize add student form handler
	 * @returns {void}
	 */
	const initAddStudentForm = () => {
		const form = document.getElementById("add-student-form");
		if (!form) return;

		const shell = document.querySelector("main.shell[data-students-api]");
		const studentsApi = shell?.getAttribute("data-students-api");
		if (!studentsApi) return;

		form.addEventListener("submit", (event) => {
			event.preventDefault();

			const studentId = document.getElementById("student_id").value.trim();
			const name = document.getElementById("name").value.trim();
			const year = document.getElementById("year").value.trim();
			const section = document.getElementById("section").value.trim();

			if (!studentId || !name || !year || !section) {
				alert("All fields are required");
				return;
			}

			window.ApiClient.post(studentsApi, {
				student_id: studentId,
				name,
				year,
				section,
			})
				.then(() => {
					hideAddStudentForm();
					alert("Student added successfully.");
					window.TeacherDashboard.reload();
				})
				.catch((error) => window.ApiClient.handleError(error));
		});
	};

	/**
	 * Initialize delete student handler
	 * @returns {void}
	 */
	const initDeleteStudent = () => {
		const studentList = document.getElementById("student-list");
		const shell = document.querySelector("main.shell[data-students-api]");
		const studentsApi = shell?.getAttribute("data-students-api");

		if (!studentList || !studentsApi) return;

		studentList.addEventListener("click", (event) => {
			const btn = event.target.closest(".student-delete-btn");
			const studentId = btn?.getAttribute("data-student-id");

			if (!studentId || !studentList.contains(btn)) return;

			if (!confirm(`Delete student ${studentId}? This cannot be undone.`)) return;

			window.ApiClient.delete(studentsApi, { student_id: studentId })
				.then(() => {
					alert("Student deleted successfully.");
					window.TeacherDashboard.reload();
				})
				.catch((error) => alert(`Error: ${error.message}`));
		});
	};

	/**
	 * Initialize edit student modal
	 * @returns {void}
	 */
	const initEditStudentModal = () => {
		const modal = document.getElementById("student-edit-modal");
		const closeBtn = document.getElementById("student-edit-modal-close");
		const backdrop = document.getElementById("student-edit-modal-backdrop");
		const studentList = document.getElementById("student-list");
		const shell = document.querySelector("main.shell[data-students-api]");
		const studentsApi = shell?.getAttribute("data-students-api");

		if (!modal || !studentsApi) return;

		const openModal = (btn) => {
			const row = btn.closest("tr");
			document.getElementById("edit_student_id").value =
				btn.getAttribute("data-student-id") ?? "";
			document.getElementById("edit_name").value =
				row?.getAttribute("data-name") ?? "";
			document.getElementById("edit_year").value =
				row?.getAttribute("data-year") ?? "";
			document.getElementById("edit_section").value =
				row?.getAttribute("data-section") ?? "";
			modal.removeAttribute("hidden");
			document.body.style.overflow = "hidden";
			document.getElementById("edit_name").focus();
		};

		const closeEditModal = () => {
			modal.setAttribute("hidden", "");
			document.body.style.overflow = "";
			document.getElementById("edit-student-form")?.reset();
		};

		const onKeydown = (event) => {
			if (event.key === "Escape" && !modal.hasAttribute("hidden")) {
				closeEditModal();
			}
		};

		// Wire edit button
		if (studentList) {
			studentList.addEventListener("click", (event) => {
				const btn = event.target.closest(".student-edit-btn");
				if (btn?.dataset.studentId && studentList.contains(btn)) {
					openModal(btn);
				}
			});
		}

		// Wire modal controls
		if (closeBtn) closeBtn.addEventListener("click", closeEditModal);
		if (backdrop) backdrop.addEventListener("click", closeEditModal);
		document.addEventListener("keydown", onKeydown);

		// Wire form submission
		const form = document.getElementById("edit-student-form");
		if (form) {
			form.addEventListener("submit", (event) => {
				event.preventDefault();

				const studentId = document.getElementById("edit_student_id").value.trim();
				const name = document.getElementById("edit_name").value.trim();
				const year = document.getElementById("edit_year").value.trim();
				const section = document.getElementById("edit_section").value.trim();

				if (!studentId || !name || !year || !section) {
					alert("All fields are required.");
					return;
				}

				window.ApiClient.put(studentsApi, {
					student_id: studentId,
					name,
					year,
					section,
				})
					.then(() => {
						closeEditModal();
						alert("Student updated successfully.");
						window.TeacherDashboard.reload();
					})
					.catch((error) => alert(`Error: ${error.message}`));
			});
		}
	};

	// Public API
	return Object.freeze({
		init: () => {
			const toggleBtn = document.getElementById("add-student-toggle");
			const cancelBtn = document.getElementById("add-student-cancel");

			if (toggleBtn) toggleBtn.addEventListener("click", showAddStudentForm);
			if (cancelBtn) cancelBtn.addEventListener("click", hideAddStudentForm);

			initAddStudentForm();
			initDeleteStudent();
			initEditStudentModal();
		},
	});
})();
