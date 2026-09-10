package com.prepverse.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.time.LocalDate;

/** One row per user per day with real activity (accepts, mock attempts). */
@Entity
@Table(name = "user_activity")
@IdClass(UserActivityId.class)
public class UserActivity {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Id
    @Column(name = "activity_date")
    private LocalDate activityDate;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
}
