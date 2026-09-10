package com.prepverse.repository;

import com.prepverse.entity.InterviewQuestion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, String> {

    List<InterviewQuestion> findAllByOrderByPositionAsc();
}
