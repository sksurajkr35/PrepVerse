package com.prepverse.dto;

import com.prepverse.entity.User;
import java.util.Set;

/**
 * Public user profile sent to the React frontend (never includes password hash).
 */
public record UserDto(
    String id,
    String name,
    String email,
    String college,
    String branch,
    Integer graduationYear,
    String targetRole,
    String preferredLanguage,
    String avatarUrl,
    int prepVerseScore,
    int placementReadiness,
    int codingRating,
    int problemsSolved,
    int mockTestsTaken,
    int streakDays,
    int xp,
    int level,
    String role,
    String githubUrl,
    String leetcodeUrl,
    String linkedinUrl,
    String codechefUrl,
    Set<String> solvedProblemIds
) {

    public static UserDto fromEntity(User u) {
        return new UserDto(
            u.getId(),
            u.getName(),
            u.getEmail(),
            u.getCollege(),
            u.getBranch(),
            u.getGraduationYear(),
            u.getTargetRole(),
            u.getPreferredLanguage(),
            u.getAvatarUrl(),
            u.getPrepVerseScore(),
            u.getPlacementReadiness(),
            u.getCodingRating(),
            u.getProblemsSolved(),
            u.getMockTestsTaken(),
            u.getStreakDays(),
            u.getXp(),
            u.getLevel(),
            u.getRole(),
            u.getGithubUrl(),
            u.getLeetcodeUrl(),
            u.getLinkedinUrl(),
            u.getCodechefUrl(),
            u.getSolvedProblemIds() == null ? Set.of() : Set.copyOf(u.getSolvedProblemIds())
        );
    }
}
