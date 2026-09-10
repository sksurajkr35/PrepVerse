package com.prepverse.repository;

import com.prepverse.entity.TestCase;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    List<TestCase> findByProblemIdOrderByPositionAsc(String problemId);

    void deleteByProblemId(String problemId);
}
