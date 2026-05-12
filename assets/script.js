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

    function initStudentQrModal() {
        var modal = document.getElementById('student-qr-modal');
        if (!modal) {
            return;
        }

        var titleEl = document.getElementById('student-qr-modal-title');
        var imgEl = document.getElementById('student-qr-modal-img');
        var closeBtn = document.getElementById('student-qr-modal-close');
        var backdrop = document.getElementById('student-qr-modal-backdrop');
        var studentList = document.getElementById('student-list');

        /** Public QR image endpoint; swap for self-hosted generation later. Docs: https://goqr.me/api/doc/create-qr-code/ */
        var qrImageBase = 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=';
        var qrPreviewPayload = 'student-management:preview';

        function qrImageUrlForPayload(payload) {
            return qrImageBase + encodeURIComponent(payload);
        }

        function openModal(studentId) {
            if (titleEl) {
                titleEl.textContent = 'QR Code for ' + studentId;
            }
            if (imgEl) {
                var payload = studentId ? 'student-management:' + studentId : qrPreviewPayload;
                imgEl.alt = 'QR code for student ' + (studentId || 'preview');
                imgEl.src = qrImageUrlForPayload(payload);
            }
            modal.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
            if (closeBtn) {
                closeBtn.focus();
            }
        }

        function closeModal() {
            modal.setAttribute('hidden', '');
            document.body.style.overflow = '';
            if (imgEl) {
                imgEl.src = qrImageUrlForPayload(qrPreviewPayload);
                imgEl.alt = '';
            }
        }

        function onKeydown(e) {
            if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
                closeModal();
            }
        }

        if (studentList) {
            studentList.addEventListener('click', function (e) {
                var btn = e.target.closest('.student-qr-open-btn');
                if (!btn || !studentList.contains(btn)) {
                    return;
                }
                var sid = btn.getAttribute('data-student-id') || '';
                openModal(sid);
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        if (backdrop) {
            backdrop.addEventListener('click', closeModal);
        }

        document.addEventListener('keydown', onKeydown);
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

        initStudentQrModal();
    });
})();
