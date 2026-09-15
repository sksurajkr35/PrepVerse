package com.prepverse.service;

import com.prepverse.dto.TestAttemptDto;
import com.prepverse.dto.TestAttemptRequest;
import com.prepverse.entity.TestAttempt;
import com.prepverse.entity.User;
import com.prepverse.repository.MockTestRepository;
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
    private final MockTestRepository mockTests;
    private final StreakService streaks;

    public TestAttemptService(TestAttemptRepository attempts,
                              UserRepository users,
                              MockTestRepository mockTests,
                              StreakService streaks) {
        this.attempts = attempts;
        this.users = users;
        this.mockTests = mockTests;
        this.streaks = streaks;
    }

    @Transactional
    public TestAttemptDto save(String userId, TestAttemptRequest req) {
        User u = users.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!mockTests.existsById(req.testId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mock test not found: " + req.testId());
        }

        // Validate and bound check score metrics to prevent arbitrary score forgery
        int totalMarks = Math.max(1, req.totalMarks());
        int score = Math.max(0, Math.min(req.score(), totalMarks));
        double accuracy = Math.max(0.0, Math.min(100.0, req.accuracy()));
        double percentile = Math.max(0.0, Math.min(100.0, req.percentile()));

        TestAttempt t = new TestAttempt();
        t.setUserId(userId);
        t.setTestId(req.testId());
        t.setScore(score);
        t.setTotalMarks(totalMarks);
        t.setAccuracy(accuracy);
        t.setCorrectAnswers(Math.max(0, req.correctAnswers()));
        t.setWrongAnswers(Math.max(0, req.wrongAnswers()));
        t.setSkipped(Math.max(0, req.skipped()));
        t.setPercentile(percentile);
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
