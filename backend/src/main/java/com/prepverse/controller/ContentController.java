package com.prepverse.controller;

import com.prepverse.entity.AptitudeQuestion;
import com.prepverse.entity.Company;
import com.prepverse.entity.CoreSubject;
import com.prepverse.entity.InterviewQuestion;
import com.prepverse.entity.MockTest;
import com.prepverse.repository.AptitudeQuestionRepository;
import com.prepverse.repository.CompanyRepository;
import com.prepverse.repository.CoreSubjectRepository;
import com.prepverse.repository.InterviewQuestionRepository;
import com.prepverse.repository.MockTestRepository;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Read-only reference banks (aptitude, mocks, companies, core CS, interview). */
@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final AptitudeQuestionRepository aptitude;
    private final MockTestRepository mockTests;
    private final CompanyRepository companies;
    private final CoreSubjectRepository coreSubjects;
    private final InterviewQuestionRepository interview;

    public ContentController(AptitudeQuestionRepository aptitude,
                             MockTestRepository mockTests,
                             CompanyRepository companies,
                             CoreSubjectRepository coreSubjects,
                             InterviewQuestionRepository interview) {
        this.aptitude = aptitude;
        this.mockTests = mockTests;
        this.companies = companies;
        this.coreSubjects = coreSubjects;
        this.interview = interview;
    }

    @GetMapping("/aptitude")
    public ResponseEntity<List<AptitudeQuestion>> aptitude() {
        return ResponseEntity.ok(aptitude.findAllByOrderByPositionAsc());
    }

    @GetMapping("/mock-tests")
    public ResponseEntity<List<MockTest>> mockTests() {
        return ResponseEntity.ok(mockTests.findAllByOrderByPositionAsc());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> companies() {
        return ResponseEntity.ok(companies.findAllByOrderByPositionAsc());
    }

    @GetMapping("/core-subjects")
    public ResponseEntity<List<CoreSubject>> coreSubjects() {
        return ResponseEntity.ok(coreSubjects.findAllByOrderByPositionAsc());
    }

    @GetMapping("/interview")
    public ResponseEntity<List<InterviewQuestion>> interview() {
        return ResponseEntity.ok(interview.findAllByOrderByPositionAsc());
    }
}
