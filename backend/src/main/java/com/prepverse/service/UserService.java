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
        if (req.name() != null) u.setName(req.name());
        if (req.college() != null) u.setCollege(req.college());
        if (req.branch() != null) u.setBranch(req.branch());
        if (req.graduationYear() != null) u.setGraduationYear(req.graduationYear());
        if (req.targetRole() != null) u.setTargetRole(req.targetRole());
        if (req.preferredLanguage() != null) u.setPreferredLanguage(req.preferredLanguage());
        if (req.avatarUrl() != null) u.setAvatarUrl(req.avatarUrl());
        if (req.githubUrl() != null) u.setGithubUrl(req.githubUrl());
        if (req.leetcodeUrl() != null) u.setLeetcodeUrl(req.leetcodeUrl());
        if (req.linkedinUrl() != null) u.setLinkedinUrl(req.linkedinUrl());
        if (req.codechefUrl() != null) u.setCodechefUrl(req.codechefUrl());
        return UserDto.fromEntity(users.save(u));
    }

    private User require(String userId) {
        return users.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
