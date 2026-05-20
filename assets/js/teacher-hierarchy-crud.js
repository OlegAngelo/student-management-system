/**
 * Teacher Hierarchy CRUD Module
 * Handles add, edit, delete operations for teachers and subjects
 * Dependencies: api-client.js, ui-helpers.js, teacher-row-helper.js
 */
window.TeacherHierarchyCRUD = (function () {
	"use strict";

	var subjectActionsBound = false;
	var subjectFormHandlersBound = false;

	function attachSubjectActions() {
		if (subjectActionsBound) {
			return;
		}
		subjectActionsBound = true;

		document.addEventListener("click", function (e) {
			if (e.target.closest(".subject-edit-btn")) {
				var btn = e.target.closest(".subject-edit-btn");
				var subjectId = btn.getAttribute("data-subject-id");
				if (subjectId) {
					loadSubjectForEdit(subjectId);
				}
			}

			if (e.target.closest(".subject-delete-btn")) {
				var btn = e.target.closest(".subject-delete-btn");
				var subjectId = btn.getAttribute("data-subject-id");
				if (subjectId && confirm("Delete this subject? This cannot be undone.")) {
					deleteSubject(subjectId);
				}
			}
		});
	}

	function loadSubjectForEdit(subjectId) {
		var shell = document.querySelector("main.shell[data-subjects-api]");
		if (!shell) {
			return;
		}

		var subjectsApi = shell.getAttribute("data-subjects-api");
		if (!subjectsApi) {
			return;
		}

		window.ApiClient.get(subjectsApi)
			.then(function (data) {
				var subjects = data && data.subjects ? data.subjects : [];
				var subject = subjects.find(function (s) {
					return s.id == subjectId;
				});

				if (subject) {
					window.TeacherHierarchy.attachSubjectToTeacher(subject.teacher_id);

					var form = document.querySelector(
						'.add-subject-form[data-teacher-id="' + subject.teacher_id + '"]',
					);

					if (form) {
						form.querySelector('input[name="subject_id"]').value = subject.id;
						form.querySelector('input[name="subject_name"]').value =
							subject.subject_name;
						form.querySelector('input[name="schedule_time"]').value =
							subject.schedule_time.substring(0, 5);
						form.querySelector('input[name="late_after_time"]').value =
							subject.late_after_time.substring(0, 5);
						var submitBtn = form.querySelector('button[type="submit"]');
						if (submitBtn) {
							submitBtn.textContent = "Update Subject";
						}
					}
				}
			})
			.catch(function (error) {
				alert("Error loading subject: " + error.message);
			});
	}

	function deleteSubject(subjectId) {
		var shell = document.querySelector("main.shell[data-subjects-api]");
		if (!shell) {
			return;
		}

		var subjectsApi = shell.getAttribute("data-subjects-api");
		if (!subjectsApi) {
			return;
		}

		window.ApiClient.delete(subjectsApi, { id: parseInt(subjectId) })
			.then(function () {
				alert("Subject deleted successfully.");
				window.TeacherHierarchy.reload();
			})
			.catch(function (error) {
				alert("Error: " + error.message);
			});
	}

	function attachSubjectFormHandlers() {
		if (subjectFormHandlersBound) {
			return;
		}
		subjectFormHandlersBound = true;

		var shell = document.querySelector("main.shell[data-subjects-api]");
		if (!shell) {
			return;
		}

		var subjectsApi = shell.getAttribute("data-subjects-api");
		if (!subjectsApi) {
			return;
		}

		document.addEventListener("submit", function (e) {
			var form = e.target.closest(".add-subject-form");
			if (!form) {
				return;
			}
			handleSubjectFormSubmit(e, subjectsApi, form);
		});

		document.addEventListener("click", function (e) {
			var btn = e.target.closest(".cancel-add-subject");
			if (!btn) {
				return;
			}
			e.preventDefault();
			var form = btn.closest(".add-subject-form");
			if (form) {
				var teacherId =
					form.getAttribute("data-teacher-id") ||
					form.querySelector('input[name="current_teacher_id"]').value;
				window.TeacherHierarchy.hideSubjectForm(teacherId);
			}
		});
	}

	function handleSubjectFormSubmit(e, subjectsApi, form) {
		e.preventDefault();

		var subjectId = form.querySelector('input[name="subject_id"]').value.trim();
		var subjectName = form
			.querySelector('input[name="subject_name"]')
			.value.trim();
		var teacherId =
			parseInt(form.getAttribute("data-teacher-id")) ||
			parseInt(form.querySelector('input[name="current_teacher_id"]').value);
		var scheduleTime = form
			.querySelector('input[name="schedule_time"]')
			.value.trim();
		var lateAfterTime = form
			.querySelector('input[name="late_after_time"]')
			.value.trim();

		if (!subjectName || !scheduleTime || !lateAfterTime) {
			alert("Subject name, schedule time, and late after time are required");
			return;
		}

		var payload = {
			subject_name: subjectName,
			teacher_id: teacherId,
			schedule_time: scheduleTime,
			late_after_time: lateAfterTime,
		};

		var apiRequest;
		if (subjectId) {
			payload.id = parseInt(subjectId);
			apiRequest = window.ApiClient.put(subjectsApi, payload);
		} else {
			apiRequest = window.ApiClient.post(subjectsApi, payload);
		}

		apiRequest
			.then(function () {
				window.TeacherHierarchy.hideSubjectForm(teacherId);
				alert(
					subjectId
						? "Subject updated successfully."
						: "Subject added successfully.",
				);
				window.TeacherHierarchy.reload();
			})
			.catch(function (error) {
				alert("Error: " + error.message);
			});
	}

	function loadTeachers() {
		var shell = document.querySelector("main.shell[data-teachers-api]");
		if (!shell) {
			return;
		}

		var teachersApi = shell.getAttribute("data-teachers-api");
		if (!teachersApi) {
			return;
		}

		window.ApiClient.get(teachersApi)
			.then(function (data) {
				var teachers = data && data.teachers ? data.teachers : [];
				renderTeachersInModal(teachers);
			})
			.catch(function () {
				renderTeachersInModal([]);
			});

		window.TeacherHierarchy.reload();
	}

	function renderTeachersInModal(teachers) {
		var container = document.getElementById("teachers-management-list");
		if (!container) {
			return;
		}

		if (!teachers || !teachers.length) {
			container.innerHTML = '<p style="color: #666;">No teachers yet.</p>';
			return;
		}

		var html = teachers
			.map(function (teacher) {
				return buildTeacherModalRow(teacher);
			})
			.join("");

		container.innerHTML = html;
	}

	function resetTeacherForm() {
		document.getElementById("teacher_edit_id").value = "";
		document.getElementById("teacher_edit_name").value = "";
		document.getElementById("teacher_edit_department").value = "";
		document.getElementById("teacher-form-submit").textContent = "Add Teacher";
	}

	function openTeacherModal() {
		window.UIHelpers.openModal(
			"teacher-modal",
			document.getElementById("teacher_edit_name"),
		);
	}

	function closeTeacherModal() {
		window.UIHelpers.closeModal("teacher-modal");
	}

	function loadTeacherForEdit(teacherId) {
		var shell = document.querySelector("main.shell[data-teachers-api]");
		if (!shell) {
			return;
		}

		var teachersApi = shell.getAttribute("data-teachers-api");
		if (!teachersApi) {
			return;
		}

		window.ApiClient.get(teachersApi)
			.then(function (data) {
				var teachers = data && data.teachers ? data.teachers : [];
				var teacher = teachers.find(function (t) {
					return t.id == teacherId;
				});

				if (teacher) {
					document.getElementById("teacher_edit_id").value = teacher.id;
					document.getElementById("teacher_edit_name").value = teacher.name;
					document.getElementById("teacher_edit_department").value =
						teacher.department;
					document.getElementById("teacher-form-submit").textContent =
						"Update Teacher";
					openTeacherModal();
				}
			})
			.catch(function (error) {
				alert("Error loading teacher: " + error.message);
			});
	}

	function deleteTeacher(teacherId, teachersApi, subjectCount) {
		window.ApiClient.delete(teachersApi, { id: parseInt(teacherId) })
			.then(function () {
				if (subjectCount > 0) {
					alert(
						"Teacher deleted. " +
							subjectCount +
							" subject" +
							(subjectCount !== 1 ? "s" : "") +
							" removed as well.",
					);
					return;
				}
				alert("Teacher deleted successfully.");
				loadTeachers();
			})
			.catch(function (error) {
				alert("Error: " + error.message);
			});
	}

	function initTeacherModal() {
		var modal = document.getElementById("teacher-modal");
		var form = document.getElementById("teacher-form");
		var closeBtn = document.getElementById("teacher-modal-close");
		var backdrop = document.getElementById("teacher-modal-backdrop");
		var openBtn = document.getElementById("open-teacher-modal-btn");

		var shell = document.querySelector("main.shell[data-teachers-api]");
		if (!shell) {
			return;
		}

		var teachersApi = shell.getAttribute("data-teachers-api");
		if (!teachersApi) {
			return;
		}

		if (closeBtn) {
			closeBtn.addEventListener("click", closeTeacherModal);
		}

		if (openBtn) {
			openBtn.addEventListener("click", function () {
				resetTeacherForm();
				openTeacherModal();
			});
		}

		if (backdrop) {
			backdrop.addEventListener("click", closeTeacherModal);
		}

		if (form) {
			form.addEventListener("submit", function (e) {
				e.preventDefault();

				var teacherId = document.getElementById("teacher_edit_id").value.trim();
				var name = document.getElementById("teacher_edit_name").value.trim();
				var department = document
					.getElementById("teacher_edit_department")
					.value.trim();

				if (!name || !department) {
					alert("Teacher name and department are required");
					return;
				}

				var payload = {
					name: name,
					department: department,
				};

				var apiRequest;
				if (teacherId) {
					payload.id = parseInt(teacherId);
					apiRequest = window.ApiClient.put(teachersApi, payload);
				} else {
					apiRequest = window.ApiClient.post(teachersApi, payload);
				}

				apiRequest
					.then(function () {
						loadTeachers();
						closeTeacherModal();
						alert(
							teacherId
								? "Teacher updated successfully."
								: "Teacher added successfully.",
						);
					})
					.catch(function (error) {
						alert("Error: " + error.message);
					});
			});
		}

		document.addEventListener("click", function (e) {
			if (e.target.closest(".teacher-edit-btn")) {
				var btn = e.target.closest(".teacher-edit-btn");
				var tid = btn.getAttribute("data-teacher-id");
				if (tid) {
					loadTeacherForEdit(tid);
				}
			}
		});

		document.addEventListener("click", function (e) {
			if (e.target.closest(".teacher-delete-btn")) {
				var btn = e.target.closest(".teacher-delete-btn");
				var tid = btn.getAttribute("data-teacher-id");
				var subjectCount =
					parseInt(btn.getAttribute("data-subject-count"), 10) || 0;
				var message =
					subjectCount > 0
						? "This teacher has " +
							subjectCount +
							" subject" +
							(subjectCount !== 1 ? "s" : "") +
							" assigned. Deleting will remove them too. Continue?"
						: "Delete this teacher? This cannot be undone.";
				if (tid && confirm(message)) {
					deleteTeacher(tid, teachersApi, subjectCount);
				}
			}
		});

		loadTeachers();
	}

	// Public API
	return {
		init: function () {
			initTeacherModal();
		},
		attachSubjectActions: function () {
			attachSubjectActions();
		},
		attachSubjectFormHandlers: function () {
			attachSubjectFormHandlers();
		},
	};
})();
