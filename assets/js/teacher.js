(function () {
    'use strict';

    // Reveals the add-student panel and focuses its first field.
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

    // Hides the add-student panel and resets its form.
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

    // Reveals the add-subject panel and focuses its first field.
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

    // Hides the add-subject panel and resets its form.
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

    // Wires search and sort controls for the teacher dashboard student table.
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

        // Returns table rows that represent a student (have data-student-id).
        function getDataRows() {
            return [].slice.call(tbody.querySelectorAll('tr[data-student-id]'));
        }

        // Builds a lowercase string of searchable attributes for one row.
        function rowHaystack(row) {
            var id = (row.getAttribute('data-student-id') || '').toLowerCase();
            var name = (row.getAttribute('data-name') || '').toLowerCase();
            var year = (row.getAttribute('data-year') || '').toLowerCase();
            var section = (row.getAttribute('data-section') || '').toLowerCase();
            return id + ' ' + name + ' ' + year + ' ' + section;
        }

        // Shows or hides each row based on the search box substring match.
        function applyFilter() {
            var q = (searchEl.value || '').trim().toLowerCase();
            // Sets row display from whether the query appears in the row haystack.
            getDataRows().forEach(function (row) {
                if (!q) {
                    row.style.display = '';
                    return;
                }
                row.style.display = rowHaystack(row).indexOf(q) !== -1 ? '' : 'none';
            });
        }

        // Reads the sort key value from data-* attributes on one table row.
        function sortValue(row, key) {
            if (key === 'id') {
                return row.getAttribute('data-student-id') || '';
            }
            return row.getAttribute('data-' + key) || '';
        }

        // Compares two rows for Array.sort using the current sort mode string.
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

        // Reorders tbody rows then reapplies the text filter.
        function applySort() {
            var mode = sortEl.value || 'name-asc';
            var rows = getDataRows();
            // Compares two rows using compareRows for the active sort mode.
            rows.sort(function (a, b) {
                return compareRows(mode, a, b);
            });
            // Moves each row node to the end in sorted order.
            rows.forEach(function (row) {
                tbody.appendChild(row);
            });
            applyFilter();
        }

        searchEl.addEventListener('input', applyFilter);
        sortEl.addEventListener('change', applySort);
        applyFilter();
    }

    // Filters subject schedule cards on the teacher page by subject name.
    function initSubjectScheduleSearch() {
        var root = document.getElementById('subject-schedule-list');
        var searchEl = document.getElementById('subject-list-search');
        if (!root || !searchEl) {
            return;
        }

        // Toggles card visibility when the query matches data-subject-name.
        function applySubjectFilter() {
            var q = (searchEl.value || '').trim().toLowerCase();
            var cards = root.querySelectorAll('.subject-schedule-card[data-subject-name]');
            // Shows each card when its subject name contains the filter text.
            cards.forEach(function (card) {
                var name = (card.getAttribute('data-subject-name') || '').toLowerCase();
                if (!q) {
                    card.style.display = '';
                    return;
                }
                card.style.display = name.indexOf(q) !== -1 ? '' : 'none';
            });
        }

        searchEl.addEventListener('input', applySubjectFilter);
        applySubjectFilter();
    }

    // Opens/closes the student QR preview modal from list buttons and Escape.
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

        // Returns the goqr.me image URL for a given QR payload string.
        function qrImageUrlForPayload(payload) {
            return qrImageBase + encodeURIComponent(payload);
        }

        // Shows the modal, sets title/image from studentId, and locks body scroll.
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

        // Hides the modal, restores scroll, and resets the image to the preview.
        function closeModal() {
            modal.setAttribute('hidden', '');
            document.body.style.overflow = '';
            if (imgEl) {
                imgEl.src = qrImageUrlForPayload(qrPreviewPayload);
                imgEl.alt = '';
            }
        }

        // Closes the modal when Escape is pressed while it is open.
        function onKeydown(e) {
            if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
                closeModal();
            }
        }

        if (studentList) {
            // Opens the QR modal when a list row QR button is clicked.
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
        initSubjectScheduleSearch();
        initStudentQrModal();
    });
})();
