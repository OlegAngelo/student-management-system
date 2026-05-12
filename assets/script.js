(function () {
    'use strict';

    function showAddStudentForm() {
        var panel = document.getElementById('add-student-panel');
        if (!panel) {
            return;
        }
        panel.removeAttribute('hidden');
        var first = panel.querySelector('input, select, textarea');
        if (first) {
            first.focus();
        }
    }

    function hideAddStudentForm() {
        var panel = document.getElementById('add-student-panel');
        if (!panel) {
            return;
        }
        panel.setAttribute('hidden', '');
        var form = panel.querySelector('form');
        if (form) {
            form.reset();
        }
    }

    function showAddSubjectForm() {
        var panel = document.getElementById('add-subject-panel');
        if (!panel) {
            return;
        }
        panel.removeAttribute('hidden');
        var first = panel.querySelector('input, select, textarea');
        if (first) {
            first.focus();
        }
    }

    function hideAddSubjectForm() {
        var panel = document.getElementById('add-subject-panel');
        if (!panel) {
            return;
        }
        panel.setAttribute('hidden', '');
        var form = panel.querySelector('form');
        if (form) {
            form.reset();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var toggleBtn = document.getElementById('add-student-toggle');
        var cancelBtn = document.getElementById('add-student-cancel');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', showAddStudentForm);
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideAddStudentForm);
        }

        var subjectToggle = document.getElementById('add-subject-toggle');
        var subjectCancel = document.getElementById('add-subject-cancel');
        if (subjectToggle) {
            subjectToggle.addEventListener('click', showAddSubjectForm);
        }
        if (subjectCancel) {
            subjectCancel.addEventListener('click', hideAddSubjectForm);
        }
    });
})();
