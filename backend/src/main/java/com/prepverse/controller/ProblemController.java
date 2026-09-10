package com.prepverse.controller;

import com.prepverse.dto.MarkSolvedRequest;
import com.prepverse.dto.UserDto;
import com.prepverse.service.SubmissionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final SubmissionService submissionService;

    public ProblemController(SubmissionService submissionService) {
        this.submissionService = submissionService;
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
