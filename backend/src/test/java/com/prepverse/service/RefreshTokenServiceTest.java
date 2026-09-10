package com.prepverse.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.prepverse.entity.RefreshToken;
import com.prepverse.repository.RefreshTokenRepository;
import com.prepverse.security.JwtUtil;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    RefreshTokenRepository tokens;

    private RefreshTokenService service;

    @BeforeEach
    void setUp() {
        service = new RefreshTokenService(tokens, 2_592_000_000L);
    }

    private static RefreshToken token(String userId, String hash, boolean revoked, Instant exp) {
        RefreshToken t = new RefreshToken();
        t.setUserId(userId);
        t.setTokenHash(hash);
        t.setRevoked(revoked);
        t.setExpiresAt(exp);
        return t;
    }

    @Test
    void issueStoresHashNotRaw() {
        String raw = service.issue("u1");

        ArgumentCaptor<RefreshToken> cap = ArgumentCaptor.forClass(RefreshToken.class);
        verify(tokens).save(cap.capture());
        RefreshToken saved = cap.getValue();

        assertEquals("u1", saved.getUserId());
        assertEquals(JwtUtil.sha256(raw), saved.getTokenHash());
        assertFalse(saved.isRevoked());
        assertTrue(saved.getExpiresAt().isAfter(Instant.now()));
    }

    @Test
    void rotateValidToken() {
        String raw = "raw-token";
        RefreshToken t = token("u1", JwtUtil.sha256(raw), false, Instant.now().plusSeconds(3600));
        when(tokens.findByTokenHash(t.getTokenHash())).thenReturn(Optional.of(t));

        Optional<RefreshTokenService.Rotation> r = service.rotate(raw);

        assertTrue(r.isPresent());
        assertEquals("u1", r.get().userId());
        assertNotEquals(raw, r.get().refreshToken());
        assertTrue(t.isRevoked());
        verify(tokens).save(t);
    }

    @Test
    void rotateUnknownToken() {
        when(tokens.findByTokenHash(any())).thenReturn(Optional.empty());

        assertTrue(service.rotate("nope").isEmpty());
    }

    @Test
    void rotateRevokedTokenWipesFamily() {
        RefreshToken t = token("u1", JwtUtil.sha256("old"), true, Instant.now().plusSeconds(3600));
        when(tokens.findByTokenHash(t.getTokenHash())).thenReturn(Optional.of(t));

        assertTrue(service.rotate("old").isEmpty());
        verify(tokens).deleteByUserId("u1");
    }

    @Test
    void rotateExpiredToken() {
        RefreshToken t = token("u1", JwtUtil.sha256("old"), false, Instant.now().minusSeconds(10));
        when(tokens.findByTokenHash(t.getTokenHash())).thenReturn(Optional.of(t));

        assertTrue(service.rotate("old").isEmpty());
        verify(tokens).delete(t);
    }

    @Test
    void revokeAll() {
        service.revokeAll("u1");

        verify(tokens).deleteByUserId("u1");
    }
}
