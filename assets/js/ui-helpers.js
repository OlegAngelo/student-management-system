(function () {
	"use strict";

	/**
	 * UI Helper utilities for modals, forms, error handling, and events.
	 * Extracted to reduce duplication across teacher.js, student.js, etc.
	 */

	// ===== MODAL MANAGEMENT =====

	/**
	 * Opens a modal by ID and hides body scroll
	 * @param {string} modalId - The ID of the modal element
	 * @param {HTMLElement} [focusElement] - Element to focus when modal opens (defaults to first interactive element)
	 */
	window.UIHelpers = window.UIHelpers || {};

	window.UIHelpers.openModal = function (modalId, focusElement) {
		var modal = document.getElementById(modalId);
		if (modal) {
			modal.removeAttribute("hidden");
			document.body.style.overflow = "hidden";
			if (focusElement) {
				focusElement.focus();
			} else {
				var first = modal.querySelector("input, select, textarea, button");
				if (first) {
					first.focus();
				}
			}
		}
	};

	/**
	 * Closes a modal by ID and restores body scroll
	 * @param {string} modalId - The ID of the modal element
	 */
	window.UIHelpers.closeModal = function (modalId) {
		var modal = document.getElementById(modalId);
		if (modal) {
			modal.setAttribute("hidden", "");
			document.body.style.overflow = "";
		}
	};

	// ===== FORM MANAGEMENT =====

	/**
	 * Resets a form to its initial state
	 * @param {string} formId - The ID of the form element
	 */
	window.UIHelpers.resetForm = function (formId) {
		var form = document.getElementById(formId);
		if (form) {
			form.reset();
		}
	};

	/**
	 * Focuses the first interactive element in a container
	 * @param {string} containerId - The ID of the container element
	 */
	window.UIHelpers.focusFirstInput = function (containerId) {
		var container = document.getElementById(containerId);
		if (container) {
			var first = container.querySelector("input, select, textarea, button");
			if (first) {
				first.focus();
			}
		}
	};

	/**
	 * Shows a form container and focuses first input
	 * @param {string} formContainerId - The ID of the form container
	 */
	window.UIHelpers.showForm = function (formContainerId) {
		var container = document.getElementById(formContainerId);
		if (container) {
			container.removeAttribute("hidden");
			window.UIHelpers.focusFirstInput(formContainerId);
		}
	};

	/**
	 * Hides a form container and resets it
	 * @param {string} formContainerId - The ID of the form container
	 * @param {string} [formId] - Optional form ID to reset (if different from container)
	 */
	window.UIHelpers.hideForm = function (formContainerId, formId) {
		var container = document.getElementById(formContainerId);
		if (container) {
			container.setAttribute("hidden", "");
		}
		if (formId) {
			window.UIHelpers.resetForm(formId);
		}
	};
})();
