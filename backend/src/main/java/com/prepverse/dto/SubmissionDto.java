package com.prepverse.dto;

import com.prepverse.entity.Submission;
import java.time.format.DateTimeFormatter;

public record SubmissionDto(
    String id,
    String problemId,
    String problemTitle,
    String language,
    String status,
    String runtime,
    String memory,
    String submittedAt,
    String code,
    String output
) {

    private static final DateTimeFormatter FORMAT =
        DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public static SubmissionDto fromEntity(Submission s) {
        return new SubmissionDto(
            s.getId(),
            s.getProblemId(),
            s.getProblemTitle(),
            s.getLanguage(),
            s.getStatus(),
            s.getRuntime(),
            s.getMemory(),
            s.getSubmittedAt() == null ? "" : s.getSubmittedAt().format(FORMAT),
            s.getCode(),
            s.getOutput() == null ? "" : s.getOutput()
        );
    }
}
