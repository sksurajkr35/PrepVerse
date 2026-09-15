package com.prepverse.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email")
    @Size(max = 120, message = "Email is too long")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 128, message = "Password must be between 6 and 128 characters")
    String password,

    @Size(max = 150, message = "College is too long")
    String college,

    @Size(max = 100, message = "Branch is too long")
    String branch,

    Integer graduationYear,

    @Size(max = 100, message = "Target role is too long")
    String targetRole,

    @Size(max = 50, message = "Preferred language is too long")
    String preferredLanguage
) {}
