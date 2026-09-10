package com.prepverse.repository;

import com.prepverse.entity.Company;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, String> {

    List<Company> findAllByOrderByPositionAsc();
}
