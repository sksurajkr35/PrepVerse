package com.prepverse.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * A mock-test attempt by a user, stored in MySQL table {@code test_attempts}.
 * Per-topic scores live in {@code test_attempt_topics}.
 */
@Entity
@Table(name = "test_attempts")
public class TestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    private String testId;
    private int score;
    private int totalMarks;
    private double accuracy;
    private int correctAnswers;
    private int wrongAnswers;
    private int skipped;
    private double percentile;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "test_attempt_topics", joinColumns = @JoinColumn(name = "attempt_id"))
    @MapKeyColumn(name = "topic")
    @Column(name = "topic_score")
    private Map<String, Integer> topicBreakdown = new HashMap<>();

    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        if (completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTestId() { return testId; }
    public void setTestId(String testId) { this.testId = testId; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

    public int getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }

    public int getWrongAnswers() { return wrongAnswers; }
    public void setWrongAnswers(int wrongAnswers) { this.wrongAnswers = wrongAnswers; }

    public int getSkipped() { return skipped; }
    public void setSkipped(int skipped) { this.skipped = skipped; }

    public double getPercentile() { return percentile; }
    public void setPercentile(double percentile) { this.percentile = percentile; }

    public Map<String, Integer> getTopicBreakdown() { return topicBreakdown; }
    public void setTopicBreakdown(Map<String, Integer> topicBreakdown) { this.topicBreakdown = topicBreakdown; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
