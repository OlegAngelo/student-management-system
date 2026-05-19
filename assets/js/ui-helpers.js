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

	/**
	 * Attaches Escape key listener to close modal
	 * @param {string} modalId - The ID of the modal element
	 * @param {Function} closeCallback - Callback to execute on Escape (e.g., closeModal)
	 */
	window.UIHelpers.attachEscapeKeyListener = function (modalId, closeCallback) {
		var modal = document.getElementById(modalId);
		if (!modal) {
			return;
		}

		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
				if (closeCallback) {
					closeCallback();
				}
			}
		});
	};

	/**
	 * Attaches backdrop click listener to close modal
	 * @param {string} backdropId - The ID of the backdrop element
	 * @param {Function} closeCallback - Callback to execute on click
	 */
	window.UIHelpers.attachBackdropListener = function (
		backdropId,
		closeCallback,
	) {
		var backdrop = document.getElementById(backdropId);
		if (backdrop && closeCallback) {
			backdrop.addEventListener("click", closeCallback);
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

	// ===== ERROR HANDLING =====

	/**
	 * Displays an API error message to the user
	 * @param {string} message - The error message to display
	 * @param {Object} [options] - Optional configuration
	 * @param {number} [options.duration] - How long to show (ms). 0 = permanent. Default 5000.
	 * @param {Function} [options.onDismiss] - Callback when error is dismissed
	 */
	window.UIHelpers.showError = function (message, options) {
		options = options || {};
		var duration = options.duration !== undefined ? options.duration : 5000;

		// Create error element
		var errorEl = document.createElement("div");
		errorEl.style.cssText =
			"position: fixed; top: 20px; right: 20px; background-color: #dc3545; " +
			"color: white; padding: 16px 24px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); " +
			"z-index: 10000; max-width: 400px; word-wrap: break-word; font-size: 14px;";
		errorEl.textContent = message;

		// Add dismiss button
		var dismissBtn = document.createElement("button");
		dismissBtn.type = "button";
		dismissBtn.style.cssText =
			"margin-left: 16px; background: none; border: none; color: white; " +
			"cursor: pointer; font-size: 16px; padding: 0; vertical-align: middle;";
		dismissBtn.textContent = "✕";

		function dismiss() {
			errorEl.remove();
			if (options.onDismiss) {
				options.onDismiss();
			}
		}

		dismissBtn.addEventListener("click", dismiss);
		errorEl.appendChild(dismissBtn);
		document.body.appendChild(errorEl);

		// Auto-dismiss if duration specified
		if (duration > 0) {
			setTimeout(dismiss, duration);
		}

		return dismiss; // Return dismiss function so caller can dismiss early if needed
	};

	/**
	 * Displays a success message to the user
	 * @param {string} message - The success message to display
	 * @param {number} [duration] - How long to show (ms). Default 3000.
	 */
	window.UIHelpers.showSuccess = function (message, duration) {
		duration = duration || 3000;

		var successEl = document.createElement("div");
		successEl.style.cssText =
			"position: fixed; top: 20px; right: 20px; background-color: #28a745; " +
			"color: white; padding: 16px 24px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); " +
			"z-index: 10000; max-width: 400px; word-wrap: break-word; font-size: 14px;";
		successEl.textContent = message;

		document.body.appendChild(successEl);

		if (duration > 0) {
			setTimeout(function () {
				successEl.remove();
			}, duration);
		}
	};

	// ===== EVENT DELEGATION =====

	/**
	 * Attaches a delegated event listener to a container
	 * @param {string} containerId - The ID of the container element
	 * @param {string} selector - CSS selector for target elements
	 * @param {string} eventType - Event type (e.g., 'click', 'submit')
	 * @param {Function} handler - Event handler function
	 */
	window.UIHelpers.addDelegatedListener = function (
		containerId,
		selector,
		eventType,
		handler,
	) {
		var container = document.getElementById(containerId);
		if (!container) {
			return;
		}

		container.addEventListener(eventType, function (e) {
			var target = e.target.closest(selector);
			if (target && container.contains(target)) {
				handler.call(target, e);
			}
		});
	};

	/**
	 * Gets all data attributes from an element as an object
	 * @param {HTMLElement} element - The element to extract data from
	 * @returns {Object} Object with camelCase keys
	 */
	window.UIHelpers.getElementData = function (element) {
		var data = {};
		if (element.dataset) {
			Object.keys(element.dataset).forEach(function (key) {
				data[key] = element.dataset[key];
			});
		}
		return data;
	};

	// ===== UTILITY FUNCTIONS =====

	/**
	 * Escapes HTML special characters to prevent XSS
	 * @param {string} str - The string to escape
	 * @returns {string} Escaped string safe for HTML context
	 */
	window.UIHelpers.escapeHtml = function (str) {
		if (!str) {
			return "";
		}
		var div = document.createElement("div");
		div.textContent = str;
		return div.innerHTML;
	};

	/**
	 * Debounces a function call
	 * @param {Function} func - The function to debounce
	 * @param {number} wait - Milliseconds to wait before calling
	 * @returns {Function} Debounced function
	 */
	window.UIHelpers.debounce = function (func, wait) {
		var timeout;
		return function () {
			var context = this;
			var args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				func.apply(context, args);
			}, wait);
		};
	};

	/**
	 * Confirms an action with the user
	 * @param {string} message - The confirmation message
	 * @returns {boolean} True if user confirmed, false otherwise
	 */
	window.UIHelpers.confirm = function (message) {
		return window.confirm(message);
	};
})();
