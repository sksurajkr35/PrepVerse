package com.prepverse.service;

import com.prepverse.entity.RefreshToken;
import com.prepverse.repository.RefreshTokenRepository;
import com.prepverse.security.JwtUtil;
import java.time.Instant;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Opaque refresh tokens with rotation + reuse detection.
 * Only SHA-256 hashes are persisted; raw tokens are single-use.
 */
@Service
public class RefreshTokenService {

    private final RefreshTokenRepository tokens;
    private final long refreshExpirationMs;

    public RefreshTokenService(RefreshTokenRepository tokens,
            @Value("${app.jwt.refresh-expiration-ms:2592000000}") long refreshExpirationMs) {
        this.tokens = tokens;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    /** Issues a new raw refresh token for the user (stores only its hash). */
    @Transactional
    public String issue(String userId) {
        String raw = JwtUtil.generateRefreshToken();
        RefreshToken t = new RefreshToken();
        t.setUserId(userId);
        t.setTokenHash(JwtUtil.sha256(raw));
        t.setExpiresAt(Instant.now().plusMillis(refreshExpirationMs));
        tokens.save(t);
        return raw;
    }

    public record Rotation(String userId, String refreshToken) {}

    /**
     * Rotates a refresh token: the presented token is revoked and a new one
     * issued. Reuse of an already-revoked token signals possible theft, so
     * the whole token family is wiped. Empty when invalid/expired/reused.
     */
    @Transactional
    public Optional<Rotation> rotate(String rawToken) {
        tokens.deleteByExpiresAtBefore(Instant.now());
        if (rawToken == null || rawToken.isBlank()) {
            return Optional.empty();
        }
        Optional<RefreshToken> found = tokens.findByTokenHash(JwtUtil.sha256(rawToken));
        if (found.isEmpty()) {
            return Optional.empty();
        }
        RefreshToken t = found.get();
        if (t.isRevoked()) {
            tokens.deleteByUserId(t.getUserId());
            return Optional.empty();
        }
        if (t.getExpiresAt().isBefore(Instant.now())) {
            tokens.delete(t);
            return Optional.empty();
        }
        t.setRevoked(true);
        tokens.save(t);
        return Optional.of(new Rotation(t.getUserId(), issue(t.getUserId())));
    }

    /** Revokes every refresh token of a user (logout). */
    @Transactional
    public void revokeAll(String userId) {
        tokens.deleteByUserId(userId);
    }
}
