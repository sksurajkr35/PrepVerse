package com.prepverse.service;

import com.prepverse.dto.TestAttemptDto;
import com.prepverse.dto.TestAttemptRequest;
import com.prepverse.entity.TestAttempt;
import com.prepverse.entity.User;
import com.prepverse.repository.TestAttemptRepository;
import com.prepverse.repository.UserRepository;
import java.util.HashMap;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TestAttemptService {

    private final TestAttemptRepository attempts;
    private final UserRepository users;
    private final StreakService streaks;

    public TestAttemptService(TestAttemptRepository attempts, UserRepository users, StreakService streaks) {
        this.attempts = attempts;
        this.users = users;
        this.streaks = streaks;
    }

    @Transactional
    public TestAttemptDto save(String userId, TestAttemptRequest req) {
        User u = users.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        TestAttempt t = new TestAttempt();
        t.setUserId(userId);
        t.setTestId(req.testId());
        t.setScore(req.score());
        t.setTotalMarks(req.totalMarks());
        t.setAccuracy(req.accuracy());
        t.setCorrectAnswers(req.correctAnswers());
        t.setWrongAnswers(req.wrongAnswers());
        t.setSkipped(req.skipped());
        t.setPercentile(req.percentile());
        t.setTopicBreakdown(req.topicBreakdown() == null ? new HashMap<>() : new HashMap<>(req.topicBreakdown()));
        attempts.save(t);

        u.setMockTestsTaken(u.getMockTestsTaken() + 1);
        users.save(u);
        streaks.recordActivity(userId);
        return TestAttemptDto.fromEntity(t);
    }

    @Transactional(readOnly = true)
    public List<TestAttemptDto> listMine(String userId) {
        return attempts.findByUserIdOrderByCompletedAtDesc(userId).stream()
            .map(TestAttemptDto::fromEntity)
            .toList();
    }
}
