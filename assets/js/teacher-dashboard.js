/**
 * Teacher Dashboard Module
 * Handles student list rendering, searching, sorting, and data loading
 * Dependencies: api-client.js, teacher-row-helpers.js
 */
window.TeacherDashboard = (function () {
	"use strict";

	function renderStudentRows(rows) {
		var listRoot = document.getElementById("student-list");
		if (!listRoot) {
			return;
		}

		var tbody = listRoot.querySelector("tbody");
		if (!tbody) {
			return;
		}

		if (!rows || !rows.length) {
			tbody.innerHTML = '<tr><td colspan="5">No students found.</td></tr>';
			return;
		}

		var html = rows.map(buildStudentRow).join("");
		tbody.innerHTML = html;
	}

	function loadStudentsFromApi() {
		var shell = document.querySelector("main.shell[data-students-api]");
		if (!shell) {
			return;
		}

		var studentsApi = shell.getAttribute("data-students-api");
		if (!studentsApi) {
			return;
		}

		window.ApiClient.get(studentsApi)
			.then(function (data) {
				var rows = data && data.students ? data.students : [];
				renderStudentRows(rows);
				var sortEl = document.getElementById("student-list-sort");
				if (sortEl) {
					sortEl.dispatchEvent(new Event("change", { bubbles: true }));
				}
			})
			.catch(function (error) {
				window.ApiClient.handleError(error);
				renderStudentRows([]);
			});
	}

	function initToolbar() {
		var listRoot = document.getElementById("student-list");
		var searchEl = document.getElementById("student-list-search");
		var sortEl = document.getElementById("student-list-sort");
		if (!listRoot || !searchEl || !sortEl) {
			return;
		}

		var tbody = listRoot.querySelector("tbody");
		if (!tbody) {
			return;
		}

		function getDataRows() {
			return [].slice.call(tbody.querySelectorAll("tr[data-student-id]"));
		}

		function rowHaystack(row) {
			var id = (row.getAttribute("data-student-id") || "").toLowerCase();
			var name = (row.getAttribute("data-name") || "").toLowerCase();
			var year = (row.getAttribute("data-year") || "").toLowerCase();
			var section = (row.getAttribute("data-section") || "").toLowerCase();
			return id + " " + name + " " + year + " " + section;
		}

		function applyFilter() {
			var q = (searchEl.value || "").trim().toLowerCase();
			getDataRows().forEach(function (row) {
				if (!q) {
					row.style.display = "";
					return;
				}
				row.style.display = rowHaystack(row).indexOf(q) !== -1 ? "" : "none";
			});
		}

		function sortValue(row, key) {
			if (key === "id") {
				return row.getAttribute("data-student-id") || "";
			}
			return row.getAttribute("data-" + key) || "";
		}

		function compareRows(mode, a, b) {
			var lastDash = mode.lastIndexOf("-");
			var key = mode.slice(0, lastDash);
			var desc = mode.slice(lastDash + 1) === "desc";
			var va = sortValue(a, key);
			var vb = sortValue(b, key);
			var n;
			if (key === "year") {
				n = (parseInt(va, 10) || 0) - (parseInt(vb, 10) || 0);
			} else if (key === "id") {
				n = va.localeCompare(vb, undefined, { numeric: true, sensitivity: "base" });
			} else {
				n = va.localeCompare(vb, undefined, { sensitivity: "base" });
			}
			if (desc) {
				n = -n;
			}
			return n;
		}

		function applySort() {
			var mode = sortEl.value || "name-asc";
			var rows = getDataRows();
			rows.sort(function (a, b) {
				return compareRows(mode, a, b);
			});
			rows.forEach(function (row) {
				tbody.appendChild(row);
			});
			applyFilter();
		}

		searchEl.addEventListener("input", applyFilter);
		sortEl.addEventListener("change", applySort);
		applySort();
	}

	// Public API
	return {
		init: function () {
			initToolbar();
			loadStudentsFromApi();
		},
		render: function (rows) {
			renderStudentRows(rows);
		},
		reload: function () {
			loadStudentsFromApi();
		}
	};
})();
