/**
 * Teacher Student QR Module
 * Handles QR code generation, display, and download
 * Dependencies: ui-helpers.js
 */
window.TeacherStudentQR = (function () {
	"use strict";

	var currentStudentId = null;
	var currentQRCanvas = null;

	function generateAndDisplayQR(containerEl, studentId) {
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
		var titleEl = document.getElementById("student-qr-modal-title");
		var containerEl = document.getElementById("student-qr-modal-container");
		var closeBtn = document.getElementById("student-qr-modal-close");

		currentStudentId = studentId;

		if (titleEl) {
			titleEl.textContent = "QR Code for " + studentId;
		}

		generateAndDisplayQR(containerEl, studentId);
		window.UIHelpers.openModal("student-qr-modal", closeBtn);
	}

	function closeModal() {
		window.UIHelpers.closeModal("student-qr-modal");
		currentStudentId = null;
		currentQRCanvas = null;
	}

	function onKeydown(e) {
		var modal = document.getElementById("student-qr-modal");
		if (e.key === "Escape" && modal && !modal.hasAttribute("hidden")) {
			closeModal();
		}
	}

	// Public API
	return {
		init: function () {
			var modal = document.getElementById("student-qr-modal");
			var downloadBtn = document.getElementById("student-qr-modal-download");
			var closeBtn = document.getElementById("student-qr-modal-close");
			var backdrop = document.getElementById("student-qr-modal-backdrop");
			var studentList = document.getElementById("student-list");

			if (!modal) {
				return;
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
	};
})();
