(function () {
	"use strict";

	// Reveals the add-student panel and focuses its first field.
	function showAddStudentForm() {
		window.UIHelpers.showForm("add-student-panel");
	}

	// Hides the add-student panel and resets its form.
	function hideAddStudentForm() {
		window.UIHelpers.hideForm("add-student-panel", "add-student-form");
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

	// Loads teacher dashboard datasets from APIs and refreshes active filters.
	function initTeacherDashboardApiData() {
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

		function generateAndDisplayQR(studentId) {
			if (containerEl) {
				containerEl.innerHTML = "";
				containerEl.style.display = "flex";
				containerEl.style.alignItems = "center";
				containerEl.style.justifyContent = "center";
			}

			try {
				var qr = new QRCode(containerEl, {
					text: "Record attendance for " + studentId,
					width: 220,
					height: 220,
					colorDark: "#000000",
					colorLight: "#ffffff",
					correctLevel: QRCode.CorrectLevel.H,
				});

				var canvas = containerEl.querySelector("canvas");
				if (canvas) {
					currentQRCanvas = canvas;
				}
			} catch (e) {
				console.error("QR Code generation error:", e);
				if (containerEl) {
					containerEl.innerHTML = `
						<p class="error-message">
							Failed to generate QR code: ${e.message}.
							Kindly contact your administrator.
						</p>
					`;
				}
			}
		}

		function downloadQR() {
			if (!currentQRCanvas) {
				alert("QR code not generated");
				return;
			}

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

		function openModal(studentId) {
			currentStudentId = studentId;

			if (titleEl) {
				titleEl.textContent = "QR Code for " + studentId;
			}

			generateAndDisplayQR(studentId);
			window.UIHelpers.openModal("student-qr-modal", closeBtn);
		}

		function closeModal() {
			window.UIHelpers.closeModal("student-qr-modal");
			currentStudentId = null;
			currentQRCanvas = null;
		}

		function onKeydown(e) {
			if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
				closeModal();
			}
		}

		if (studentList) {
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

			window.ApiClient.post(studentsApi, {
				student_id: studentId,
				name: name,
				year: year,
				section: section,
			})
				.then(function () {
					hideAddStudentForm();
					window.UIHelpers.showSuccess("Student added successfully.");
					initTeacherDashboardApiData();
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
					initTeacherDashboardApiData();
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
						initTeacherDashboardApiData();
					})
					.catch(function (error) {
						alert("Error: " + error.message);
					});
			});
		}
	}

	// ===== HIERARCHICAL TEACHER MANAGEMENT =====

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

		attachSubjectActions();
		attachSubjectFormHandlers();
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
		var form = card.querySelector(".add-subject-form");
		var btn = card.querySelector(".add-subject-btn");

		if (formContainer) {
			formContainer.style.display = "none";
		}

		if (form) {
			form.reset();
		}

		if (btn) {
			btn.style.display = "block";
		}
	}

	function attachSubjectActions() {
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
					attachSubjectToTeacher(subject.teacher_id);
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

		window.ApiClient.delete(subjectsApi, {
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
				loadTeachersWithSubjects();
			})
			.catch(function (error) {
				alert("Error: " + error.message);
			});
	}

	function attachSubjectFormHandlers() {
		var shell = document.querySelector("main.shell[data-subjects-api]");
		if (!shell) {
			return;
		}

		var subjectsApi = shell.getAttribute("data-subjects-api");
		if (!subjectsApi) {
			return;
		}

		document.querySelectorAll(".add-subject-form").forEach(function (form) {
			form.removeEventListener("submit", handleSubjectFormSubmit);
			form.addEventListener("submit", function (e) {
				handleSubjectFormSubmit(e, subjectsApi, form);
			});
		});

		document.querySelectorAll(".cancel-add-subject").forEach(function (btn) {
			btn.addEventListener("click", function (e) {
				e.preventDefault();
				var form = btn.closest(".add-subject-form");
				if (form) {
					var teacherId =
						form.getAttribute("data-teacher-id") ||
						form.querySelector('input[name="current_teacher_id"]').value;
					hideSubjectFormForTeacher(teacherId);
				}
			});
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

		window.ApiClient.delete(subjectsApi, {
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
				hideSubjectFormForTeacher(teacherId);
				loadTeachersWithSubjects();
			})
			.catch(function (error) {
				alert("Error: " + error.message);
			});
	}

	// ===== TEACHER MANAGEMENT =====

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

		loadTeachersWithSubjects();
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

	function openTeacherModal() {
		document.getElementById("teacher_edit_id").value = "";
		document.getElementById("teacher_edit_name").value = "";
		document.getElementById("teacher_edit_department").value = "";
		window.UIHelpers.openModal(
			"teacher-modal",
			document.getElementById("teacher_edit_name")
		);
		document.getElementById("teacher-form-submit").textContent = "Add Teacher";
	}

	function closeTeacherModal() {
		window.UIHelpers.closeModal("teacher-modal");
	}

	function initTeacherModal() {
		var modal = document.getElementById("teacher-modal");
		var form = document.getElementById("teacher-form");
		var closeBtn = document.getElementById("teacher-modal-close");
		var backdrop = document.getElementById("teacher-modal-backdrop");

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

		if (backdrop) {
			backdrop.addEventListener("click", closeTeacherModal);
		}

		if (form) {
			form.addEventListener("submit", function (e) {
				e.preventDefault();

				var teacherId = document.getElementById("teacher_edit_id").value.trim();
				var name = document.getElementById("teacher_edit_name").value.trim();
				var subject = document
					.getElementById("teacher_edit_department")
					.value.trim();

				if (!name || !subject) {
					alert("Teacher name and department are required");
					return;
				}

				var method = teacherId ? "PUT" : "POST";
				var payload = {
					name: name,
					department: subject,
				};

				if (teacherId) {
					payload.id = parseInt(teacherId);
				}

				window.ApiClient.delete(teachersApi, {
					method: method,
					credentials: "same-origin",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				})
					.then(function (response) {
						return response.json().then(function (data) {
							if (!response.ok) {
								throw new Error(data.error || "Failed to save teacher");
							}
							return data;
						});
					})
					.then(function () {
						loadTeachers();
						closeTeacherModal();
					})
					.catch(function (error) {
						alert("Error: " + error.message);
					});
			});
		}

		document.addEventListener("click", function (e) {
			if (e.target.closest(".teacher-edit-btn")) {
				var btn = e.target.closest(".teacher-edit-btn");
				var teacherId = btn.getAttribute("data-teacher-id");
				if (teacherId) {
					loadTeacherForEdit(teacherId);
				}
			}
		});

		document.addEventListener("click", function (e) {
			if (e.target.closest(".teacher-delete-btn")) {
				var btn = e.target.closest(".teacher-delete-btn");
				var teacherId = btn.getAttribute("data-teacher-id");
				if (teacherId && confirm("Delete this teacher? This cannot be undone.")) {
					deleteTeacher(teacherId, teachersApi);
				}
			}
		});
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

	function deleteTeacher(teacherId, teachersApi) {
		window.ApiClient.delete(teachersApi, {
			method: "DELETE",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: parseInt(teacherId) }),
		})
			.then(function (response) {
				return response.json().then(function (data) {
					if (!response.ok) {
						throw new Error(data.error || "Failed to delete teacher");
					}
					return data;
				});
			})
			.then(function () {
				loadTeachers();
			})
			.catch(function (error) {
				alert("Error: " + error.message);
			});
	}

	function initTeacherModalButton() {
		var btn = document.getElementById("open-teacher-modal-btn");
		if (btn) {
			btn.addEventListener("click", openTeacherModal);
		}
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

		initStudentListToolbar();
		initTeacherDashboardApiData();
		initStudentQrModal();
		initAddStudentForm();
		initDeleteStudent();
		initEditStudentModal();
		initTeacherModal();
		initTeacherModalButton();
		loadTeachersWithSubjects();
	});
})();
