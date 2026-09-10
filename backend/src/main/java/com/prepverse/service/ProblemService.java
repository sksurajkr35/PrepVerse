package com.prepverse.service;

import com.prepverse.dto.AdminProblemRequest;
import com.prepverse.dto.ProblemDto;
import com.prepverse.dto.TestCaseDto;
import com.prepverse.entity.Problem;
import com.prepverse.entity.ProblemExample;
import com.prepverse.entity.TestCase;
import com.prepverse.repository.ProblemRepository;
import com.prepverse.repository.TestCaseRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProblemService {

    private final ProblemRepository problems;
    private final TestCaseRepository testCases;

    public ProblemService(ProblemRepository problems, TestCaseRepository testCases) {
        this.problems = problems;
        this.testCases = testCases;
    }

    @Transactional(readOnly = true)
    public List<ProblemDto> listAll() {
        return problems.findAllByOrderByDisplayOrderAsc().stream()
            .map(ProblemDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public ProblemDto getById(String id) {
        return ProblemDto.fromEntity(require(id));
    }

    /** Judge test cases - for admin eyes only. */
    @Transactional(readOnly = true)
    public List<TestCaseDto> testCasesFor(String id) {
        require(id);
        return testCases.findByProblemIdOrderByPositionAsc(id).stream()
            .map(TestCaseDto::fromEntity)
            .toList();
    }

    @Transactional
    public ProblemDto create(AdminProblemRequest req) {
        Problem p = new Problem();
        p.setId("p" + UUID.randomUUID().toString().substring(0, 8));
        p.setDisplayOrder((int) problems.count() + 1);
        apply(p, req);
        problems.save(p);
        replaceTestCases(p.getId(), req.testCases());
        return ProblemDto.fromEntity(p);
    }

    @Transactional
    public ProblemDto update(String id, AdminProblemRequest req) {
        Problem p = require(id);
        apply(p, req);
        problems.save(p);
        if (req.testCases() != null) {
            replaceTestCases(id, req.testCases());
        }
        return ProblemDto.fromEntity(p);
    }

    @Transactional
    public void delete(String id) {
        require(id);
        testCases.deleteByProblemId(id);
        problems.deleteById(id);
    }

    private void apply(Problem p, AdminProblemRequest req) {
        p.setTitle(req.title());
        p.setTopic(req.topic() == null ? "" : req.topic());
        p.setDifficulty(req.difficulty() == null ? "Medium" : req.difficulty());
        p.setAcceptanceRate(req.acceptanceRate());
        p.setDescription(req.description() == null ? "" : req.description());
        p.setCompanies(req.companies() == null ? List.of() : List.copyOf(req.companies()));
        p.setConstraints(req.constraints() == null ? List.of() : List.copyOf(req.constraints()));
        p.setHints(req.hints() == null ? List.of() : List.copyOf(req.hints()));
        p.setExpectedTimeComplexity(req.expectedTimeComplexity() == null ? "" : req.expectedTimeComplexity());
        p.setExpectedSpaceComplexity(req.expectedSpaceComplexity() == null ? "" : req.expectedSpaceComplexity());
        p.setStarterCode(req.starterCode() == null ? null : new java.util.HashMap<>(req.starterCode()));
        if (req.examples() != null) {
            p.setExamples(req.examples().stream()
                .map(e -> new ProblemExample(e.input(), e.output(), e.explanation()))
                .toList());
        }
        if (p.getStatus() == null) {
            p.setStatus("Unsolved");
        }
    }

    private void replaceTestCases(String problemId, List<AdminProblemRequest.CaseInput> inputs) {
        testCases.deleteByProblemId(problemId);
        if (inputs == null) {
            return;
        }
        int position = 1;
        for (AdminProblemRequest.CaseInput in : inputs) {
            TestCase tc = new TestCase();
            tc.setProblemId(problemId);
            tc.setInput(in.input() == null ? "" : in.input());
            tc.setExpectedOutput(in.expectedOutput() == null ? "" : in.expectedOutput());
            tc.setHidden(in.hidden());
            tc.setPosition(position++);
            testCases.save(tc);
        }
    }

    private Problem require(String id) {
        return problems.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
    }
}
