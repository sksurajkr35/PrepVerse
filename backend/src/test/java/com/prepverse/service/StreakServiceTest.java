package com.prepverse.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.prepverse.entity.User;
import com.prepverse.entity.UserActivity;
import com.prepverse.entity.UserActivityId;
import com.prepverse.repository.UserActivityRepository;
import com.prepverse.repository.UserRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StreakServiceTest {

    @Mock
    UserActivityRepository activity;

    @Mock
    UserRepository users;

    @InjectMocks
    StreakService service;

    private static UserActivity day(String userId, LocalDate date) {
        UserActivity a = new UserActivity();
        a.setUserId(userId);
        a.setActivityDate(date);
        return a;
    }

    @Test
    void noActivityIsZero() {
        when(activity.findByUserIdOrderByActivityDateDesc("u1")).thenReturn(List.of());

        assertEquals(0, service.currentStreak("u1"));
    }

    @Test
    void consecutiveDaysCount() {
        LocalDate today = LocalDate.now();
        when(activity.findByUserIdOrderByActivityDateDesc("u1")).thenReturn(List.of(
            day("u1", today), day("u1", today.minusDays(1)), day("u1", today.minusDays(2))));

        assertEquals(3, service.currentStreak("u1"));
    }

    @Test
    void gapBreaksStreak() {
        LocalDate today = LocalDate.now();
        when(activity.findByUserIdOrderByActivityDateDesc("u1")).thenReturn(List.of(
            day("u1", today), day("u1", today.minusDays(3))));

        assertEquals(1, service.currentStreak("u1"));
    }

    @Test
    void yesterdayOnlyStaysAlive() {
        LocalDate today = LocalDate.now();
        when(activity.findByUserIdOrderByActivityDateDesc("u1")).thenReturn(List.of(
            day("u1", today.minusDays(1))));

        assertEquals(1, service.currentStreak("u1"));
    }

    @Test
    void staleActivityIsZero() {
        LocalDate today = LocalDate.now();
        when(activity.findByUserIdOrderByActivityDateDesc("u1")).thenReturn(List.of(
            day("u1", today.minusDays(5))));

        assertEquals(0, service.currentStreak("u1"));
    }

    @Test
    void recordActivitySavesAndCachesStreak() {
        LocalDate today = LocalDate.now();
        when(activity.existsById(new UserActivityId("u1", today))).thenReturn(false);
        User u = new User();
        u.setId("u1");
        when(users.findById("u1")).thenReturn(Optional.of(u));
        when(activity.findByUserIdOrderByActivityDateDesc("u1")).thenReturn(List.of(day("u1", today)));

        assertEquals(1, service.recordActivity("u1"));
        verify(activity).save(any(UserActivity.class));
        assertEquals(1, u.getStreakDays());
    }
}
