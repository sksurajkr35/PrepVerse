package com.prepverse.service;

import com.prepverse.dto.AnalyticsDto;
import com.prepverse.dto.AnalyticsDto.DayActivity;
import com.prepverse.dto.AnalyticsDto.TopicAccuracy;
import com.prepverse.entity.Submission;
import com.prepverse.entity.TestAttempt;
import com.prepverse.repository.SubmissionRepository;
import com.prepverse.repository.TestAttemptRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnalyticsService {

    private final SubmissionRepository submissions;
    private final TestAttemptRepository attempts;
    private final StreakService streaks;

    public AnalyticsService(SubmissionRepository submissions,
                            TestAttemptRepository attempts,
                            StreakService streaks) {
        this.submissions = submissions;
        this.attempts = attempts;
        this.streaks = streaks;
    }

    @Transactional(readOnly = true)
    public AnalyticsDto summary(String userId) {
        List<Submission> subs = submissions.findByUserIdOrderBySubmittedAtDesc(userId);
        List<TestAttempt> att = attempts.findByUserIdOrderByCompletedAtDesc(userId);

        int total = subs.size();
        int accepted = (int) subs.stream()
            .filter(s -> "Accepted".equalsIgnoreCase(s.getStatus()))
            .count();
        double overall = total == 0 ? 0 : round1(accepted * 100.0 / total);
        double mockAvg = att.isEmpty() ? 0 : round1(att.stream()
            .mapToDouble(a -> a.getTotalMarks() == 0 ? 0 : a.getScore() * 100.0 / a.getTotalMarks())
            .average()
            .orElse(0));

        Map<LocalDate, int[]> perDay = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        for (int i = 13; i >= 0; i--) {
            perDay.put(today.minusDays(i), new int[2]);
        }
        for (Submission s : subs) {
            LocalDate d = s.getSubmittedAt() == null ? null : s.getSubmittedAt().toLocalDate();
            int[] bucket = d == null ? null : perDay.get(d);
            if (bucket != null) {
                bucket[1]++;
                if ("Accepted".equalsIgnoreCase(s.getStatus())) {
                    bucket[0]++;
                }
            }
        }
        List<DayActivity> days = new ArrayList<>();
        perDay.forEach((date, b) -> days.add(new DayActivity(date.toString(), b[0], b[1])));

        Map<String, List<Integer>> byTopic = new HashMap<>();
        for (TestAttempt a : att) {
            if (a.getTopicBreakdown() != null) {
                a.getTopicBreakdown().forEach((topic, pct) ->
                    byTopic.computeIfAbsent(topic, k -> new ArrayList<>()).add(pct));
            }
        }
        List<TopicAccuracy> topics = byTopic.entrySet().stream()
            .map(e -> new TopicAccuracy(e.getKey(), round1(e.getValue().stream()
                .mapToInt(Integer::intValue).average().orElse(0))))
            .sorted(Comparator.comparing(TopicAccuracy::topic))
            .toList();

        return new AnalyticsDto(total, accepted, overall, mockAvg,
            att.size(), streaks.currentStreak(userId), days, topics);
    }

    private static double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }
}
