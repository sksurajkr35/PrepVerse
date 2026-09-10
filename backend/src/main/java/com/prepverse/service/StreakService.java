package com.prepverse.service;

import com.prepverse.entity.UserActivity;
import com.prepverse.entity.UserActivityId;
import com.prepverse.repository.UserActivityRepository;
import com.prepverse.repository.UserRepository;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Real streaks: consecutive calendar days with recorded activity.
 * The streak stays alive when today or yesterday has activity.
 */
@Service
public class StreakService {

    private final UserActivityRepository activity;
    private final UserRepository users;

    public StreakService(UserActivityRepository activity, UserRepository users) {
        this.activity = activity;
        this.users = users;
    }

    /** Records today's activity and refreshes the user's cached streak. */
    @Transactional
    public int recordActivity(String userId) {
        LocalDate today = LocalDate.now();
        if (!activity.existsById(new UserActivityId(userId, today))) {
            UserActivity a = new UserActivity();
            a.setUserId(userId);
            a.setActivityDate(today);
            activity.save(a);
        }
        int streak = currentStreak(userId);
        users.findById(userId).ifPresent(u -> {
            u.setStreakDays(streak);
            users.save(u);
        });
        return streak;
    }

    @Transactional(readOnly = true)
    public int currentStreak(String userId) {
        Set<LocalDate> days = new HashSet<>();
        for (UserActivity a : activity.findByUserIdOrderByActivityDateDesc(userId)) {
            days.add(a.getActivityDate());
        }
        LocalDate today = LocalDate.now();
        LocalDate cursor = days.contains(today) ? today : today.minusDays(1);
        int streak = 0;
        while (days.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }
        return streak;
    }
}
