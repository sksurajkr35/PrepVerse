package com.prepverse.repository;

import com.prepverse.entity.ResumeProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeProfileRepository extends JpaRepository<ResumeProfile, String> {
}
