package com.prepverse.service;

import com.prepverse.dto.LeaderboardDto;
import com.prepverse.entity.User;
import com.prepverse.repository.UserRepository;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeaderboardService {

    private final UserRepository users;

    public LeaderboardService(UserRepository users) {
        this.users = users;
    }

    /** Top 20 users by PrepVerse score, computed live from MySQL. */
    @Transactional(readOnly = true)
    public List<LeaderboardDto> top(String currentUserId) {
        List<User> list = users.findTop20ByOrderByPrepVerseScoreDesc();
        AtomicInteger rank = new AtomicInteger(1);
        return list.stream()
            .map(u -> new LeaderboardDto(
                rank.getAndIncrement(),
                u.getId(),
                u.getName(),
                u.getCollege() == null ? "" : u.getCollege(),
                u.getCodingRating(),
                u.getProblemsSolved(),
                u.getPrepVerseScore(),
                u.getAvatarUrl() == null ? "" : u.getAvatarUrl(),
                badgeFor(u.getPrepVerseScore()),
                u.getId().equals(currentUserId)
            ))
            .toList();
    }

    private static String badgeFor(int score) {
        if (score >= 900) return "Grandmaster";
        if (score >= 850) return "Master";
        if (score >= 800) return "Expert";
        if (score >= 700) return "Advanced";
        if (score >= 500) return "Intermediate";
        return "Beginner";
    }
}
