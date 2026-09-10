package com.prepverse.dto;

import jakarta.validation.constraints.NotBlank;

public record SubmissionRequest(
    @NotBlank(message = "problemId is required")
    String problemId,

    String problemTitle,

    @NotBlank(message = "language is required")
    String language,

    String code,
    String status,
    String runtime,
    String memory
) {}
