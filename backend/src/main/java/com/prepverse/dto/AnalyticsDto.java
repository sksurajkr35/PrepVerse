package com.prepverse.dto;

import java.util.List;

/** Real per-user analytics computed from submissions + mock attempts. */
public record AnalyticsDto(
    int totalSubmissions,
    int acceptedSubmissions,
    double overallAccuracy,
    double mockTestAverage,
    int mockTestsTaken,
    int currentStreak,
    List<DayActivity> last14Days,
    List<TopicAccuracy> topicAccuracy
) {
    public record DayActivity(String date, int accepted, int total) {}

    public record TopicAccuracy(String topic, double accuracy) {}
}
