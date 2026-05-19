/**
 * Teacher Student CRUD Module
 * Handles add, edit, and delete student operations
 * Dependencies: api-client.js, ui-helpers.js
 */
window.TeacherStudentCRUD = (function () {
	"use strict";

	function showAddStudentForm() {
		window.UIHelpers.showForm("add-student-panel");
	}

	function hideAddStudentForm() {
		window.UIHelpers.hideForm("add-student-panel", "add-student-form");
	}

	function initAddStudentForm() {
		var form = document.getElementById("add-student-form");
		if (!form) {
			return;
		}

		var shell = document.querySelector("main.shell[data-students-api]");
		if (!shell) {
			return;
		}

		var studentsApi = shell.getAttribute("data-students-api");
		if (!studentsApi) {
			return;
		}

		form.addEventListener("submit", function (e) {
			e.preventDefault();

			var studentId = document.getElementById("student_id").value.trim();
			var name = document.getElementById("name").value.trim();
			var year = document.getElementById("year").value.trim();
			var section = document.getElementById("section").value.trim();

			if (!studentId || !name || !year || !section) {
				alert("All fields are required");
				return;
			}

			window.ApiClient.post(studentsApi, {
				student_id: studentId,
				name: name,
				year: year,
				section: section,
			})
				.then(function () {
					hideAddStudentForm();
					window.UIHelpers.showSuccess("Student added successfully.");
					window.TeacherDashboard.reload();
				})
				.catch(function (error) {
					window.ApiClient.handleError(error);
				});
		});
	}

	function initDeleteStudent() {
		var studentList = document.getElementById("student-list");
		if (!studentList) {
			return;
		}

		var shell = document.querySelector("main.shell[data-students-api]");
		if (!shell) {
			return;
		}

		var studentsApi = shell.getAttribute("data-students-api");
		if (!studentsApi) {
			return;
		}

		studentList.addEventListener("click", function (e) {
			var btn = e.target.closest(".student-delete-btn");
			if (!btn || !studentList.contains(btn)) {
				return;
			}

			var studentId = btn.getAttribute("data-student-id") || "";
			if (!studentId) {
				return;
			}

			if (!confirm("Delete student " + studentId + "? This cannot be undone.")) {
				return;
			}

			window.ApiClient.put(studentsApi, {
				method: "DELETE",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: studentId }),
			})
				.then(function (response) {
					return response.json().then(function (data) {
						if (!response.ok) {
							throw new Error(data.error || "Failed to delete student");
						}
						return data;
					});
				})
				.then(function () {
					alert("Student deleted successfully.");
					window.TeacherDashboard.reload();
				})
				.catch(function (error) {
					alert("Error: " + error.message);
				});
		});
	}

	function initEditStudentModal() {
		var modal = document.getElementById("student-edit-modal");
		if (!modal) {
			return;
		}

		var closeBtn = document.getElementById("student-edit-modal-close");
		var backdrop = document.getElementById("student-edit-modal-backdrop");
		var studentList = document.getElementById("student-list");

		var shell = document.querySelector("main.shell[data-students-api]");
		if (!shell) {
			return;
		}

		var studentsApi = shell.getAttribute("data-students-api");
		if (!studentsApi) {
			return;
		}

		function openModal(btn) {
			var row = btn.closest("tr");
			document.getElementById("edit_student_id").value =
				btn.getAttribute("data-student-id") || "";
			document.getElementById("edit_name").value = row
				? row.getAttribute("data-name") || ""
				: "";
			document.getElementById("edit_year").value = row
				? row.getAttribute("data-year") || ""
				: "";
			document.getElementById("edit_section").value = row
				? row.getAttribute("data-section") || ""
				: "";
			modal.removeAttribute("hidden");
			document.body.style.overflow = "hidden";
			document.getElementById("edit_name").focus();
		}

		function closeModal() {
			modal.setAttribute("hidden", "");
			document.body.style.overflow = "";
			var form = document.getElementById("edit-student-form");
			if (form) {
				form.reset();
			}
		}

		function onKeydown(e) {
			if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
				closeModal();
			}
		}

		if (studentList) {
			studentList.addEventListener("click", function (e) {
				var btn = e.target.closest(".student-edit-btn");
				if (!btn || !studentList.contains(btn)) {
					return;
				}
				openModal(btn);
			});
		}

		if (closeBtn) {
			closeBtn.addEventListener("click", closeModal);
		}
		if (backdrop) {
			backdrop.addEventListener("click", closeModal);
		}

		document.addEventListener("keydown", onKeydown);

		var form = document.getElementById("edit-student-form");
		if (form) {
			form.addEventListener("submit", function (e) {
				e.preventDefault();

				var studentId = document.getElementById("edit_student_id").value.trim();
				var name = document.getElementById("edit_name").value.trim();
				var year = document.getElementById("edit_year").value.trim();
				var section = document.getElementById("edit_section").value.trim();

				if (!studentId || !name || !year || !section) {
					alert("All fields are required.");
					return;
				}

				window.ApiClient.put(studentsApi, {
					method: "PUT",
					credentials: "same-origin",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						student_id: studentId,
						name: name,
						year: year,
						section: section,
					}),
				})
					.then(function (response) {
						return response.json().then(function (data) {
							if (!response.ok) {
								throw new Error(data.error || "Failed to update student");
							}
							return data;
						});
					})
					.then(function () {
						closeModal();
						alert("Student updated successfully.");
						window.TeacherDashboard.reload();
					})
					.catch(function (error) {
						alert("Error: " + error.message);
					});
			});
		}
	}

	// Public API
	return {
		init: function () {
			var toggleBtn = document.getElementById("add-student-toggle");
			var cancelBtn = document.getElementById("add-student-cancel");

			if (toggleBtn) {
				toggleBtn.addEventListener("click", showAddStudentForm);
			}
			if (cancelBtn) {
				cancelBtn.addEventListener("click", hideAddStudentForm);
			}

			initAddStudentForm();
			initDeleteStudent();
			initEditStudentModal();
		}
	};
})();
