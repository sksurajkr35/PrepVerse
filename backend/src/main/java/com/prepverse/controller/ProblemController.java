package com.prepverse.controller;

import com.prepverse.dto.MarkSolvedRequest;
import com.prepverse.dto.ProblemDto;
import com.prepverse.dto.SubmitRequest;
import com.prepverse.dto.SubmitResponse;
import com.prepverse.dto.UserDto;
import com.prepverse.service.JudgingService;
import com.prepverse.service.ProblemService;
import com.prepverse.service.SubmissionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final SubmissionService submissionService;
    private final ProblemService problemService;
    private final JudgingService judgingService;

    public ProblemController(SubmissionService submissionService,
                             ProblemService problemService,
                             JudgingService judgingService) {
        this.submissionService = submissionService;
        this.problemService = problemService;
        this.judgingService = judgingService;
    }

    @GetMapping
    public ResponseEntity<List<ProblemDto>> list() {
        return ResponseEntity.ok(problemService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemDto> byId(@PathVariable String id) {
        return ResponseEntity.ok(problemService.getById(id));
    }

    /** Real judged submit: runs hidden test cases, saves verdict + score. */
    @PostMapping("/{id}/submit")
    public ResponseEntity<SubmitResponse> submit(Authentication auth,
                                                @PathVariable String id,
                                                @Valid @RequestBody SubmitRequest req) {
        return ResponseEntity.ok(
            judgingService.submit(auth.getName(), id, req.language(), req.code()));
    }

    @GetMapping("/solved")
    public ResponseEntity<List<String>> solvedIds(Authentication auth) {
        return ResponseEntity.ok(submissionService.solvedIds(auth.getName()));
    }

    @PostMapping("/solved")
    public ResponseEntity<UserDto> markSolved(Authentication auth,
                                              @Valid @RequestBody MarkSolvedRequest req) {
        return ResponseEntity.ok(submissionService.markSolved(auth.getName(), req));
    }
}
