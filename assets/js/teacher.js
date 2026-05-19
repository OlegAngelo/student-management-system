/**
 * Teacher Page Coordinator
 * Central hub that manages all module initialization and coordination
 * Modern vanilla JS with clean separation of concerns
 * No frameworks, no build tools - pure ES6+ with script tags
 */

const TeacherPageCoordinator = (() => {
	"use strict";

	// Module registry - internal modules don't need window exposure
	const modules = {
		dashboard: null,
		studentQR: null,
		studentCRUD: null,
		hierarchy: null,
		hierarchyCRUD: null,
	};

	const config = {
		readyState: false,
		debug: false,
	};

	/**
	 * Initialize all modules in dependency order
	 * @returns {void}
	 */
	const init = () => {
		if (config.readyState) return;

		try {
			// Verify all required modules are available
			if (!window.TeacherDashboard) {
				throw new Error("TeacherDashboard module not loaded");
			}
			if (!window.TeacherStudentQR) {
				throw new Error("TeacherStudentQR module not loaded");
			}
			if (!window.TeacherStudentCRUD) {
				throw new Error("TeacherStudentCRUD module not loaded");
			}
			if (!window.TeacherHierarchy) {
				throw new Error("TeacherHierarchy module not loaded");
			}
			if (!window.TeacherHierarchyCRUD) {
				throw new Error("TeacherHierarchyCRUD module not loaded");
			}

			// Store module references
			modules.dashboard = window.TeacherDashboard;
			modules.studentQR = window.TeacherStudentQR;
			modules.studentCRUD = window.TeacherStudentCRUD;
			modules.hierarchy = window.TeacherHierarchy;
			modules.hierarchyCRUD = window.TeacherHierarchyCRUD;

			// Initialize in dependency order
			// 1. Student features (independent)
			modules.dashboard.init();
			modules.studentQR.init();
			modules.studentCRUD.init();

			// 2. Teacher/Subject features (depend on hierarchy services)
			modules.hierarchy.init();
			modules.hierarchyCRUD.init();

			config.readyState = true;
			log("All modules initialized successfully");
		} catch (error) {
			console.error("Failed to initialize TeacherPage:", error);
			throw error;
		}
	};

	/**
	 * Get module by name (for internal coordination)
	 * @param {string} moduleName - Name of module to retrieve
	 * @returns {object|null} Module instance or null
	 */
	const getModule = (moduleName) => modules[moduleName] || null;

	/**
	 * Debug logging
	 * @param {string} message - Message to log
	 */
	const log = (message) => {
		if (config.debug) {
			console.log(`[TeacherPage] ${message}`);
		}
	};

	/**
	 * Set debug mode
	 * @param {boolean} enabled - Enable/disable debug mode
	 */
	const setDebug = (enabled) => {
		config.debug = enabled;
	};

	/**
	 * Check if coordinator is ready
	 * @returns {boolean}
	 */
	const isReady = () => config.readyState;

	// Public API
	return Object.freeze({
		init,
		getModule,
		setDebug,
		isReady,
		log,
	});
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
	TeacherPageCoordinator.init();
});

// Expose coordinator for debugging/testing
window.TeacherPageCoordinator = TeacherPageCoordinator;
