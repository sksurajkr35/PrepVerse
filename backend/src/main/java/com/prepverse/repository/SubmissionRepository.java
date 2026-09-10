package com.prepverse.repository;

import com.prepverse.entity.Submission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<Submission, String> {

    List<Submission> findByUserIdOrderBySubmittedAtDesc(String userId);
}
