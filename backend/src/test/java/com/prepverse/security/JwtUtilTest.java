package com.prepverse.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class JwtUtilTest {

    private static final String SECRET =
        "test-secret-key-that-is-long-enough-for-hs256-algorithm!!";

    private final JwtUtil jwt = new JwtUtil(SECRET, 60_000);

    @Test
    void generateAndValidateRoundTrip() {
        String token = jwt.generateToken("u1", "a@b.com");

        assertTrue(jwt.isValid(token));
        assertEquals("u1", jwt.extractUserId(token));
    }

    @Test
    void tamperedTokenIsInvalid() {
        String token = jwt.generateToken("u1", "a@b.com");
        String[] parts = token.split("\\.");
        assertEquals(3, parts.length);

        // flip the last char of the signature (same length, breaks HMAC)
        String sig = parts[2];
        char flipped = sig.charAt(sig.length() - 1) == 'a' ? 'b' : 'a';
        String badSig = parts[0] + "." + parts[1] + "."
            + sig.substring(0, sig.length() - 1) + flipped;
        assertFalse(jwt.isValid(badSig));

        // flip a char in the payload (breaks HMAC over content)
        String payload = parts[1];
        char flippedP = payload.charAt(0) == 'a' ? 'b' : 'a';
        String badPayload = parts[0] + "." + flippedP + payload.substring(1) + "." + parts[2];
        assertFalse(jwt.isValid(badPayload));

        assertFalse(jwt.isValid("not-a-token"));
    }

    @Test
    void tokenSignedWithDifferentKeyIsInvalid() {
        JwtUtil other = new JwtUtil(
            "a-different-secret-key-that-is-also-long-enough!!", 60_000);
        String token = jwt.generateToken("u1", "a@b.com");

        assertFalse(other.isValid(token));
        assertFalse(jwt.isValid(other.generateToken("u1", "a@b.com")));
    }

    @Test
    void expiredTokenIsInvalid() throws InterruptedException {
        JwtUtil shortLived = new JwtUtil(SECRET, 1);
        String token = shortLived.generateToken("u1", "a@b.com");
        Thread.sleep(20);

        assertFalse(shortLived.isValid(token));
    }

    @Test
    void refreshTokensAreUniqueAndUrlSafe() {
        String a = JwtUtil.generateRefreshToken();
        String b = JwtUtil.generateRefreshToken();

        assertNotEquals(a, b);
        assertTrue(a.matches("[A-Za-z0-9_-]+"));
    }

    @Test
    void sha256IsStableHex() {
        String h1 = JwtUtil.sha256("abc");

        assertEquals(h1, JwtUtil.sha256("abc"));
        assertEquals(64, h1.length());
        assertTrue(h1.matches("[0-9a-f]+"));
        assertNotEquals(h1, JwtUtil.sha256("abd"));
    }
}
