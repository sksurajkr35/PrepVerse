package com.prepverse.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/** Composite key for UserActivity (one row per user per active day). */
public class UserActivityId implements Serializable {

    private String userId;
    private LocalDate activityDate;

    public UserActivityId() {}

    public UserActivityId(String userId, LocalDate activityDate) {
        this.userId = userId;
        this.activityDate = activityDate;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserActivityId other)) {
            return false;
        }
        return Objects.equals(userId, other.userId)
            && Objects.equals(activityDate, other.activityDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, activityDate);
    }
}
