package com.prepverse.dto;

/** Dashboard counters for the admin portal. */
public record AdminStatsDto(
    long totalUsers,
    long totalProblems,
    long totalSubmissions,
    long totalTestAttempts,
    long acceptedSubmissions
) {}
