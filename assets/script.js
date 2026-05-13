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

    function initStudentListToolbar() {
        var listRoot = document.getElementById('student-list');
        var searchEl = document.getElementById('student-list-search');
        var sortEl = document.getElementById('student-list-sort');
        if (!listRoot || !searchEl || !sortEl) {
            return;
        }

        var tbody = listRoot.querySelector('tbody');
        if (!tbody) {
            return;
        }

        function getDataRows() {
            return [].slice.call(tbody.querySelectorAll('tr[data-student-id]'));
        }

        function rowHaystack(row) {
            var id = (row.getAttribute('data-student-id') || '').toLowerCase();
            var name = (row.getAttribute('data-name') || '').toLowerCase();
            var year = (row.getAttribute('data-year') || '').toLowerCase();
            var section = (row.getAttribute('data-section') || '').toLowerCase();
            return id + ' ' + name + ' ' + year + ' ' + section;
        }

        function applyFilter() {
            var q = (searchEl.value || '').trim().toLowerCase();
            getDataRows().forEach(function (row) {
                if (!q) {
                    row.style.display = '';
                    return;
                }
                row.style.display = rowHaystack(row).indexOf(q) !== -1 ? '' : 'none';
            });
        }

        function sortValue(row, key) {
            if (key === 'id') {
                return row.getAttribute('data-student-id') || '';
            }
            return row.getAttribute('data-' + key) || '';
        }

        function compareRows(mode, a, b) {
            var lastDash = mode.lastIndexOf('-');
            var key = mode.slice(0, lastDash);
            var desc = mode.slice(lastDash + 1) === 'desc';
            var va = sortValue(a, key);
            var vb = sortValue(b, key);
            var n;
            if (key === 'year') {
                n = (parseInt(va, 10) || 0) - (parseInt(vb, 10) || 0);
            } else if (key === 'id') {
                n = va.localeCompare(vb, undefined, { numeric: true, sensitivity: 'base' });
            } else {
                n = va.localeCompare(vb, undefined, { sensitivity: 'base' });
            }
            if (desc) {
                n = -n;
            }
            return n;
        }

        function applySort() {
            var mode = sortEl.value || 'name-asc';
            var rows = getDataRows();
            rows.sort(function (a, b) {
                return compareRows(mode, a, b);
            });
            rows.forEach(function (row) {
                tbody.appendChild(row);
            });
            applyFilter();
        }

        searchEl.addEventListener('input', applyFilter);
        sortEl.addEventListener('change', applySort);
        applyFilter();
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

        initStudentListToolbar();
        initStudentQrModal();
    });
})();
