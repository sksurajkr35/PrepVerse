package com.prepverse.service;

import com.prepverse.dto.UpdateProfileRequest;
import com.prepverse.dto.UserDto;
import com.prepverse.entity.User;
import com.prepverse.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository users;

    public UserService(UserRepository users) {
        this.users = users;
    }

    @Transactional(readOnly = true)
    public UserDto getById(String userId) {
        return UserDto.fromEntity(require(userId));
    }

    @Transactional
    public UserDto updateProfile(String userId, UpdateProfileRequest req) {
        User u = require(userId);
        if (req.name() != null && !req.name().isBlank()) u.setName(req.name().trim());
        if (req.college() != null) u.setCollege(req.college().trim());
        if (req.branch() != null) u.setBranch(req.branch().trim());
        if (req.graduationYear() != null) u.setGraduationYear(req.graduationYear());
        if (req.targetRole() != null) u.setTargetRole(req.targetRole().trim());
        if (req.preferredLanguage() != null) u.setPreferredLanguage(req.preferredLanguage().trim());
        if (req.avatarUrl() != null) u.setAvatarUrl(sanitizeUrl(req.avatarUrl()));
        if (req.githubUrl() != null) u.setGithubUrl(sanitizeUrl(req.githubUrl()));
        if (req.leetcodeUrl() != null) u.setLeetcodeUrl(sanitizeUrl(req.leetcodeUrl()));
        if (req.linkedinUrl() != null) u.setLinkedinUrl(sanitizeUrl(req.linkedinUrl()));
        if (req.codechefUrl() != null) u.setCodechefUrl(sanitizeUrl(req.codechefUrl()));
        if ("dark".equals(req.theme()) || "light".equals(req.theme())) u.setTheme(req.theme());
        return UserDto.fromEntity(users.save(u));
    }

    /** Strict URL sanitization to prevent Stored XSS (javascript: or data: schemes). */
    private static String sanitizeUrl(String url) {
        if (url == null || url.isBlank()) {
            return "";
        }
        String trimmed = url.trim();
        if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
            return trimmed;
        }
        return "";
    }

    private User require(String userId) {
        return users.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
