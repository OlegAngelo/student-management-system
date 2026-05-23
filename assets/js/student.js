(function () {
    'use strict';

    // Lazy-loads subject options from the API when teacher or filter changes.
    function initStudentSubjectPickerFilter() {
        var root = document.getElementById('student-subject-picker');
        var select = document.getElementById('subject_id');
        var teacherEl = document.getElementById('subject-teacher-filter');
        var searchEl = document.getElementById('subject-search');
        if (!root || !select || !teacherEl || !searchEl) {
            return;
        }

        var api = root.getAttribute('data-subjects-api');
        if (!api) {
            return;
        }

        var debounceMs = 320;
        var debTimer = null;
        var seq = 0;

        // Replaces the select with a single disabled placeholder option.
        function setPlaceholder(message, disableSelect) {
            select.innerHTML = '';
            var opt = document.createElement('option');
            opt.value = '';
            opt.disabled = true;
            opt.selected = true;
            opt.textContent = message;
            select.appendChild(opt);
            select.disabled = !!disableSelect;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Fills the subject select from API rows (label includes teacher and time).
        function renderSubjects(rows) {
            select.innerHTML = '';
            var ph = document.createElement('option');
            ph.value = '';
            ph.disabled = true;
            ph.selected = true;
            ph.textContent = rows.length ? 'Select Subject' : 'No matching subjects';
            select.appendChild(ph);

            // Builds one option element per subject returned from the API.
            rows.forEach(function (row) {
                var tid = row.teacher_id != null ? parseInt(row.teacher_id, 10) : 0;
                if (isNaN(tid)) {
                    tid = 0;
                }
                var tname = (row.teacher_name != null ? String(row.teacher_name) : '').trim();
                var label = String(row.subject_name || '');
                if (tname) {
                    label += ' - ' + tname;
                }
                label += ' - ' + String(row.schedule_time || '');

                var opt = document.createElement('option');
                opt.value = String(row.id);
                opt.textContent = label;
                opt.setAttribute('data-teacher-id', String(tid));
                select.appendChild(opt);
            });

            select.disabled = false;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // True when a teacher is chosen or the global search has enough characters.
        function canFetch() {
            var tid = (teacherEl.value || '').trim();
            var q = (searchEl.value || '').trim();
            if (tid === '') {
                return q.length >= 2;
            }
            return true;
        }

        // Requests subjects JSON and renders options, ignoring stale responses.
        function doFetch() {
            if (!canFetch()) {
                setPlaceholder('Pick a teacher or type to search', false);
                return;
            }

            var my = ++seq;
            setPlaceholder('Loading subjects…', true);

            var params = new URLSearchParams();
            var tid = (teacherEl.value || '').trim();
            if (tid !== '') {
                params.set('teacher_id', tid);
            }
            var q = (searchEl.value || '').trim();
            if (q !== '') {
                params.set('q', q);
            }

            var url = api + '?' + params.toString();
            fetch(url, { credentials: 'same-origin' })
                // Rejects non-OK responses so catch can show an error placeholder.
                .then(function (r) {
                    if (!r.ok) {
                        throw new Error('bad status');
                    }
                    return r.json();
                })
                // Renders rows if this response is still the latest in-flight request.
                .then(function (data) {
                    if (my !== seq) {
                        return;
                    }
                    var rows = data && data.subjects ? data.subjects : [];
                    renderSubjects(rows);
                })
                // Shows a retry message when the network or JSON handling fails.
                .catch(function () {
                    if (my !== seq) {
                        return;
                    }
                    setPlaceholder('Could not load subjects. Try again.', false);
                });
        }

        // Clears debounce and fetches immediately after teacher selection changes.
        function onTeacherChange() {
            if (debTimer) {
                clearTimeout(debTimer);
                debTimer = null;
            }
            doFetch();
        }

        // Debounces typing so rapid keystrokes trigger one subjects request.
        function onSearchInput() {
            if (debTimer) {
                clearTimeout(debTimer);
            }
            // Waits for typing to pause before requesting subjects again.
            debTimer = setTimeout(function () {
                debTimer = null;
                doFetch();
            }, debounceMs);
        }

        teacherEl.addEventListener('change', onTeacherChange);
        searchEl.addEventListener('input', onSearchInput);

        setPlaceholder('Pick a teacher or type to search', false);
    }

    // Shows the QR scanner block only after a subject is selected.
    function initAttendanceScanner() {
        var select = document.getElementById('subject_id');
        var placeholder = document.getElementById('attendance-placeholder');
        var scanner = document.getElementById('attendance-scanner');
        var manualSubjectId = document.getElementById('manual-subject-id');
        var manualStudentInput = document.getElementById('manual-student-id');
        var manualSubmit = document.getElementById('manual-attendance-submit');
        if (!select || !placeholder || !scanner) {
            return;
        }

        // Toggles placeholder vs scanner visibility from the subject select value.
        function update() {
            var hasSubject = !!select.value;
            if (select.value) {
                placeholder.setAttribute('hidden', '');
                scanner.removeAttribute('hidden');
            } else {
                scanner.setAttribute('hidden', '');
                placeholder.removeAttribute('hidden');
            }

            if (manualSubjectId) {
                manualSubjectId.value = select.value || '';
            }

            if (manualStudentInput) {
                manualStudentInput.disabled = !hasSubject;
            }

            if (manualSubmit) {
                manualSubmit.disabled = !hasSubject;
            }
        }

        select.addEventListener('change', update);
        update();
    }

    function initManualAttendanceForm() {
        var form = document.getElementById('manual-attendance-form');
        var input = document.getElementById('manual-student-id');
        var subjectIdInput = document.getElementById('manual-subject-id');
        var messageEl = document.getElementById('manual-attendance-message');
        var submitBtn = document.getElementById('manual-attendance-submit');
        var select = document.getElementById('subject_id');
        if (!form || !input || !subjectIdInput || !messageEl || !submitBtn || !select) {
            return;
        }

        function setMessage(text, type) {
            if (!text) {
                messageEl.textContent = '';
                messageEl.className = 'manual-attendance-message';
                messageEl.setAttribute('hidden', '');
                return;
            }

            messageEl.textContent = text;
            messageEl.className = 'manual-attendance-message manual-attendance-message--' + type;
            messageEl.removeAttribute('hidden');
        }

        function syncSubject() {
            subjectIdInput.value = select.value || '';
            input.disabled = !select.value;
            submitBtn.disabled = !select.value;
            if (!select.value) {
                setMessage('Select a subject above to enable manual attendance.', 'info');
            } else if (messageEl.textContent && messageEl.classList.contains('manual-attendance-message--info')) {
                setMessage('', 'info');
            }
        }

        function isValidStudentId(value) {
            return /^\d+$/.test(value);
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var studentId = (input.value || '').trim();
            var subjectId = (subjectIdInput.value || '').trim();

            if (!subjectId) {
                setMessage('Select a subject above before recording attendance.', 'error');
                return;
            }

            if (!studentId) {
                setMessage('Student ID is required.', 'error');
                input.focus();
                return;
            }

            if (!isValidStudentId(studentId)) {
                setMessage('Student ID must contain digits only.', 'error');
                input.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Recording…';
            setMessage('', 'info');

            fetch(form.action, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    student_id: studentId,
                    subject_id: parseInt(subjectId, 10)
                })
            })
                .then(function (response) {
                    return response.json().then(function (data) {
                        return {
                            ok: response.ok,
                            data: data || {}
                        };
                    });
                })
                .then(function (result) {
                    if (!result.ok) {
                        throw new Error(result.data.error || result.data.message || 'Unable to record attendance.');
                    }

                    setMessage(result.data.message || 'Attendance recorded successfully.', 'success');
                    input.value = '';
                    input.focus();
                })
                .catch(function (error) {
                    setMessage(error.message || 'Unable to record attendance. Please try again.', 'error');
                })
                .finally(function () {
                    submitBtn.textContent = 'Record Attendance';
                    submitBtn.disabled = !select.value;
                });
        });

        select.addEventListener('change', syncSubject);
        syncSubject();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initStudentSubjectPickerFilter();
        initAttendanceScanner();
        initManualAttendanceForm();
    });
})();
