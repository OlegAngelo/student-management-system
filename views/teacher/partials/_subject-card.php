<?php
    /**
     * Subject card template for displaying individual subjects.
     *
     * Expected variables:
     * - $subject (array): Subject data with id, subject_name, schedule_time, late_after_time
     */

    if (!isset($subject)) {
        return;
    }

    $subjectId = (int) ($subject['id'] ?? 0);
    $subjectName = htmlspecialchars($subject['subject_name'] ?? '', ENT_QUOTES, 'UTF-8');
    $scheduleTime = htmlspecialchars($subject['schedule_time'] ?? '', ENT_QUOTES, 'UTF-8');
    $lateAfterTime = htmlspecialchars($subject['late_after_time'] ?? '', ENT_QUOTES, 'UTF-8');

    // Extract HH:MM format
    $scheduleDisplay = substr($scheduleTime, 0, 5);
    $lateAfterDisplay = substr($lateAfterTime, 0, 5);

    $editSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
    $deleteSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';
?>

<div class="subject-schedule-card" data-subject-id="<?= $subjectId ?>" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 12px; background-color: #fafafa;">
    <!-- Subject Card Top (Title + Actions) -->
    <div class="subject-schedule-card__top" style="display: flex; justify-content: space-between; align-items: flex-start;">
        <h3 class="subject-schedule-card__title" style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
            <?= $subjectName ?>
        </h3>
        <div class="subject-schedule-card__actions" style="display: flex; gap: 4px;">
            <button type="button" class="subject-icon-btn subject-edit-btn" data-subject-id="<?= $subjectId ?>" aria-label="Edit <?= $subjectName ?>" style="background: none; border: none; color: #0066cc; cursor: pointer; padding: 4px; display: flex; align-items: center;">
                <?= $editSvg ?>
            </button>
            <button type="button" class="subject-icon-btn subject-delete-btn" data-subject-id="<?= $subjectId ?>" aria-label="Delete <?= $subjectName ?>" style="background: none; border: none; color: #dc3545; cursor: pointer; padding: 4px; display: flex; align-items: center;">
                <?= $deleteSvg ?>
            </button>
        </div>
    </div>

    <!-- Subject Card Meta (Schedule Info) -->
    <div class="subject-schedule-card__meta" style="display: flex; gap: 16px; font-size: 13px; color: #666;">
        <span>Schedule: <?= $scheduleDisplay ?></span>
        <span>Late after: <?= $lateAfterDisplay ?></span>
    </div>
</div>
