package com.prepverse.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record TestAttemptRequest(
    @NotBlank(message = "testId is required")
    String testId,

    int score,
    int totalMarks,
    double accuracy,
    int correctAnswers,
    int wrongAnswers,
    int skipped,
    double percentile,
    Map<String, Integer> topicBreakdown
) {}
