package com.prepverse.service;

import com.prepverse.dto.AuthResponse;
import com.prepverse.dto.LoginRequest;
import com.prepverse.dto.RegisterRequest;
import com.prepverse.dto.UserDto;
import com.prepverse.entity.User;
import com.prepverse.repository.UserRepository;
import com.prepverse.security.JwtUtil;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Registration, login and demo-login. Passwords are BCrypt-hashed in MySQL.
 * Every session returns a short-lived access JWT + a rotating refresh token.
 */
@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokens;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil, RefreshTokenService refreshTokens) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokens = refreshTokens;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = req.email().toLowerCase().trim();
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        User u = new User();
        u.setId("usr_" + UUID.randomUUID().toString().substring(0, 8));
        u.setName(req.name());
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setCollege(orEmpty(req.college()));
        u.setBranch(orEmpty(req.branch()));
        u.setGraduationYear(req.graduationYear() == null ? 2026 : req.graduationYear());
        u.setTargetRole(orEmpty(req.targetRole()));
        u.setPreferredLanguage(req.preferredLanguage() == null ? "C++" : req.preferredLanguage());
        u.setCodingRating(1000);
        u.setLevel(1);
        u.setRole("student");
        users.save(u);
        return toAuthResponse(u);
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        User u = users.findByEmail(req.email().toLowerCase().trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (u.getPasswordHash() == null || !passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return toAuthResponse(u);
    }

    /** One-click demo access - creates the demo account on first use. */
    @Transactional
    public AuthResponse demoLogin() {
        User u = users.findByEmail("demo@prepverse.com").orElseGet(() -> {
            User demo = new User();
            demo.setId("usr_demo");
            demo.setName("Demo Student");
            demo.setEmail("demo@prepverse.com");
            demo.setPasswordHash(passwordEncoder.encode("demo1234"));
            demo.setCollege("Delhi Technological University (DTU)");
            demo.setBranch("Computer Science & Engineering");
            demo.setGraduationYear(2026);
            demo.setTargetRole("Software Development Engineer (SDE-1)");
            demo.setPreferredLanguage("C++");
            demo.setPrepVerseScore(742);
            demo.setPlacementReadiness(74);
            demo.setCodingRating(1286);
            demo.setProblemsSolved(7);
            demo.setMockTestsTaken(18);
            demo.setStreakDays(12);
            demo.setXp(4850);
            demo.setLevel(14);
            demo.setRole("student");
            demo.setSolvedProblemIds(new java.util.HashSet<>(Set.of("p1", "p2", "p3", "p4", "p5", "p7", "p9")));
            return users.save(demo);
        });
        return toAuthResponse(u);
    }

    /** Exchanges a valid refresh token for a fresh access + refresh pair. */
    @Transactional
    public AuthResponse refresh(String rawToken) {
        RefreshTokenService.Rotation r = refreshTokens.rotate(rawToken)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Session expired - please log in again"));
        User u = users.findById(r.userId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Account no longer exists"));
        return new AuthResponse(
            jwtUtil.generateToken(u.getId(), u.getEmail()), r.refreshToken(), UserDto.fromEntity(u));
    }

    /** Logs out everywhere by revoking all refresh tokens of the user. */
    @Transactional
    public void logout(String userId) {
        refreshTokens.revokeAll(userId);
    }

    private AuthResponse toAuthResponse(User u) {
        return new AuthResponse(
            jwtUtil.generateToken(u.getId(), u.getEmail()),
            refreshTokens.issue(u.getId()),
            UserDto.fromEntity(u));
    }

    private static String orEmpty(String s) {
        return s == null ? "" : s;
    }
}
