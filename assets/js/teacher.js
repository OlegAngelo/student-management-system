/**
 * Teacher Page Entry Point
 * Initializes all teacher management modules
 * Requires: teacher-dashboard.js, teacher-student-qr.js, teacher-student-crud.js,
 *           teacher-hierarchy.js, teacher-hierarchy-crud.js
 */
(function () {
	"use strict";

	document.addEventListener("DOMContentLoaded", function () {
		// Initialize student dashboard features
		window.TeacherDashboard.init();
		window.TeacherStudentQR.init();
		window.TeacherStudentCRUD.init();

		// Initialize teacher hierarchy features
		window.TeacherHierarchy.init();
		window.TeacherHierarchyCRUD.init();
	});
})();
