package com.prepverse.controller;

import com.prepverse.dto.AnalyticsDto;
import com.prepverse.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analytics;

    public AnalyticsController(AnalyticsService analytics) {
        this.analytics = analytics;
    }

    /** Real analytics for the logged-in user (submissions + attempts). */
    @GetMapping("/summary")
    public ResponseEntity<AnalyticsDto> summary(Authentication auth) {
        return ResponseEntity.ok(analytics.summary(auth.getName()));
    }
}
