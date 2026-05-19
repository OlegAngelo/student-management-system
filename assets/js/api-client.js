(function () {
	"use strict";

	/**
	 * Centralized API client for all HTTP requests.
	 * Provides consistent error handling, request/response formatting, and retry logic.
	 */

	window.ApiClient = window.ApiClient || {};

	/**
	 * Fetches JSON from a URL with error handling
	 * @param {string} url - The URL to fetch
	 * @param {Object} [options] - Fetch options
	 * @returns {Promise<Object>} Parsed JSON response
	 * @throws {Error} If response is not OK
	 */
	window.ApiClient.get = function (url, options) {
		options = options || {};
		return fetch(
			url,
			Object.assign({ credentials: "same-origin" }, options),
		).then(function (response) {
			return response.json().then(function (data) {
				if (!response.ok) {
					var error = new Error(
						data.error || "Request failed with status " + response.status,
					);
					error.status = response.status;
					error.data = data;
					throw error;
				}
				return data;
			});
		});
	};

	/**
	 * Sends a POST request with JSON data
	 * @param {string} url - The URL to post to
	 * @param {Object} data - Data to send (will be JSON stringified)
	 * @param {Object} [options] - Additional fetch options
	 * @returns {Promise<Object>} Parsed JSON response
	 * @throws {Error} If response is not OK
	 */
	window.ApiClient.post = function (url, data, options) {
		options = options || {};
		return fetch(
			url,
			Object.assign(
				{
					method: "POST",
					credentials: "same-origin",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				},
				options,
			),
		).then(function (response) {
			return response.json().then(function (responseData) {
				if (!response.ok) {
					var error = new Error(
						responseData.error || "Request failed with status " + response.status,
					);
					error.status = response.status;
					error.data = responseData;
					throw error;
				}
				return responseData;
			});
		});
	};

	/**
	 * Sends a PUT request with JSON data
	 * @param {string} url - The URL to put to
	 * @param {Object} data - Data to send (will be JSON stringified)
	 * @param {Object} [options] - Additional fetch options
	 * @returns {Promise<Object>} Parsed JSON response
	 * @throws {Error} If response is not OK
	 */
	window.ApiClient.put = function (url, data, options) {
		options = options || {};
		return fetch(
			url,
			Object.assign(
				{
					method: "PUT",
					credentials: "same-origin",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				},
				options,
			),
		).then(function (response) {
			return response.json().then(function (responseData) {
				if (!response.ok) {
					var error = new Error(
						responseData.error || "Request failed with status " + response.status,
					);
					error.status = response.status;
					error.data = responseData;
					throw error;
				}
				return responseData;
			});
		});
	};

	/**
	 * Sends a DELETE request with JSON data
	 * @param {string} url - The URL to delete to
	 * @param {Object} data - Data to send in request body (will be JSON stringified)
	 * @param {Object} [options] - Additional fetch options
	 * @returns {Promise<Object>} Parsed JSON response
	 * @throws {Error} If response is not OK
	 */
	window.ApiClient.delete = function (url, data, options) {
		options = options || {};
		return fetch(
			url,
			Object.assign(
				{
					method: "DELETE",
					credentials: "same-origin",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				},
				options,
			),
		).then(function (response) {
			return response.json().then(function (responseData) {
				if (!response.ok) {
					var error = new Error(
						responseData.error || "Request failed with status " + response.status,
					);
					error.status = response.status;
					error.data = responseData;
					throw error;
				}
				return responseData;
			});
		});
	};

	/**
	 * Generic request method with full control
	 * @param {string} url - The URL to request
	 * @param {Object} options - Fetch options (method, body, headers, etc)
	 * @returns {Promise<Object>} Parsed JSON response
	 * @throws {Error} If response is not OK
	 */
	window.ApiClient.request = function (url, options) {
		options = options || {};
		var fetchOptions = Object.assign(
			{
				credentials: "same-origin",
				headers: Object.assign(
					{ "Content-Type": "application/json" },
					options.headers || {},
				),
			},
			options,
		);

		return fetch(url, fetchOptions).then(function (response) {
			return response.json().then(function (data) {
				if (!response.ok) {
					var error = new Error(
						data.error || "Request failed with status " + response.status,
					);
					error.status = response.status;
					error.data = data;
					throw error;
				}
				return data;
			});
		});
	};

	/**
	 * Handles API errors consistently across the app
	 * Shows error message to user and logs to console
	 * @param {Error} error - The error object from a rejected promise
	 * @param {Object} [options] - Options for error handling
	 * @param {boolean} [options.showUI] - Show error in UI (default: true)
	 * @param {boolean} [options.log] - Log to console (default: true)
	 * @returns {string} The error message
	 */
	window.ApiClient.handleError = function (error, options) {
		options = options || {};
		var showUI = options.showUI !== false;
		var log = options.log !== false;

		var message = error.message || "An error occurred";

		if (log) {
			console.error("API Error:", error);
		}

		if (showUI && window.UIHelpers && window.UIHelpers.showError) {
			window.UIHelpers.showError(message, { duration: 5000 });
		} else if (showUI) {
			alert(message);
		}

		return message;
	};

	/**
	 * Validates required fields in data object
	 * @param {Object} data - The data object to validate
	 * @param {Array<string>} requiredFields - Array of required field names
	 * @returns {string|null} Error message if validation fails, null if valid
	 */
	window.ApiClient.validateRequired = function (data, requiredFields) {
		for (var i = 0; i < requiredFields.length; i++) {
			var field = requiredFields[i];
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
