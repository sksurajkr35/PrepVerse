package com.prepverse.repository;

import com.prepverse.entity.TestAttempt;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {

    List<TestAttempt> findByUserIdOrderByCompletedAtDesc(String userId);
}
