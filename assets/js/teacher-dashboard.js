/**
 * Teacher Dashboard Module
 * Handles student list rendering, searching, sorting, and data loading
 * Dependencies: api-client.js, teacher-row-helpers.js
 * @module TeacherDashboard
 */

window.TeacherDashboard = (() => {
	"use strict";

	// State
	let studentList = [];

	/**
	 * Render student rows in table
	 * @param {Array} rows - Student data rows
	 * @returns {void}
	 */
	const renderStudentRows = (rows) => {
		const listRoot = document.getElementById("student-list");
		if (!listRoot) return;

		const tbody = listRoot.querySelector("tbody");
		if (!tbody) return;

		if (!rows?.length) {
			tbody.innerHTML = '<tr><td colspan="5">No students found.</td></tr>';
			return;
		}

		studentList = rows;
		const html = rows.map(buildStudentRow).join("");
		tbody.innerHTML = html;
	};

	/**
	 * Load students from API
	 * @returns {void}
	 */
	const loadStudentsFromApi = () => {
		const shell = document.querySelector("main.shell[data-students-api]");
		if (!shell) return;

		const studentsApi = shell.getAttribute("data-students-api");
		if (!studentsApi) return;

		window.ApiClient.get(studentsApi)
			.then((data) => {
				const rows = data?.students ?? [];
				renderStudentRows(rows);

				// Trigger sort after rendering
				const sortEl = document.getElementById("student-list-sort");
				if (sortEl) {
					sortEl.dispatchEvent(new Event("change", { bubbles: true }));
				}
			})
			.catch((error) => {
				window.ApiClient.handleError(error);
				renderStudentRows([]);
			});
	};

	/**
	 * Initialize search and sort toolbar
	 * @returns {void}
	 */
	const initToolbar = () => {
		const listRoot = document.getElementById("student-list");
		const searchEl = document.getElementById("student-list-search");
		const sortEl = document.getElementById("student-list-sort");

		if (!listRoot || !searchEl || !sortEl) return;

		const tbody = listRoot.querySelector("tbody");
		if (!tbody) return;

		const getDataRows = () => [...tbody.querySelectorAll("tr[data-student-id]")];

		const rowHaystack = (row) => {
			const id = (row.getAttribute("data-student-id") ?? "").toLowerCase();
			const name = (row.getAttribute("data-name") ?? "").toLowerCase();
			const year = (row.getAttribute("data-year") ?? "").toLowerCase();
			const section = (row.getAttribute("data-section") ?? "").toLowerCase();
			return `${id} ${name} ${year} ${section}`;
		};

		const applyFilter = () => {
			const q = (searchEl.value ?? "").trim().toLowerCase();
			getDataRows().forEach((row) => {
				if (!q) {
					row.style.display = "";
					return;
				}
				row.style.display = rowHaystack(row).includes(q) ? "" : "none";
			});
		};

		const sortValue = (row, key) => {
			if (key === "id") {
				return row.getAttribute("data-student-id") ?? "";
			}
			return row.getAttribute(`data-${key}`) ?? "";
		};

		const compareRows = (mode, a, b) => {
			const lastDash = mode.lastIndexOf("-");
			const key = mode.slice(0, lastDash);
			const desc = mode.slice(lastDash + 1) === "desc";
			const va = sortValue(a, key);
			const vb = sortValue(b, key);

			let n;
			if (key === "year") {
				n = (parseInt(va, 10) || 0) - (parseInt(vb, 10) || 0);
			} else if (key === "id") {
				n = va.localeCompare(vb, undefined, { numeric: true, sensitivity: "base" });
			} else {
				n = va.localeCompare(vb, undefined, { sensitivity: "base" });
			}

			return desc ? -n : n;
		};

		const applySort = () => {
			const mode = sortEl.value || "name-asc";
			const rows = getDataRows();

			rows.sort((a, b) => compareRows(mode, a, b));
			rows.forEach((row) => tbody.appendChild(row));

			applyFilter();
		};

		searchEl.addEventListener("input", applyFilter);
		sortEl.addEventListener("change", applySort);
		applySort();
	};

	// Public API
	return Object.freeze({
		init: () => {
			initToolbar();
			loadStudentsFromApi();
		},
		render: (rows) => renderStudentRows(rows),
		reload: () => loadStudentsFromApi(),
		getStudents: () => [...studentList],
	});
})();
