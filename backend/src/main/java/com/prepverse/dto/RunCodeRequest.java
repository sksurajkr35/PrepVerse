package com.prepverse.dto;

import jakarta.validation.constraints.NotBlank;

public record RunCodeRequest(
    @NotBlank(message = "language is required")
    String language,

    @NotBlank(message = "code is required")
    String code,

    String customInput
) {}
