/**
 * Teacher Student QR Module
 * Handles QR code generation, display, and download for students
 * Dependencies: ui-helpers.js
 * @module TeacherStudentQR
 */

window.TeacherStudentQR = (() => {
	"use strict";

	let currentStudentId = null;
	let currentQRCanvas = null;

	/**
	 * Generate and display QR code
	 * @param {HTMLElement} containerEl - Container for QR code
	 * @param {string} studentId - Student identifier
	 * @returns {void}
	 */
	const generateAndDisplayQR = (containerEl, studentId) => {
		if (containerEl) {
			containerEl.innerHTML = "";
			containerEl.style.display = "flex";
			containerEl.style.alignItems = "center";
			containerEl.style.justifyContent = "center";
		}

		try {
			// QRCode library (global)
			const qr = new QRCode(containerEl, {
				text: `Record attendance for ${studentId}`,
				width: 220,
				height: 220,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: QRCode.CorrectLevel.H,
			});

			const canvas = containerEl?.querySelector("canvas");
			if (canvas) {
				currentQRCanvas = canvas;
			}
		} catch (error) {
			console.error("QR Code generation error:", error);
			if (containerEl) {
				containerEl.innerHTML = `
					<p class="error-message">
						Failed to generate QR code: ${error.message}.
						Kindly contact your administrator.
					</p>
				`;
			}
		}
	};

	/**
	 * Download QR code as PNG image
	 * @returns {void}
	 */
	const downloadQR = () => {
		if (!currentQRCanvas) {
			alert("QR code not generated");
			return;
		}

		currentQRCanvas.toBlob((blob) => {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `qr-${currentStudentId}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}, "image/png");
	};

	/**
	 * Open QR modal for student
	 * @param {string} studentId - Student identifier
	 * @returns {void}
	 */
	const openModal = (studentId) => {
		const titleEl = document.getElementById("student-qr-modal-title");
		const containerEl = document.getElementById("student-qr-modal-container");
		const closeBtn = document.getElementById("student-qr-modal-close");

		currentStudentId = studentId;

		if (titleEl) {
			titleEl.textContent = `QR Code for ${studentId}`;
		}

		generateAndDisplayQR(containerEl, studentId);
		window.UIHelpers.openModal("student-qr-modal", closeBtn);
	};

	/**
	 * Close QR modal and cleanup
	 * @returns {void}
	 */
	const closeModal = () => {
		window.UIHelpers.closeModal("student-qr-modal");
		currentStudentId = null;
		currentQRCanvas = null;
	};

	/**
	 * Handle Escape key to close modal
	 * @param {KeyboardEvent} event - Keyboard event
	 * @returns {void}
	 */
	const onKeydown = (event) => {
		const modal = document.getElementById("student-qr-modal");
		if (event.key === "Escape" && modal && !modal.hasAttribute("hidden")) {
			closeModal();
		}
	};

	// Public API
	return Object.freeze({
		init: () => {
			const modal = document.getElementById("student-qr-modal");
			const downloadBtn = document.getElementById("student-qr-modal-download");
			const closeBtn = document.getElementById("student-qr-modal-close");
			const backdrop = document.getElementById("student-qr-modal-backdrop");
			const studentList = document.getElementById("student-list");

			if (!modal) return;

			// Wire QR button click handler
			if (studentList) {
				studentList.addEventListener("click", (event) => {
					const btn = event.target.closest(".student-qr-open-btn");
					if (btn?.dataset.studentId) {
						openModal(btn.dataset.studentId);
					}
				});
			}

			// Wire action buttons
			if (downloadBtn) {
				downloadBtn.addEventListener("click", downloadQR);
			}

			if (closeBtn) {
				closeBtn.addEventListener("click", closeModal);
			}

			if (backdrop) {
				backdrop.addEventListener("click", closeModal);
			}

			// Wire keyboard escape
			document.addEventListener("keydown", onKeydown);
		},
	});
})();
