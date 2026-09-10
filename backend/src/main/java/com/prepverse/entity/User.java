package com.prepverse.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * App user stored in MySQL table {@code users}.
 * Solved problem ids live in the join table {@code user_solved_problems}.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    private String college;
    private String branch;
    private Integer graduationYear;
    private String targetRole;
    private String preferredLanguage;

    @Column(length = 512)
    private String avatarUrl;

    private int prepVerseScore;
    private int placementReadiness;
    private int codingRating;
    private int problemsSolved;
    private int mockTestsTaken;
    private int streakDays;
    private int xp;
    private int level;

    @Column(nullable = false)
    private String role = "student";

    @Column(nullable = false, length = 8)
    private String theme = "dark";

    private String githubUrl;
    private String leetcodeUrl;
    private String linkedinUrl;
    private String codechefUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_solved_problems", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "problem_id")
    private Set<String> solvedProblemIds = new HashSet<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (level == 0) {
            level = 1;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ---------- Getters & setters ----------
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public int getPrepVerseScore() { return prepVerseScore; }
    public void setPrepVerseScore(int prepVerseScore) { this.prepVerseScore = prepVerseScore; }

    public int getPlacementReadiness() { return placementReadiness; }
    public void setPlacementReadiness(int placementReadiness) { this.placementReadiness = placementReadiness; }

    public int getCodingRating() { return codingRating; }
    public void setCodingRating(int codingRating) { this.codingRating = codingRating; }

    public int getProblemsSolved() { return problemsSolved; }
    public void setProblemsSolved(int problemsSolved) { this.problemsSolved = problemsSolved; }

    public int getMockTestsTaken() { return mockTestsTaken; }
    public void setMockTestsTaken(int mockTestsTaken) { this.mockTestsTaken = mockTestsTaken; }

    public int getStreakDays() { return streakDays; }
    public void setStreakDays(int streakDays) { this.streakDays = streakDays; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLeetcodeUrl() { return leetcodeUrl; }
    public void setLeetcodeUrl(String leetcodeUrl) { this.leetcodeUrl = leetcodeUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getCodechefUrl() { return codechefUrl; }
    public void setCodechefUrl(String codechefUrl) { this.codechefUrl = codechefUrl; }

    public Set<String> getSolvedProblemIds() { return solvedProblemIds; }
    public void setSolvedProblemIds(Set<String> solvedProblemIds) { this.solvedProblemIds = solvedProblemIds; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
