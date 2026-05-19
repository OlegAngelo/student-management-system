(function () {
	"use strict";

	window.ApiClient = window.ApiClient || {};

	// Helper for handling fetch responses consistently
	const handleResponse = (response) => {
		return response.json().then((data) => {
			if (!response.ok) {
				const error = new Error(
					data.error || `Request failed with status ${response.status}`,
				);
				error.status = response.status;
				error.data = data;
				throw error;
			}
			return data;
		});
	};

	window.ApiClient.get = function (url, options = {}) {
		return fetch(url, { credentials: "same-origin", ...options }).then(
			handleResponse,
		);
	};

	window.ApiClient.post = function (url, data, options = {}) {
		return fetch(url, {
			method: "POST",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
			...options,
		}).then(handleResponse);
	};

	window.ApiClient.put = function (url, data, options = {}) {
		return fetch(url, {
			method: "PUT",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
			...options,
		}).then(handleResponse);
	};

	window.ApiClient.delete = function (url, data, options = {}) {
		return fetch(url, {
			method: "DELETE",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
			...options,
		}).then(handleResponse);
	};

	/**
	 * Handles API errors consistently across the app using native alerts
	 */
	window.ApiClient.handleError = function (error, options = {}) {
		const showUI = options.showUI !== false;
		const log = options.log !== false;
		const message = error.message || "An error occurred";

		// Behind the scenes debug logging remains intact
		if (log) console.error("API Error:", error);

		if (showUI) {
			alert(message);
		}

		return message;
	};

	window.ApiClient.validateRequired = function (data, requiredFields) {
		for (const field of requiredFields) {
			if (
				!data[field] ||
				(typeof data[field] === "string" && !data[field].trim())
			) {
				return field.charAt(0).toUpperCase() + field.slice(1) + " is required";
			}
		}
		return null;
	};
})();
