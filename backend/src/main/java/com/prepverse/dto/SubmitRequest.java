package com.prepverse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubmitRequest(
    @NotBlank(message = "language is required")
    @Size(max = 20, message = "language is too long")
    String language,

    @NotBlank(message = "code is required")
    @Size(max = 100_000, message = "code exceeds 100 KB limit")
    String code
) {}
