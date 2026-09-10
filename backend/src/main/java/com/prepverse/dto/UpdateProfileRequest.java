package com.prepverse.dto;

/** All fields optional - only non-null fields are updated. */
public record UpdateProfileRequest(
    String name,
    String college,
    String branch,
    Integer graduationYear,
    String targetRole,
    String preferredLanguage,
    String avatarUrl,
    String githubUrl,
    String leetcodeUrl,
    String linkedinUrl,
    String codechefUrl,
    String theme
) {}
