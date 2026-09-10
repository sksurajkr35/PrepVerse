package com.prepverse.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class RateLimitFilterTest {

    private final RateLimitFilter filter = new RateLimitFilter();

    @Test
    void authBucketAllowsTenThen429() throws Exception {
        for (int i = 0; i < 10; i++) {
            assertEquals(200, call("/api/auth/login", "1.2.3.4").getStatus());
        }
        MockHttpServletResponse limited = call("/api/auth/login", "1.2.3.4");

        assertEquals(429, limited.getStatus());
        assertNotNull(limited.getHeader("Retry-After"));
    }

    @Test
    void limitsArePerIp() throws Exception {
        for (int i = 0; i < 10; i++) {
            call("/api/auth/login", "9.9.9.9");
        }
        assertEquals(429, call("/api/auth/login", "9.9.9.9").getStatus());
        assertEquals(200, call("/api/auth/login", "8.8.8.8").getStatus());
    }

    @Test
    void unlistedPathsPassThrough() throws Exception {
        assertEquals(200, call("/api/health", "1.2.3.4").getStatus());
    }

    private MockHttpServletResponse call(String uri, String ip) throws Exception {
        MockHttpServletRequest req = new MockHttpServletRequest("POST", uri);
        req.setRemoteAddr(ip);
        MockHttpServletResponse res = new MockHttpServletResponse();
        filter.doFilter(req, res, new MockFilterChain());
        return res;
    }
}
