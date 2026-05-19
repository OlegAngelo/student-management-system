/**
 * Teacher Hierarchy Module
 * Handles loading and rendering teacher/subject hierarchy
 * Dependencies: api-client.js, teacher-row-helpers.js
 */
window.TeacherHierarchy = (function () {
	"use strict";

	function renderTeachersList(teachers, subjectsByTeacher) {
		var container = document.getElementById("teachers-list-container");
		if (!container || !teachers) {
			return;
		}

		if (!teachers.length) {
			container.innerHTML =
				'<div class="empty-state"><p>No teachers yet. Click the "+ Add/Manage Teachers" button to add one.</p></div>';
			return;
		}

		var html = teachers
			.map(function (teacher) {
				return buildTeacherCard(teacher, subjectsByTeacher);
			})
			.join("");

		container.innerHTML = html;

		document.querySelectorAll(".teacher-card-header").forEach(function (header) {
			header.addEventListener("click", function () {
				var card = header.closest(".teacher-card");
				if (card) {
					toggleTeacherCard(card);
				}
			});
		});

		document.querySelectorAll(".add-subject-btn").forEach(function (btn) {
			btn.addEventListener("click", function () {
				var teacherId = btn.getAttribute("data-teacher-id");
				if (teacherId) {
					attachSubjectToTeacher(teacherId);
				}
			});
		});

		window.TeacherHierarchyCRUD.attachSubjectActions();
		window.TeacherHierarchyCRUD.attachSubjectFormHandlers();
	}

	function toggleTeacherCard(cardElement) {
		var header = cardElement.querySelector(".teacher-card-header");
		var content = cardElement.querySelector(".teacher-card-content");
		var triangle = cardElement.querySelector(".disclosure-triangle");

		if (!header || !content) {
			return;
		}

		var isExpanded = content.style.display !== "none";

		if (isExpanded) {
			content.style.display = "none";
			if (triangle) {
				triangle.style.transform = "rotate(0deg)";
			}
		} else {
			content.style.display = "block";
			if (triangle) {
				triangle.style.transform = "rotate(90deg)";
			}
		}
	}

	function attachSubjectToTeacher(teacherId) {
		var card = document.querySelector(
			'.teacher-card[data-teacher-id="' + teacherId + '"]',
		);
		if (!card) {
			return;
		}

		var formContainer = card.querySelector(".add-subject-form-container");
		var btn = card.querySelector(".add-subject-btn");
		if (!formContainer) {
			return;
		}

		formContainer.style.display = "block";
		var form = formContainer.querySelector("form");
		if (form) {
			var firstInput = form.querySelector("input[name='subject_name']");
			if (firstInput) {
				firstInput.focus();
			}
		}

		if (btn) {
			btn.style.display = "none";
		}
	}

	function hideSubjectFormForTeacher(teacherId) {
		var card = document.querySelector(
			'.teacher-card[data-teacher-id="' + teacherId + '"]',
		);
		if (!card) {
			return;
		}

		var formContainer = card.querySelector(".add-subject-form-container");
		var btn = card.querySelector(".add-subject-btn");
		if (!formContainer) {
			return;
		}

		formContainer.style.display = "none";
		var form = formContainer.querySelector("form");
		if (form) {
			form.reset();
		}

		if (btn) {
			btn.style.display = "block";
		}
	}

	function loadTeachersWithSubjects() {
		var shell = document.querySelector(
			"main.shell[data-teachers-api][data-subjects-api]",
		);
		if (!shell) {
			return;
		}

		var teachersApi = shell.getAttribute("data-teachers-api");
		var subjectsApi = shell.getAttribute("data-subjects-api");
		if (!teachersApi || !subjectsApi) {
			return;
		}

		Promise.all([window.ApiClient.get(teachersApi), window.ApiClient.get(subjectsApi)])
			.then(function (results) {
				var teachersData = results[0];
				var subjectsData = results[1];
				var teachers =
					teachersData && teachersData.teachers ? teachersData.teachers : [];
				var subjects =
					subjectsData && subjectsData.subjects ? subjectsData.subjects : [];

				var subjectsByTeacher = {};
				teachers.forEach(function (teacher) {
					subjectsByTeacher[teacher.id] = [];
				});

				subjects.forEach(function (subject) {
					if (subjectsByTeacher[subject.teacher_id]) {
						subjectsByTeacher[subject.teacher_id].push(subject);
					}
				});

				renderTeachersList(teachers, subjectsByTeacher);
			})
			.catch(function () {
				renderTeachersList([], {});
			});
	}

	// Public API
	return {
		init: function () {
			loadTeachersWithSubjects();
		},
		reload: function () {
			loadTeachersWithSubjects();
		},
		hideSubjectForm: function (teacherId) {
			hideSubjectFormForTeacher(teacherId);
		}
	};
})();
