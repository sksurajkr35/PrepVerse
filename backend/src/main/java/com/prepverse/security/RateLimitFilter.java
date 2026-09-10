package com.prepverse.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Sliding-window rate limiter (in-memory, no extra dependency):
 * <ul>
 *   <li>/api/auth/** - 10 req/min per IP (login brute-force protection)</li>
 *   <li>/api/ai-mentor - 20 req/min per user (Gemini quota protection)</li>
 *   <li>/api/compiler/** - 30 req/min per user (Piston abuse protection)</li>
 *   <li>/api/problems/*/submit - 10 req/min per user (judging runs many Piston calls)</li>
 * </ul>
 * Excess requests get HTTP 429 + Retry-After header.
 *
 * <p>NOTE: intentionally NOT annotated with @Component - declared as a @Bean
 * in SecurityConfig so it runs exactly once per request. Uses ReentrantLock
 * (not synchronized) so Java 21 virtual threads are never pinned.
 * For multi-instance production use, replace with Redis/Bucket4j.
 */
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int AUTH_LIMIT_PER_MIN = 10;
    private static final int AI_LIMIT_PER_MIN = 20;
    private static final int COMPILER_LIMIT_PER_MIN = 30;
    private static final int SUBMIT_LIMIT_PER_MIN = 10;
    private static final long WINDOW_MS = 60_000L;

    /** One sliding window per "scope:key" (e.g. "ai:usr_abc123"). */
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    private static class Window {
        final ReentrantLock lock = new ReentrantLock();
        final Deque<Long> timestamps = new ArrayDeque<>();
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
        String path = request.getRequestURI();
        String scope;
        int limit;

        if (path.startsWith("/api/auth/")) {
            scope = "auth:" + clientIp(request);
            limit = AUTH_LIMIT_PER_MIN;
        } else if (path.equals("/api/ai-mentor")) {
            scope = "ai:" + userOrIp(request);
            limit = AI_LIMIT_PER_MIN;
        } else if (path.startsWith("/api/compiler/")) {
            scope = "compiler:" + userOrIp(request);
            limit = COMPILER_LIMIT_PER_MIN;
        } else if (path.startsWith("/api/problems/") && path.endsWith("/submit")) {
            scope = "submit:" + userOrIp(request);
            limit = SUBMIT_LIMIT_PER_MIN;
        } else {
            chain.doFilter(request, response);
            return;
        }

        if (!allow(scope, limit)) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.setHeader("Retry-After", "60");
            response.getWriter().write(
                "{\"error\":\"Too many requests - please wait a minute and retry\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    private boolean allow(String key, int limit) {
        long now = System.currentTimeMillis();
        Window w = windows.computeIfAbsent(key, k -> new Window());
        w.lock.lock();
        try {
            while (!w.timestamps.isEmpty() && now - w.timestamps.peekFirst() > WINDOW_MS) {
                w.timestamps.pollFirst();
            }
            if (w.timestamps.size() >= limit) {
                return false;
            }
            w.timestamps.addLast(now);
            return true;
        } finally {
            w.lock.unlock();
        }
    }

    /** Authenticated user id when available, otherwise the client IP. */
    private String userOrIp(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()
            && auth.getPrincipal() instanceof String principal
            && !"anonymousUser".equals(principal)) {
            return "user:" + principal;
        }
        return "ip:" + clientIp(request);
    }

    private static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
