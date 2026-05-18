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
					'" data-subject-id="' +
					row.id +
					'">' +
					'<div class="subject-schedule-card__top">' +
					'<h3 class="subject-schedule-card__title">' +
					subjectName +
					"</h3>" +
					'<div class="subject-schedule-card__actions">' +
					'<button type="button" class="subject-icon-btn subject-edit-btn" data-subject-id="' +
					row.id +
					'" aria-label="Edit ' +
					subjectName +
					'">' +
					editSvg +
					"</button>" +
					'<button type="button" class="subject-icon-btn subject-delete-btn" data-subject-id="' +
					row.id +
					'" aria-label="Delete ' +
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
				containerEl.style.display = "flex";
				containerEl.style.alignItems = "center";
				containerEl.style.justifyContent = "center";
			}

			try {
				// QRCode library generates canvas inside the container
				var qr = new QRCode(containerEl, {
					text: "Record attendance for " + studentId,
					width: 220,
					height: 220,
					colorDark: "#000000",
					colorLight: "#ffffff",
					correctLevel: QRCode.CorrectLevel.H,
				});

				// Get the canvas that was created by QRCode
				var canvas = containerEl.querySelector("canvas");
				if (canvas) {
					currentQRCanvas = canvas;
				}
			} catch (e) {
				console.error("QR Code generation error:", e);
				if (containerEl) {
					containerEl.innerHTML =
						'<p style="color: red;">Failed to generate QR code: ' +
						e.message +
						". Kindly contact your administrator.</p>";
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
					alert("Student added successfully.");
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

		var shell = document.querySelector("main.shell[data-subjects-api]");
		if (!shell) {
			return;
		}

		var subjectsApi = shell.getAttribute("data-subjects-api");
		if (!subjectsApi) {
			return;
		}

		form.addEventListener("submit", function (e) {
			e.preventDefault();

			var subjectId = document.getElementById("subject_id").value.trim();
			var subjectName = document.getElementById("subject_name").value.trim();
			var teacherId = parseInt(document.getElementById("teacher_id").value) || 0;
			var scheduleTime = document.getElementById("schedule_time").value.trim();
			var lateAfterTime = document.getElementById("late_after_time").value.trim();

			if (!subjectName || !scheduleTime || !lateAfterTime) {
				alert("Subject name, schedule time, and late after time are required");
				return;
			}

			var method = subjectId ? "PUT" : "POST";
			var payload = {
				subject_name: subjectName,
				teacher_id: teacherId,
				schedule_time: scheduleTime,
				late_after_time: lateAfterTime,
			};

			if (subjectId) {
				payload.id = parseInt(subjectId);
			}

			fetch(subjectsApi, {
				method: method,
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			})
				.then(function (response) {
					return response.json().then(function (data) {
						if (!response.ok) {
							throw new Error(data.error || "Failed to save subject");
						}
						return data;
					});
				})
				.then(function () {
					hideAddSubjectForm();
					initTeacherDashboardApiData();
				})
				.catch(function (error) {
					alert("Error: " + error.message);
				});
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

	// Opens/closes the edit student modal from list buttons and Escape.
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

		// Fills the form fields, shows the modal, and locks body scroll.
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

		// Hides the modal, restores scroll, and resets the form.
		function closeModal() {
			modal.setAttribute("hidden", "");
			document.body.style.overflow = "";
			var form = document.getElementById("edit-student-form");
			if (form) {
				form.reset();
			}
		}

		// Closes the modal when Escape is pressed while it is open.
		function onKeydown(e) {
			if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
				closeModal();
			}
		}

		if (studentList) {
			// Opens the edit modal when a list row edit button is clicked.
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

		// Submits the edit form as a PUT request.
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

				fetch(studentsApi, {
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
						initTeacherDashboardApiData();
					})
					.catch(function (error) {
						alert("Error: " + error.message);
					});
			});
		}
	}

	// Handles edit/delete button clicks on subject cards via event delegation.
	function initSubjectCardActions() {
		var subjectList = document.getElementById("subject-schedule-list");
		if (!subjectList) {
			return;
		}

		var shell = document.querySelector("main.shell[data-subjects-api]");
		if (!shell) {
			return;
		}

		var subjectsApi = shell.getAttribute("data-subjects-api");
		if (!subjectsApi) {
			return;
		}

		// Handle edit button
		subjectList.addEventListener("click", function (e) {
			var btn = e.target.closest(".subject-edit-btn");
			if (!btn || !subjectList.contains(btn)) {
				return;
			}

			var subjectId = btn.getAttribute("data-subject-id");
			if (!subjectId) {
				return;
			}

			// Fetch subject data and populate form
			fetch(subjectsApi, { credentials: "same-origin" })
				.then(function (r) {
					if (!r.ok) throw new Error("Failed to fetch subjects");
					return r.json();
				})
				.then(function (data) {
					var subjects = data.subjects || [];
					var subject = subjects.find(function (s) {
						return s.id == subjectId;
					});

					if (!subject) {
						alert("Subject not found");
						return;
					}

					// Populate form with subject data
					document.getElementById("subject_id").value = subject.id;
					document.getElementById("subject_name").value = subject.subject_name;
					document.getElementById("teacher_id").value = subject.teacher_id;
					document.getElementById("schedule_time").value = subject.schedule_time;
					document.getElementById("late_after_time").value = subject.late_after_time;

					// Show form
					showAddSubjectForm();
				})
				.catch(function (error) {
					alert("Error: " + error.message);
				});
		});

		// Handle delete button
		subjectList.addEventListener("click", function (e) {
			var btn = e.target.closest(".subject-delete-btn");
			if (!btn || !subjectList.contains(btn)) {
				return;
			}

			var subjectId = btn.getAttribute("data-subject-id");
			if (!subjectId) {
				return;
			}

			if (!confirm("Delete this subject? This cannot be undone.")) {
				return;
			}

			fetch(subjectsApi, {
				method: "DELETE",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: parseInt(subjectId) }),
			})
				.then(function (response) {
					return response.json().then(function (data) {
						if (!response.ok) {
							throw new Error(data.error || "Failed to delete subject");
						}
						return data;
					});
				})
				.then(function () {
					alert("Subject deleted successfully.");
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
		initEditStudentModal();
		initAddSubjectForm();
	});
})();
