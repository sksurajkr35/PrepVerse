package com.prepverse.repository;

import com.prepverse.entity.AptitudeQuestion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AptitudeQuestionRepository extends JpaRepository<AptitudeQuestion, String> {

    List<AptitudeQuestion> findAllByOrderByPositionAsc();
}
