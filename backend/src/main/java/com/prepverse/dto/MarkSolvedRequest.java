package com.prepverse.dto;

import jakarta.validation.constraints.NotBlank;

public record MarkSolvedRequest(
    @NotBlank(message = "problemId is required")
    String problemId,

    String language,
    String code
) {}
