package com.prepverse.repository;

import com.prepverse.entity.UserActivity;
import com.prepverse.entity.UserActivityId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserActivityRepository extends JpaRepository<UserActivity, UserActivityId> {

    List<UserActivity> findByUserIdOrderByActivityDateDesc(String userId);
}
