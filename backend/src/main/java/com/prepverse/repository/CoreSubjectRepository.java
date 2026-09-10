package com.prepverse.repository;

import com.prepverse.entity.CoreSubject;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoreSubjectRepository extends JpaRepository<CoreSubject, String> {

    List<CoreSubject> findAllByOrderByPositionAsc();
}
