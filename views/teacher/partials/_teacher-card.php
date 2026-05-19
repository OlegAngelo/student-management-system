<?php
    /**
     * Teacher card template for hierarchical teacher list display.
     *
     * Expected variables:
     * - $teacher (array): Teacher data with id, name, department, subject_count
     * - $subjects (array): Array of subjects for this teacher
     * - $baseUrl (string): Base URL for asset links
     */

    if (!isset($teacher, $subjects, $baseUrl)) {
        return;
    }

    $teacherId = (int) ($teacher['id'] ?? 0);
    $teacherName = htmlspecialchars($teacher['name'] ?? '', ENT_QUOTES, 'UTF-8');
    $department = htmlspecialchars($teacher['department'] ?? '', ENT_QUOTES, 'UTF-8');
    $subjectCount = (int) ($teacher['subject_count'] ?? count($subjects ?? []));
    $isExpanded = false;
?>

<div class="teacher-card" data-teacher-id="<?= $teacherId ?>" style="border: 1px solid #ddd; border-radius: 4px; margin-bottom: 16px; overflow: hidden;">
    <!-- Teacher Card Header (Collapsible) -->
    <div class="teacher-card-header" style="padding: 12px; background-color: #f5f5f5; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
        <div style="display: flex; align-items: center; flex: 1;">
            <span class="disclosure-triangle" style="display: inline-block; margin-right: 8px; font-size: 12px; transition: transform 0.2s; transform: <?= $isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' ?>;">▶</span>
            <strong><?= $teacherName ?></strong>
            <span style="color: #666; margin-left: 8px;">(<?= $department ?> Department)</span>
            <span class="subject-count-badge" style="display: inline-block; margin-left: 12px; background-color: #e0e0e0; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                <?= $subjectCount ?> subject<?= $subjectCount !== 1 ? 's' : '' ?>
            </span>
        </div>
    </div>

    <!-- Teacher Card Content (Collapsible) -->
    <div class="teacher-card-content" style="display: <?= $isExpanded ? 'block' : 'none' ?>; padding: 16px; border-top: 1px solid #ddd;">
        <!-- Add Subject Button -->
        <button type="button" class="add-subject-btn button secondary" data-teacher-id="<?= $teacherId ?>" style="margin-bottom: 12px;">
            + Add Subject
        </button>

        <!-- Subjects List -->
        <div class="subjects-list" style="margin-bottom: 16px;">
            <?php if (empty($subjects)): ?>
                <p style="color: #666;">No subjects for this teacher yet.</p>
            <?php else: ?>
                <?php foreach ($subjects as $subject): ?>
                    <?php include __DIR__ . '/_subject-card.php'; ?>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <!-- Add Subject Form (Initially Hidden) -->
        <div class="add-subject-form-container" style="display: none; margin-top: 16px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 4px; background-color: #f9f9f9;">
            <h4 style="margin-top: 0;">Add Subject for <?= $teacherName ?></h4>
            <form class="add-subject-form" data-teacher-id="<?= $teacherId ?>">
                <input type="hidden" name="subject_id" value="">
                <input type="hidden" name="current_teacher_id" value="<?= $teacherId ?>">

                <label for="subject_name_<?= $teacherId ?>">Subject Name</label>
                <input type="text" id="subject_name_<?= $teacherId ?>" name="subject_name" placeholder="CPE 3222 - Web Development" required>

                <label for="schedule_time_<?= $teacherId ?>">Schedule Time</label>
                <small class="field-hint">24-hour clock (HH:MM)</small>
                <input type="time" id="schedule_time_<?= $teacherId ?>" name="schedule_time" step="60" required>

                <label for="late_after_time_<?= $teacherId ?>">Late After Time</label>
                <small class="field-hint">Same format; should be after the schedule time.</small>
                <input type="time" id="late_after_time_<?= $teacherId ?>" name="late_after_time" step="60" required>

                <div class="action-btns">
                    <button type="submit" class="button primary">Save</button>
                    <button type="button" class="button secondary cancel-add-subject">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</div>
