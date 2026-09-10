package com.prepverse.repository;

import com.prepverse.entity.Problem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, String> {

    List<Problem> findAllByOrderByDisplayOrderAsc();
}
