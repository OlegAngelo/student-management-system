<?php
    declare(strict_types=1);

    /**
     * TeacherFormatter - Transforms raw database data into structured API response shapes.
     *
     * This class handles:
     * - Grouping subjects by teacher
     * - Enriching teacher data with computed fields
     * - Formatting hierarchical teacher/subject relationships
     *
     * Used by TeacherController to reduce JavaScript complexity and provide
     * a single source of truth for data transformation.
     */
    class TeacherFormatter
    {
        /**
         * Groups subjects by teacher_id for hierarchical dashboard display.
         *
         * Example output:
         * [
         *     1 => [
         *         { id: 1, subject_name: "Math", ... },
         *         { id: 2, subject_name: "Physics", ... }
         *     ],
         *     2 => [
         *         { id: 3, subject_name: "English", ... }
         *     ]
         * ]
         *
         * @param list<array<string, mixed>> $subjects Raw subject rows from database
         * @return array<int, list<array<string, mixed>>> Subjects grouped by teacher_id
         */
        public static function groupSubjectsByTeacher(array $subjects): array
        {
            $subjectsByTeacher = [];

            foreach ($subjects as $subject) {
                $teacherId = (int) ($subject['teacher_id'] ?? 0);

                if (!isset($subjectsByTeacher[$teacherId])) {
                    $subjectsByTeacher[$teacherId] = [];
                }

                $subjectsByTeacher[$teacherId][] = $subject;
            }

            return $subjectsByTeacher;
        }

        /**
         * Enriches teacher data with computed fields like subject count.
         *
         * Example output:
         * [
         *     {
         *         id: 1,
         *         name: "Dr. Angelo",
         *         department: "Computer Engineering",
         *         subject_count: 3,
         *         display_name: "Dr. Angelo (Computer Engineering)"
         *     },
         *     ...
         * ]
         *
         * @param list<array<string, mixed>> $teachers Raw teacher rows
         * @param array<int, list<array<string, mixed>>> $subjectsByTeacher Pre-grouped subjects
         * @return list<array<string, mixed>> Teachers with added computed fields
         */
        public static function enrichTeacherData(
            array $teachers,
            array $subjectsByTeacher
        ): array {
            return array_map(
                static function (array $teacher) use ($subjectsByTeacher): array {
                    $teacherId = (int) ($teacher['id'] ?? 0);
                    $subjectCount = count($subjectsByTeacher[$teacherId] ?? []);

                    return array_merge($teacher, [
                        'subject_count' => $subjectCount,
                        'display_name' => (string) ($teacher['name'] ?? '') .
                                        ' (' . (string) ($teacher['department'] ?? '') . ' Department)',
                    ]);
                },
                $teachers
            );
        }

        /**
         * Formats the complete hierarchical response for dashboard.
         * Combines teachers and subjects into a single response structure.
         *
         * Example output:
         * {
         *     "teachers": [
         *         { id: 1, name: "...", department: "...", subject_count: 2, ... },
         *         ...
         *     ],
         *     "subjectsByTeacher": {
         *         "1": [ { id: 1, subject_name: "...", ... }, ... ],
         *         "2": [ ... ],
         *         ...
         *     }
         * }
         *
         * @param list<array<string, mixed>> $teachers Raw teacher rows
         * @param list<array<string, mixed>> $subjects Raw subject rows with teacher joins
         * @return array<string, mixed> Formatted response ready for JSON encoding
         */
        public static function formatHierarchy(
            array $teachers,
            array $subjects
        ): array {
            $subjectsByTeacher = self::groupSubjectsByTeacher($subjects);
            $enrichedTeachers = self::enrichTeacherData($teachers, $subjectsByTeacher);

            return [
                'teachers' => $enrichedTeachers,
                'subjectsByTeacher' => $subjectsByTeacher,
            ];
        }

        /**
         * Validates required fields for teacher creation/update.
         *
         * @param array<string, mixed> $input User input data
         * @return string|null Error message if validation fails, null if valid
         */
        public static function validateTeacher(array $input): ?string
        {
            $name = trim($input['name'] ?? '');
            $department = trim($input['department'] ?? '');

            if (!$name) {
                return 'Teacher name is required';
            }

            if (!$department) {
                return 'Department is required';
            }

            if (strlen($name) > 100) {
                return 'Teacher name must not exceed 100 characters';
            }

            if (strlen($department) > 100) {
                return 'Department must not exceed 100 characters';
            }

            return null;
        }

        /**
         * Validates required fields for subject creation/update.
         *
         * @param array<string, mixed> $input User input data
         * @return string|null Error message if validation fails, null if valid
         */
        public static function validateSubject(array $input): ?string
        {
            $subjectName = trim($input['subject_name'] ?? '');
            $scheduleTime = trim($input['schedule_time'] ?? '');
            $lateAfterTime = trim($input['late_after_time'] ?? '');

            if (!$subjectName) {
                return 'Subject name is required';
            }

            if (!$scheduleTime) {
                return 'Schedule time is required';
            }

            if (!$lateAfterTime) {
                return 'Late after time is required';
            }

            if (strlen($subjectName) > 100) {
                return 'Subject name must not exceed 100 characters';
            }

            // Validate time format HH:MM
            if (!preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]$/', $scheduleTime)) {
                return 'Schedule time must be in HH:MM format (24-hour)';
            }

            if (!preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]$/', $lateAfterTime)) {
                return 'Late after time must be in HH:MM format (24-hour)';
            }

            return null;
        }
    }
?>
