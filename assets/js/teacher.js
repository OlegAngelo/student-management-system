(function () {
	"use strict";

	// Reveals the add-student panel and focuses its first field.
	function showAddStudentForm() {
		var panel = document.getElementById("add-student-panel");
		if (!panel) {
			return;
		}
		panel.removeAttribute("hidden");
		var first = panel.querySelector("input, select, textarea");
		if (first) {
			first.focus();
		}
	}

	// Hides the add-student panel and resets its form.
	function hideAddStudentForm() {
		var panel = document.getElementById("add-student-panel");
		if (!panel) {
			return;
		}
		panel.setAttribute("hidden", "");
		var form = panel.querySelector("form");
		if (form) {
			form.reset();
		}
	}

	// Reveals the add-subject panel and focuses its first field.
	function showAddSubjectForm() {
		var panel = document.getElementById("add-subject-panel");
		if (!panel) {
			return;
		}
		panel.removeAttribute("hidden");
		var first = panel.querySelector("input, select, textarea");
		if (first) {
			first.focus();
		}
	}

	// Hides the add-subject panel and resets its form.
	function hideAddSubjectForm() {
		var panel = document.getElementById("add-subject-panel");
		if (!panel) {
			return;
		}
		panel.setAttribute("hidden", "");
		var form = panel.querySelector("form");
		if (form) {
			form.reset();
		}
	}

	// Fetches JSON from an API endpoint and rejects non-OK responses.
	function fetchJson(url) {
		return fetch(url, { credentials: "same-origin" }).then(function (response) {
			if (!response.ok) {
				throw new Error("bad status");
			}
			return response.json();
		});
	}

	// Renders student rows from API data into the teacher table body.
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

	// Renders subject cards from API data into the teacher subject list.
	function renderSubjectCards(rows) {
		var root = document.getElementById("subject-schedule-list");
		if (!root) {
			return;
		}

		if (!rows || !rows.length) {
			root.innerHTML =
				'<article class="subject-schedule-card" role="listitem" data-subject-name=""><div class="subject-schedule-card__meta"><span>No subjects found.</span></div></article>';
			return;
		}

		var html = rows
			.map(function (row) {
				var subjectName = escapeHtml(row.subject_name || "");
				var teacherName = escapeHtml(row.teacher_name || "Unassigned teacher");
				var scheduleTime = escapeHtml(row.schedule_time || "");
				var lateAfterTime = escapeHtml(row.late_after_time || "");

				var editSvg =
					'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
				var deleteSvg =
					'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';

				return (
					'<article class="subject-schedule-card" role="listitem" data-subject-name="' +
					subjectName +
					'">' +
					'<div class="subject-schedule-card__top">' +
					'<h3 class="subject-schedule-card__title">' +
					subjectName +
					"</h3>" +
					'<div class="subject-schedule-card__actions">' +
					'<button type="button" class="subject-icon-btn" aria-label="Edit ' +
					subjectName +
					'">' +
					editSvg +
					"</button>" +
					'<button type="button" class="subject-icon-btn student-delete-btn" aria-label="Delete ' +
					subjectName +
					'">' +
					deleteSvg +
					"</button>" +
					"</div>" +
					"</div>" +
					'<div class="subject-schedule-card__meta">' +
					"<span>Teacher: " +
					teacherName +
					"</span>" +
					"<span>Schedule: " +
					scheduleTime +
					"</span>" +
					"<span>Late after: " +
					lateAfterTime +
					"</span>" +
					"</div>" +
					"</article>"
				);
			})
			.join("");

		root.innerHTML = html;
	}

	// Loads teacher dashboard datasets from APIs and refreshes active filters.
	function initTeacherDashboardApiData() {
		var shell = document.querySelector(
			"main.shell[data-students-api][data-subjects-api]",
		);
		if (!shell) {
			return;
		}

		var studentsApi = shell.getAttribute("data-students-api");
		var subjectsApi = shell.getAttribute("data-subjects-api");
		if (!studentsApi || !subjectsApi) {
			return;
		}

		fetchJson(studentsApi)
			.then(function (data) {
				var rows = data && data.students ? data.students : [];
				renderStudentRows(rows);
				var sortEl = document.getElementById("student-list-sort");
				if (sortEl) {
					sortEl.dispatchEvent(new Event("change", { bubbles: true }));
				}
			})
			.catch(function () {
				renderStudentRows([]);
			});

		fetchJson(subjectsApi)
			.then(function (data) {
				var rows = data && data.subjects ? data.subjects : [];
				renderSubjectCards(rows);
				var searchEl = document.getElementById("subject-list-search");
				if (searchEl) {
					searchEl.dispatchEvent(new Event("input", { bubbles: true }));
				}
			})
			.catch(function () {
				renderSubjectCards([]);
			});
	}

	// Wires search and sort controls for the teacher dashboard student table.
	function initStudentListToolbar() {
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

		// Returns table rows that represent a student (have data-student-id).
		function getDataRows() {
			return [].slice.call(tbody.querySelectorAll("tr[data-student-id]"));
		}

		// Builds a lowercase string of searchable attributes for one row.
		function rowHaystack(row) {
			var id = (row.getAttribute("data-student-id") || "").toLowerCase();
			var name = (row.getAttribute("data-name") || "").toLowerCase();
			var year = (row.getAttribute("data-year") || "").toLowerCase();
			var section = (row.getAttribute("data-section") || "").toLowerCase();
			return id + " " + name + " " + year + " " + section;
		}

		// Shows or hides each row based on the search box substring match.
		function applyFilter() {
			var q = (searchEl.value || "").trim().toLowerCase();
			// Sets row display from whether the query appears in the row haystack.
			getDataRows().forEach(function (row) {
				if (!q) {
					row.style.display = "";
					return;
				}
				row.style.display = rowHaystack(row).indexOf(q) !== -1 ? "" : "none";
			});
		}

		// Reads the sort key value from data-* attributes on one table row.
		function sortValue(row, key) {
			if (key === "id") {
				return row.getAttribute("data-student-id") || "";
			}
			return row.getAttribute("data-" + key) || "";
		}

		// Compares two rows for Array.sort using the current sort mode string.
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

		// Reorders tbody rows then reapplies the text filter.
		function applySort() {
			var mode = sortEl.value || "name-asc";
			var rows = getDataRows();
			// Compares two rows using compareRows for the active sort mode.
			rows.sort(function (a, b) {
				return compareRows(mode, a, b);
			});
			// Moves each row node to the end in sorted order.
			rows.forEach(function (row) {
				tbody.appendChild(row);
			});
			applyFilter();
		}

		searchEl.addEventListener("input", applyFilter);
		sortEl.addEventListener("change", applySort);
		applyFilter();
	}

	// Filters subject schedule cards on the teacher page by subject name.
	function initSubjectScheduleSearch() {
		var root = document.getElementById("subject-schedule-list");
		var searchEl = document.getElementById("subject-list-search");
		if (!root || !searchEl) {
			return;
		}

		// Toggles card visibility when the query matches data-subject-name.
		function applySubjectFilter() {
			var q = (searchEl.value || "").trim().toLowerCase();
			var cards = root.querySelectorAll(
				".subject-schedule-card[data-subject-name]",
			);
			// Shows each card when its subject name contains the filter text.
			cards.forEach(function (card) {
				var name = (card.getAttribute("data-subject-name") || "").toLowerCase();
				if (!q) {
					card.style.display = "";
					return;
				}
				card.style.display = name.indexOf(q) !== -1 ? "" : "none";
			});
		}

		searchEl.addEventListener("input", applySubjectFilter);
		applySubjectFilter();
	}

	// Opens/closes the student QR preview modal from list buttons and Escape.
	function initStudentQrModal() {
		var modal = document.getElementById("student-qr-modal");
		if (!modal) {
			return;
		}

		var titleEl = document.getElementById("student-qr-modal-title");
		var containerEl = document.getElementById("student-qr-modal-container");
		var closeBtn = document.getElementById("student-qr-modal-close");
		var downloadBtn = document.getElementById("student-qr-modal-download");
		var backdrop = document.getElementById("student-qr-modal-backdrop");
		var studentList = document.getElementById("student-list");

		var currentStudentId = null;
		var currentQRCanvas = null;

		// Generates QR code and displays it in the modal.
		function generateAndDisplayQR(studentId) {
			// Clear previous QR code
			if (containerEl) {
				containerEl.innerHTML = "";
			}

			// Create canvas element for QR code
			var canvas = document.createElement("canvas");
			canvas.id = "student-qr-canvas";
			canvas.style.display = "block";
			canvas.style.margin = "0 auto";

			if (containerEl) {
				containerEl.appendChild(canvas);
			}

			try {
				// Generate QR code with the student ID
				var qr = new QRCode(canvas, {
					text: "student-management:" + studentId,
					width: 260,
					height: 260,
					colorDark: "#000000",
					colorLight: "#ffffff",
					correctLevel: QRCode.CorrectLevel.H,
				});

				currentQRCanvas = canvas;
			} catch (e) {
				if (containerEl) {
					containerEl.innerHTML = '<p style="color: red;">Failed to generate QR code</p>';
				}
			}
		}

		// Downloads the QR code as a PNG file.
		function downloadQR() {
			if (!currentQRCanvas) {
				alert("QR code not generated");
				return;
			}

			// Convert canvas to blob and download
			currentQRCanvas.toBlob(function (blob) {
				var url = URL.createObjectURL(blob);
				var link = document.createElement("a");
				link.href = url;
				link.download = "qr-" + currentStudentId + ".png";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
			}, "image/png");
		}

		// Shows the modal and generates QR code.
		function openModal(studentId) {
			currentStudentId = studentId;

			if (titleEl) {
				titleEl.textContent = "QR Code for " + studentId;
			}

			generateAndDisplayQR(studentId);

			modal.removeAttribute("hidden");
			document.body.style.overflow = "hidden";
			if (closeBtn) {
				closeBtn.focus();
			}
		}

		// Hides the modal and restores scroll.
		function closeModal() {
			modal.setAttribute("hidden", "");
			document.body.style.overflow = "";
			currentStudentId = null;
			currentQRCanvas = null;
		}

		// Closes the modal when Escape is pressed.
		function onKeydown(e) {
			if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
				closeModal();
			}
		}

		if (studentList) {
			// Opens the QR modal when a list row QR button is clicked.
			studentList.addEventListener("click", function (e) {
				var btn = e.target.closest(".student-qr-open-btn");
				if (!btn || !studentList.contains(btn)) {
					return;
				}
				var sid = btn.getAttribute("data-student-id") || "";
				openModal(sid);
			});
		}

		if (downloadBtn) {
			downloadBtn.addEventListener("click", downloadQR);
		}

		if (closeBtn) {
			closeBtn.addEventListener("click", closeModal);
		}

		if (backdrop) {
			backdrop.addEventListener("click", closeModal);
		}

		document.addEventListener("keydown", onKeydown);
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

			fetch(studentsApi, {
				method: "POST",
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
							throw new Error(data.error || "Failed to create student");
						}
						return data;
					});
				})
				.then(function () {
					hideAddStudentForm();
					initTeacherDashboardApiData();
				})
				.catch(function (error) {
					alert("Error: " + error.message);
				});
		});
	}

	function initAddSubjectForm() {
		var form = document.getElementById("add-subject-form");
		if (!form) {
			return;
		}
		form.addEventListener("submit", function (e) {
			e.preventDefault();
		});
	}

	// Handles delete button clicks on student rows via event delegation.
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

			fetch(studentsApi, {
				method: "DELETE",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ student_id: studentId }),
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
					alert("Student " + studentId + " deleted successfully.");
					initTeacherDashboardApiData();
				})
				.catch(function (error) {
					alert("Error: " + error.message);
				});
		});
	}

	document.addEventListener("DOMContentLoaded", function () {
		var toggleBtn = document.getElementById("add-student-toggle");
		var cancelBtn = document.getElementById("add-student-cancel");
		if (toggleBtn) {
			toggleBtn.addEventListener("click", showAddStudentForm);
		}
		if (cancelBtn) {
			cancelBtn.addEventListener("click", hideAddStudentForm);
		}

		var subjectToggle = document.getElementById("add-subject-toggle");
		var subjectCancel = document.getElementById("add-subject-cancel");
		if (subjectToggle) {
			subjectToggle.addEventListener("click", showAddSubjectForm);
		}
		if (subjectCancel) {
			subjectCancel.addEventListener("click", hideAddSubjectForm);
		}

		initStudentListToolbar();
		initSubjectScheduleSearch();
		initTeacherDashboardApiData();
		initStudentQrModal();
		initAddStudentForm();
		initDeleteStudent();
		initAddSubjectForm();
	});
})();
