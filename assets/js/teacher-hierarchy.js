/**
 * Teacher Hierarchy Module
 * Handles loading and rendering teacher/subject hierarchy
 * Dependencies: api-client.js, teacher-row-helpers.js
 * @module TeacherHierarchy
 */

window.TeacherHierarchy = (() => {
	"use strict";

	const expandedTeacherIds = new Set();
	let currentSearchQuery = "";

	const normalize = (value) => (value || "").toLowerCase();

	const ensureOriginalText = (el) => {
		if (!el) return "";
		if (!el.dataset.originalText) {
			el.dataset.originalText = el.textContent || "";
		}
		return el.dataset.originalText;
	};

	const applyHighlightToElement = (el, query) => {
		if (!el) return;
		const text = ensureOriginalText(el);
		if (!query) {
			el.textContent = text;
			return;
		}
		const hay = text.toLowerCase();
		const needle = query.toLowerCase();
		let index = hay.indexOf(needle);
		if (index === -1) {
			el.textContent = text;
			return;
		}

		el.textContent = "";
		let lastIndex = 0;
		while (index !== -1) {
			if (index > lastIndex) {
				el.appendChild(document.createTextNode(text.slice(lastIndex, index)));
			}
			const mark = document.createElement("span");
			mark.className = "search-highlight";
			mark.textContent = text.slice(index, index + needle.length);
			el.appendChild(mark);
			lastIndex = index + needle.length;
			index = hay.indexOf(needle, lastIndex);
		}
		if (lastIndex < text.length) {
			el.appendChild(document.createTextNode(text.slice(lastIndex)));
		}
	};

	const setCardExpandedState = (card, expanded) => {
		const content = card.querySelector(".teacher-card-content");
		const triangle = card.querySelector(".disclosure-triangle");
		if (content) {
			content.style.display = expanded ? "block" : "none";
		}
		if (triangle) {
			triangle.style.transform = expanded ? "rotate(90deg)" : "rotate(0deg)";
		}
	};

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

		if (!container.querySelector(".teachers-list-empty")) {
			const empty = document.createElement("div");
			empty.className = "empty-state teachers-list-empty";
			empty.style.display = "none";
			empty.innerHTML = "<p>No teachers or subjects match your search.</p>";
			container.appendChild(empty);
		}

		container.querySelectorAll(".teacher-card").forEach((card) => {
			const teacherId = card.getAttribute("data-teacher-id");
			if (teacherId && expandedTeacherIds.has(teacherId)) {
				setCardExpandedState(card, true);
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

		applySearchFilter();
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
			setCardExpandedState(cardElement, false);
			if (teacherId) expandedTeacherIds.delete(teacherId);
		} else {
			setCardExpandedState(cardElement, true);
			if (teacherId) expandedTeacherIds.add(teacherId);
		}
	};

	const applySearchFilter = () => {
		const container = document.getElementById("teachers-list-container");
		const input = document.getElementById("teacher-list-search");
		if (!container || !input) return;

		const query = normalize(input.value).trim();
		currentSearchQuery = query;

		const cards = [...container.querySelectorAll(".teacher-card")];
		let visibleCount = 0;

		cards.forEach((card) => {
			const teacherSearch = normalize(card.getAttribute("data-teacher-search"));
			const subjectCards = [...card.querySelectorAll(".subject-schedule-card")];
			const teacherMatch = query && teacherSearch.includes(query);
			let subjectMatchCount = 0;

			subjectCards.forEach((subjectCard) => {
				const subjectSearch = normalize(
					subjectCard.getAttribute("data-subject-search"),
				);
				const subjectMatch = query && subjectSearch.includes(query);
				if (!query || teacherMatch) {
					subjectCard.style.display = "";
				} else {
					subjectCard.style.display = subjectMatch ? "" : "none";
				}
				if (subjectMatch) {
					subjectMatchCount += 1;
				}
			});

			const showCard = !query || teacherMatch || subjectMatchCount > 0;
			card.style.display = showCard ? "" : "none";

			if (showCard) {
				visibleCount += 1;
				applyHighlightToElement(card.querySelector(".teacher-name"), query);
				applyHighlightToElement(card.querySelector(".teacher-department"), query);
				card
					.querySelectorAll(".subject-schedule-card__title, .subject-meta")
					.forEach((el) => applyHighlightToElement(el, query));
				if (query) {
					setCardExpandedState(card, true);
				} else {
					const teacherId = card.getAttribute("data-teacher-id");
					setCardExpandedState(card, teacherId && expandedTeacherIds.has(teacherId));
				}
			}
		});

		const emptyState = container.querySelector(".teachers-list-empty");
		if (emptyState) {
			emptyState.style.display = query && visibleCount === 0 ? "block" : "none";
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
					applySearchFilter();
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
				applySearchFilter();
			})
			.catch(() => {
				renderTeachersList([], {});
			});
	};

	const initSearch = () => {
		const input = document.getElementById("teacher-list-search");
		if (!input) return;

		input.addEventListener("input", applySearchFilter);
		if (currentSearchQuery) {
			input.value = currentSearchQuery;
		}
		applySearchFilter();
	};

	// Public API
	return Object.freeze({
		init: () => {
			initSearch();
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
