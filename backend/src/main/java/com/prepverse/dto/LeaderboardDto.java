package com.prepverse.dto;

public record LeaderboardDto(
    int rank,
    String id,
    String name,
    String college,
    int rating,
    int problemsSolved,
    int score,
    String avatarUrl,
    String badge,
    boolean currentUser
) {}
