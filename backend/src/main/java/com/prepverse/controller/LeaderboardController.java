package com.prepverse.controller;

import com.prepverse.dto.LeaderboardDto;
import com.prepverse.service.LeaderboardService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardDto>> top(Authentication auth) {
        String currentUserId = null;
        if (auth != null && auth.isAuthenticated()
            && auth.getPrincipal() instanceof String principal
            && !"anonymousUser".equals(principal)) {
            currentUserId = principal;
        }
        return ResponseEntity.ok(leaderboardService.top(currentUserId));
    }
}
