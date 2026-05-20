/**
 * Teacher Hierarchy Module
 * Handles loading and rendering teacher/subject hierarchy
 * Dependencies: api-client.js, teacher-row-helpers.js
 * @module TeacherHierarchy
 */

window.TeacherHierarchy = (() => {
	"use strict";

	const expandedTeacherIds = new Set();

	/**
	 * Render teacher cards with hierarchy
	 * @param {Array} teachers - Teacher list
	 * @param {Object} subjectsByTeacher - Subjects grouped by teacher ID
	 * @returns {void}
	 */
	const renderTeachersList = (teachers, subjectsByTeacher) => {
		const container = document.getElementById("teachers-list-container");
		if (!container || !teachers) return;

		if (!teachers.length) {
			container.innerHTML = `<div class="empty-state"><p>No teachers yet. Click the "+ Add/Manage Teachers" button to add one.</p></div>`;
			return;
		}

		const html = teachers
			.map((teacher) => buildTeacherCard(teacher, subjectsByTeacher))
			.join("");

		container.innerHTML = html;

		container.querySelectorAll(".teacher-card").forEach((card) => {
			const teacherId = card.getAttribute("data-teacher-id");
			if (teacherId && expandedTeacherIds.has(teacherId)) {
				const content = card.querySelector(".teacher-card-content");
				const triangle = card.querySelector(".disclosure-triangle");
				if (content) content.style.display = "block";
				if (triangle) triangle.style.transform = "rotate(90deg)";
			}
		});

		document.querySelectorAll(".teacher-card-header").forEach((header) => {
			header.addEventListener("click", () => {
				const card = header.closest(".teacher-card");
				if (card) toggleTeacherCard(card);
			});
		});

		document.querySelectorAll(".add-subject-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				const teacherId = btn.getAttribute("data-teacher-id");
				if (teacherId) attachSubjectToTeacher(teacherId);
			});
		});

		window.TeacherHierarchyCRUD.attachSubjectActions();
		window.TeacherHierarchyCRUD.attachSubjectFormHandlers();
	};

	/**
	 * Toggle teacher card expansion state
	 * @param {HTMLElement} cardElement - Teacher card element
	 * @returns {void}
	 */
	const toggleTeacherCard = (cardElement) => {
		const header = cardElement.querySelector(".teacher-card-header");
		const content = cardElement.querySelector(".teacher-card-content");
		const triangle = cardElement.querySelector(".disclosure-triangle");
		const teacherId = cardElement.getAttribute("data-teacher-id");

		if (!header || !content) return;

		const isExpanded = content.style.display !== "none";

		if (isExpanded) {
			content.style.display = "none";
			if (triangle) triangle.style.transform = "rotate(0deg)";
			if (teacherId) expandedTeacherIds.delete(teacherId);
		} else {
			content.style.display = "block";
			if (triangle) triangle.style.transform = "rotate(90deg)";
			if (teacherId) expandedTeacherIds.add(teacherId);
		}
	};

	/**
	 * Show subject form for teacher
	 * @param {string} teacherId - Teacher identifier
	 * @returns {void}
	 */
	const attachSubjectToTeacher = (teacherId) => {
		const card = document.querySelector(
			`.teacher-card[data-teacher-id="${teacherId}"]`,
		);
		if (!card) return;

		const formContainer = card.querySelector(".add-subject-form-container");
		const btn = card.querySelector(".add-subject-btn");
		if (!formContainer) return;

		formContainer.style.display = "block";
		const form = formContainer.querySelector("form");
		const firstInput = form?.querySelector("input[name='subject_name']");
		firstInput?.focus();

		if (btn) btn.style.display = "none";
	};

	/**
	 * Hide subject form for teacher
	 * @param {string} teacherId - Teacher identifier
	 * @returns {void}
	 */
	const hideSubjectFormForTeacher = (teacherId) => {
		const card = document.querySelector(
			`.teacher-card[data-teacher-id="${teacherId}"]`,
		);
		if (!card) return;

		const formContainer = card.querySelector(".add-subject-form-container");
		const btn = card.querySelector(".add-subject-btn");
		if (!formContainer) return;

		formContainer.style.display = "none";
		const form = formContainer.querySelector("form");
		if (form) form.reset();

		if (btn) btn.style.display = "block";
	};

	/**
	 * Load teachers and subjects from API
	 * @returns {void}
	 */
	const loadTeachersWithSubjects = () => {
		const shell = document.querySelector(
			"main.shell[data-teachers-api][data-subjects-api]",
		);
		if (!shell) return;

		const hierarchyApi = shell.getAttribute("data-teachers-hierarchy-api");
		if (hierarchyApi) {
			window.ApiClient.get(hierarchyApi)
				.then((data) => {
					const teachers = data?.teachers ?? [];
					const subjectsByTeacher = data?.subjectsByTeacher ?? {};
					renderTeachersList(teachers, subjectsByTeacher);
				})
				.catch(() => {
					renderTeachersList([], {});
				});
			return;
		}

		const teachersApi = shell.getAttribute("data-teachers-api");
		const subjectsApi = shell.getAttribute("data-subjects-api");
		if (!teachersApi || !subjectsApi) return;

		Promise.all([
			window.ApiClient.get(teachersApi),
			window.ApiClient.get(subjectsApi),
		])
			.then(([teachersData, subjectsData]) => {
				const teachers = teachersData?.teachers ?? [];
				const subjects = subjectsData?.subjects ?? [];

				const subjectsByTeacher = {};
				teachers.forEach((teacher) => {
					subjectsByTeacher[teacher.id] = [];
				});

				subjects.forEach((subject) => {
					if (subjectsByTeacher[subject.teacher_id]) {
						subjectsByTeacher[subject.teacher_id].push(subject);
					}
				});

				renderTeachersList(teachers, subjectsByTeacher);
			})
			.catch(() => {
				renderTeachersList([], {});
			});
	};

	// Public API
	return Object.freeze({
		init: () => {
			loadTeachersWithSubjects();
		},
		reload: () => {
			loadTeachersWithSubjects();
		},
		hideSubjectForm: (teacherId) => {
			hideSubjectFormForTeacher(teacherId);
		},
		attachSubjectToTeacher: (teacherId) => {
			attachSubjectToTeacher(teacherId);
		},
	});
})();
