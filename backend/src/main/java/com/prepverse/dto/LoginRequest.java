package com.prepverse.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email")
    @Size(max = 120, message = "Email is too long")
    String email,

    @NotBlank(message = "Password is required")
    @Size(max = 128, message = "Password cannot exceed 128 characters")
    String password
) {}
