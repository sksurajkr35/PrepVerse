package com.prepverse.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Sliding-window rate limiter with memory-bounded TTL eviction:
 * <ul>
 *   <li>/api/auth/** - 10 req/min per IP (login brute-force protection)</li>
 *   <li>/api/ai-mentor - 20 req/min per user (Gemini quota protection)</li>
 *   <li>/api/compiler/** - 30 req/min per user (Piston abuse protection)</li>
 *   <li>/api/problems/{id}/submit - 10 req/min per user (judging runs many Piston calls)</li>
 * </ul>
 * Excess requests get HTTP 429 + Retry-After header.
 */
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int AUTH_LIMIT_PER_MIN = 10;
    private static final int AI_LIMIT_PER_MIN = 20;
    private static final int COMPILER_LIMIT_PER_MIN = 30;
    private static final int SUBMIT_LIMIT_PER_MIN = 10;
    private static final long WINDOW_MS = 60_000L;
    private static final int MAX_WINDOWS = 10_000;
    private static final int CLEANUP_INTERVAL = 100;

    /** One sliding window per "scope:key" (e.g. "ai:usr_abc123"). */
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();
    private final AtomicInteger requestCounter = new AtomicInteger(0);

    private static class Window {
        final ReentrantLock lock = new ReentrantLock();
        final Deque<Long> timestamps = new ArrayDeque<>();
        volatile long lastAccess = System.currentTimeMillis();
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

        // Periodic eviction to prevent unbounded memory growth
        if (requestCounter.incrementAndGet() % CLEANUP_INTERVAL == 0) {
            evictExpiredWindows();
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
        if (windows.size() >= MAX_WINDOWS) {
            evictExpiredWindows();
        }
        Window w = windows.computeIfAbsent(key, k -> new Window());
        w.lastAccess = now;
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

    private void evictExpiredWindows() {
        long now = System.currentTimeMillis();
        windows.entrySet().removeIf(entry -> {
            Window w = entry.getValue();
            return now - w.lastAccess > WINDOW_MS && w.timestamps.isEmpty();
        });
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
        String remote = request.getRemoteAddr();
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // Only honor X-Forwarded-For when request comes from local/loopback or private proxy
            if (remote != null && (remote.equals("127.0.0.1") || remote.equals("0:0:0:0:0:0:0:1")
                || remote.startsWith("10.") || remote.startsWith("192.168.")
                || remote.startsWith("172.") || remote.equals("localhost"))) {
                return forwarded.split(",")[0].trim();
            }
        }
        return remote == null ? "unknown" : remote;
    }
}
