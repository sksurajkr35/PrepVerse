package com.prepverse.dto;

import com.prepverse.entity.TestAttempt;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public record TestAttemptDto(
    Long id,
    String testId,
    int score,
    int totalMarks,
    double accuracy,
    int correctAnswers,
    int wrongAnswers,
    int skipped,
    double percentile,
    Map<String, Integer> topicBreakdown,
    String completedAt
) {

    private static final DateTimeFormatter FORMAT =
        DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public static TestAttemptDto fromEntity(TestAttempt t) {
        return new TestAttemptDto(
            t.getId(),
            t.getTestId(),
            t.getScore(),
            t.getTotalMarks(),
            t.getAccuracy(),
            t.getCorrectAnswers(),
            t.getWrongAnswers(),
            t.getSkipped(),
            t.getPercentile(),
            t.getTopicBreakdown(),
            t.getCompletedAt() == null ? "" : t.getCompletedAt().format(FORMAT)
        );
    }
}
