package com.prepverse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RunCodeRequest(
    @NotBlank(message = "language is required")
    @Size(max = 30, message = "language identifier is too long")
    String language,

    @NotBlank(message = "code is required")
    @Size(max = 65536, message = "code cannot exceed 64 KB")
    String code,

    @Size(max = 16384, message = "customInput cannot exceed 16 KB")
    String customInput
) {}
