package com.prepverse.repository;

import com.prepverse.entity.MockTest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MockTestRepository extends JpaRepository<MockTest, String> {

    List<MockTest> findAllByOrderByPositionAsc();
}
